import React from "react";
import { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import { redirect, useNavigate, Link } from "react-router-dom";
import Swal from 'sweetalert2';
import apiConfig from '../../layouts/base_url';
import PosNewKotmodal from "./posNeworderkotlist";
import { useReactToPrint } from 'react-to-print';

const PosNeworderKotModal = ({ isModalOpen, setModalOpen }) => {

  const [posRunningorder, setPosRunningorder] = useState([]);
  const [searchKotTerm, setSearchKotTerm] = useState('');
  const [kotdata, setkotData] = useState(null);
  const [showkotModal, setShowKotModal] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [kotToPrint, setKotToPrint] = useState(null);
  const printRef = useRef();

  // React-to-print hook
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `KOT_${kotToPrint?.ordernumber || 'Order'}`,
    onAfterPrint: () => {
      setShowPrintPreview(false);
      setKotToPrint(null);
    }
  });

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    fetch(`${apiConfig.baseURL}/api/pos/getrunningorder`)
      .then((response) => response.json())
      .then((data) => setPosRunningorder(data))
      .catch((error) => console.error(error));
  }, []);

  const handleKotSearch = (e) => {
    setSearchKotTerm(e.target.value);
  };

  const filteredOrders = posRunningorder.filter((order) => {
    const searchTermLower = searchKotTerm.toLowerCase();
    const orderNumberIncludes = order.ordernumber.toLowerCase().includes(searchTermLower);
    const tableNameIncludes = order.table && order.table.tablename.toLowerCase().includes(searchTermLower);
    const waiterNameIncludes = order.waiter.firstname.toLowerCase().includes(searchTermLower);

    return orderNumberIncludes || (tableNameIncludes && waiterNameIncludes);
  });

  const handlekot = (id) => {
    axios.get(`${apiConfig.baseURL}/api/pos/getKot/${id}`)
      .then((response) => {
        setkotData(response.data);

        // Ask user if they want to print
        Swal.fire({
          title: 'KOT Details Loaded',
          text: 'Do you want to view print preview?',
          icon: 'info',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, show preview',
          cancelButtonText: 'No, just view',
          showCloseButton: true
        }).then((result) => {
          if (result.isConfirmed) {
            // Set data for print preview
            setKotToPrint(response.data);
            setShowPrintPreview(true);
          } else {
            // Show regular modal
            setShowKotModal(true);
          }
        });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load KOT details'
        });
      });
  };


  const calculateKotTotals = (cart) => {
    if (!cart || cart.length === 0) {
      return { subtotal: 0, totalQty: 0 };
    }

    const subtotal = cart.reduce((sum, item) =>
      sum + (item.quantity * item.salesprice), 0);

    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

    return {
      subtotal: subtotal.toFixed(2),
      totalQty: totalQty
    };
  };

  // Handle direct print without preview
  const handleDirectPrint = (order) => {
    setKotToPrint(order);
    setShowPrintPreview(true);
  };

   if (!isModalOpen) return null;

  return (
    <div>
      {/* Main KOT Modal */}
      <div className={`modal ${isModalOpen ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: isModalOpen ? 'block' : 'none' }}>
        <div className="modal-dialog modal-lg" role="document" style={{ maxWidth: '1200px' }}>
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">
                <i className="fas fa-utensils mr-2"></i>
                Kitchen Order Tickets (KOT)
              </h5>
              <button type="button" className="close text-white" onClick={handleCloseModal}>
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="fas fa-search"></i>
                        </span>
                      </div>
                      <input
                        type="text"
                        placeholder="Search by Order ID, Table or Waiter..."
                        value={searchKotTerm}
                        onChange={handleKotSearch}
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>

                {filteredOrders.length === 0 ? (
                  <div className="col-md-12 text-center py-5">
                    <i className="fas fa-clipboard-list fa-3x text-muted mb-3"></i>
                    <h5>No running orders found</h5>
                    <p className="text-muted">Start creating orders to see KOTs here</p>
                  </div>
                ) : (
                  filteredOrders.map((order) => (
                    <div key={order._id} className="col-md-3 mb-3">
                      <div className="card border-primary h-100">
                        <div className="card-header bg-primary text-white text-center py-2">
                          <h6 className="mb-0">
                            <i className="fas fa-receipt mr-1"></i>
                            Order #{order.ordernumber}
                          </h6>
                        </div>
                        <div className="card-body text-center">
                          <div className="mb-2">
                            <i className="fas fa-chair mr-1"></i>
                            <strong>Table:</strong> {order.table ? order.table.tablename : 'Takeaway'}
                          </div>
                          <div className="mb-2">
                            <i className="fas fa-user-tie mr-1"></i>
                            <strong>Waiter:</strong> {order.waiter.firstname} {order.waiter.lastname}
                          </div>
                          <div className="mb-3">
                            <i className="fas fa-clock mr-1"></i>
                            <strong>Status:</strong>
                            <span className="badge badge-warning ml-1">Running</span>
                          </div>

                          <div className="btn-group" role="group">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handlekot(order._id)}
                            >
                              <i className="fas fa-eye mr-1"></i> View
                            </button>
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleDirectPrint(order)}
                            >
                              <i className="fas fa-print mr-1"></i> Print
                            </button>
                          </div>
                        </div>
                        <div className="card-footer text-center">
                          <small className="text-muted">
                            <i className="fas fa-calendar-alt mr-1"></i>
                            {new Date(order.date).toLocaleDateString()}
                          </small>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                <i className="fas fa-times mr-1"></i> Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Print Preview Modal for KOT */}
      {showPrintPreview && kotToPrint && (
        <>
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title">
                    <i className="fas fa-print mr-2"></i>
                    KOT Print Preview
                  </h5>
                  <button
                    type="button"
                    className="close text-white"
                    onClick={() => {
                      setShowPrintPreview(false);
                      setKotToPrint(null);
                    }}
                  >
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  {/* KOT Print Content - This will be printed */}
                  <div ref={printRef} style={{ fontFamily: 'monospace', maxWidth: '80mm', margin: '0 auto' }}>
                    {/* KOT Header */}
                    <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                      <h3 style={{ margin: '0 0 5px 0', fontWeight: 'bold', fontSize: '18px' }}>KITCHEN ORDER TICKET</h3>
                      <h4 style={{ margin: '0 0 3px 0', fontSize: '16px' }}>RESTAURANT NAME</h4>
                      <div style={{ borderBottom: '2px dashed #000', margin: '5px 0' }}></div>
                    </div>

                    {/* Order Information */}
                    <div style={{ marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span><strong>KOT No:</strong></span>
                        <span>{kotToPrint.ordernumber || 'N/A'}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span><strong>Date:</strong></span>
                        <span>{new Date(kotToPrint.date || Date.now()).toLocaleDateString()}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span><strong>Time:</strong></span>
                        <span>{new Date(kotToPrint.date || Date.now()).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })}</span>
                      </div>
                      {kotToPrint.table && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                          <span><strong>Table:</strong></span>
                          <span>{kotToPrint.table.tablename}</span>
                        </div>
                      )}
                      {kotToPrint.waiter && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                          <span><strong>Waiter:</strong></span>
                          <span>{kotToPrint.waiter.firstname} {kotToPrint.waiter.lastname}</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span><strong>Type:</strong></span>
                        <span>{kotToPrint.options || 'Dine In'}</span>
                      </div>
                      <div style={{ borderBottom: '1px dashed #000', margin: '8px 0' }}></div>
                    </div>

                    {/* Items List */}
                    <div style={{ marginBottom: '15px' }}>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '3fr 1fr 2fr',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        marginBottom: '5px',
                        borderBottom: '1px solid #000',
                        paddingBottom: '3px'
                      }}>
                        <div>ITEM</div>
                        <div style={{ textAlign: 'center' }}>QTY</div>
                        <div style={{ textAlign: 'right' }}>NOTES</div>
                      </div>

                      {kotToPrint.cart?.map((item, index) => (
                        <div
                          key={index}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '3fr 1fr 2fr',
                            fontSize: '12px',
                            marginBottom: '4px',
                            paddingBottom: '3px',
                            borderBottom: '1px dotted #ccc'
                          }}
                        >
                          <div style={{ wordBreak: 'break-word' }}>
                            {item.foodmenuname}
                          </div>
                          <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                            {item.quantity}
                          </div>
                          <div style={{ textAlign: 'right', fontStyle: 'italic', fontSize: '11px' }}>
                            {/* Add special instructions here if available */}
                          </div>
                        </div>
                      ))}

                      <div style={{ borderBottom: '1px dashed #000', margin: '10px 0' }}></div>
                    </div>

                    {/* Order Summary */}
                    <div style={{ fontSize: '12px', marginBottom: '15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                        <span><strong>Total Items:</strong></span>
                        <span>{kotToPrint.cart?.reduce((sum, item) => sum + item.quantity, 0) || 0}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                        <span><strong>Order Value:</strong></span>
                        <span>₹{calculateKotTotals(kotToPrint.cart).subtotal}</span>
                      </div>
                    </div>

                    {/* Kitchen Notes */}
                    <div style={{
                      marginTop: '15px',
                      padding: '8px',
                      border: '1px dashed #000',
                      fontSize: '11px'
                    }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>KITCHEN NOTES:</div>
                      <div style={{ minHeight: '40px' }}>
                        ________________________________
                        <br/>
                        ________________________________
                      </div>
                    </div>

                    {/* Footer */}
                    <div style={{
                      textAlign: 'center',
                      marginTop: '20px',
                      fontSize: '10px',
                      paddingTop: '10px',
                      borderTop: '1px dashed #000'
                    }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                        *** KITCHEN COPY ***
                      </div>
                      <div style={{ marginBottom: '5px' }}>
                        {new Date().toLocaleString()}
                      </div>
                      <div>
                        Generated by POS System
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowPrintPreview(false);
                      setKotToPrint(null);
                    }}
                  >
                    <i className="fas fa-times mr-1"></i> Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handlePrint}
                  >
                    <i className="fas fa-print mr-1"></i> Print KOT
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {/* Existing KOT Detail Modal */}
      {/* <PosNewKotmodal
        kotdata={kotdata}
        showkotModal={showkotModal}
        setShowKotModal={setShowKotModal}
      /> */}

      {/* Background overlay */}
      <div className={`modal-backdrop ${isModalOpen ? 'show' : ''}`} style={{ display: isModalOpen ? 'block' : 'none' }}></div>
    </div>
  );
};

export default PosNeworderKotModal;