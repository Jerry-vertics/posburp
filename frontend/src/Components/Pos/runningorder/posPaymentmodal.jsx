import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from 'react-to-print';
import apiConfig from '../../layouts/base_url';

// Thermal Printer Component for Receipt
const ThermalReceiptComponent = React.forwardRef(({ orderData, restaurantInfo = {} }, ref) => {
  const defaultRestaurant = {
    name: "TAHA Cafeteria",
    address: "Electra street - opposite NMC",
    city: "Al Danah - Zone 1 - Abu Dhabi",
    phone: "02 632 8382",
    vatNumber: "100123456789",
    footer: "Thank you for dining with us!"
  };

  const restaurant = { ...defaultRestaurant, ...restaurantInfo };

  // Safe number conversion
  const safeToNumber = (value) => {
    if (value === null || value === undefined) return 0;
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  // Calculate totals
  const subtotal = orderData?.cart?.reduce((sum, item) =>
    sum + (safeToNumber(item.quantity) * safeToNumber(item.salesprice)), 0) || 0;
  const vatPercent = 5;
  const vatAmount = (subtotal * vatPercent) / 100;
  const netTotal = subtotal - vatAmount;
  const grandTotal = subtotal;

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear().toString().slice(-2)} ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
  };

  const formatPrice = (price) => {
    const num = safeToNumber(price);
    return num.toFixed(2);
  };

  const thermalStyles = {
    container: {
      fontFamily: "'Courier New', 'Fira Code', monospace",
      fontSize: '11px',
      lineHeight: '1.3',
      width: '280px',
      maxWidth: '100%',
      margin: '0 auto',
      padding: '8px 4px',
      backgroundColor: 'white',
      color: 'black'
    },
    header: {
      textAlign: 'center',
      marginBottom: '8px',
      paddingBottom: '5px',
      borderBottom: '1px dashed #000'
    },
    restaurantName: {
      fontSize: '14px',
      fontWeight: 'bold',
      margin: '0 0 3px 0',
      letterSpacing: '1px'
    },
    divider: {
      borderTop: '1px dashed #000',
      margin: '5px 0'
    },
    dividerDouble: {
      borderTop: '2px solid #000',
      margin: '5px 0'
    },
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '2px'
    },
    itemRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '2px',
      fontSize: '10px'
    },
    itemName: {
      flex: 3,
      wordBreak: 'break-word',
      paddingRight: '6px'
    },
    itemQty: {
      flex: 1,
      textAlign: 'center'
    },
    itemPrice: {
      flex: 1.5,
      textAlign: 'right'
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      fontWeight: 'bold',
      marginTop: '5px',
      paddingTop: '5px'
    },
    footer: {
      textAlign: 'center',
      marginTop: '10px',
      paddingTop: '8px',
      borderTop: '1px dashed #000',
      fontSize: '9px'
    }
  };

  return (
    <div ref={ref} style={thermalStyles.container}>
      <div style={thermalStyles.header}>
        <div style={thermalStyles.restaurantName}>{restaurant.name}</div>
        <div style={{ fontSize: '9px', margin: '2px 0' }}>{restaurant.address}</div>
        <div style={{ fontSize: '9px' }}>{restaurant.city}</div>
        <div style={{ fontSize: '9px' }}>Tel: {restaurant.phone}</div>
        {restaurant.vatNumber && (
          <div style={{ fontSize: '8px' }}>VAT: {restaurant.vatNumber}</div>
        )}
      </div>

      <div style={{ marginBottom: '8px' }}>
        <div style={thermalStyles.row}>
          <span>Order #:</span>
          <span style={{ fontWeight: 'bold' }}>{orderData?.ordernumber || 'N/A'}</span>
        </div>
        {orderData?.billnumber && (
          <div style={thermalStyles.row}>
            <span>Bill #:</span>
            <span>{orderData.billnumber}</span>
          </div>
        )}
        <div style={thermalStyles.row}>
          <span>Date:</span>
          <span>{formatDate(orderData?.date || Date.now())}</span>
        </div>
        <div style={thermalStyles.row}>
          <span>Payment:</span>
          <span>{orderData?.paymentType || 'N/A'}</span>
        </div>
        {orderData?.tableDetails?.tablename && (
          <div style={thermalStyles.row}>
            <span>Table:</span>
            <span>{orderData.tableDetails.tablename}</span>
          </div>
        )}
        {orderData?.waiterDetails && (
          <div style={thermalStyles.row}>
            <span>Waiter:</span>
            <span>{orderData.waiterDetails.firstname} {orderData.waiterDetails.lastname}</span>
          </div>
        )}
      </div>

      <div style={thermalStyles.divider} />

      <div style={{ ...thermalStyles.row, fontWeight: 'bold', marginBottom: '4px' }}>
        <span style={{ flex: 3 }}>ITEM</span>
        <span style={{ flex: 1, textAlign: 'center' }}>QTY</span>
        <span style={{ flex: 1.5, textAlign: 'right' }}>TOTAL</span>
      </div>

      {orderData?.cart?.map((item, index) => {
        const quantity = safeToNumber(item.quantity);
        const price = safeToNumber(item.salesprice);
        const total = quantity * price;
        const itemName = item.menuItemDetails?.foodmenuname || item.foodmenuname || 'N/A';

        return (
          <div key={index} style={thermalStyles.itemRow}>
            <span style={thermalStyles.itemName}>{itemName}</span>
            <span style={thermalStyles.itemQty}>x{quantity}</span>
            <span style={thermalStyles.itemPrice}>{formatPrice(total)}</span>
          </div>
        );
      })}

      <div style={thermalStyles.divider} />

      <div style={{ marginTop: '5px' }}>
        <div style={thermalStyles.row}>
          <span>Subtotal:</span>
          <span>{formatPrice(netTotal)}</span>
        </div>
        <div style={thermalStyles.row}>
          <span>VAT ({vatPercent}%):</span>
          <span>{formatPrice(vatAmount)}</span>
        </div>
        <div style={{ ...thermalStyles.row, ...thermalStyles.totalRow }}>
          <span style={{ fontSize: '12px' }}>GRAND TOTAL:</span>
          <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{formatPrice(grandTotal)} AED</span>
        </div>
      </div>

      <div style={thermalStyles.dividerDouble} />

      <div style={thermalStyles.footer}>
        <div style={{ fontWeight: 'bold', marginBottom: '3px' }}>{restaurant.footer}</div>
        <div style={{ fontSize: '8px', marginTop: '3px' }}>Please visit again!</div>
        <div style={{ fontSize: '8px', marginTop: '3px' }}>*** Have a nice day ***</div>
        <div style={{ fontSize: '7px', marginTop: '5px', letterSpacing: '1px' }}>
          {Array(24).fill('=').join('')}
        </div>
      </div>
    </div>
  );
});

