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


const PosCancelOrder = ({ isModalCanelOrders, setModalCancelOrders }) => {

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

  // useEffect(() => {

  //   axios.get(`${apiConfig.baseURL}/api/pos/closingBalance?shiftstoken=${encodeURIComponent(shiftstoken)}`)
  //  // axios.fetch(`${apiConfig.baseURL}/api/pos/closingBalance?shiftstoken=${encodeURIComponent(shiftstoken)}`)

  //     .then((response) => response.json())
  //     .then((data) => setPosCloseBalance(data))
  //    .catch((error) => console.error(error));

  // }, []);
  // console.log(posclosebalance);

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

        //const response = await axios.get(`${apiConfig.baseURL}/api/pos/getShiftAccess?storeid=${storeid}`);
       const response = await axios.get(`${apiConfig.baseURL}/api/pos/getShiftAccess`, {
          params: {
            id: id,
          },
        });
       // console.log(response.data);
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
    setModalCancelOrders(false);
  }
  useEffect(() => {
    const fetchDatas = async () => {
      try {
        const responses = await axios.get(`${apiConfig.baseURL}/api/pos/closingCancelOrder`, {
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


  let overallTotal = 0;




  return (
    <div>
    <div className={`modal ${isModalCanelOrders ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: isModalCanelOrders ? 'block' : 'none' }}>
      <div className="modal-dialog modal-lg" role="document" style={{ maxWidth: '1200px' }}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Pos Cancel Orders</h5>
            <button type="button" className="close" onClick={handleCloseBalance}>
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="container">
              <div className="row">
{posclosebalance.length > 0 ? (
  posclosebalance.map((order) => (
    <React.Fragment key={order._id || order.id}>
      <div>
        <h3>Opening Balance Amount: {order.amount}</h3>
      </div>
      <div>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Si No</th>
              <th>Bill Number</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {order.payments
              .filter((payment) => payment.status === "Cancel" && payment.opentoken === shiftaccess)
              .map((payment, index) => {
                const paymentTotal = parseFloat(payment.grandTotal) || 0;
                overallTotal += paymentTotal;

                return (
                  <tr key={payment._id || `payment-${index}`}>
                    <td>{index + 1}</td>
                    <td>{payment.bilnumber}</td>
                    <td>{payment.grandTotal}</td>
                  </tr>
                );
              })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="2">Overall Total</td>
              <td>{overallTotal}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-outline-secondary" onClick={() => setModalCancelOrders(false)}>Close</button>
      </div>
    </React.Fragment>
  ))
) : (
  <p>No data available</p>
)}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className={`modal-backdrop ${isModalCanelOrders ? 'show' : ''}`} style={{ display: isModalCanelOrders ? 'block' : 'none' }}></div>
  </div>
  );

}


export default PosCancelOrder;