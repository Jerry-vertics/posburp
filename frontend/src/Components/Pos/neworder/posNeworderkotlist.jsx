import React from "react";
import { useState, useEffect,useRef } from "react";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import { redirect, useNavigate, Link } from "react-router-dom";
import Swal from 'sweetalert2';
import ReactToPrint   from "react-to-print";
const PosNewKotmodal =({kotdata,showkotModal,setShowKotModal}) =>
{
    const kotModalRef = useRef();

    const handleCloseHold =() =>{
      setShowKotModal(false);
    }

    const handlePrint = () => {
      if (kotModalRef.current) {
        // Use ReactToPrint to handle the print action for the KOT modal
        kotModalRef.current.handlePrint();
      }
    }
    return (
<div>
 <div className={`modal ${showkotModal ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: showkotModal ? 'block' : 'none' }}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">KOT</h5>
              <button type="button" className="close" onClick={() => setShowKotModal(false)}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">


              { kotdata ? (
kotdata.map((order) => {

  const subtotal = order.cart.reduce((total, cartItem) => total + (cartItem.quantity * cartItem.salesprice), 0);
  const vatPercentValue = 5;
  const vatAmount = (subtotal * vatPercentValue) / 100;
  const subTotals = subtotal - vatAmount;
  const grandTotal =subTotals + vatAmount;
  const orderDate = new Date(order.date);
  const formattedDate = `${orderDate.getDate().toString().padStart(2, '0')}-${(orderDate.getMonth() + 1).toString().padStart(2, '0')}-${orderDate.getFullYear()}`;
  const formattedTime = `${orderDate.getHours().toString().padStart(2, '0')}:${orderDate.getMinutes().toString().padStart(2, '0')}:${orderDate.getSeconds().toString().padStart(2, '0')}`;

            return (
               <div key={order.id}>
               <h5>Order Number: {order.ordernumber}</h5>
               <h6>Options: {order.options}</h6>
               <h6>Customer Name:{order.customerDetails ? order.customerDetails.customername : 'N/A'}</h6>
      <h6>Table:{order.tableDetails ? order.tableDetails.tablename : 'N/A'}</h6>
      <h6>Waiter {order.waiterDetails ? order.waiterDetails.firstname : 'N/A'}</h6>
      <h6>Date & Time:{formattedDate} {formattedTime}</h6>
                <table className="table   table-bordered">
                <thead>
                <tr>
                    <th>Si No</th>
                    <th>Food Name</th>
                    <th>Quanity</th>
                    <th>Unit Price</th>
                    <th>Price</th>
                    </tr>
                </thead>
                <tbody>

                  {order.cart.map((cartItem,key) => (
                <tr key={cartItem.foodmenuId}>
                  <td>{key + 1}</td>
                  <td>{cartItem.menuItemDetails.foodmenuname}</td>
                  <td>{cartItem.quantity}</td>
                  <td>{cartItem.salesprice}</td>
                  <td>{cartItem.quantity * cartItem.salesprice}</td>

                  {/* Render other cart item details here */}
                </tr>
              ))}

                </tbody>
                </table>
                <h6 className="text-right">Subtotal: {subTotals}</h6>
            <h6 className="text-right">VAT Amount ({vatPercentValue}%): {vatAmount}</h6>
            <h6 className="text-right">Grand Total: {grandTotal}</h6>





             </div>
            )
                  })
              ):(
                <p>No data</p>
              )
            }
            </div>

            <div className="modal-footer">
            <ReactToPrint
  trigger={() => (
    <button className="btn btn-outline-primary">Print</button>
  )}
  content={() => componentRef.current}
/>
              <button type="button" className="btn btn-outline-secondary" onClick={() => setShowKotModal(false)}>Close</button>
      </div>

          </div>
        </div>
      </div>
      <div className={`modal-backdrop ${showkotModal ? 'show' : ''}`} style={{ display: showkotModal ? 'block' : 'none' }}></div>
    </div>
    )
}

export default PosNewKotmodal;
