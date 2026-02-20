import React from "react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import apiConfig from '../layouts/base_url';

const PosTodayOrder = ({ isModalTodayOrderReport, setModalTodayOrderReport }) => {
  const [posTodayorder, setPosTodayorder] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState(null);
  const [kotdata, setKotData] = useState(null);
  const [showkotModal, setShowKotModal] = useState(false);
  const [printOrderId, setPrintOrderId] = useState(null);
  const [canceldata, setCancelData] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);

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

  // Add refs for modal containers to handle click outside
  const modalRef = useRef();
  const completeModalRef = useRef();
  const kotModalRef = useRef();
  const cancelModalRef = useRef();
  const printModalRef = useRef();

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

  useEffect(() => {
    if (isModalTodayOrderReport) {
      fetchTodayOrders();
    }
  }, [isModalTodayOrderReport]);

  // Add event listener to handle click outside modals
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showModal && completeModalRef.current && !completeModalRef.current.contains(event.target)) {
        // Optional: Close modal when clicking outside
        // setShowModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModal]);

  const fetchTodayOrders = () => {
    setLoading(true);
    fetch(`${apiConfig.baseURL}/api/pos/gettodayOrder`)
      .then((response) => response.json())
      .then((data) => {
        setPosTodayorder(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  const totalGrandTotal = Array.isArray(posTodayorder)
    ? posTodayorder.reduce((total, order) => {
        const orderGrandTotal = parseFloat(order.grandTotal) || 0;
        return total + orderGrandTotal;
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
          setCancelModel(false);
          fetchTodayOrders(); // Refresh data
        });
      })
      .catch((err) => console.log(err));
  };

  const handleClose = () => {
    setModalTodayOrderReport(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
    const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    return `${formattedDate} ${formattedTime}`;
  };

  // Stop propagation function for buttons
  const handleButtonClick = (e, callback) => {
    e.stopPropagation();
    e.preventDefault();
    if (callback) {
      callback();
    }
  };

  // If modal is not open, don't render anything
  if (!isModalTodayOrderReport) return null;

  return (
    <div>
      {/* Main Modal */}
      <div
        className={`modal fade ${isModalTodayOrderReport ? 'show d-block' : ''}`}
        tabIndex="-1"
        role="dialog"
        style={{
          display: isModalTodayOrderReport ? 'block' : 'none',
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1050
        }}
        onClick={(e) => {
          // Close only if clicking the backdrop
          if (e.target === e.currentTarget) {
            handleClose();
          }
        }}
      >
        <div
          className="modal-dialog modal-lg"
          role="document"
          style={{ maxWidth: '1400px', zIndex: 1051 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="mdi mdi-calendar-today mr-2"></i>
                Today's Orders Report
              </h5>
              <button
                type="button"
                className="close"
                onClick={handleClose}
              >
                <span>&times;</span>
              </button>
            </div>

            <div className="modal-body">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-12">
                    {loading ? (
                      <div className="text-center p-4">
                        <div className="spinner-border text-primary" role="status">
                          <span className="sr-only">Loading...</span>
                        </div>
                        <p className="mt-2">Loading today's orders...</p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                          <thead className="thead-light">
                            <tr>
                              <th>SI No</th>
                              <th>Bill Number</th>
                              <th>Order Number</th>
                              <th>Order Type</th>
                              <th>Waiter</th>
                              <th>Subtotal</th>
                              <th>VAT Amount</th>
                              <th>Date & Time</th>
                              <th>Added By</th>
                              <th>Grand Total</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Array.isArray(posTodayorder) && posTodayorder.length > 0 ? (
                              posTodayorder.map((order, key) => {
                                const subtotal = parseFloat(order.total) || 0;
                                const vat = 5;
                                const vatamounts = (subtotal * vat) / 100;
                                const subtotalAfterVat = subtotal - vatamounts;

                                return (
                                  <tr key={order._id || key}>
                                    <td>{key + 1}</td>
                                    <td>{order.billnumber || 'N/A'}</td>
                                    <td>{order.ordernumber || 'N/A'}</td>
                                    <td>
                                      <span className="badge badge-info">
                                        {order.options || 'N/A'}
                                      </span>
                                    </td>
                                    <td>
                                      {order.waiter
                                        ? `${order.waiter.firstname || ''} ${order.waiter.lastname || ''}`.trim() || 'N/A'
                                        : 'N/A'
                                      }
                                    </td>
                                    <td>{subtotalAfterVat.toFixed(2)}</td>
                                    <td>{vatamounts.toFixed(2)}</td>
                                    <td>{formatDate(order.updatedAt)}</td>
                                    <td>
                                      {order.user
                                        ? `${order.user.firstname || ''} ${order.user.lastname || ''}`.trim() || 'N/A'
                                        : 'N/A'
                                      }
                                    </td>
                                    <td>
                                      <strong>
                                        {order.grandTotal ? parseFloat(order.grandTotal).toFixed(2) : '0.00'}
                                      </strong>
                                    </td>
                                    <td>
                                      <button
                                        onClick={(e) => handleButtonClick(e, () => handleComplete(order._id))}
                                        className="btn btn-sm btn-primary mr-1"
                                        data-toggle="tooltip"
                                        title="Print Invoice"
                                        type="button"
                                      >
                                        <i className="mdi mdi-cloud-print-outline"></i>
                                      </button>
                                      <button
                                        onClick={(e) => handleButtonClick(e, () => handlekot(order._id))}
                                        className="btn btn-sm btn-danger mr-1"
                                        data-toggle="tooltip"
                                        title="Kitchen Order Ticket"
                                        type="button"
                                      >
                                        <i className="mdi mdi-food-variant"></i>
                                      </button>
                                      <button
                                        onClick={(e) => handleButtonClick(e, () => handleCancel(order._id))}
                                        className="btn btn-sm btn-warning"
                                        data-toggle="tooltip"
                                        title="Cancel Order"
                                        type="button"
                                      >
                                        <i className="mdi mdi-cancel"></i>
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan="11" className="text-center p-4">
                                  <i className="mdi mdi-information-outline mdi-24px"></i>
                                  <p className="mt-2">No orders found for today</p>
                                </td>
                              </tr>
                            )}
                          </tbody>
                          <tfoot className="table-info">
                            <tr>
                              <td colSpan="9" className="text-right">
                                <strong>Total Grand Total:</strong>
                              </td>
                              <td colSpan="2">
                                <strong>{totalGrandTotal.toFixed(2)}</strong>
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleClose}
              >
                <i className="mdi mdi-close mr-1"></i>
                Close
              </button>
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => window.print()}
              >
                <i className="mdi mdi-printer mr-1"></i>
                Print Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Order Modal */}
      {showModal && (
        <>
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            style={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 1060
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowModal(false);
              }
            }}
          >
            <div
              className="modal-dialog modal-lg"
              role="document"
              style={{ maxWidth: '1000px', zIndex: 1061 }}
              ref={completeModalRef}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Order Details</h5>
                  <button type="button" className="close" onClick={() => setShowModal(false)}>
                    <span>&times;</span>
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

                      return (
                        <div key={order.id}>
                          <div className="row mb-3">
                            <div className="col-md-6">
                              <p><strong>Order Number:</strong> {order.ordernumber}</p>
                              <p><strong>Options:</strong> {order.options}</p>
                              <p><strong>Customer:</strong> {order.customerDetails ? order.customerDetails.customername : 'N/A'}</p>
                            </div>
                            <div className="col-md-6">
                              <p><strong>Table:</strong> {order.tableDetails ? order.tableDetails.tablename : 'N/A'}</p>
                              <p><strong>Waiter:</strong> {order.waiterDetails ? `${order.waiterDetails.firstname} ${order.waiterDetails.lastname}` : 'N/A'}</p>
                              <p><strong>Date & Time:</strong> {formatDate(order.date)}</p>
                            </div>
                          </div>

                          <table className="table table-bordered">
                            <thead className="thead-light">
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
                                <tr key={cartItem.foodmenuId || key}>
                                  <td>{key + 1}</td>
                                  <td>{cartItem.menuItemDetails?.foodmenuname || 'N/A'}</td>
                                  <td>{cartItem.quantity}</td>
                                  <td>{parseFloat(cartItem.salesprice).toFixed(2)}</td>
                                  <td>{(cartItem.quantity * cartItem.salesprice).toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>

                          <div className="row">
                            <div className="col-md-6 offset-md-6">
                              <table className="table table-sm">
                                <tbody>
                                  <tr>
                                    <td><strong>Subtotal:</strong></td>
                                    <td className="text-right">{subTotals.toFixed(2)}</td>
                                  </tr>
                                  <tr>
                                    <td><strong>VAT Amount ({vatPercentValue}%):</strong></td>
                                    <td className="text-right">{vatAmount.toFixed(2)}</td>
                                  </tr>
                                  <tr className="table-info">
                                    <td><strong>Grand Total:</strong></td>
                                    <td className="text-right"><strong>{grandTotal.toFixed(2)}</strong></td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-center p-4">No data available</p>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (data && data[0]) {
                        setOrderData(data[0]);
                        setShowPrintModal(true);
                        setShowModal(false);
                      }
                    }}
                  >
                    <i className="mdi mdi-printer mr-1"></i> Print
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowModal(false);
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* KOT Modal */}
      {showkotModal && (
        <>
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            style={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 1060
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowKotModal(false);
              }
            }}
          >
            <div
              className="modal-dialog modal-lg"
              role="document"
              style={{ maxWidth: '1000px', zIndex: 1061 }}
              ref={kotModalRef}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">KOT (Kitchen Order Ticket)</h5>
                  <button type="button" className="close" onClick={() => setShowKotModal(false)}>
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  {kotdata ? (
                    kotdata.map((order) => {
                      return (
                        <div key={order.id}>
                          <div className="row mb-3">
                            <div className="col-md-6">
                              <p><strong>Order Number:</strong> {order.ordernumber}</p>
                              <p><strong>Options:</strong> {order.options}</p>
                              <p><strong>Customer:</strong> {order.customerDetails ? order.customerDetails.customername : 'N/A'}</p>
                            </div>
                            <div className="col-md-6">
                              <p><strong>Table:</strong> {order.tableDetails ? order.tableDetails.tablename : 'N/A'}</p>
                              <p><strong>Waiter:</strong> {order.waiterDetails ? `${order.waiterDetails.firstname} ${order.waiterDetails.lastname}` : 'N/A'}</p>
                              <p><strong>Date & Time:</strong> {formatDate(order.date)}</p>
                            </div>
                          </div>

                          <table className="table table-bordered">
                            <thead className="thead-light">
                              <tr>
                                <th>Si No</th>
                                <th>Food Name</th>
                                <th>Quantity</th>
                                <th>Special Instructions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.cart.map((cartItem, key) => (
                                <tr key={cartItem.foodmenuId || key}>
                                  <td>{key + 1}</td>
                                  <td>{cartItem.menuItemDetails?.foodmenuname || 'N/A'}</td>
                                  <td>{cartItem.quantity}</td>
                                  <td>{cartItem.specialInstructions || 'None'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-center p-4">No data available</p>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (kotdata && kotdata[0]) {
                        setOrderData(kotdata[0]);
                        setShowPrintModal(true);
                        setShowKotModal(false);
                      }
                    }}
                  >
                    <i className="mdi mdi-printer mr-1"></i> Print KOT
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowKotModal(false);
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Cancel Order Modal */}
      {isCancelmodel && (
        <>
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            style={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 1060
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setCancelModel(false);
              }
            }}
          >
            <div
              className="modal-dialog"
              role="document"
              style={{ maxWidth: '500px', zIndex: 1061 }}
              ref={cancelModalRef}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Cancel Order</h5>
                  <button type="button" className="close" onClick={() => setCancelModel(false)}>
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  {canceldata ? (
                    canceldata.map((order) => (
                      <div key={order.id}>
                        <div className="mb-3">
                          <p><strong>Bill Number:</strong> {order.billnumber}</p>
                          <p><strong>Order Number:</strong> {order.ordernumber}</p>
                          <p><strong>Options:</strong> {order.options}</p>
                          <p><strong>Total:</strong> {parseFloat(order.total || 0).toFixed(2)}</p>
                          <p><strong>Grand Total:</strong> {parseFloat(order.grandTotal || 0).toFixed(2)}</p>
                        </div>

                        <div className="form-group">
                          <label>User Name/Email</label>
                          <input
                            type="text"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter Email"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>

                        <div className="form-group">
                          <label>Password</label>
                          <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Password"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center p-4">No data available</p>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancelSubmit(canceldata?.[0]?._id, canceldata?.[0]);
                    }}
                    className="btn btn-danger"
                  >
                    Submit Cancel Payment
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCancelModel(false);
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Print Modal */}
      {showPrintModal && (
        <>
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            style={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 1070
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowPrintModal(false);
              }
            }}
          >
            <div
              className="modal-dialog modal-lg"
              role="document"
              style={{ maxWidth: '800px', zIndex: 1071 }}
              ref={printModalRef}
              onClick={(e) => e.stopPropagation()}
            >
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
                        <span>{orderData?.date ? new Date(orderData.date).toLocaleDateString() : 'N/A'}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span>Time:</span>
                        <span>{orderData?.date ? new Date(orderData.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</span>
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
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPrintModal(false);
                    }}
                  >
                    <i className="fas fa-times mr-1"></i> Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrints();
                    }}
                  >
                    <i className="fas fa-print mr-1"></i> Print Receipt
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PosTodayOrder;