import React from "react";
import { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { redirect, useNavigate, Link,useParams } from "react-router-dom";
import Swal from "sweetalert2";
import apiConfig from "../layouts/base_url";
import {
  FaShoppingCart,
  FaHistory,
  FaPause,
  FaRegCalendarAlt,
} from "react-icons/fa";
import { TbToolsKitchen3, TbChefHat } from "react-icons/tb";
import { BsFillPauseCircleFill } from "react-icons/bs";
import { FaHandHoldingDroplet, FaCcDinersClub } from "react-icons/fa6";
import { RiArchiveDrawerLine } from "react-icons/ri";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { SiTablecheck } from "react-icons/si";
import { IoFastFoodSharp } from "react-icons/io5";
import { CiDeliveryTruck } from "react-icons/ci";

import { MdBookOnline } from "react-icons/md";
import { FaUserAlt } from "react-icons/fa";
import { MdDeliveryDining } from "react-icons/md";
import { MdOutlineTakeoutDining } from "react-icons/md";
import PosNeworderKotModal from "./neworder/posNeworderkotmodal";
import PosNewHoldingModal from "./neworder/posNewHoldingmodal";
import PosCashDrop from "./neworder/cashDropout";
import PosInvoiceReport from "./neworder/posinvoiceReport";
import PosClosingBalance from "./neworder/posClosingbalance";
import PosOrderPrint from "./print/posOrderPrint";
import { useReactToPrint } from 'react-to-print';

import PrintComponent from "./print/posPrint";
import PosCancelOrder from "./neworder/posCancelOrders";
const PosNewOrder = () => {



//  const navigate = useNavigate();
  const [tabEnabled, setTabEnabled] = useState({
    dineIn: false,
    takeaway: false,
    delivery: false,
  });

  const [addedby, setuserid] = useState("");
  const [shiftstoken, setShiftstoken] = useState('');
  const [shiftAccess, setShiftAccess] = useState('');

 // setOpentoken(dit);
 // const dit = shiftAccess.shiftacess;

  const { id } = useParams();
  useEffect(() => {
    const storeid = localStorage.getItem("_id");
    const storetoken = localStorage.getItem('shifttoken');
    const storeaccess = localStorage.getItem('shiftacess');

    setuserid(storeid);
    setShiftstoken(storetoken);




  }, []);


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

//console.log();


  const [designationname, setDesignationName] = useState("");

  const [enableDinein, setEnableDinein] = useState(false);
  const [enableFoodmenu, setEnableFoodmenu] = useState(false);
  // const [isEnableTable, setEnableTable] = useState(true);
  // const [isEnableTakeway,setEnableTakeway] =useState(true);
  // const [isEnableDelivery,setEnableDelivery] =useState(true);
  //Value Declare
  const [waiter, setWaiter] = useState([]);
  const [selectWaiter, setSelectWaiter] = useState();
  const [delivery, setDelivery] = useState([]);
  const [selectDelivery, setSelectDelivery] = useState();
  const [table, setTable] = useState([]);
  const [ordertable, setOrderTable] = useState([]);
  const [selectTable, setSelectTable] = useState();
  const [foodCategory, setFoodcategory] = useState([]);
  const distinctCategories = [
    ...new Set(foodCategory.map((item) => item.foodcategory.foodcategoryname)),
  ];
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [vatAmount, setTotalVat] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [options, setOptions] = useState("");
  const [showCustomerTab, setShowCustomerTab] = useState(false);
  const [showDeliveryTab, setShowDeliveryTab] = useState(false);
  const [showFoodMenuTab, setShowFoodMenuTab] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [selectCustomer, setSelectCustomer] = useState();
  const [placeorder, setPlaceOrder] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [refresh, setRefresh] = useState(false);

  const [searchWaiter, setSearchWaiter] = useState("");
  const [searchTable, setSearchTable] = useState("");
  const [searchCustomer, setSearchCustomer] = useState("");
  const [searchDeliveryPerson, setSearchDeliveryPerson] = useState("");

  const [showTable, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);

  const [posHoldingorder, setPosHoldingorder] = useState([]);
  const [isModalHold, setModalHold] = useState(false);
  const [isModalCashDrop, setModalCashDrop] = useState(false);
  const [numberofperson, setNumberofPerson] = useState("");
  const [isModalInvoiceReport, setModalInvoiceReport] = useState(false);
  const [isModalClosingBalance,setModalClosingBalance] =useState(false);
  const [isModalCanelOrders,setModalCancelOrders] =useState(false);


  const [loadingPlaceOrder, setLoadingPlaceOrder] = useState(false);
const [loadingQuickPay, setLoadingQuickPay] = useState(false);

  const [activeTabletab, setactiveTableTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleSearchWaiter = (e) => {
    setSearchWaiter(e.target.value);
  };

  const handleClearClick = () => {
    setSelectWaiter("");
    setSelectCustomer("");
    setSelectDelivery("");
    setSelectTable("");
    setOptions("");
    setTabEnabled({
      dineIn: false,
      takeaway: false,
      delivery: false,
    });
    setEnableDinein(false);
    setShowCustomerTab(false);
    setShowFoodMenuTab(false);
    setShowDeliveryTab(false);
    setCart([]);

    // navigate("/pos");
  };
  // const filteredWaiters = waiter.filter((wait) =>
  //   wait.waitername.toLowerCase().includes(searchWaiter.toLowerCase())
  // );
  const filteredWaiters = waiter.filter((wait) =>
  wait.firstname.toLowerCase().includes(searchWaiter.toLowerCase()) ||
  wait.lastname.toLowerCase().includes(searchWaiter.toLowerCase())
);
  const handleSearchTable = (e) => {
    setSearchTable(e.target.value);
  };

  const filteredTables = table.filter((tables) =>
    tables.tablename.toLowerCase().includes(searchTable.toLowerCase())
  );

  const handleSearchCustomer = (e) => {
    setSearchCustomer(e.target.value);
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.customername.toLowerCase().includes(searchCustomer.toLowerCase())
  );

  const handleSearchDelivery = (e) => {
    setSearchDeliveryPerson(e.target.value);
  };

  const filteredDelivery = delivery.filter((delivery) =>


      delivery.firstname.toLowerCase().includes(searchDeliveryPerson.toLowerCase()) ||
      delivery.lastname.toLowerCase().includes(searchDeliveryPerson.toLowerCase())
  );

  console.info({ table });
  const handleDinein = (e) => {
    setTabEnabled({
      dineIn: true,
      takeaway: false,
      delivery: false,
    });
    setOptions("Dine In");
    setEnableDinein(true);
    setactiveTableTab(1);
  };

  const handleWaiter = (details) => {
    setSelectWaiter(details);
    setTabEnabled({
      dineIn: true,
      takeaway: true,
      delivery: true,
    });
     setActiveTab(1);
  };
//  console.log("selectWaiter is not empty:", selectWaiter);
  const handleTable = (tables) => {
    if (numberofperson.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter the number of persons!",
      });
    } else {
      setSelectTable(tables);
      setEnableFoodmenu(true);
      setShowFoodMenuTab(true);
    }
  };

  const handleTabsClick = (index) => {
    setActiveTab(index);
  };
  // const trimmedValue = typeof numberofperson === 'string' ? numberofperson.trim() : '';

  // const handleNumberofPersonChange = (e, tableId) => {
  //   setNumberofPerson((prevNumberofperson) => ({
  //     ...prevNumberofperson,
  //     [tableId]: e.target.value,
  //   }));
  // };

  const handleNumberofPersonChange = (e) => {
    const value = e.target.value;

    // Validate if the entered value is a valid positive integer
    if (/^[1-9]\d*$/.test(value) || value === "") {
      setNumberofPerson(value);
    }
  };

  const isValidNumber = () => {
    return /^[1-9]\d*$/.test(numberofperson);
  };

  const handleTakeway = (e) => {
    // setEnableTakeway(false);
    setTabEnabled({
      dineIn: false,
      delivery: false,
      takeaway: true,
    });
    setOptions("Take Away");
    setShowFoodMenuTab(true);
  };

  const handleDelivery = (e) => {
    setTabEnabled({
      dineIn: false,
      delivery: true,
      takeaway: false,
    });
    setOptions("Delivery");
    setShowCustomerTab(true);
    setShowDeliveryTab(true);
  };

  const handleCustomer = (e) => {
    setShowDeliveryTab(false);
  };
  const handleMenu = (e) => {
    setEnableFoodmenu(true);
  };
  const handleDeliveryPerson = (e) => {
    setShowCustomerTab(false);
  };
  console.info({ customers });

  useEffect(() => {
    axios
      .get(`${apiConfig.baseURL}/api/pos/posWaiter`)
      .then((response) => {
        setWaiter(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${apiConfig.baseURL}/api/pos/posDelivery`)
      .then((response) => {
        setDelivery(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    // axios.get(`${apiConfig.baseURL}/api/pos/posTable`)
    //   .then((response) => {
    //     setTable(response.data);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
    axios
      .get(`${apiConfig.baseURL}/api/pos/tableorder`)
      .then((response) => {
        setTable(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get(`${apiConfig.baseURL}/api/pos/posCustomer`)
      .then((response) => {
        setCustomers(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${apiConfig.baseURL}/api/pos/posfood`)
      .then((response) => {
        setFoodcategory(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const addProductToCart = async (menu) => {
    let findProductInCart = cart.find((i) => {
      return i._id === menu._id;
    });
    console.info({ findProductInCart });
    let newCart = [];
    if (findProductInCart) {
      let newItem;

      cart.forEach((cartItem) => {
        if (cartItem._id === menu._id) {
          newItem = {
            ...cartItem,
            quantity: cartItem.quantity + 1,
          };

          newCart.push(newItem);
        } else {
          newCart.push(cartItem);
          // console.log(cartItem);
        }
      });
      console.info({ newCart });
      setCart(newCart);
    } else {
      let addingProduct = {
        ...menu,
        quantity: 1,
        totalAmount: menu.salesprice,
      };
      setCart([...cart, addingProduct]);
    }
  };
  const removeProduct = async (menu) => {
    const newCart = cart.filter((cartItem) => cartItem._id !== menu._id);
    setCart(newCart);
  };

  useEffect(() => {
    let newTotalAmount = 0;
    let newVatAmount = 0;
    cart.forEach((icart) => {
      newTotalAmount =
        newTotalAmount + icart.quantity * parseInt(icart.totalAmount);
      newVatAmount =
        parseInt(icart.vat.percentage) != 0
          ? newVatAmount +
          icart.quantity *
          parseInt(icart.salesprice) *
          (parseInt(icart.vat.percentage) / 100)
          : newVatAmount;
    });
    //console.log({ newVatAmount });
    setTotalAmount(newTotalAmount);
    setTotalVat(newVatAmount.toFixed(2));
    setGrandTotal((newTotalAmount + newVatAmount).toFixed());
  }, [cart]);

  const handleIncrement = (prod) => {
    const { _id, salesprice } = prod;
  //  console.log({ cart, prod });
   // console.log({ prodId: prod["_id"] });
    let addQuantity = cart.map((item) => {
      if (item["_id"] == prod["_id"]) {
        console.log({ item });
        item.quantity = item.quantity + 1;
        return item;
      }
      return item;
    });
    setCart(addQuantity);
  };

  //console.log({totalAmount});

  const handleDecrement = (prod) => {
    const { _id, salesprice } = prod;
   // console.log({ cart, prod });
  //  console.log({ prodId: prod["_id"] });
    let addQuantity = cart.map((item) => {
      if (item["_id"] == _id) {
    //    console.log({ item });
        item.quantity = item.quantity > 1 ? item.quantity - 1 : 1;
        return item;
      }
      return item;
    });
  //  console.log({ addQuantity });
    // setTotalAmount(parseInt(totalAmount) - parseInt(salesprice))
    setCart(addQuantity);
  };


  const [response, setResponse] = useState(null);
const handlePlaceorder = async (event) => {
  event.preventDefault();

  // Validate first
  if (!selectWaiter) {
    Swal.fire({
      icon: 'error',
      title: 'Waiter is Empty',
      text: 'Please select a waiter before placing an order.',
    });
    return;
  } else if (cart.length < 1) {
    Swal.fire({
      icon: 'error',
      title: 'Cart is empty',
      text: 'Please add items to your cart before placing an order.',
    });
    return;
  } else if (!options) {
    Swal.fire({
      icon: 'error',
      title: 'Options not selected',
      text: 'Please select options before placing an order.',
    });
    return;
  }

  // Set loading state
  setLoadingPlaceOrder(true);

  try {
    // Prepare order data
    var posData = new FormData();
    if (selectCustomer && selectCustomer._id) {
      posData.append('customers', selectCustomer._id);
    }
    if (selectDelivery && selectDelivery._id) {
      posData.append("delivery", selectDelivery._id);
    }
    posData.append('options', options);
    posData.append('grandTotal', grandTotal);

    for (let i = 0; i < cart.length; i++) {
      posData.append(`cart[${i}].foodmenuId`, cart[i]._id);
      posData.append(`cart[${i}].foodmenuname`, cart[i].foodmenuname);
      posData.append(`cart[${i}].salesprice`, cart[i].salesprice);
      posData.append(`cart[${i}].quantity`, cart[i].quantity);
    }

    posData.append('vatAmount', vatAmount);
    posData.append('total', totalAmount);
    posData.append('foodoption', options);
    posData.append('addedby', addedby);
    posData.append('opentoken', shiftAccess);

    if (selectTable && selectTable._id) {
      posData.append('tableId', selectTable._id);
      posData.append('numberofperson', numberofperson);
    }

    if (selectWaiter && selectWaiter._id) {
      posData.append('waiterId', selectWaiter._id);
    }

    const config = { headers: { 'Content-Type': 'application/json' } };

    const response = await axios.post(
      `${apiConfig.baseURL}/api/pos/createpos`,
      posData,
      config
    );

    // Ask if user wants to print
    Swal.fire({
      title: 'Order Placed Successfully!',
      text: 'Do you want to print the receipt?',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, show print preview',
      cancelButtonText: 'No, continue',
      showCloseButton: true,
      focusConfirm: false,
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        // Set order data and show print preview modal
        setOrderData(response.data);
        setShowPrintModal(true);

        // Clear cart and reset states
        setCart([]);
        setTotalAmount(0);
        setTotalVat(0);
        setGrandTotal(0);

        // Reset tabs
        setSelectWaiter("");
        setSelectCustomer("");
        setSelectDelivery("");
        setSelectTable("");
        setOptions("");
        setNumberofPerson("");
        setTabEnabled({
          dineIn: false,
          takeaway: false,
          delivery: false,
        });
        setEnableDinein(false);
        setShowCustomerTab(false);
        setShowFoodMenuTab(false);
        setShowDeliveryTab(false);

      } else {
        // User clicked "No, continue"
        // Clear cart and reset states
        setCart([]);
        setTotalAmount(0);
        setTotalVat(0);
        setGrandTotal(0);

        // Reset tabs
        setSelectWaiter("");
        setSelectCustomer("");
        setSelectDelivery("");
        setSelectTable("");
        setOptions("");
        setNumberofPerson("");
        setTabEnabled({
          dineIn: false,
          takeaway: false,
          delivery: false,
        });
        setEnableDinein(false);
        setShowCustomerTab(false);
        setShowFoodMenuTab(false);
        setShowDeliveryTab(false);
      }
    });

  } catch (error) {
    console.error('Error placing order:', error);
    Swal.fire({
      icon: 'error',
      title: 'Order Error',
      text: 'An error occurred while placing the order.',
    });
  } finally {
    // Always reset loading state
    setLoadingPlaceOrder(false);
  }
};

  const imagePaths = "/assets/images/pos/taha.png";


  const printOrderDetails = (orderData) => {
    const printWindow = window;
    printWindow.document.write('<html><head><title>Order Details</title>');
    // Add style for center alignment and table styling
    printWindow.document.write(`
      <style>
        body { text-align: center; }
        table {
          width: 100%;
          border-collapse: collapse;

        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
        td
        {
          font-size:13px;
          text-transform: capitalize;
        }
        .order-info {
          font-size:13px;
          text-transform: capitalize;
        }
      </style>
    `);
    printWindow.document.write('</head><body>');

    // Include order details and image in the print window

    printWindow.document.write(`<img src="${imagePaths}" alt="Logo" style="max-width: 100%;" onload="window.print(); location.reload();">`);
    printWindow.document.write(`<p>Order ID: ${orderData.ordernumber}</p>`);
    const orderDate = new Date(orderData.date);
const formattedDate = `${orderDate.getDate().toString().padStart(2, '0')}-${(orderDate.getMonth() + 1).toString().padStart(2, '0')}-${orderDate.getFullYear()}`;
printWindow.document.write(`<p>Date: ${formattedDate}</p>`);


if (orderData.cart && orderData.cart.length > 0) {
  printWindow.document.write(`
    <table>
      <thead>
        <tr>
          <th>Food Name</th>
          <th>Qty</th>
          <th>Total Price</th>
        </tr>
      </thead>
      <tbody>
  `);

  let subtotal = 0;

  orderData.cart.forEach((item) => {
    const totalPrice = item.quantity * item.salesprice;
    subtotal += totalPrice;

    printWindow.document.write(`
      <tr>
        <td>${item.foodmenuname}</td>
        <td>${item.quantity}</td>
        <td>${totalPrice}</td>
      </tr>
    `);
  });

  // Calculate VAT amount and overall total
  const vatPercentValue = 5;
  const vatAmounts = (subtotal * vatPercentValue) / 100;
  const overallTotal = subtotal + vatAmount;
  const subTotals = subtotal - vatAmounts;

  printWindow.document.write('</tbody></table>');

  printWindow.document.write(`<p>VAT Amount: ${vatAmounts}</p>`);
  printWindow.document.write(`<p>Subtotal: ${subTotals}</p>`);
  printWindow.document.write(`<p>Overall Total: ${subtotal}</p>`);
}

printWindow.document.write('</body></html>');
};

  const componentRef = useRef(null);

  // Use the hook to enable printing
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });


  // const componentRef = React.useRef();

  const handleClosePrint = () => {
      setShowPrintModal(false);

    }

    const handlePrints = useReactToPrint({
      content: () => componentRef.current,
    });



  const [showPrintModal, setShowPrintModal] = useState(false);
  const [orderData,setOrderData ] = useState(null);

  useEffect(() => {
    // You can perform actions here after orderData state is updated
    // For example, open the print modal
    if (orderData) {
      setShowPrintModal(true);
    }
  }, [orderData]);




  // console.info({filteredTables})
  const handleHold = (event) => {
    event.preventDefault();
    if (cart.length < 1) {
      Swal.fire({
        icon: "error",
        title: "Cart is empty",
        text: "Please add items to your cart before placing an order.",
      });
    } else if (!options) {
      Swal.fire({
        icon: "error",
        title: "Options not selected",
        text: "Please select options before placing an order.",
      });
    } else {
      setPlaceOrder({
        option: options,
        waiter: selectWaiter,
        customer: selectCustomer,
        table: selectTable,
        deliveryperson: selectDelivery,
        cart: cart,
        total: totalAmount,
        vat: vatAmount,
        grandTotal: grandTotal,
        delivery: selectDelivery,
        numberofperson: numberofperson,
      });

      var posData = new FormData();
      // posData.append("customers",selectCustomer._id);
      if (selectCustomer && selectCustomer._id) {
        posData.append("customers", selectCustomer._id);
      }
      if (selectDelivery && selectDelivery._id) {
        posData.append("delivery", selectDelivery._id);
      }
      posData.append("options", options);
      posData.append("grandTotal", grandTotal);
      for (let i = 0; i < cart.length; i++) {
        posData.append(`cart[${i}].foodmenuId`, cart[i]._id);
        posData.append(`cart[${i}].foodmenuname`, cart[i].foodmenuname);
        posData.append(`cart[${i}].salesprice`, cart[i].salesprice);
        posData.append(`cart[${i}].quantity`, cart[i].quantity);
      }
      posData.append("vatAmount", vatAmount);
      posData.append("total", totalAmount);
      posData.append("foodoption", options);
      if (selectTable && selectTable._id) {
        posData.append("tableId", selectTable._id);
      }
      if (selectWaiter && selectWaiter._id) {
        posData.append("waiterId", selectWaiter._id);
      }
      posData.append("addedby", addedby);
      const config = { headers: { "Content-Type": "application/json" } };
      axios
        .post(`${apiConfig.baseURL}/api/pos/createHold`, posData, config)

        .then((res) => {
          Swal.fire({
            title: "Success!",
            text: "Do you want to print the order?",
            icon: "success",
            showCancelButton: true,
            confirmButtonText: "Yes, print",
            cancelButtonText: "No",
          }).then((result) => {
            if (result.isConfirmed) {
              // Open your print modal here
          //    console.log(res);
              openPrintModal(res.data);
            } else {
              setRefresh((prevRefresh) => !prevRefresh);
            }
          });
        })
        .catch((err) => console.log(err));
    }
  };





const handleQuickPay = (event) => {
  event.preventDefault();

  // Validate first
  if (cart.length < 1) {
    Swal.fire({
      icon: 'error',
      title: 'Cart is empty',
      text: 'Please add items to your cart before placing an order.',
    });
    return;
  } else if (!options) {
    Swal.fire({
      icon: 'error',
      title: 'Options not selected',
      text: 'Please select options before placing an order.',
    });
    return;
  } else if (options.toLowerCase() === 'dine in') {
    Swal.fire({
      icon: 'error',
      title: 'Dine-In Not Allowed',
      text: 'Quick pay is not allowed for dine-in orders.',
    });
    return;
  }

  // Set loading state
  setLoadingQuickPay(true);

  var posData = new FormData();

  if (selectCustomer && selectCustomer._id) {
    posData.append("customers", selectCustomer._id);
  }
  if (selectDelivery && selectDelivery._id) {
    posData.append("delivery", selectDelivery._id);
  }
  posData.append("options", options);
  posData.append("grandTotal", grandTotal);

  for (let i = 0; i < cart.length; i++) {
    posData.append(`cart[${i}].foodmenuId`, cart[i]._id);
    posData.append(`cart[${i}].foodmenuname`, cart[i].foodmenuname);
    posData.append(`cart[${i}].salesprice`, cart[i].salesprice);
    posData.append(`cart[${i}].quantity`, cart[i].quantity);
  }

  posData.append("vatAmount", vatAmount);
  posData.append("total", totalAmount);
  posData.append("foodoption", options);

  if (selectTable && selectTable._id) {
    posData.append("tableId", selectTable._id);
  }

  if (selectWaiter && selectWaiter._id) {
    posData.append("waiterId", selectWaiter._id);
  }

  posData.append('addedby', addedby);
  posData.append('shiftstoken', shiftstoken);
  posData.append('opentoken', shiftAccess);

  const config = { headers: { "Content-Type": "application/json" } };

  axios
    .post(`${apiConfig.baseURL}/api/pos/createQuickpay`, posData, config)
    .then((res) => {
      // Ask if user wants to print
      Swal.fire({
        title: 'Quick Pay Successful!',
        text: 'Do you want to print the receipt?',
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Yes, show print preview',
        cancelButtonText: 'No, continue',
        showCloseButton: true,
        focusConfirm: false,
        allowOutsideClick: false
      }).then((result) => {
        if (result.isConfirmed) {
          // Prepare order data for print preview
          const orderData = {
            ordernumber: res.data.newEntry.ordernumber,
            billnumber: res.data.updatedDocuments.billnumber,
            cart: res.data.newEntry.cart,
            total: res.data.newEntry.total,
            vatAmount: res.data.newEntry.vatAmount,
            grandTotal: res.data.newEntry.grandTotal,
            date: res.data.newEntry.date,
            options: options
          };

          // Set order data and show print preview modal
          setOrderData(orderData);
          setShowPrintModal(true);

          // Clear cart and reset states
          setCart([]);
          setTotalAmount(0);
          setTotalVat(0);
          setGrandTotal(0);

          // Reset tabs
          setSelectWaiter("");
          setSelectCustomer("");
          setSelectDelivery("");
          setSelectTable("");
          setOptions("");
          setNumberofPerson("");
          setTabEnabled({
            dineIn: false,
            takeaway: false,
            delivery: false,
          });
          setEnableDinein(false);
          setShowCustomerTab(false);
          setShowFoodMenuTab(false);
          setShowDeliveryTab(false);

        } else {
          // User clicked "No, continue"
          // Clear cart and reset states
          setCart([]);
          setTotalAmount(0);
          setTotalVat(0);
          setGrandTotal(0);

          // Reset tabs
          setSelectWaiter("");
          setSelectCustomer("");
          setSelectDelivery("");
          setSelectTable("");
          setOptions("");
          setNumberofPerson("");
          setTabEnabled({
            dineIn: false,
            takeaway: false,
            delivery: false,
          });
          setEnableDinein(false);
          setShowCustomerTab(false);
          setShowFoodMenuTab(false);
          setShowDeliveryTab(false);
        }
      });
    })
    .catch((err) => {
      console.error('Quick pay error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Quick Pay Error',
        text: 'An error occurred during quick pay.',
      });
    })
    .finally(() => {
      setLoadingQuickPay(false);
    });
};


  const printComponentRef = useRef();
  const handlequickPrint = useReactToPrint({
    content: () => printComponentRef.current,
  });

  const printQuickDetails = (newEntry, updatedDocuments) => {
    const printWindow = window;
    printWindow.document.write('<html><head><title>Order Details</title>');

    // Add style for center alignment and table styling
    printWindow.document.write(`
      <style>
        body { text-align: center; }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
        td {
          font-size: 11px;
          text-transform: capitalize;
        }
        .order-info {
          display: flex;
          justify-content: space-between;
        }
      </style>
    `);

    printWindow.document.write('</head><body>');

    // Include order details and image in the print window
    printWindow.document.write(`<img src="${imagePaths}" alt="Logo" style="max-width: 100%;" onload="window.print(); location.reload();">`);
    printWindow.document.write(`<p>Bill Number: ${updatedDocuments.billnumber}</p>`);
    printWindow.document.write(`<p>Order ID: ${newEntry.ordernumber}</p>`);

    const orderDate = new Date(newEntry.date);
    const formattedDate = `${orderDate.getDate().toString().padStart(2, '0')}-${(orderDate.getMonth() + 1).toString().padStart(2, '0')}-${orderDate.getFullYear()}`;
    const formattedTime = `${orderDate.getHours().toString().padStart(2, '0')}:${orderDate.getMinutes().toString().padStart(2, '0')}:${orderDate.getSeconds().toString().padStart(2, '0')}`;
    printWindow.document.write(`<p>Date and Time: ${formattedDate} ${formattedTime}</p>`);

    // Print details of each item in the cart in a table
    if (newEntry.cart && newEntry.cart.length > 0) {
      printWindow.document.write(`
        <table>
          <thead>
            <tr>
              <th>Food Name</th>
              <th>Qty</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
      `);

      let subtotal = 0;

      newEntry.cart.forEach((item) => {
        const totalPrice = item.quantity * item.salesprice;
        subtotal += totalPrice;

        printWindow.document.write(`
          <tr>
            <td>${item.foodmenuname}</td>
            <td>${item.quantity}</td>
            <td>${totalPrice}</td>
          </tr>
        `);
      });

      // Calculate VAT amount and overall total
      const vatPercentValue = 5;
      const vatAmounts = (subtotal * vatPercentValue) / 100;
      const overallTotal = subtotal + vatAmount;
      const subTotals = subtotal - vatAmounts;

      printWindow.document.write('</tbody></table>');

      printWindow.document.write(`<p>VAT Amount: ${vatAmounts}</p>`);
      printWindow.document.write(`<p>Subtotal: ${subTotals}</p>`);
      printWindow.document.write(`<p>Overall Total: ${subtotal}</p>`);
    }

    printWindow.document.write('</body></html>');
  };

  const handleTabClick = () => {
    setModalOpen(true);
  };
  const handleCloseTable = () => {
    setShowModal(false);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };
  const handleHoldClick = () => {
    setModalHold(true);
  };
  const handleDropoutClick = () => {
    setModalCashDrop(true);
  };
  const handleInvoiceClick = () => {
    setModalInvoiceReport(true);
  };

  const handleClosingBalance =() =>
  {
    setModalClosingBalance(true);
  }

  const handleCancelOrders =() =>
  {
    setModalCancelOrders(true);
  }


  return (
    <div className="row">
      <div className="col-sm-4 col-lg-4">
        <div className="wraper shdw">
          <div
            className="table-responsive vh-70"
            style={{ overflowY: "scroll" }}
          >
            <table className="table ">
              <thead>
                <tr className="thead-light">
                  <th>No.</th>
                  <th>Name</th>
                  <th>U.Price</th>
                  <th>Qty</th>

                  {/* <th scope="col">Total</th> */}
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cart
                  ? cart.map((cartProduct, key) => (
                    <tr key={key}>
                      {/* <td>{cartProduct._id}</td> */}
                      <td>{key + 1}</td>
                      <td>{cartProduct.foodmenuname}</td>
                      <td>{cartProduct.salesprice}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm cartminus"
                          onClick={() => handleDecrement(cartProduct)}
                        >
                          -
                        </button>
                        <input
                          type="text"
                          style={{ width: "20px" }}
                          value={cartProduct.quantity}
                        />
                        <button
                          className="btn btn-success btn-sm cartplus"
                          onClick={() => handleIncrement(cartProduct)}
                        >
                          +
                        </button>
                      </td>

                      {/* <td>{cartProduct.totalAmount}</td> */}
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => removeProduct(cartProduct)}
                        >
                          x
                        </button>
                      </td>
                    </tr>
                  ))
                  : "No Item in Cart"}
              </tbody>
            </table>
          </div>

          <div className="table-responsive">
            <table className="table">
              <tr>
                <td>Total </td>
                <th className="text-right">{totalAmount}</th>
              </tr>
              <tr>
                <td>Discount </td>
                <th className="text-right"></th>
              </tr>
              <tr>
                <td>VAT </td>
                <th className="text-right">{vatAmount}</th>
              </tr>
              <tr>
                <th>Grand Total </th>
                <th className="text-right">{grandTotal}</th>
              </tr>
              <tr>
                <td></td>
                <th></th>
              </tr>
            </table>
          </div>


          <div className="row">
            <div className="col-lg-6">
              <button type="button" className="btn btn-danger w-100 mb-2 p-2">
                Cancel
              </button>
            </div>

  <div className="col-lg-6 pl-0">
    <button
      type="button"
      onClick={handlePlaceorder}
      className="btn btn-warning w-100 mb-2 p-2"
      disabled={loadingPlaceOrder} // Only disable when Place Order is processing
    >
      {loadingPlaceOrder ? 'Placing Order...' : 'Place Order'}
    </button>
  </div>

            <div className="col-lg-6">
              <button
                type="button"
                onClick={handleHold}
                className="btn btn-danger w-100 mb-2 p-2"
              >
                Hold
              </button>
            </div>
 <div className="col-lg-6 pl-0">
    <button
      type="button"
      onClick={handleQuickPay}
      className="btn btn-success w-100 mb-2 p-2"
      disabled={loadingQuickPay} // Only disable when Quick Pay is processing
    >
      {loadingQuickPay ? 'Processing...' : 'Quick Pay'}
    </button>
  </div>
          </div>
        </div>
      </div>
      <div className="col-lg-1" style={{ background: "white" }}>
        <div
          class="nav flex-column nav-pills"
          id="v-pills-tab"
          role="tablist"
          aria-orientation="vertical"
        >
          <a
            class="nav-link  text-center navleft"
            id="v-pills-home-tab"
            data-toggle="pill"
            href="#v-pills-home"
            role="tab"
            aria-controls="v-pills-home"
            aria-selected="true"
            style={{ marginTop: "10px" }}
            onClick={handleClearClick}
          >
            <FaHistory className="mr-2" />
            <br /> Clear
          </a>
          <a
            className="nav-link text-center navleft"
            id="v-pills-profile-tab"
            data-toggle="pill"
            href="#v-pills-profile"
            role="tab"
            aria-controls="v-pills-profile"
            aria-selected="false"
            onClick={handleTabClick}
          >
            <TbToolsKitchen3 className="mr-2" />
            <br /> KOT
          </a>

          <a
            className="nav-link text-center navleft"
            id="v-pills-messages-tab"
            data-toggle="pill"
            href="#v-pills-messages"
            role="tab"
            aria-controls="v-pills-messages"
            aria-selected="false"
            onClick={handleHoldClick}
          >
            <BsFillPauseCircleFill className="mr-2" />
            <br /> Holding Order
          </a>
          <a
            class="nav-link text-center navleft"
            id="v-pills-cash-drop-tab"
            data-toggle="pill"
            href="#v-pills-cash-drop"
            role="tab"
            aria-controls="v-pills-cash-drop"
            aria-selected="false"
            onClick={handleDropoutClick}
          >
            <FaHandHoldingDroplet className="mr-2" /> <br /> Cash Drop/Out
          </a>
          <a
            class="nav-link text-center navleft"
            id="v-pills-drawer-tab"
            data-toggle="pill"
            href="#v-pills-drawer"
            role="tab"
            aria-controls="v-pills-drawer"
            aria-selected="false"
          >
            <RiArchiveDrawerLine className="mr-2" />
            <br />
            Open Drawer
          </a>
          <a
            onClick={handleInvoiceClick}
            class="nav-link text-center navleft"
            id="v-pills-invoice-tab"
            data-toggle="pill"
            href="#v-pills-invoice"
            role="tab"
            aria-controls="v-pills-invoice"
            aria-selected="false"
          >
            <LiaFileInvoiceSolid className="mr-2" />
            <br /> Invoice Report
          </a>

          <a
           onClick={handleClosingBalance}
            class="nav-link text-center navleft"
            id="v-pills-invoice-tab"
            data-toggle="pill"
            href="#v-pills-invoice"
            role="tab"
            aria-controls="v-pills-invoice"
            aria-selected="false"
          >
            <LiaFileInvoiceSolid className="mr-2" />
            <br /> Closing Balance
          </a>

          <a
           onClick={handleCancelOrders}
            class="nav-link text-center navleft"
            id="v-pills-invoice-tabs"
            data-toggle="pill"
            href="#v-pills-invoices"
            role="tab"
            aria-controls="v-pills-invoice"
            aria-selected="false"
          >
            <LiaFileInvoiceSolid className="mr-2" />
            <br /> Cancel Orders
          </a>
        </div>
      </div>
      <div className="col-sm-7 col-lg-7">
        <div className="tbl-h">
          <ul className="nav nav-tabs nav-justified" role="tablist">
            <li className="nav-item ">
              {/* <a className="nav-link  active" onClick={handleWaiter} data-toggle="tab" href="#waiter" role="tab" aria-controls="kiwi2" aria-selected="false">Waiter</a> */}
              <a
                className="nav-link pos active"
                onClick={() => {
                  setSelectWaiter("");
                  setSelectCustomer("");
                  setSelectDelivery("");
                  setSelectTable("");
                  setOptions("");
                  setTabEnabled({
                    dineIn: false,
                    takeaway: false,
                    delivery: false,
                  });
                  setEnableDinein(false);
                  setShowCustomerTab(false);
                  setShowFoodMenuTab(false);
                  setShowDeliveryTab(false);
                }}
                data-toggle="tab"
                href="#waiter"
                role="tab"
                aria-controls="kiwi2"
                aria-selected="false"
              >
                <TbChefHat className="mr-2" />
                Select Waiter
              </a>
            </li>

            {tabEnabled.dineIn && (
              <li className="nav-item">
                <a
                  className="nav-link pos "
                  onClick={handleDinein}
                  data-toggle="tab"
                  href="#table"
                  role="tab"
                  aria-controls="duck2"
                  aria-selected="true"
                >
                  <FaCcDinersClub className="mr-2" />
                  Dine In
                </a>
              </li>
            )}

            {tabEnabled.delivery && (
              <li className="nav-item">
                <a
                  className="nav-link pos"
                  onClick={handleDelivery}
                  data-toggle="tab"
                  href="#dinein"
                  role="tab"
                  aria-controls="duck2"
                  aria-selected="true"
                >
                  <CiDeliveryTruck className="mr-2" />
                  Delivery
                </a>
              </li>
            )}

            {showCustomerTab && (
              <li className="nav-item">
                <a
                  className="nav-link pos"
                  onClick={handleCustomer}
                  data-toggle="tab"
                  href="#customer"
                  role="tab"
                  aria-controls="duck2"
                  aria-selected="true"
                >
                  <FaUserAlt className="mr-2" />
                  Customer
                </a>
              </li>
            )}
            {showDeliveryTab && (
              <li className="nav-item">
                <a
                  className="nav-link pos"
                  onClick={handleDeliveryPerson}
                  data-toggle="tab"
                  href="#delivery"
                  role="tab"
                  aria-controls="duck2"
                  aria-selected="true"
                >
                  <MdDeliveryDining className="mr-2" />
                  Delivery Boy
                </a>
              </li>
            )}
            {tabEnabled.takeaway && (
              <li className="nav-item">
                <a
                  className="nav-link pos"
                  onClick={handleTakeway}
                  data-toggle="tab"
                  href="#dinein"
                  role="tab"
                  aria-controls="duck2"
                  aria-selected="true"
                >
                  <MdOutlineTakeoutDining className="mr-2" />
                  Take Away
                </a>
              </li>
            )}
            {showFoodMenuTab && (
              <li className="nav-item">
                <a
                  className="nav-link pos"
                  onClick={handleMenu}
                  data-toggle="tab"
                  href="#foodmenu"
                  role="tab"
                  aria-controls="duck2"
                  aria-selected="true"
                >
                  <IoFastFoodSharp className="mr-2" />
                  Food Menu
                </a>
              </li>
            )}
          </ul>
        </div>
        <div className="tab-content mt-3" style={{ maxHeight: '800px', overflowY: 'scroll' }}>

          <div
            className="tab-pane active"
            id="waiter"
            role="tabpanel"
            aria-labelledby="duck-tab"
          >
            {/* { */}
            {/* showWaiters && */}
            <input
              type="text"
              placeholder="Search waiters..."
              value={searchWaiter}
              className="form-control"
              onChange={handleSearchWaiter}
            />{" "}
            <br />
            <div className="row">
              {filteredWaiters.map((wait, index) => (
                <div
                  key={index}
                  className={`col-sm-3 col-md-3 ${selectWaiter === wait ? "disabled" : ""
                    }`}
                >
                  <div
                    className={`menu-box ${selectWaiter ? "read-only" : "selectable"
                      }`}
                    onClick={() => handleWaiter(wait)}
                  >
                    <h6>
                      <TbChefHat className="mr-2" /> <br />
                      {wait.firstname}{wait.lastname}
                    </h6>
                  </div>
                </div>
              ))}
            </div>




            {/* } */}
          </div>


         {enableDinein && (
            <div
              className="tab-pane"
              id="table"
              role="tabpanel"
              aria-labelledby="duck-tab"
            >
              <input
                type="text"
                placeholder="Search Tables..."
                value={searchTable}
                className="form-control"
                onChange={handleSearchTable}
              />
              <br />
              <div className="row">
                {filteredTables.map((tables, index) => (
                  <div
                    key={index}
                    className={`col-sm-3 col-md-3 ${selectTable === tables ? "disabled" : ""
                      }`}
                  >
                    <div className="card">

                      <div
                        className={`menu-box ${selectTable ? "read-only" : "selectable"
                          }`}
                      >
                        <h6>
                          <SiTablecheck className="mr-2" />
                          <br />
                          {tables.tablename}
                        </h6>
                        <p>SeatCapacity:{tables.seatcapacity}</p>
                        <p>Avilable Seat:{tables.availableSeat}</p>
                      </div>

                      <div className="card-footer">
                        <div class="flex-row-container">
                          <div class="flex-row-item">
                            <input
                              type="text"
                              name="numberofperson"
                              value={numberofperson[tables._id]}
                              onChange={(e) => {
                                // setNumberofPerson(e.target.value);
                                handleNumberofPersonChange(e, tables._id);
                              }}
                              className="form-control"
                              placeholder="No Of Person"
                              readOnly={tables.availableSeat === 0}
                            />
                          </div>
                          <div class="flex-row-item">
                            <a
                              className={`btn btn-outline-primary ${!isValidNumber(tables._id) ||
                                tables.availableSeat === 0 ||
                                parseInt(numberofperson[tables._id]) >
                                parseInt(tables.seatcapacity)
                                ? "disabled"
                                : ""
                                }`}
                              onClick={(e) => {
                                setSelectTable(tables);
                                handleTable(tables);
                              }}
                            >
                              Add
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div
            className="tab-pane "
            id="customer"
            role="tabpanel"
            aria-labelledby="duck-tab"
          >
            <input
              type="text"
              placeholder="Search Customers..."
              value={searchCustomer}
              className="form-control"
              onChange={handleSearchCustomer}
            />
            <br />
            <div className="row">
              {filteredCustomers.map((customer, index) => (
                <div className="col-sm-3 col-md-3">
                  <div
                    className="menu-box"
                    onClick={(e) => {
                      setSelectCustomer(customer);
                      setShowFoodMenuTab(true);
                      setShowDeliveryTab(false);
                    }}
                  >
                    <h6>
                      <FaUserAlt className="mr-2" />
                      <br />
                      {customer.customername}
                    </h6>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            className="tab-pane "
            id="delivery"
            role="tabpanel"
            aria-labelledby="duck-tab"
          >
            <input
              type="text"
              placeholder="Search Delivery..."
              value={searchDeliveryPerson}
              className="form-control"
              onChange={handleSearchDelivery}
            />
            <br />
            <div className="row">
              {filteredDelivery.map((delivery, index) => (
                <div className="col-sm-3 col-md-3">
                  <div
                    className="menu-box"
                    onClick={(e) => {
                      setSelectDelivery(delivery);
                      setShowFoodMenuTab(true);
                      setShowCustomerTab(false);
                    }}
                  >
                    <h6>
                      <MdDeliveryDining className="mr-2" />
                      <br />
                      {delivery.firstname}{delivery.lastname}

                    </h6>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {enableFoodmenu && (
            <div
              className="tab-pane "
              id="foodmenu"
              role="tabpanel"
              aria-labelledby="duck-tab"
            >
              <div className="tbl-h">
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Search foodmenu..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="form-control"
                  />
                </div>

       <div className="tab-scroll-container">

      <div className="nav-container">
        <ul className="nav nav-pills flex-row shdw-lft" id="myTab" role="tablist">
          {distinctCategories.map((category, index) => (
            <li className="nav-item" key={index}>
              <a
                className={`nav-item nav-link ${index === activeTab ? "active" : ""}`}
                onClick={() => handleTabsClick(index)}
              >
                {category}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>

              </div>

              <div className="tab-content p-3" id="myTabContents">
                {isLoading ? (
                  "Loading"
                ) : (
                  <div className="row">
                    {foodCategory.length > 0 &&
                      foodCategory
                        .filter(
                          (item) =>
                            item.foodcategory.foodcategoryname ===
                            distinctCategories[activeTab] &&
                            item.foodmenuname
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                        )
                        .map((menu, index) => (
                          <div className="col-sm-3 col-sm-3" key={index}>
                            <div
                              className="menu-box"
                              onClick={() => addProductToCart(menu)}
                            >
                              <div className="menu-div">
                                {/* <img src={`/uploads/${menu.photo}`} className=" foodimg" /> */}
                                <h6 className="mt-2">{menu.foodmenuname}</h6>
                                <p>Price: {menu.salesprice}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div class="modal" id="print-modal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Order Details</h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body" id="modal-body"></div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button type="button" class="btn btn-primary" id="print-button">
                Print
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* KOTMODAl */}
      <PosNeworderKotModal
        isModalOpen={isModalOpen}
        setModalOpen={setModalOpen}
      />

      {/* Holding Order */}

      <PosNewHoldingModal
        isModalHold={isModalHold}
        setModalHold={setModalHold}
      />

      <PosCashDrop
        isModalCashDrop={isModalCashDrop}
        setModalCashDrop={setModalCashDrop}
      />

      <PosInvoiceReport
        isModalInvoiceReport={isModalInvoiceReport}
        setModalInvoiceReport={setModalInvoiceReport}
      />

    <PosClosingBalance
      isModalClosingBalance={isModalClosingBalance}
      setModalClosingBalance={setModalClosingBalance}
    />

    <PosCancelOrder
    isModalCanelOrders={isModalCanelOrders}
    setModalCancelOrders={setModalCancelOrders}
    />






{/* <PrintComponent ref={componentRef} response={response} /> */}

    {/* <PosOrderPrint
     orderData={orderData}
      showPrintModal={showPrintModal}
      setShowPrintModal={setShowPrintModal}

    /> */}
            <div>
{/* Print Preview Modal */}
{/* Print Preview Modal */}
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
          <div className="modal-body p-4" ref={componentRef}>
            {/* Print Preview Content */}
            <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '300px', margin: '0 auto' }}>
              {/* Restaurant Header */}
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>RESTAURANT NAME</h3>
                <p style={{ margin: '0', fontSize: '12px' }}>Restaurant Address Line 1</p>
                <p style={{ margin: '0', fontSize: '12px' }}>Restaurant Address Line 2</p>
                <p style={{ margin: '0', fontSize: '12px' }}>Phone: +1234567890</p>
                <hr style={{ margin: '10px 0', borderColor: '#000' }} />
              </div>

              {/* Order Details */}
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

              {/* Items Table */}
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
                    <div style={{ wordBreak: 'break-word' }}>{item.foodmenuname}</div>
                    <div style={{ textAlign: 'center' }}>{item.quantity}</div>
                    <div style={{ textAlign: 'right' }}>{(item.quantity * item.salesprice).toFixed(2)}</div>
                  </div>
                ))}

                <hr style={{ margin: '10px 0', borderColor: '#000' }} />
              </div>

              {/* Totals Calculation */}
              <div style={{ fontSize: '12px' }}>
                {(() => {
                  // Calculate subtotal from cart
                  const subtotal = orderData?.cart?.reduce((sum, item) =>
                    sum + (item.quantity * item.salesprice), 0) || 0;

                  // Calculate VAT using your exact formula
                  const vatPercentValue = 5;
                  const vatAmounts = (subtotal * vatPercentValue) / 100;

                  // Calculate overall total
                   const fixedsubtotal = subtotal - vatAmounts;

                  const overallTotal = fixedsubtotal + vatAmounts;

                  return (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span>Sub Total:</span>
                        <span>{fixedsubtotal.toFixed(2)}</span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span>VAT Amount:</span>
                        <span>{vatAmounts.toFixed(2)}</span>
                      </div>

                      {/* Optional: Show VAT percentage */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '10px',
                        fontSize: '11px',
                        color: '#666',
                        fontStyle: 'italic'
                      }}>
                        <span>(VAT @ {vatPercentValue}%):</span>
                        <span>{(subtotal * vatPercentValue / 100).toFixed(2)}</span>
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

              {/* Footer */}
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
      </div>

    </div>
  );
};

export default PosNewOrder;

