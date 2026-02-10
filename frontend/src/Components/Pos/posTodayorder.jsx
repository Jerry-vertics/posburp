import React from "react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import apiConfig from '../layouts/base_url';

const PosTodayOrder = () => {
  const [posTodayorder, setPosTodayorder] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState(null);
  const [kotdata, setKotData] = useState(null);
  const [showkotModal, setShowKotModal] = useState(false);
  const [printOrderId, setPrintOrderId] = useState(null);
  const [canceldata, setCancelData] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [orderData, setOrderData] = useState(null);

  const [paymentError, setPaymentError] = useState('');

  // Cancel Order
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [addedby, setUserId] = useState("");
  const [shiftstoken, setShiftstoken] = useState('');
  const [shiftAccess, setShiftAccess] = useState('');

  const [isCancelmodel, setCancelModel] = useState(false);

  const componentRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = localStorage.getItem('_id');

        if (!id) {
          console.error('Store ID not found in localStorage');
          return;
        }

        const response = await axios.get(`${apiConfig.baseURL}/api/pos/getShiftAccess`, {
          params: { id: id },
        });

        const shiftdata = response.data;
        setShiftAccess(shiftdata.shiftacess);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const storeid = localStorage.getItem("_id");
    const storetoken = localStorage.getItem('shifttoken');
    setUserId(storeid);
    setShiftstoken(storetoken);
  }, []);

  const totalGrandTotal = Array.isArray(posTodayorder)
    ? posTodayorder.reduce((total, order) => {
        const orderGrandTotal = parseFloat(order.grandTotal);
        return !isNaN(orderGrandTotal) ? total + orderGrandTotal : total;
      }, 0)
    : 0;

  // Handle print from modal
  const handlePrintFromModal = () => {
    if (componentRef.current) {
      const printContents = componentRef.current.innerHTML;
      const originalContents = document.body.innerHTML;

      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;

      // Reload the page to restore functionality
      window.location.reload();
    }
  };

  // New function for print preview
  const handlePrintPreview = (order, type = 'invoice') => {
    setOrderData(order);
    setShowPrintModal(true);
  };

  // Function to trigger actual printing
  const handlePrints = () => {
    const printWindow = window.open('', '_blank');
    const content = generatePrintContent();

    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Receipt</title>
          <style>
            @media print {
              body { font-family: Arial, sans-serif; max-width: 300px; margin: 0 auto; }
              @page { margin: 0; }
              .print-content { padding: 10px; }
              .header { text-align: center; margin-bottom: 20px; }
              .item-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
              .total-row { border-top: 2px solid #000; margin-top: 10px; padding-top: 5px; }
            }
          </style>
        </head>
        <body>
          <div class="print-content">
            ${content}
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const generatePrintContent = () => {
    if (!orderData) return '';

    // Calculate totals
    const subtotal = orderData.cart?.reduce((sum, item) =>
      sum + (item.quantity * item.salesprice), 0) || 0;
    const vatPercentValue = 5;
    const vatAmounts = (subtotal * vatPercentValue) / 100;
    const fixedsubtotal = subtotal - vatAmounts;
    const overallTotal = fixedsubtotal + vatAmounts;

    const orderDate = new Date(orderData.date || Date.now());
    const formattedDate = orderDate.toLocaleDateString();
    const formattedTime = orderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return `
      <div class="header">
        <h3 style="margin: 0 0 5px 0; font-weight: bold;">RESTAURANT NAME</h3>
        <p style="margin: 0; font-size: 12px;">Restaurant Address</p>
        <p style="margin: 0; font-size: 12px;">Phone: +1234567890</p>
        <hr style="margin: 10px 0; border-color: #000;">
      </div>

      <div style="margin-bottom: 15px;">
        <div class="item-row">
          <span>Order No:</span>
          <span style="font-weight: bold;">${orderData.ordernumber || 'N/A'}</span>
        </div>
        <div class="item-row">
          <span>Date:</span>
          <span>${formattedDate}</span>
        </div>
        <div class="item-row">
          <span>Time:</span>
          <span>${formattedTime}</span>
        </div>
        <div class="item-row">
          <span>Type:</span>
          <span>${orderData.options || 'N/A'}</span>
        </div>
        <hr style="margin: 10px 0; border-color: #000;">
      </div>

      <div style="margin-bottom: 15px;">
        <div style="display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 5px; border-bottom: 1px solid #000; padding-bottom: 5px;">
          <div>ITEM</div>
          <div style="text-align: center;">QTY</div>
          <div style="text-align: right;">AMOUNT</div>
        </div>

        ${orderData.cart?.map(item => `
          <div class="item-row">
            <div style="word-break: break-word; flex: 2;">${item.menuItemDetails?.foodmenuname || item.foodmenuname || 'N/A'}</div>
            <div style="text-align: center; flex: 1;">${item.quantity}</div>
            <div style="text-align: right; flex: 1;">${(item.quantity * item.salesprice).toFixed(2)}</div>
          </div>
        `).join('')}

        <hr style="margin: 10px 0; border-color: #000;">
      </div>

      <div style="font-size: 12px;">
        <div class="item-row">
          <span>Sub Total:</span>
          <span>${fixedsubtotal.toFixed(2)}</span>
        </div>
        <div class="item-row">
          <span>VAT Amount (${vatPercentValue}%):</span>
          <span>${vatAmounts.toFixed(2)}</span>
        </div>
        <div class="item-row total-row" style="font-weight: bold; font-size: 14px;">
          <span>Overall Total:</span>
          <span>${overallTotal.toFixed(2)}</span>
        </div>
      </div>

      <div style="text-align: center; margin-top: 20px; font-size: 11px; border-top: 1px dashed #000; padding-top: 10px;">
        <p style="margin: 5px 0;">Thank you for dining with us!</p>
        <p style="margin: 5px 0; font-weight: bold;">Please visit again</p>
        <p style="margin: 5px 0;">*** Have a nice day ***</p>
      </div>
    `;
  };

  useEffect(() => {
    fetch(`${apiConfig.baseURL}/api/pos/gettodayOrder`)
      .then((response) => response.json())
      .then((data) => setPosTodayorder(data))
      .catch((error) => console.error(error));
  }, []);

  const handleComplete = (id) => {
    console.log(id);
    axios.get(`${apiConfig.baseURL}/api/pos/getcomplete/${id}`)
      .then((response) => {
        setData(response.data);
        console.log(response.data);
        setShowModal(true);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  const handlekot = (id) => {
    const url = `${apiConfig.baseURL}/api/pos/getKot/${id}`;
    axios.get(url)
      .then((response) => {
        setKotData(response.data);
        console.log(response.data);
        setShowKotModal(true);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  const handleCancel = (id) => {
    const url = `${apiConfig.baseURL}/api/pos/getCancel/${id}`;
    axios.get(url)
      .then((response) => {
        setCancelData(response.data);
        console.log(response.data);
        setCancelModel(true);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  const handleCancelSubmit = (id, order) => {
    if (!email || !password) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please enter both email and password.',
      });
      return;
    }

    var formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append('addedby', addedby);
    formData.append("shiftstoken", shiftstoken);
    formData.append('opentoken', shiftAccess);

    const config = {
      headers: {
        'Content-Type': 'application/json',
      }
    };

    axios
      .put(`${apiConfig.baseURL}/api/pos/updateCancel/${id}`, formData, config)
      .then((res) => {
        console.log(res);
        Swal.fire({
          icon: 'success',
          title: 'Order Cancel Approved!',
          text: 'Your Cancel Order was successful.',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        }).then(() => {
          navigate('/pos');
        });
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container">
      <div className="row">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>SI No</th>
              <th>Bill Number</th>
              <th>Order Number</th>
              <th>Select Option</th>
              <th>Waiter</th>
              <th>Total</th>
              <th>Vat Amount</th>
              <th>Date & Time</th>
              <th>Added By</th>
              <th>Grand Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(posTodayorder) && posTodayorder.length > 0 ? (
              posTodayorder.map((order, key) => {
                const subtotal = order.total;
                const vat = 5;
                const vatamounts = (subtotal * vat) / 100;
                const subtotalAfterVat = subtotal - vatamounts;
                const orderDate = new Date(order.updatedAt);
                const formattedDate = `${orderDate.getDate().toString().padStart(2, '0')}-${(orderDate.getMonth() + 1).toString().padStart(2, '0')}-${orderDate.getFullYear()}`;
                const formattedTime = `${orderDate.getHours().toString().padStart(2, '0')}:${orderDate.getMinutes().toString().padStart(2, '0')}:${orderDate.getSeconds().toString().padStart(2, '0')}`;
                const datetime = `${formattedDate} ${formattedTime}`;

                return (
                  <tr key={order._id}>
                    <td>{key + 1}</td>
                    <td>{order.billnumber}</td>
                    <td>{order.ordernumber}</td>
                    <td>{order.options}</td>
                    <td>{order.waiter ? `${order.waiter.firstname} ${order.waiter.lastname}` : 'N/A'}</td>
                    <td>{subtotalAfterVat}</td>
                    <td>{vatamounts}</td>
                    <td>{datetime}</td>
                    <td>{order.user ? `${order.user.firstname} ${order.user.lastname || ''}` : 'N/A'}</td>
                    <td>{order.grandTotal}</td>
                    <td>
                      <button
                        onClick={(e) => handleComplete(order._id)}
                        className="btn btn-primary btn-sm"
                        style={{ marginRight: '5px' }}
                        data-toggle="tooltip"
                        data-placement="right"
                        title="Print Invoice"
                      >
                        <i className="mdi mdi-cloud-print-outline"></i>
                      </button>
                      <button
                        onClick={(e) => handlekot(order._id)}
                        className="btn btn-danger btn-sm"
                        style={{ marginRight: '5px' }}
                        data-toggle="tooltip"
                        data-placement="right"
                        title="Kitchen Order"
                      >
                        <i className="mdi mdi-food-variant"></i>
                      </button>
                      <button
                        onClick={(e) => handleCancel(order._id)}
                        className="btn btn-warning btn-sm"
                        style={{ marginRight: '5px' }}
                        data-toggle="tooltip"
                        data-placement="right"
                        title="Cancel Order"
                      >
                        <i className="mdi mdi-cancel"></i>
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="11">No data available</td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="9"></td>
              <td>Total Grand Total:</td>
              <td>{totalGrandTotal}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Complete Order Modal */}
      <div className={`modal ${showModal ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: showModal ? 'block' : 'none' }}>
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Order Details</h5>
              <button type="button" className="close" onClick={() => setShowModal(false)}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {data ? (
                data.map((order) => {
                  const subtotal = order.cart.reduce((total, cartItem) => total + (cartItem.quantity * cartItem.salesprice), 0);
                  const vatPercentValue = 5;
                  const vatAmount = (subtotal * vatPercentValue) / 100;
                  const subTotals = subtotal - vatAmount;
                  const grandTotal = subTotals + vatAmount;
                  const orderDate = new Date(order.date);
                  const formattedDate = `${orderDate.getDate().toString().padStart(2, '0')}-${(orderDate.getMonth() + 1).toString().padStart(2, '0')}-${orderDate.getFullYear()}`;
                  const formattedTime = `${orderDate.getHours().toString().padStart(2, '0')}:${orderDate.getMinutes().toString().padStart(2, '0')}:${orderDate.getSeconds().toString().padStart(2, '0')}`;

                  return (
                    <div key={order.id}>
                      <h5>Order Number: {order.ordernumber}</h5>
                      <h6>Options: {order.options}</h6>
                      <h6>Customer Name: {order.customerDetails ? order.customerDetails.customername : 'N/A'}</h6>
                      <h6>Table: {order.tableDetails ? order.tableDetails.tablename : 'N/A'}</h6>
                      <h6>Waiter: {order.waiterDetails ? order.waiterDetails.firstname : 'N/A'} {order.waiterDetails ? order.waiterDetails.lastname : 'N/A'}</h6>
                      <h6>Date & Time: {formattedDate} {formattedTime}</h6>

                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Si No</th>
                            <th>Food Name</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.cart.map((cartItem, key) => (
                            <tr key={cartItem.foodmenuId}>
                              <td>{key + 1}</td>
                              <td>{cartItem.menuItemDetails.foodmenuname}</td>
                              <td>{cartItem.quantity}</td>
                              <td>{cartItem.salesprice}</td>
                              <td>{cartItem.quantity * cartItem.salesprice}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <h6 className="text-right">Subtotal: {subTotals}</h6>
                      <h6 className="text-right">VAT Amount ({vatPercentValue}%): {vatAmount}</h6>
                      <h6 className="text-right">Grand Total: {grandTotal}</h6>

                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => {
                            setOrderData(order);
                            setShowPrintModal(true);
                            setShowModal(false);
                          }}
                        >
                          <i className="mdi mdi-printer mr-1"></i> Print
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                          Close
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>No data</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* KOT Modal */}
      <div className={`modal ${showkotModal ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: showkotModal ? 'block' : 'none' }}>
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">KOT (Kitchen Order Ticket)</h5>
              <button type="button" className="close" onClick={() => setShowKotModal(false)}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {kotdata ? (
                kotdata.map((order) => {
                  const subtotal = order.cart.reduce((total, cartItem) => total + (cartItem.quantity * cartItem.salesprice), 0);
                  const vatPercentValue = 5;
                  const vatAmount = (subtotal * vatPercentValue) / 100;
                  const subTotals = subtotal - vatAmount;
                  const grandTotal = subTotals + vatAmount;
                  const orderDate = new Date(order.date);
                  const formattedDate = `${orderDate.getDate().toString().padStart(2, '0')}-${(orderDate.getMonth() + 1).toString().padStart(2, '0')}-${orderDate.getFullYear()}`;
                  const formattedTime = `${orderDate.getHours().toString().padStart(2, '0')}:${orderDate.getMinutes().toString().padStart(2, '0')}:${orderDate.getSeconds().toString().padStart(2, '0')}`;

                  return (
                    <div key={order.id}>
                      <h5>Order Number: {order.ordernumber}</h5>
                      <h6>Options: {order.options}</h6>
                      <h6>Customer Name: {order.customerDetails ? order.customerDetails.customername : 'N/A'}</h6>
                      <h6>Table: {order.tableDetails ? order.tableDetails.tablename : 'N/A'}</h6>
                      <h6>Waiter: {order.waiterDetails ? order.waiterDetails.firstname : 'N/A'} {order.waiterDetails ? order.waiterDetails.lastname : 'N/A'}</h6>
                      <h6>Date & Time: {formattedDate} {formattedTime}</h6>

                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Si No</th>
                            <th>Food Name</th>
                            <th>Quantity</th>
                            <th>Special Instructions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.cart.map((cartItem, key) => (
                            <tr key={cartItem.foodmenuId}>
                              <td>{key + 1}</td>
                              <td>{cartItem.menuItemDetails.foodmenuname}</td>
                              <td>{cartItem.quantity}</td>
                              <td>{cartItem.specialInstructions || 'None'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => {
                            setOrderData(order);
                            setShowPrintModal(true);
                            setShowKotModal(false);
                          }}
                        >
                          <i className="mdi mdi-printer mr-1"></i> Print KOT
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => setShowKotModal(false)}>
                          Close
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>No data</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      <div className={`modal ${isCancelmodel ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: isCancelmodel ? 'block' : 'none' }}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Cancel Order</h5>
              <button type="button" className="close" onClick={() => setCancelModel(false)}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {canceldata ? (
                canceldata.map((order, key) => (
                  <div key={order.id}>
                    <h5>Bill Number: {order.billnumber}</h5>
                    <h5>Order Number: {order.ordernumber}</h5>
                    <h6>Options: {order.options}</h6>
                    <h6 className="text-right">Total: {order.total}</h6>
                    <h6 className="text-right">Grand Total: {order.grandTotal}</h6>

                    <div className="form-group row">
                      <label className="col-sm-3 col-form-label">User Name</label>
                      <div className="col-sm-9">
                        <input type="text" className="form-control" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email" />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-sm-3 col-form-label">Password</label>
                      <div className="col-sm-9">
                        <input type="password" className="form-control" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" />
                      </div>
                    </div>

                    <div className="modal-footer">
                      <button type="button" onClick={() => handleCancelSubmit(order._id, order)} className="btn btn-danger">
                        Submit Cancel Payment
                      </button>
                      <button type="button" className="btn btn-secondary" onClick={() => setCancelModel(false)}>
                        Close
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No data</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Print Modal */}
      {showPrintModal && (
        <>
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title">
                    <i className="fas fa-print mr-2"></i>
                    Print Preview
                  </h5>
                  <button
                    type="button"
                    className="close text-white"
                    onClick={() => setShowPrintModal(false)}
                  >
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body p-4" ref={componentRef}>
                  <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '300px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                      <h3 style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>RESTAURANT NAME</h3>
                      <p style={{ margin: '0', fontSize: '12px' }}>Restaurant Address Line 1</p>
                      <p style={{ margin: '0', fontSize: '12px' }}>Restaurant Address Line 2</p>
                      <p style={{ margin: '0', fontSize: '12px' }}>Phone: +1234567890</p>
                      <hr style={{ margin: '10px 0', borderColor: '#000' }} />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span>Order No:</span>
                        <span style={{ fontWeight: 'bold' }}>{orderData?.ordernumber || 'N/A'}</span>
                      </div>
                      {orderData?.billnumber && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                          <span>Bill No:</span>
                          <span style={{ fontWeight: 'bold' }}>{orderData.billnumber}</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span>Date:</span>
                        <span>{new Date(orderData?.date || Date.now()).toLocaleDateString()}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span>Time:</span>
                        <span>{new Date(orderData?.date || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span>Type:</span>
                        <span>{orderData?.options || 'N/A'}</span>
                      </div>
                      <hr style={{ margin: '10px 0', borderColor: '#000' }} />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr 1fr',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        marginBottom: '5px',
                        borderBottom: '1px solid #000',
                        paddingBottom: '5px'
                      }}>
                        <div>ITEM</div>
                        <div style={{ textAlign: 'center' }}>QTY</div>
                        <div style={{ textAlign: 'right' }}>AMOUNT</div>
                      </div>

                      {orderData?.cart?.map((item, index) => (
                        <div
                          key={index}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '2fr 1fr 1fr',
                            fontSize: '12px',
                            marginBottom: '3px'
                          }}
                        >
                          <div style={{ wordBreak: 'break-word' }}>{item.menuItemDetails?.foodmenuname || item.foodmenuname || 'N/A'}</div>
                          <div style={{ textAlign: 'center' }}>{item.quantity}</div>
                          <div style={{ textAlign: 'right' }}>{(item.quantity * item.salesprice).toFixed(2)}</div>
                        </div>
                      ))}

                      <hr style={{ margin: '10px 0', borderColor: '#000' }} />
                    </div>

                    <div style={{ fontSize: '12px' }}>
                      {(() => {
                        const subtotal = orderData?.cart?.reduce((sum, item) =>
                          sum + (item.quantity * item.salesprice), 0) || 0;
                        const vatPercentValue = 5;
                        const vatAmounts = (subtotal * vatPercentValue) / 100;
                        const fixedsubtotal = subtotal - vatAmounts;
                        const overallTotal = fixedsubtotal + vatAmounts;

                        return (
                          <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                              <span>Sub Total:</span>
                              <span>{fixedsubtotal.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                              <span>VAT Amount ({vatPercentValue}%):</span>
                              <span>{vatAmounts.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '11px', color: '#666', fontStyle: 'italic' }}>
                              <span>(VAT @ {vatPercentValue}%):</span>
                              <span>{(subtotal * vatPercentValue / 100).toFixed(2)}</span>
                            </div>
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              fontWeight: 'bold',
                              fontSize: '14px',
                              marginTop: '10px',
                              paddingTop: '5px',
                              borderTop: '2px solid #000'
                            }}>
                              <span>Overall Total:</span>
                              <span>{overallTotal.toFixed(2)}</span>
                            </div>
                          </>
                        );
                      })()}
                    </div>

                    <div style={{
                      textAlign: 'center',
                      marginTop: '20px',
                      fontSize: '11px',
                      borderTop: '1px dashed #000',
                      paddingTop: '10px'
                    }}>
                      <p style={{ margin: '5px 0' }}>Thank you for dining with us!</p>
                      <p style={{ margin: '5px 0', fontWeight: 'bold' }}>Please visit again</p>
                      <p style={{ margin: '5px 0' }}>*** Have a nice day ***</p>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowPrintModal(false)}
                  >
                    <i className="fas fa-times mr-1"></i> Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handlePrints}
                  >
                    <i className="fas fa-print mr-1"></i> Print Receipt
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
};

export default PosTodayOrder;