ThermalReceiptComponent.displayName = 'ThermalReceiptComponent';

const RunningPaymentModal = ({ data, showModal, setShowModal }) => {
  const navigate = useNavigate();
  const [payments, setPays] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [addedby, setUserid] = useState("");
  const [shiftstoken, setShiftstoken] = useState('');
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printData, setPrintData] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [showPaymentSection, setShowPaymentSection] = useState(false);
  const [shiftAccess, setShiftAccess] = useState('');
  const componentRef = useRef();

  // Payment options
  const paymentOptions = [
    { value: 'Cash', label: 'Cash' },
    { value: 'Card', label: 'Card' },
  ];

  // Load user data from localStorage
  useEffect(() => {
    const storeid = localStorage.getItem("_id");
    const storetoken = localStorage.getItem('shifttoken');
    setUserid(storeid);
    setShiftstoken(storetoken);
  }, []);

  // Fetch shift access
  useEffect(() => {
    const fetchShiftAccess = async () => {
      try {
        const id = localStorage.getItem('_id');
        if (!id) {
          console.error('Store ID not found in localStorage');
          return;
        }

        const response = await axios.get(`${apiConfig.baseURL}/api/pos/getShiftAccess`, {
          params: { id }
        });
        setShiftAccess(response.data.shiftacess);
      } catch (error) {
        console.error('Error fetching shift access:', error);
      }
    };

    fetchShiftAccess();
  }, []);

  // Handle payment method change
  const handlePays = (event) => {
    setPays(event.target.value);
    setPaymentError('');
  }

  // Safe number conversion
  const safeToNumber = (value) => {
    if (value === null || value === undefined) return 0;
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  // Format price
  const formatPrice = (price) => {
    const num = safeToNumber(price);
    return num.toFixed(2);
  };

  // Thermal printer print function
  const handleThermalPrint = () => {
    if (componentRef.current) {
      const printContent = componentRef.current.innerHTML;
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Receipt</title>
            <style>
              @page {
                size: 58mm auto;
                margin: 0;
              }
              body {
                margin: 0;
                padding: 0;
                font-family: 'Courier New', monospace;
              }
              @media print {
                body { margin: 0; padding: 0; }
              }
            </style>
          </head>
          <body>
            ${printContent}
            <script>
              window.onload = function() {
                window.print();
                window.close();
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  // Handle payment submission
  const handleMakePayment = async (id, order) => {
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

    try {
      const formData = new FormData();
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
      const response = await axios.put(url, formData, config);

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
          setOrderData(response.data);
          setPrintData(response.data);
          setShowPrintModal(true);
          closeModal();
        } else {
          navigate('/runningorder');
          closeModal();
        }
      });
    } catch (err) {
      console.error('Payment error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Payment Failed',
        text: err.response?.data?.message || 'There was an error processing your payment.',
      });
    }
  }

  // Handle close table
  const handleCloseTable = (id, order) => {
    if (!order || order?.grandTotal == null) {
      console.error("Invalid order data");
      return;
    }

    Swal.fire({
      title: 'Close Table?',
      text: 'Are you sure you want to close this table?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, close table'
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Processing...',
          text: 'Please wait while we close the table',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        try {
          const formData = new FormData();
          formData.append("orderId", id);
          formData.append("addedby", addedby);
          formData.append("shiftstoken", shiftstoken);

          const url = `${apiConfig.baseURL}/api/pos/updateTable/${id}`;
          await axios.put(url, formData);

          Swal.fire({
            icon: 'success',
            title: 'Closed!',
            text: 'Table has been closed successfully.',
            timer: 1500,
            showConfirmButton: true
          }).then(() => {
            closeModal();
            navigate('/runningorder');
          });
        } catch (err) {
          console.error('Error closing table:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: err.response?.data?.message || 'Failed to close table. Please try again.',
            confirmButtonColor: '#3085d6'
          });
        }
      }
    });
  };

  // Handle pay bill button click
  const handlePayBill = () => {
    setShowPaymentSection(true);
  }

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setShowPaymentSection(false);
    setPays('');
    setPaymentError('');
  };

  // Close print modal
  const closePrintModal = () => {
    setShowPrintModal(false);
    navigate('/runningorder');
  };

  // Render order details
  const renderOrderDetails = (order) => {
    const subtotal = order.cart.reduce((total, cartItem) => {
      const quantity = safeToNumber(cartItem.quantity);
      const salesprice = safeToNumber(cartItem.salesprice);
      return total + (quantity * salesprice);
    }, 0);

    const vatPercent = 5;
    const vatAmount = (subtotal * vatPercent) / 100;
    const grandTotal = subtotal;

    const orderDate = new Date(order.date);
    const formattedDate = `${orderDate.getDate().toString().padStart(2, '0')}-${(orderDate.getMonth() + 1).toString().padStart(2, '0')}-${orderDate.getFullYear()}`;
    const formattedTime = `${orderDate.getHours().toString().padStart(2, '0')}:${orderDate.getMinutes().toString().padStart(2, '0')}:${orderDate.getSeconds().toString().padStart(2, '0')}`;

    return (
      <div key={order._id}>
        <div className="row mb-3">
          <div className="col-md-6">
            <p><strong>Order Number:</strong> {order.ordernumber}</p>
            <p><strong>Customer:</strong> {order.customerDetails?.customername || 'N/A'}</p>
            <p><strong>Table:</strong> {order.tableDetails?.tablename || 'N/A'}</p>
          </div>
          <div className="col-md-6">
            <p><strong>Waiter:</strong> {order.waiterDetails ? `${order.waiterDetails.firstname} ${order.waiterDetails.lastname}` : 'N/A'}</p>
            <p><strong>Date:</strong> {formattedDate}</p>
            <p><strong>Time:</strong> {formattedTime}</p>
          </div>
        </div>

        <div className="table-responsive">
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
        </div>

        <div className="row mt-3">
          <div className="col-md-6 offset-md-6">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>{formatPrice(subtotal - vatAmount)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>VAT ({vatPercent}%):</span>
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

        {/* Action Buttons */}
        <div className="row mt-4">
          <div className="col-12 text-center">
            {order.tableDetails?.tablename && order.orderTable?.orderstatus !== "Complete" && (
              <button
                type="button"
                className="btn btn-secondary mr-3"
                onClick={() => handleCloseTable(order._id, order)}
                style={{ minWidth: '120px' }}
              >
                <i className="fas fa-times-circle mr-2"></i>
                Close Table
              </button>
            )}

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

        {/* Payment Section */}
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
                  {paymentOptions.map(option => (
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
                onClick={() => handleMakePayment(order._id, order)}
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
  };

  return (
    <>
      {/* Payment Modal */}
      <div
        className={`modal ${showModal ? 'show' : ''}`}
        tabIndex="-1"
        role="dialog"
        style={{ display: showModal ? 'block' : 'none', backgroundColor: 'rgba(0,0,0,0.5)' }}
        onClick={(e) => e.target === e.currentTarget && closeModal()}
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Order Details</h5>
              <button type="button" className="close" onClick={closeModal}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {data && data.length > 0 ? (
                data.map(order => renderOrderDetails(order))
              ) : (
                <p className="text-center">No order data available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Thermal Printer Print Modal */}
      {showPrintModal && (
        <>
          <div
            className="modal fade show"
            style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
            tabIndex="-1"
            role="dialog"
            onClick={(e) => e.target === e.currentTarget && setShowPrintModal(false)}
          >
            <div className="modal-dialog modal-sm" role="document" style={{ maxWidth: '320px' }}>
              <div className="modal-content" style={{ borderRadius: '8px' }}>
                <div className="modal-header bg-primary text-white" style={{ padding: '10px 15px' }}>
                  <h5 className="modal-title" style={{ fontSize: '16px' }}>
                    <i className="fas fa-print mr-2"></i>
                    Print Receipt
                  </h5>
                  <button
                    type="button"
                    className="close text-white"
                    onClick={() => setShowPrintModal(false)}
                    style={{ opacity: 1 }}
                  >
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body p-0" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                  <ThermalReceiptComponent
                    ref={componentRef}
                    orderData={orderData || printData}
                    restaurantInfo={{
                      name: "TAHA Cafeteria",
                      address: "Electra street - opposite NMC",
                      city: "Al Danah - Zone 1 - Abu Dhabi",
                      phone: "02 632 8382",
                      vatNumber: "100123456789",
                      footer: "Thank you for dining with us!"
                    }}
                  />
                </div>
                <div className="modal-footer" style={{ padding: '10px', justifyContent: 'space-between' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowPrintModal(false)}
                  >
                    <i className="fas fa-times mr-1"></i> Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={handleThermalPrint}
                  >
                    <i className="fas fa-print mr-1"></i> Print
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {/* Modal Backdrop */}
      {showModal && (
        <div className="modal-backdrop fade show"></div>
      )}
    </>
  );
}

export default RunningPaymentModal;