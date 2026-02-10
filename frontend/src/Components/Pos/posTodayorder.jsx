import React from "react";
import { useState,useEffect,useRef } from "react";
import axios from "axios";
import { redirect, useNavigate,Link } from "react-router-dom";
import Swal from 'sweetalert2';
import apiConfig from '../layouts/base_url';

const PosTodayOrder =() =>{

    const [posTodayorder, setPosTodayorder] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [data, setData] = useState(null);
    const [kotdata,setkotData] =useState(null);
    const [showkotModal,setShowKotModal] =useState(false);
    const [printOrderId, setPrintOrderId] = useState(null);
    const [canceldata,setCancelData] =useState(null);

    const [paymentError, setPaymentError] = useState('');

    //Cancel Order
    const [email,setEmail] =useState('');
    const [password,setPassword] =useState('');
    const [addedby, setuserid] = useState("");
    const [shiftstoken, setShiftstoken] = useState('');
    const [shiftAccess, setShiftAccess] = useState('');

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

  useEffect(() => {
    const storeid = localStorage.getItem("_id");
    const storetoken = localStorage.getItem('shifttoken');
    setuserid(storeid);
    setShiftstoken(storetoken)
  }, []);

    const [isCancelmodel, setCancelModel] = useState(false);

    const totalGrandTotal = Array.isArray(posTodayorder)
    ? posTodayorder.reduce((total, order) => {
        // Ensure grandTotal is present and is a number before adding it to the total
        const orderGrandTotal = parseFloat(order.grandTotal);
        return !isNaN(orderGrandTotal) ? total + orderGrandTotal : total;
      }, 0)
    : 0;

    const componentRef = useRef();

    const handlePrint = (orderId) => {
      const selectedOrder = posTodayorder.find((order) => order._id === orderId);
      setPrintOrderId(orderId);
      setData(selectedOrder);
      setShowModal(true);
      // Open a new window for printing


    };

    useEffect(() => {
        fetch(`${apiConfig.baseURL}/api/pos/gettodayOrder`)
          .then((response) => response.json())
          .then((data) => setPosTodayorder(data))
          .catch((error) => console.error(error));
      }, []);

      const handleComplete =(id) =>{
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



    }

    const handlekot =(id) =>
{

  const url = `${apiConfig.baseURL}/api/pos/getKot/${id}`;
  axios.get(url)
  .then((response) => {
    setkotData(response.data);
    console.log(response.data);
    setShowKotModal(true);
  })

  .catch((error) => {
    console.error('Error fetching data:', error);
  });

}

const handlePrints = () => {
  if (componentRef.current) {
    // Assuming your modal content has a handlePrint method
    if (componentRef.current.handlePrint) {
      componentRef.current.handlePrint();
    } else {
      // If handlePrint is not defined, you can use window.print() for a simple print
      window.print();
    }
  }
};

const handleCancel =(id) =>
{

 // setCancelModel(true);
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
  formData.append('addedby',addedby);
  formData.append("shiftstoken", shiftstoken);
  formData.append('opentoken',shiftAccess)

  const config = {
    headers: {
      'Content-Type': 'application/json',
    }
  };

  axios
    .put(`${apiConfig.baseURL}/api/pos/updateCancel/${id}`, formData, config) // Corrected URL
    .then((res) => {
      console.log(res);
      Swal.fire({
        icon: 'success',
        title: 'Order Cancel Approved!',
        text: 'Your Cancel Order was successful.',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
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

                    {
  Array.isArray(posTodayorder) && posTodayorder.length > 0 ? (
    posTodayorder.map((order,key) => {
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
            <a
              onClick={(e) => handleComplete(order._id)}
              className="btn btn-primary"
              style={{ marginRight: '5px' }}
              data-toggle="tooltip"
              data-placement="right"
              title="Print"
            >
              <i className="mdi mdi-cloud-print-outline"></i>
            </a>
            <a
              onClick={(e) => handlekot(order._id)}
              className="btn btn-danger"
              style={{ marginRight: '5px' }}
              data-toggle="tooltip"
              data-placement="right"
              title="Kitchen Order"
            >
              <i className="mdi mdi-food-variant"></i>
            </a>
            <a
              onClick={(e) => handleCancel(order._id)}
              className="btn btn-danger"
              style={{ marginRight: '5px' }}
              data-toggle="tooltip"
              data-placement="right"
              title="Cancel Order"
            >
              <i className="mdi mdi-food-variant"></i>
            </a>
          </td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan="8">No data available</td>
    </tr>
  )
}



                    </tbody>
                    <tfoot>
        <tr>
          <td colSpan="8"></td>
          <td>Total Grand Total:</td>
          <td>{totalGrandTotal}</td>
        </tr>
      </tfoot>
                </table>
            </div>
            <div>
 <div className={`modal ${showModal ? 'show' : ''}`} tabIndex="-1" role="dialog" ref={componentRef} style={{ display: showModal ? 'block' : 'none' }}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Order Details</h5>
              <button type="button" className="close" onClick={() => setShowModal(false)}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {/* Display the data here */}

              { data ? (
data.map((order) => {

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
      <h6>Waiter {order.waiterDetails ? order.waiterDetails.firstname : 'N/A'} {order.waiterDetails ? order.waiterDetails.lastname : 'N/A'}</h6>
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


                <div className="modal-footer">

              <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>Close</button>
            </div>

             </div>

  )  })
              ):(
                <p>No data</p>
              )
            }
            </div>

          </div>
        </div>
      </div>
      <div className={`modal-backdrop ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }}></div>
    </div>
    <div>

  <div className={`modal ${showkotModal ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: showkotModal ? 'block' : 'none' }}>
         <div className="modal-dialog" role="document">
           <div className="modal-content">
             <div className="modal-header">
               <h5 className="modal-title">KOT</h5>
               <button type="button" className="close" onClick={() => setShowModal(false)}>
                 <span aria-hidden="true">&times;</span>
               </button>
             </div>
             <div className="modal-body">
               {/* Display the data here */}

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
       <h6>Waiter {order.waiterDetails ? order.waiterDetails.firstname : 'N/A'} {order.waiterDetails ? order.waiterDetails.lastname : 'N/A'}</h6>
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



                 <div className="modal-footer">
                 <button type="button" onClick={handlePrint}  className="btn btn-outline-primary" >Print</button>
               <button type="button" className="btn btn-outline-secondary" onClick={() => setShowKotModal(false)}>Close</button>
             </div>

              </div>
 )
                   })
               ):(
                 <p>No data</p>
               )
             }
             </div>

           </div>
         </div>
       </div>
       <div className={`modal-backdrop ${showkotModal ? 'show' : ''}`} style={{ display: showkotModal ? 'block' : 'none' }}></div>


     </div>

     <div>



<div className={`modal ${isCancelmodel ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: isCancelmodel ? 'block' : 'none' }}>
         <div className="modal-dialog" role="document">
           <div className="modal-content">
             <div className="modal-header">
               <h5 className="modal-title">Cancel Order </h5>
               <button type="button" className="close" onClick={() => setCancelModel(false)}>
                 <span aria-hidden="true">&times;</span>
               </button>
             </div>
             <div className="modal-body">
               {/* Display the data here */}
               { canceldata ? (
 canceldata.map((order ,key) => (
                <div key={order.id}>
                  <h5>Order Number: {order.billnumber}</h5>
                <h5>Order Number: {order.ordernumber}</h5>
                <h6>Options: {order.options}</h6>


                 <h6 className="text-right">Total :{order.total}</h6>

                 <h6 className="text-right">Grand Total :{order.grandTotal}</h6>

                 <div className="form-group row">
                      <label for="exampleInputUsername2" className="col-sm-3 col-form-label">User Name</label>
                      <div className="col-sm-9">

                      <input type="text" className="form-control" name="email" value={email} onChange={(e) => {setEmail(e.target.value)}} placeholder="Enter Email" />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label for="exampleInputUsername2" className="col-sm-3 col-form-label">Password</label>
                      <div className="col-sm-9">
                      <input type="password" className="form-control" name="password" value={password} onChange={(e) => {setPassword(e.target.value)}} placeholder="Enter Password" />

                      </div>
                    </div>



                 <div className="modal-footer">
                 <button type="button" onClick={() =>handleCancelSubmit(order._id, order)}  className="btn btn-outline-primary" >Submit Cancel Payment</button>
               <button type="button" className="btn btn-outline-secondary" onClick={() => setCancelModel(false)}>Close</button>
             </div>

              </div>

               ))
               ):(
                 <p>No datas</p>
               )
             }

             </div>

           </div>
         </div>
       </div>
       <div className={`modal-backdrop ${isCancelmodel ? 'show' : ''}`} style={{ display: isCancelmodel ? 'block' : 'none' }}></div>


     </div>
        </div>
    )

}
export default PosTodayOrder;