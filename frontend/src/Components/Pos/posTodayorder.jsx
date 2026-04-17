import React from "react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import apiConfig from '../layouts/base_url';

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

  // Calculate totals
  const subtotal = orderData?.cart?.reduce((sum, item) =>
    sum + (item.quantity * item.salesprice), 0) || 0;
  const vatPercent = 5;
  const vatAmount = (subtotal * vatPercent) / 100;
  const netTotal = subtotal - vatAmount;
  const grandTotal = netTotal + vatAmount;

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear().toString().slice(-2)} ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
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
          <span>Type:</span>
          <span style={{ textTransform: 'uppercase' }}>{orderData?.options || 'N/A'}</span>
        </div>
        {orderData?.tableDetails && (
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

      {orderData?.cart?.map((item, index) => (
        <div key={index} style={thermalStyles.itemRow}>
          <span style={thermalStyles.itemName}>
            {item.menuItemDetails?.foodmenuname || item.foodmenuname || 'N/A'}
          </span>
          <span style={thermalStyles.itemQty}>x{item.quantity}</span>
          <span style={thermalStyles.itemPrice}>
            {(item.quantity * item.salesprice).toFixed(2)}
          </span>
        </div>
      ))}

      <div style={thermalStyles.divider} />

      <div style={{ marginTop: '5px' }}>
        <div style={thermalStyles.row}>
          <span>Subtotal:</span>
          <span>{netTotal.toFixed(2)}</span>
        </div>
        <div style={thermalStyles.row}>
          <span>VAT ({vatPercent}%):</span>
          <span>{vatAmount.toFixed(2)}</span>
        </div>
        <div style={{ ...thermalStyles.row, ...thermalStyles.totalRow }}>
          <span style={{ fontSize: '12px' }}>GRAND TOTAL:</span>
          <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{grandTotal.toFixed(2)} AED</span>
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

// Thermal KOT Component
const ThermalKOTComponent = React.forwardRef(({ orderData, restaurantInfo = {} }, ref) => {
  const defaultRestaurant = {
    name: "TAHA Cafeteria",
    address: "Electra street - opposite NMC",
    city: "Al Danah - Zone 1 - Abu Dhabi",
    phone: "02 632 8382"
  };

  const restaurant = { ...defaultRestaurant, ...restaurantInfo };

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear().toString().slice(-2)} ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
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
    kotTitle: {
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: '12px',
      margin: '5px 0',
      padding: '3px',
      backgroundColor: '#f0f0f0'
    },
    divider: {
      borderTop: '1px dashed #000',
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
      marginBottom: '3px',
      padding: '2px 0'
    },
    itemName: {
      flex: 3,
      wordBreak: 'break-word'
    },
    itemQty: {
      flex: 1,
      textAlign: 'center',
      fontWeight: 'bold'
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
        <div style={{ fontSize: '9px' }}>{restaurant.address}</div>
        <div style={{ fontSize: '9px' }}>{restaurant.city}</div>
        <div style={{ fontSize: '9px' }}>Tel: {restaurant.phone}</div>
      </div>

      <div style={thermalStyles.kotTitle}>
        KITCHEN ORDER TICKET (KOT)
      </div>

      <div style={{ marginBottom: '8px' }}>
        <div style={thermalStyles.row}>
          <span>Order #:</span>
          <span style={{ fontWeight: 'bold' }}>{orderData?.ordernumber || 'N/A'}</span>
        </div>
        <div style={thermalStyles.row}>
          <span>Time:</span>
          <span>{formatDate(orderData?.date || Date.now())}</span>
        </div>
        <div style={thermalStyles.row}>
          <span>Type:</span>
          <span style={{ textTransform: 'uppercase' }}>{orderData?.options || 'N/A'}</span>
        </div>
        {orderData?.tableDetails && (
          <div style={thermalStyles.row}>
            <span>Table:</span>
            <span>{orderData.tableDetails.tablename}</span>
          </div>
        )}
      </div>

      <div style={thermalStyles.divider} />

      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
        ITEMS ORDERED:
      </div>

      {orderData?.cart?.map((item, index) => (
        <div key={index} style={thermalStyles.itemRow}>
          <span style={thermalStyles.itemName}>
            {index + 1}. {item.menuItemDetails?.foodmenuname || item.foodmenuname || 'N/A'}
          </span>
          <span style={thermalStyles.itemQty}>x {item.quantity}</span>
        </div>
      ))}

      <div style={thermalStyles.divider} />

      <div style={thermalStyles.footer}>
        <div>Please prepare the above items</div>
        <div style={{ fontSize: '8px', marginTop: '5px' }}>*** KOT generated ***</div>
      </div>
    </div>
  );
});

ThermalKOTComponent.displayName = 'ThermalKOTComponent';

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
  const [printType, setPrintType] = useState('receipt'); // 'receipt' or 'kot'

  const [paymentError, setPaymentError] = useState('');

  // Cancel Order
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [addedby, setUserId] = useState("");
  const [shiftstoken, setShiftstoken] = useState('');
  const [shiftAccess, setShiftAccess] = useState('');

  const [isCancelmodel, setCancelModel] = useState(false);

  const componentRef = useRef();
  const kotComponentRef = useRef();
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

  // Thermal printer print function
  const handleThermalPrint = (type = 'receipt') => {
    if (type === 'receipt' && componentRef.current) {
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
    } else if (type === 'kot' && kotComponentRef.current) {
      const printContent = kotComponentRef.current.innerHTML;
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Print KOT</title>
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

  // New function for print preview with thermal printer format
  const handlePrintPreview = (order, type = 'receipt') => {
    setOrderData(order);
    setPrintType(type);
    setShowPrintModal(true);
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
                        handlePrintPreview(data[0], 'receipt');
                        setShowModal(false);
                      }
                    }}
                  >
                    <i className="mdi mdi-printer mr-1"></i> Print Receipt
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
                        handlePrintPreview(kotdata[0], 'kot');
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

      {/* Thermal Printer Print Modal */}
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
              className="modal-dialog modal-sm"
              role="document"
              style={{ maxWidth: '320px', zIndex: 1071 }}
              ref={printModalRef}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content" style={{ borderRadius: '8px' }}>
                <div className="modal-header bg-primary text-white" style={{ padding: '10px 15px' }}>
                  <h5 className="modal-title" style={{ fontSize: '16px' }}>
                    <i className="fas fa-print mr-2"></i>
                    {printType === 'receipt' ? 'Print Receipt' : 'Print KOT'}
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
                  {printType === 'receipt' ? (
                    <ThermalReceiptComponent
                      ref={componentRef}
                      orderData={orderData}
                      restaurantInfo={{
                        name: "TAHA Cafeteria",
                        address: "Electra street - opposite NMC",
                        city: "Al Danah - Zone 1 - Abu Dhabi",
                        phone: "02 632 8382",
                        vatNumber: "100123456789",
                        footer: "Thank you for dining with us!"
                      }}
                    />
                  ) : (
                    <ThermalKOTComponent
                      ref={kotComponentRef}
                      orderData={orderData}
                      restaurantInfo={{
                        name: "TAHA Cafeteria",
                        address: "Electra street - opposite NMC",
                        city: "Al Danah - Zone 1 - Abu Dhabi",
                        phone: "02 632 8382"
                      }}
                    />
                  )}
                </div>
                <div className="modal-footer" style={{ padding: '10px', justifyContent: 'space-between' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPrintModal(false);
                    }}
                  >
                    <i className="fas fa-times mr-1"></i> Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleThermalPrint(printType);
                    }}
                  >
                    <i className="fas fa-print mr-1"></i> Print
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