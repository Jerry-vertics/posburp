import React from "react";
import { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import { redirect, useNavigate, Link,useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import DataTable from "react-data-table-component";

import Swal from 'sweetalert2';
import apiConfig from '../../layouts/base_url';


const PosClosingBalance = ({ isModalClosingBalance, setModalClosingBalance }) => {

  const navigate  = useNavigate();
  const { id } = useParams();
  const [addedby, setuserid] = useState("");
  const [shiftstoken, setShiftstoken] = useState('');
  const [posclosebalance, setPosCloseBalance] = useState([]);

  useEffect(() => {
    const storeid = localStorage.getItem("_id");
    const storetoken = localStorage.getItem('shifttoken');
    setuserid(storeid);
    setShiftstoken(storetoken)
  }, []);

  console.log(addedby);

  const [shiftaccess, setShiftAccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = localStorage.getItem('_id');

        if (!id) {
          // Handle the case when storeid is not available in localStorage
          console.error('Store ID not found in localStorage');
          return;
        }

       const response = await axios.get(`${apiConfig.baseURL}/api/pos/getShiftAccess`, {
          params: {
            id: id,
          },
        });
       const shiftdata = response.data;

        // Assuming response.data contains the shiftAccess data
        setShiftAccess(shiftdata.shiftacess);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  const handleCloseBalance = () => {
    setModalClosingBalance(false);
  }

  useEffect(() => {
    const fetchDatas = async () => {
      try {
        const responses = await axios.get(`${apiConfig.baseURL}/api/pos/closingBalance`, {
          params: {
            addedby: addedby,
          },
        });

        console.log(responses.data);

        if (responses.data.length > 0) {
          const firstItem = responses.data[0];
          const shiftacesstoken = firstItem.shiftacess;

          if (shiftacesstoken === shiftaccess) {
            setPosCloseBalance([firstItem]); // Wrap the item in an array
          } else {
            console.log('Shiftacess does not match the desired value');
          }
        } else {
          console.log('No data in the response array');
        }
      } catch (error) {
        console.error('Error fetching closing balance:', error);
      }
    };

    fetchDatas();
  }, [addedby, shiftaccess]);

  const handleCloseShift = () => {
    Swal.fire({
      title: 'Are you sure you want to close the shift?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, close shift',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.put(`${apiConfig.baseURL}/api/pos/closeShift?shiftaccess=${encodeURIComponent(shiftaccess)}`)
          .then((response) => response.data)
          .then((data) => {
            // Handle success
            console.log(data);

            // Clear localStorage and navigate
            window.localStorage.clear();
            navigate('/');

            Swal.fire('Shift closed!', '', 'success');
          })
          .catch((error) => {
            // Handle error
            console.error(error);
            Swal.fire('Error while closing shift', '', 'error');
          });
      } else {
        // If the user clicks "No, cancel"
        Swal.fire('Shift not closed', '', 'info');
      }
    });
  };

  let overallTotal = 0;
  let overallTotals =0;
  let CashinTotal =0;
  let CashoutTotal =0;
  let dropops ='';
  let openningbalance =0;
  let vatTotal =0;
  let subTotal =0;
  const uniqueDrops = new Set();

  return (
    <div>
      <div className={`modal ${isModalClosingBalance ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: isModalClosingBalance ? 'block' : 'none' }}>
        <div className="modal-dialog modal-lg" role="document" style={{ maxWidth: '1200px' }}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Pos Closing Balance</h5>
              <button type="button" className="close" onClick={handleCloseBalance}>
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="container">
                <div className="row">
                  {posclosebalance.length > 0 ? (
                    posclosebalance.map((order) => (
                      <div key={order.id || order._id} className="col-12">
                        <div>
                          <h3>Opening Balance Amount: {order.amount}</h3>
                        </div>

                        {/* Payments Section */}
                        <div key={`payments-${order.id || order._id}`}>
                          {order.payments && order.payments.length > 0 ? (
                            <div>
                              <table className="table table-bordered">
                                <thead>
                                  <tr>
                                    <th>Si No</th>
                                    <th>Bill Number</th>
                                    <th>Date</th>
                                    <th>Subtotal</th>
                                    <th>Vat</th>
                                    <th>Total</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {order.payments
                                    .filter((payment) => payment.status === "Paid" && payment.opentoken === shiftaccess)
                                    .map((payment, index) => {
                                      const paymentTotal = parseFloat(payment.grandTotal) || 0;
                                      overallTotal += paymentTotal;

                                      const subtotal = payment.grandTotal;
                                      const vat = 5;
                                      const vatamounts = (subtotal * vat) / 100;
                                      const subtotalAfterVat = subtotal - vatamounts;

                                      vatTotal += vatamounts;
                                      subTotal += subtotalAfterVat;

                                      const isoDateString = payment.date;
                                      const dateObject = new Date(isoDateString);

                                      // Format the date and time
                                      const formattedDate = dateObject.toLocaleDateString();
                                      const formattedTime = dateObject.toLocaleTimeString();

                                      return (
                                        <tr key={payment._id || `payment-${index}`}>
                                          <td>{index + 1}</td>
                                          <td>{payment.bilnumber}</td>
                                          <td>{formattedDate} {formattedTime}</td>
                                          <td>{subtotalAfterVat}</td>
                                          <td>{vatamounts}</td>
                                          <td>{payment.grandTotal}</td>
                                        </tr>
                                      );
                                    })}
                                </tbody>
                                <tfoot>
                                  <tr>
                                    <td colSpan="3"></td>
                                    <td>Total Subtotal:</td>
                                    <td>{subTotal}</td>
                                    <td>{vatTotal}</td>
                                    <td>{overallTotal}</td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                          ) : (
                            <p key={`no-payments-${order.id || order._id}`}>No payment data available</p>
                          )}
                        </div>

                        {/* Cashdrops Section */}
                        <div key={`cashdrops-${order.id || order._id}`}>
                          {order.cashdrops && order.cashdrops.length > 0 ? (
                            <div>
                              <table className="table table-bordered">
                                <thead>
                                  <tr>
                                    <th>Si No</th>
                                    <th>Option</th>
                                    <th>Amount</th>
                                    <th>Notes</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {order.cashdrops
                                    .filter((payment) => payment.opentoken === shiftaccess)
                                    .map((payment, index) => {
                                      const paymentTotal = parseFloat(payment.amount) || 0;
                                      const drop = payment.dropout;
                                      overallTotals += paymentTotal;
                                      uniqueDrops.add(drop);

                                      if (drop === 'Cashin') {
                                        const Intotal = parseFloat(payment.amount) || 0;
                                        CashinTotal += Intotal;
                                      } else if (drop === 'Cashout') {
                                        const Outtotal = parseFloat(payment.amount) || 0;
                                        CashoutTotal += Outtotal;
                                      }

                                      return (
                                        <tr key={payment._id || `cashdrop-${index}`}>
                                          <td>{index + 1}</td>
                                          <td>{drop}</td>
                                          <td>{payment.amount}</td>
                                          <td>{payment.notes}</td>
                                        </tr>
                                      );
                                    })}
                                </tbody>
                                <tfoot>
                                  <tr>
                                    <td colSpan="3">Overall Total</td>
                                    <td>{overallTotals}</td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                          ) : (
                            <p key={`no-cashdrops-${order.id || order._id}`}></p>
                          )}
                        </div>

                        {/* Summary Table */}
                        <div key={`summary-${order.id || order._id}`}>
                          <table className="table table-bordered">
                            <tbody>
                              <tr>
                                <td colSpan="4">Cash In Total</td>
                                <td>{parseFloat(CashinTotal)}</td>
                              </tr>
                              <tr>
                                <td colSpan="4">Cash out Total</td>
                                <td>{parseFloat(CashoutTotal)}</td>
                              </tr>
                              <tr>
                                <td colSpan="4">Sales Total</td>
                                <td>{parseFloat(overallTotal)}</td>
                              </tr>
                              <tr>
                                <td colSpan="4">Overall Total</td>
                                <td>{parseFloat(order.amount) + CashinTotal - CashoutTotal + overallTotal}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p key="no-data">No data available</p>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-primary" onClick={handleCloseShift}>Shift Close</button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => setModalClosingBalance(false)}>Close</button>
            </div>
          </div>
        </div>
      </div>
      <div className={`modal-backdrop ${isModalClosingBalance ? 'show' : ''}`} style={{ display: isModalClosingBalance ? 'block' : 'none' }}></div>
    </div>
  );
}

export default PosClosingBalance;