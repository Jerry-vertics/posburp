import React from "react";
import { useState, useEffect, useRef } from "react";
import axios from 'axios';
import apiConfig from '../../layouts/base_url';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from "react-router-dom";
import { useReactToPrint } from 'react-to-print';

const RunningPaymentModal = ({ data, showModal, setShowModal }) => {
  const navigate = useNavigate();
  const [payments, setPays] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [processedIds, setProcessedIds] = useState([]);
  const [addedby, setuserid] = useState("");
  const [shiftstoken, setShiftstoken] = useState('');
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printData, setPrintData] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [showPaymentSection, setShowPaymentSection] = useState(false); // New state for payment section
  const componentRef = useRef();

  const imageName = "taha.png";
  const [itemTotalPrices, setItemTotalPrices] = useState([]);

  useEffect(() => {
    const storeid = localStorage.getItem("_id");
    const storetoken = localStorage.getItem('shifttoken');
    setuserid(storeid);
    setShiftstoken(storetoken);
  }, []);

  const payment = [
    { value: 'Cash', label: 'Cash' },
    { value: 'Card', label: 'Card' },
  ];

  const handlePays = (event) => {
    setPays(event.target.value);
    setPaymentError('');
  }

  const [shiftAccess, setShiftAccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = localStorage.getItem('_id');

        if (!id) {
          console.error('Store ID not found in localStorage');
          return;
        }

        const response = await axios.get(`${apiConfig.baseURL}/api/pos/getShiftAccess`, {
          params: {
            id: id,
          },
        });
        const shiftdata = response.data;
        setShiftAccess(shiftdata.shiftacess);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  const handleMakePayment = (id, order) => {
    if (!order || order?.grandTotal == null) {
      console.error("Invalid order data");
      return;
    }

    if (!payments) {
      setPaymentError('Please select a payment option');
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please select a payment option.',
      });
      return;
    }

    var formData = new FormData();
    formData.append("paymentType", payments);
    formData.append("total", order.total);
    formData.append("vatAmount", order.vatAmount);
    formData.append("grandTotal", order.grandTotal);
    formData.append("addedby", addedby);
    formData.append("shiftstoken", shiftstoken);
    formData.append('opentoken', shiftAccess);

    const config = {
      headers: {
        'Content-Type': 'application/json',
      }
    };
    const url = `${apiConfig.baseURL}/api/pos/updatePayment/${id}`;

    axios.put(url, formData, config)
      .then(res => {
        Swal.fire({
          title: 'Success!',
          text: 'Payment successful! Do you want to print the receipt?',
          icon: 'success',
          showCancelButton: true,
          confirmButtonText: 'Yes, print',
          cancelButtonText: 'No, close',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
        }).then((result) => {
          if (result.isConfirmed) {
            setOrderData(res.data);
            setShowPrintModal(true);
            closeModal();
          } else {
            navigate('/runningorder');
            closeModal();
          }
        });
      })
      .catch(err => {
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'Payment Failed',
          text: 'There was an error processing your payment.',
        });
      });
  }

  const handleCloseTable = () => {
    // Add your close table logic here
    Swal.fire({
      title: 'Close Table?',
      text: 'Are you sure you want to close this table?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, close table'
    }).then((result) => {
      if (result.isConfirmed) {
        // Add your API call to close the table here
        Swal.fire(
          'Closed!',
          'Table has been closed.',
          'success'
        ).then(() => {
          closeModal();
          navigate('/runningorder');
        });
      }
    });
  }

  const handlePayBill = () => {
    setShowPaymentSection(true);
  }

  // Helper function to safely convert to number
  const safeToNumber = (value) => {
    if (value === null || value === undefined) return 0;
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  // Helper function to format price
  const formatPrice = (price) => {
    const num = safeToNumber(price);
    return num.toFixed(2);
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => {
      navigate('/runningorder');
      setShowPrintModal(false);
    },
    documentTitle: `Order_${orderData?.ordernumber || 'Receipt'}`,
    removeAfterPrint: true
  });

  const handlePrints = () => {
    handlePrint();
  };

  const closeModal = () => {
    setShowModal(false);
    setShowPaymentSection(false); // Reset payment section when closing modal
    setPays(''); // Reset payment selection
    setPaymentError(''); // Reset payment error
  };

  const closePrintModal = () => {
    setShowPrintModal(false);
    navigate('/runningorder');
  };

  const calculateTotals = () => {
    if (!orderData?.cart) return { subtotal: 0, vatAmounts: 0, overallTotal: 0 };

    const subtotal = orderData.cart.reduce((sum, item) => {
      const quantity = safeToNumber(item.quantity);
      const salesprice = safeToNumber(item.salesprice);
      return sum + (quantity * salesprice);
    }, 0);

    const vatPercentValue = 5;
    const vatAmounts = (subtotal * vatPercentValue) / 100;
    const fixedsubtotal = subtotal - vatAmounts;
    const overallTotal = fixedsubtotal + vatAmounts;

    return {
      subtotal: fixedsubtotal,
      vatAmounts,
      overallTotal,
      rawSubtotal: subtotal // Keep raw subtotal for VAT calculation display
    };
  };

  const totals = calculateTotals();

  return (
    <>
      {/* Payment Modal */}
      <div className={`modal ${showModal ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: showModal ? 'block' : 'none', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Order Details</h5>
              <button type="button" className="close" onClick={closeModal}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {data ? (
                data.map((order) => {
                  const subtotal = order.cart.reduce((total, cartItem) => {
                    const quantity = safeToNumber(cartItem.quantity);
                    const salesprice = safeToNumber(cartItem.salesprice);
                    return total + (quantity * salesprice);
                  }, 0);

                  const vatPercentValue = 5;
                  const vatAmount = (subtotal * vatPercentValue) / 100;
                  const subTotals = subtotal - vatAmount;
                  const grandTotal = subTotals + vatAmount;
                  const orderDate = new Date(order.date);
                  const formattedDate = `${orderDate.getDate().toString().padStart(2, '0')}-${(orderDate.getMonth() + 1).toString().padStart(2, '0')}-${orderDate.getFullYear()}`;
                  const formattedTime = `${orderDate.getHours().toString().padStart(2, '0')}:${orderDate.getMinutes().toString().padStart(2, '0')}:${orderDate.getSeconds().toString().padStart(2, '0')}`;

                  return (
                    <div key={order._id}>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <p><strong>Order Number:</strong> {order.ordernumber}</p>
                          <p><strong>Customer:</strong> {order.customerDetails ? order.customerDetails.customername : 'N/A'}</p>
                          <p><strong>Table:</strong> {order.tableDetails ? order.tableDetails.tablename : 'N/A'}</p>
                        </div>
                        <div className="col-md-6">
                          <p><strong>Waiter:</strong> {order.waiterDetails ? `${order.waiterDetails.firstname} ${order.waiterDetails.lastname}` : 'N/A'}</p>
                          <p><strong>Date:</strong> {formattedDate}</p>
                          <p><strong>Time:</strong> {formattedTime}</p>
                        </div>
                      </div>

                      <table className="table table-bordered table-sm">
                        <thead className="thead-dark">
                          <tr>
                            <th>#</th>
                            <th>Food Name</th>
                            <th className="text-center">Qty</th>
                            <th className="text-right">Unit Price</th>
                            <th className="text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.cart.map((cartItem, index) => {
                            const quantity = safeToNumber(cartItem.quantity);
                            const salesprice = safeToNumber(cartItem.salesprice);
                            const total = quantity * salesprice;

                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{cartItem.menuItemDetails?.foodmenuname || cartItem.foodmenuname}</td>
                                <td className="text-center">{quantity}</td>
                                <td className="text-right">{formatPrice(salesprice)}</td>
                                <td className="text-right">{formatPrice(total)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>

                      <div className="row mt-3">
                        <div className="col-md-6 offset-md-6">
                          <div className="card">
                            <div className="card-body">
                              <div className="d-flex justify-content-between mb-2">
                                <span>Subtotal:</span>
                                <span>{formatPrice(subTotals)}</span>
                              </div>
                              <div className="d-flex justify-content-between mb-2">
                                <span>VAT ({vatPercentValue}%):</span>
                                <span>{formatPrice(vatAmount)}</span>
                              </div>
                              <div className="d-flex justify-content-between mb-2 border-top pt-2">
                                <strong>Grand Total:</strong>
                                <strong>{formatPrice(grandTotal)}</strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons - Always visible */}
                      <div className="row mt-4">
                        <div className="col-12 text-center">
                          <button
                            type="button"
                            className="btn btn-secondary mr-3"
                            onClick={handleCloseTable}
                            style={{ minWidth: '120px' }}
                          >
                            <i className="fas fa-times-circle mr-2"></i>
                            Close Table
                          </button>
                          <button
                            type="button"
                            className="btn btn-success"
                            onClick={handlePayBill}
                            style={{ minWidth: '120px' }}
                          >
                            <i className="fas fa-credit-card mr-2"></i>
                            Pay Bill
                          </button>
                        </div>
                      </div>

                      {/* Payment Section - Only shown when Pay Bill is clicked */}
                      {showPaymentSection && (
                        <>
                          <div className="row mt-4">
                            <div className="col-12">
                              <hr />
                              <h6 className="mb-3">Payment Details</h6>
                            </div>
                          </div>

                          <div className="form-group row">
                            <label className="col-sm-3 col-form-label">Payment Method</label>
                            <div className="col-sm-9">
                              <select
                                className={`form-control ${paymentError ? 'is-invalid' : ''}`}
                                onChange={handlePays}
                                value={payments}
                                required
                              >
                                <option value="">Select Payment</option>
                                {payment.map(option => (
                                  <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                              </select>
                              {paymentError && (
                                <div className="invalid-feedback">{paymentError}</div>
                              )}
                            </div>
                          </div>

                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={(e) => handleMakePayment(order._id, order)}
                            >
                              <i className="fas fa-check-circle mr-2"></i>
                              Confirm Payment
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={closeModal}
                            >
                              Close
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-center">No order data available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Print Preview Modal */}
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
                <div className="modal-body p-4">
                  <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '300px', margin: '0 auto' }} ref={componentRef}>
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

                      {orderData?.cart?.map((item, index) => {
                        const quantity = safeToNumber(item.quantity);
                        const salesprice = safeToNumber(item.salesprice);
                        const amount = quantity * salesprice;

                        return (
                          <div
                            key={index}
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '2fr 1fr 1fr',
                              fontSize: '12px',
                              marginBottom: '3px'
                            }}
                          >
                            <div style={{ wordBreak: 'break-word' }}>{item.foodmenuname}</div>
                            <div style={{ textAlign: 'center' }}>{quantity}</div>
                            <div style={{ textAlign: 'right' }}>{formatPrice(amount)}</div>
                          </div>
                        );
                      })}

                      <hr style={{ margin: '10px 0', borderColor: '#000' }} />
                    </div>

                    <div style={{ fontSize: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span>Sub Total:</span>
                        <span>{formatPrice(totals.subtotal)}</span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span>VAT Amount:</span>
                        <span>{formatPrice(totals.vatAmounts)}</span>
                      </div>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '10px',
                        fontSize: '11px',
                        color: '#666',
                        fontStyle: 'italic'
                      }}>
                        <span>(VAT @ 5%):</span>
                        <span>{formatPrice(totals.vatAmounts)}</span>
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
                        <span>{formatPrice(totals.overallTotal)}</span>
                      </div>
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

      {showModal && (
        <div className="modal-backdrop fade show"></div>
      )}
    </>
  );
}

export default RunningPaymentModal;