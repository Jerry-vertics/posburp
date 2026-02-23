import React from "react";
import { useState,useEffect } from "react";
import Header from '../layouts/Header';
import Sidebar from '../layouts/Sidebar';
import Footer from '../layouts/Footer';
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import { redirect, useNavigate,Link } from "react-router-dom";
import PosTable from "./posTable";
import PosRunningOrder from "./posRunningorder";
import apiConfig from "../layouts/base_url";

const Pos =() =>{



    const customStyle = {
        paddingTop: '84px', // Adjust the value as needed
      };

      const divStyle = {
        display: 'flex',
        flexDirection: 'row',
        // Add other CSS properties here if needed
      }

      const notify = () => toast("Wow so easy!");
      const containerStyle = {
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '50%',
      };


    const [foodCategory, setFoodcategory] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [errors, setErrors] = useState({});
    const [waiter, setWaiter] = useState([]);
    const [waiters,setWaiters] =useState('');
    const [showTable, setShowTable] = useState(false);
    const [table, setTable] = useState([]);
    const [customer, setCustomer] = useState([]);
    const [customers, setCustomers] = useState('');
    const [activeTab, setActiveTab] = useState(0);

    //const distinctCategories = Array.from(new Set(foodCategory.map(item => item.foodcategory.foodcategoryname)));
    const distinctCategories = [...new Set(foodCategory.map(item => item.foodcategory.foodcategoryname))];

    const [isLoading, setIsLoading] = useState(false);
    const [cart, setCart] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [vatAmount, setTotalVat] = useState(0);

  const [grandTotal, setGrandTotal] = useState(0);
  const [options,setOptions] =useState('');
  const [selectTable,setSelectTable] =useState();

  const [showDineinOptions,setShowDineinOptions] =useState(true);
  const [placeOrder, setPlaceOrder] = useState({});

// console.log(selectTable);
// console.log(waiters);
// console.log(customers);
    const toastOptions = {
      autoClose: 400,
      pauseOnHover: true,
    }
    const navigate = useNavigate();



    useEffect(() => {

      axios.get(`${apiConfig.baseURL}/api/pos/posfood`)
      .then((response) => {
        setFoodcategory(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);


  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const [values,setValues] = useState({

    customername :'',
    customeremail:'',
    customermobile:'',
    customeraddress:''


})

const handleSubmit =(event) =>{

    event.preventDefault();
    const validationErrors = validateForm(values);
    if (Object.keys(validationErrors).length === 0) {
    axios.post(`${apiConfig.baseURL}/api/customer/createCustomer`,values)
    .then(res =>{

        console.log(res);
        navigate('/viewCustomer');
    })
    .catch(err =>console.log(err));
  }
  else {
    // Set validation errors
    setErrors(validationErrors);
  }

}


const validateForm = (data) => {
  let errors = {};

  if (!data.customername) {
    errors.customername = "Customer Name is required";
  }

  if (!data.customeremail) {
    errors.customeremail = "Vat Percentage is required";
  }else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(data.customeremail)) {
    errors.customeremail = "Invalid email address";
  }
  if (!data.customermobile) {
    errors.customermobile = "Mobile Number is required";
  } else if (!/^\d+$/.test(data.customermobile)) {
    errors.customermobile = "Enter Number Only";
  }


  return errors;
};



  useEffect(() => {

    axios.get(`${apiConfig.baseURL}/api/pos/posWaiter`)
    .then((response) => {
        setWaiter(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
}, []);
const handleWaiter = (event) => {

    setWaiters(event.target.value);

   }


useEffect(() => {

    axios.get(`${apiConfig.baseURL}/api/pos/posCustomer`)
    .then((response) => {
        setCustomer(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
}, []);
const handleCustomer=(event)=>
{
    setCustomers(event.target.value);
}



useEffect(() => {

    axios.get(`${apiConfig.baseURL}/api/pos/posTable`)
    .then((response) => {
        setTable(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
}, []);
const [modaltable, setModalTable] = useState([]);
useEffect(() => {

  axios.get(`${apiConfig.baseURL}/api/pos/posTable`)
  .then((response) => {
      setModalTable(response.data);
  })
  .catch((error) => {
    console.error(error);
  });
}, []);



  const handleOpenTable =(e) =>{
    setShowTable(true);
    //console.log(e);
    setWaiters("")
    setCustomers("")
   setOptions(e.target.innerText);
  }
  console.log(options);
  const handleCloseTable =() =>{
    setSelectTable('');
    setShowTable(false);
  }

  const addProductToCart = async(menu) =>{

    let findProductInCart = cart.find(i=>{
      return i._id === menu._id
    });
    console.info({findProductInCart})
    let newCart = [];
    if(findProductInCart){
      let newItem;

      cart.forEach(cartItem => {
        if(cartItem._id === menu._id){
          newItem = {
            ...cartItem,
            quantity: cartItem.quantity + 1,
            // totalAmount: cartItem.salesprice * (cartItem.quantity + 1),
           // vatAmount:(cartItem.salesprice * (cartItem.quantity + 1) * cartItem.vat.percentage) / 100,


          }
          //console.log(vatAmount);
          newCart.push(newItem);
        }else{
          newCart.push(cartItem);
         // console.log(cartItem);
        }
      });
      console.info({newCart})
      setCart(newCart);
      const toastOptions = {
        position: 'top-right',
        autoClose: 3000, // Close the toast after 3 seconds
        hideProgressBar: false, // Show a progress bar
        closeOnClick: true, // Close the toast when clicked
        pauseOnHover: true, // Pause on hover
      };
      <ToastContainer />
     // toast(`Added ${menu.foodmenuname} to the cart`, toastOptions);
   //  toast(`Added ${newItem.foodmenuname} to cart`,toastOptions)

    }else{
      let addingProduct = {
        ...menu,
        'quantity': 1,
        'totalAmount': menu.salesprice,
      }
      setCart([...cart, addingProduct]);
      const toastOptions = {
        position: 'top-right',
        autoClose: 3000, // Close the toast after 3 seconds
        hideProgressBar: false, // Show a progress bar
        closeOnClick: true, // Close the toast when clicked
        pauseOnHover: true, // Pause on hover
      };

      //toast(`Added ${newItem.foodmenuname} to the cart`, toastOptions);
      <ToastContainer />
    }


  }

  const removeProduct = async(menu) =>{
    const newCart =cart.filter(cartItem => cartItem._id !== menu._id);
    setCart(newCart);
  }

  // const componentRef = useRef();

  // const handleReactToPrint = useReactToPrint({
  //   content: () => componentRef.current,
  // });

  // const handlePrint = () => {
  //   handleReactToPrint();
  // }

  // useEffect(() => {
  //   fetchProducts();
  // },[]);


  useEffect(() => {
    let newTotalAmount = 0;
    let newVatAmount = 0;

    cart.forEach(icart => {

      newTotalAmount = newTotalAmount + icart.quantity * parseInt(icart.totalAmount);
      newVatAmount = parseInt(icart.vat.percentage) != 0 ? newVatAmount + icart.quantity * parseInt(icart.salesprice) * (parseInt(icart.vat.percentage)/100) : newVatAmount;
    })

    console.log({newVatAmount});
    setTotalAmount(newTotalAmount);
    setTotalVat(newVatAmount.toFixed(2));
    setGrandTotal((newTotalAmount+newVatAmount).toFixed())
  },[cart])


  // useEffect(() => {


  //   let newVatAmount =0;
  //   cart.forEach(icart => {

  //     newVatAmount = newVatAmount + parseInt(icart.vatAmount);
  //   })

  //   setTotalVat(newVatAmount)
  // },[cart])

  const handleSubmitPos =(e)=>{
    e.preventDefault();
   console.log(placeOrder);


  }

  const handleIncrement = (prod) => {
    const { _id, salesprice} = prod
    console.log({cart, prod})
    console.log({prodId: prod["_id"]});
    let addQuantity = cart.map(item => {
      if(item["_id"] == prod["_id"]) {
        console.log(({item}));
        item.quantity = item.quantity + 1;
        return item;
      }
      return item;
    })
    console.log({addQuantity});
    console.log({totalAmount});
    // setTotalAmount(parseInt(totalAmount) + parseInt(salesprice))
    setCart(addQuantity)
  }

  //console.log({totalAmount});

  const handleDecrement = (prod) => {
    const { _id, salesprice} = prod
    console.log({cart, prod})
    console.log({prodId: prod["_id"]});
    let addQuantity = cart.map(item => {
      if(item["_id"] == _id) {
        console.log(({item}));
        item.quantity = item.quantity > 1 ? item.quantity - 1 : 1;
        return item;
      }
      return item;
    })
    console.log({addQuantity});
    // setTotalAmount(parseInt(totalAmount) - parseInt(salesprice))
    setCart(addQuantity)
  }

  const handleDine =(dine)=>{

  }

  const handleTakeaway =(e) =>{
    setShowDineinOptions(false)
    setOptions(e.target.innerText)
    setWaiters("")
    setCustomers("")
  }

  const handleDelivery =(e) =>{
    setShowDineinOptions(true)
    setOptions(e.target.innerText)
    setWaiters("")
    setCustomers("")
  }

const handlePlaceorder =(event) =>{
  event.preventDefault();
  if (cart.length < 1) {
    alert("cart is empty")
  }
  else if(!options)
  {
    alert("Please select options");
  } else if(options == 'Dine in'){



  //
    if(!waiters && !customers) {
    alert("please select waiters and customers")
    } else if(!waiters){
      alert("Please select waiters")
    } else if(!customers) {
      alert("Please select customers")
    } else {


      setPlaceOrder({
        selectTable,
        customers,
        waiters,
        cart,
        options,
        totalAmount,
        grandTotal,
        vatAmount
      })
 console.log({selectTable, customers, waiters, cart, options, totalAmount, grandTotal, vatAmount });

//  const transformedCart = cart.map(item => ({
//   _id: item._id,
//   salesprice: item.salesprice,
//   quantity: item.quantity,
// }));

//console.log(transformedCart);


      var posData = new FormData();

     posData.append("customers",customers);
     posData.append("options",options);
     posData.append("grandTotal",grandTotal);

     for (let i = 0; i < cart.length; i++) {
      posData.append(
        `cart[${i}].foodmenuId`,
       cart[i]._id
      );
      posData.append(
        `cart[${i}].salesprice`,
        cart[i].salesprice
      );
      posData.append(
        `cart[${i}].quantity`,
        cart[i].quantity
      );


    }


    // for (let j = 0; j < selectTable.length; j++) {
    //   posData.append(
    //     `selectTable[${i}].tableId`,
    //     selectTable[i]._id
    //   );



    // }




  ///posData.append("cart",transformedCart);
     posData.append("vatAmount",vatAmount);
     posData.append("total",totalAmount);
    posData.append("foodoption",options);
    posData.append("tableId",selectTable._id);
    posData.append("waiterId",waiters);




      const config = {
        headers: {
          'Content-Type': 'application/json',
        }
      };

       axios
      .post(`${apiConfig.baseURL}/api/pos/createpos`, posData, config)
       .then(res => {
          console.log(res);
          navigate('/posorder');
        })
        .catch(err => console.log(err));

    }
    //console.info({selectTable, customers, waiters, cart, options, totalAmount, grandTotal, vatAmount })

  }
  else {
   // console.log({selectTable, customers, waiters, cart, options, totalAmount, grandTotal, vatAmount });
    setPlaceOrder({
      selectTable,
      customers,
      waiters,
      cart,
      options,
      totalAmount,
      grandTotal,
      vatAmount
    })

    var posData = new FormData();
    //posData.append("", photo);
    posData.append("customers",customers);
    posData.append("options",options);


    posData.append("grandTotal",grandTotal);

    for (let i = 0; i < cart.length; i++) {
     posData.append(
       `cart[${i}].foodmenuId`,
      cart[i]._id
     );
     posData.append(
       `cart[${i}].salesprice`,
       cart[i].salesprice
     );
     posData.append(
       `cart[${i}].quantity`,
       cart[i].quantity
     );


   }


 ///posData.append("cart",transformedCart);
    posData.append("vatAmount",vatAmount);
    posData.append("total",totalAmount);
   posData.append("foodoption",options);
   //posData.append("tableId",null);
   posData.append("waiterId",waiters);




     const config = {
       headers: {
         'Content-Type': 'application/json',
       }
     };

      axios
     .post(`${apiConfig.baseURL}/api/pos/createpos`, posData, config)
      .then(res => {
         console.log(res);
         navigate('/posorder');
       })
       .catch(err => console.log(err));



    //api call
  }

}

const handleDineinSubmit= () =>{
    if(selectTable)
    {
      setShowTable(false);
      setShowDineinOptions(false);
    }


}


    return (
        <div className="container-fluid">

           <div className="col-12 main-content">
          <div className="tbl-h">
          <ul className="nav nav-tabs nav-justified" role="tablist">
          <li className="nav-item">

                  <Link to="/dashboard" className="nav-link " data-toggle="tab"   aria-selected="true">Dashboard</Link>
              </li>
              <li className="nav-item">
                  <a className="nav-link active" data-toggle="tab" href="#dinein" role="tab" aria-controls="duck2" aria-selected="true">New Order</a>
              </li>
              <li className="nav-item">
                  <a className="nav-link" data-toggle="tab" href="#delivery" role="tab" aria-controls="chicken2" aria-selected="false">On Going Order</a>
              </li>
              <li className="nav-item">
                  <a className="nav-link" data-toggle="tab" href="#pickup" role="tab" aria-controls="kiwi2" aria-selected="false">Kitchen Status</a>
              </li>
              <li className="nav-item">
                  <a className="nav-link" data-toggle="tab" href="#todayorder" role="tab" aria-controls="kiwi2" aria-selected="false">Today Order</a>
              </li>


          </ul>
      </div>
                </div>
                <form onSubmit={handleSubmitPos}>
        <div className="row">
             <div className="tab-content mt-3">
             <div className="tab-pane active" id="dinein" role="tabpanel" aria-labelledby="duck-tab">
                <div className="row">
                    <div className="col-md-7">

                    <input type="text" className="form-control" placeholder="Search Here Food" />
                    {/* <div className="tab-nav-bar">
            <div className="tab-navigation">
                <i className="uil uil-angle-left left-btn"></i>
                <i className="uil uil-angle-right-b right-btn"></i>
                <ul className="tab-menu">
                    <li className="tab-btn active">Tea Items</li>
                    <li className="tab-btn">Snacks</li>
                    <li className="tab-btn">North Indian</li>
                    <li class="tab-btn">South Indian</li>
                    <li className="tab-btn">Veg</li>
                    <li className="tab-btn">Non Veg</li>
                    <li className="tab-btn">Burger</li>
                    <li className="tab-btn">North Indian</li>
                    <li className="tab-btn">South Indian</li>
                    <li className="tab-btn">Veg</li>
                    <li className="tab-btn">Non Veg</li>
                    <li className="tab-btn">Burger</li>
                </ul>
            </div>
        </div> */}
        <div class="tab-scroller" >
   <i class="tab-scroller-arrow left-arrow d-none ">


   </i>
   <i class="tab-scroller-arrow right-arrow d-none">

   </i>
   <ul class="nav nav-pills" id="pills-tab" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Home</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Profile</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Contact</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Contact</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Contact</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Contact</button>
      </li>

    </ul>
</div>
                    <div className="tbl-h">
                    <ul className="nav nav-pills flex-columns shdw-lft " id="myTab" role="tablist">


                        {distinctCategories.map((category, index) => (


                                <li className="nav-item">

          <a
            key={index}
            className={`nav-item nav-link ${index === activeTab ? 'active' : ''}`}
            onClick={() => setActiveTab(index)}
          >
            {category}
          </a>
                              </li>
                              ))}





                              </ul>
                            </div>

        <div className="tab-content p-3" id="myTabContent">
        {isLoading ? 'Loading' :<div className="row">
        {foodCategory.length > 0 &&
            foodCategory
              .filter(item => item.foodcategory.foodcategoryname === distinctCategories[activeTab])
              .map((menu, index) => (
                <div className="col-sm-3 col-sm-3" key={index}>
                  <div className="menu-box" onClick={() => addProductToCart(menu)}>

                    <div className="menu-div">
                    {/* <img src={`/uploads/${menu.photo}`} className=" foodimg" /> */}
                      <h6 className="mt-2">{menu.foodmenuname}</h6>
                      <p>Price: {menu.salesprice}</p>
                    </div>
                  </div>
                </div>
              ))}
 </div> }
        </div>


                    </div>
                    <div className="col-md-5">
                            <div className="wraper shdw">
    <div className="row">
        <div className="col-md-4">
        <button type="button" onClick={handleOpenTable}   className="btn btn-success w-100 mb-2 p-2">Dine in</button>
        </div>
        <div className="col-md-4">
        <button type="button" onClick={handleTakeaway} className="btn btn-warning w-100 mb-2 p-2">Take way</button>
        </div>
        <div className="col-md-4">
        <button type="button" onClick={handleDelivery} className="btn btn-danger w-100 mb-2 p-2">Delivery</button>
        </div>
    </div>
    <div className="row">
        <div className="col-md-4">
        <select name="" disabled={showDineinOptions} className="form-control " onChange={handleWaiter}  value={waiters} >
                             <option >Select Waiter</option>
                                 {waiter.map((wait,wai) => (
                                  <option key={wai} value={wait._id}>
                                      {wait.waitername}
                                   </option>
                                 ))}
                        </select>
        </div>
        <div className="col-md-4">
        <select name="" disabled={showDineinOptions} className="form-control" onChange={handleCustomer}  value={customers}  >
                             <option >Select Customer</option>
                                 {customer.map((cust,cus) => (
                                  <option key={cus} value={cust._id}>
                                      {cust.customername}
                                   </option>
                                 ))}
                        </select>
        </div>
        <div className="col-md-1">
        <button className="btn btn-primary w-100 mb-2 p-2" onClick={handleOpenModal}>
        +
      </button>
</div>
<div className="col-md-3">
<button className="btn btn-primary w-100 mb-2 p-2" onClick={handleOpenTable}>
        Table
      </button>
</div>

    </div>

         <div className="table-responsive vh-70">
             <table className="table">
                 <thead>
                   <tr className="thead-light">
                     <th scope="col">No.</th>
                     <th scope="col">Name</th>
                     <th scope="col">U.Price</th>
                     <th scope="col">Qty</th>

                     <th scope="col" className="text-right">Total</th>
                     <th>Action</th>
                   </tr>
                 </thead>
                 <tbody>
                 { cart ? cart.map((cartProduct, key) => <tr key={key}>
                      {/* <td>{cartProduct._id}</td> */}
                      <td>{key+1}</td>
                      <td>{cartProduct.foodmenuname}</td>
                      <td>{cartProduct.salesprice}</td>
                      <td><button className='btn btn-danger btn-sm cartminus' onClick={()=>handleDecrement(cartProduct)}>-</button><input type="text" style={{ width: '20px' }} value={cartProduct.quantity} /><button className='btn btn-success btn-sm cartplus' onClick={()=>handleIncrement(cartProduct)}>+</button></td>

                      <td>{cartProduct.totalAmount}</td>
                      <td>
                        <button className='btn btn-danger btn-sm' onClick={() => removeProduct(cartProduct)}>x</button>
                      </td>

                    </tr>)

                    : 'No Item in Cart'}


                 </tbody>
               </table>
         </div>

         <div className="table-responsive">
             <table className="table">
                   <tr>
                     <td>Total </td>
                     <th className="text-right">${totalAmount}</th>
                   </tr>
                   <tr>
                     <td >Discount  </td>
                     <th className="text-right"></th>
                   </tr>
                   <tr>
                     <td>VAT </td>
                     <th className="text-right">${vatAmount}</th>
                   </tr>
                   <tr>
                     <th>Grand Total   </th>
                     <th className="text-right">{grandTotal}</th>
                   </tr>
                   <tr>
                     <td>

                         <div className="custom-control custom-radio custom-control-inline">
                           <input type="radio" className="custom-control-input" id="defaultInline1" name="inlineDefaultRadiosExample" />
                           <label className="custom-control-label" htmlFor="defaultInline1">Cash</label>
                         </div>


                         <div className="custom-control custom-radio custom-control-inline">
                           <input type="radio" className="custom-control-input" id="defaultInline2" name="inlineDefaultRadiosExample" />
                           <label className="custom-control-label" htmlFor="defaultInline2">Card</label>
                         </div>
                     </td>
                     <th ></th>
                   </tr>
               </table>
         </div>

         <div className="row">
             <div className="col-lg-6"><button type="button" className="btn btn-danger w-100 mb-2 p-2">Cancel</button></div>
             <div className="col-lg-6 pl-0"><button type="button" onClick={handlePlaceorder} className="btn btn-warning w-100 mb-2 p-2">Place Order</button></div>
             <div className="col-lg-6"><button type="button" className="btn btn-danger w-100 mb-2 p-2">Hold</button></div>
             <div className="col-lg-6 pl-0"><button type="button" className="btn btn-success w-100 mb-2 p-2">Quick Pay</button></div>
         </div>
     </div>
                            </div>

                </div>
            </div>


            <div className="tab-pane" id="delivery" role="tabpanel" aria-labelledby="chicken-tab">
                 <PosRunningOrder />
              </div>
              <div className="tab-pane" id="pickup" role="tabpanel" aria-labelledby="kiwi-tab">
                  333333333333333
              </div>


            </div>

        </div>
        </form>

        {/* Add Customer  */}
        <div
        className={`modal ${showModal ? 'show' : ''}`}
        style={{ display: showModal ? 'block' : 'none' }}
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Customer</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={handleCloseModal}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
            <div className="row">



             <form className="forms-sample" onSubmit={handleSubmit} >
                 <div className="row">

                     <div className="form-group row">
                 <label htmlFor="exampleInputUsername2" className="col-sm-4 col-form-label">Customer Name</label>
                 <div className="col-sm-8">
                 <input type="text" className="form-control" name="customername" id="exampleInputUsername2" onChange={e =>setValues({...values, customername: e.target.value})} placeholder="Customer Name" />
                          {errors.customername && <span className="error">{errors.customername}</span>}

                 </div>
               </div>

               <div className="form-group row">
                 <label htmlFor="exampleInputUsername2" className="col-sm-4 col-form-label">Customer Email</label>
                 <div className="col-sm-8">
                 <input type="text" className="form-control" name="customeremail" id="exampleInputUsername2" onChange={e =>setValues({...values, customeremail: e.target.value})} placeholder="Customer Email" />
                          {errors.customeremail && <span className="error">{errors.customeremail}</span>}

                 </div>
               </div>
               <div className="form-group row">
                 <label htmlFor="exampleInputUsername2" className="col-sm-4 col-form-label">Customer Mobile</label>
                 <div className="col-sm-8">
                 <input type="text" className="form-control" name="customermobile" id="exampleInputUsername2" onChange={e =>setValues({...values, customermobile: e.target.value})} placeholder="Customer Mobile" />
                          {errors.customermobile && <span className="error">{errors.customermobile}</span>}

                 </div>
               </div>
               <div className="form-group row">
                 <label htmlFor="exampleInputUsername2" className="col-sm-4 col-form-label">Customer Address</label>
                 <div className="col-sm-8">
                 <textarea className='form-control' name='customeraddress' onChange={e =>setValues({...values, customeraddress: e.target.value})}></textarea>
                 </div>
               </div>




                 </div>

                 <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                onClick={handleCloseModal}
              >
                Close
              </button>
              <button type="submit" className="btn btn-gradient-primary me-2">Submit</button>
            </div>

             </form>





     </div>
            </div>

          </div>
        </div>
      </div>
      <div
        className={`modal-backdrop fade ${showModal ? 'show' : ''}`}
        style={{ display: showModal ? 'block' : 'none' }}
      ></div>


      {/* Table */}
             {/* Table */}
             <div
        className={`modal ${showTable ? 'show' : ''}`}
        style={{ display: showTable ? 'block' : 'none' }}
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog modal-xl modal-dialog-scrollable" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Tables</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={handleCloseTable}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
            <div className="row">

            {
                  modaltable.map((tables, index) =>(

                <div className="col-md-3">
                     <div className="card" onClick={(e)=>{
                      setSelectTable(tables)
                      }}>
                   <img style={containerStyle} src="assets/images/table.png" className="center" alt="logo" />
                   <h6 className="text-center">
                   Tablename:{tables.tablename}
                   </h6>
                   <h6 className="text-center">
                   Seatcapacity:{tables.seatcapacity}
                   </h6>
                </div>
                </div>
                  ))
            }






             </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                onClick={handleCloseTable}
              >
                Close
              </button>
              <button type="submit" onClick={handleDineinSubmit} className="btn btn-gradient-primary me-2">Submit</button>
            </div>

          </div>
        </div>
      </div>
      <div
        className={`modal-backdrop fade ${showTable ? 'show' : ''}`}
        style={{ display: showTable ? 'block' : 'none' }}
      ></div>

        </div>

    )


}

export default Pos;