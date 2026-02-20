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
import { FiSettings,FiPlus, FiMinus,FiX } from "react-icons/fi";

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
import PosDeliverySession from "./posDeliverySession";
import PosTodayOrder from "./posTodayorder";

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
  //const [numberofperson, setNumberofPerson] = useState("");
  const [numberofperson, setNumberofPerson] = useState({});
  const [isModalInvoiceReport, setModalInvoiceReport] = useState(false);
  const [isModalClosingBalance,setModalClosingBalance] =useState(false);
  const [isModalCanelOrders,setModalCancelOrders] =useState(false);
  const [isModalDeliveryReport,setModalDeliveryReport] =useState(false);
  const [isModalTodayOrderReport,setModalTodayOrderReport] =useState(false);


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

  // Add this useEffect to handle enabling food menu when both customer and delivery person are selected
useEffect(() => {
  if (options === "Delivery" && selectCustomer && selectDelivery) {
    setEnableFoodmenu(true);
    setShowFoodMenuTab(true);
    setActiveTab(0); // Activate food menu tab

    // Force click on food menu tab
    setTimeout(() => {
      const foodMenuTab = document.querySelector('a[href="#foodmenu"]');
      if (foodMenuTab) {
        foodMenuTab.click();
      }
    }, 100);
  }
}, [selectCustomer, selectDelivery, options]);

  // const handleWaiter = (details) => {
  //   setSelectWaiter(details);
  //   setTabEnabled({
  //     dineIn: true,
  //     takeaway: true,
  //     delivery: true,
  //   });
  //    setActiveTab(1);
  // };

  const handleWaiter = (details) => {
  setSelectWaiter(details);
  setTabEnabled({
    dineIn: true,
    takeaway: true,
    delivery: true,
  });

  // If it's a delivery order and we already have customer/delivery selected
  if (options === "Delivery" && selectCustomer && selectDelivery) {
    setActiveTab(0); // Go to food menu
  } else {
    setActiveTab(1);
  }
};
//  console.log("selectWaiter is not empty:", selectWaiter);
const handleTable = (tables) => {
  const personCount = numberofperson[tables._id];

  if (!personCount || personCount.trim() === "") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Please enter the number of persons!",
    });
  } else {
    setSelectTable(tables);
    setEnableFoodmenu(true);
    setShowFoodMenuTab(true);
    setActiveTab(0); // Change this to 0 (or whatever index your food menu categories start at)

    // Also need to ensure the food menu tab is shown and active
    // You might need to force the tab to show
    setTimeout(() => {
      const foodMenuTab = document.querySelector('a[href="#foodmenu"]');
      if (foodMenuTab) {
        foodMenuTab.click();
      }
    }, 100);
  }
};

const handlePersonCountChange = (tableId, action) => {
  const currentValue = parseInt(numberofperson[tableId] || 0);
  const table = filteredTables.find(t => t._id === tableId);

  if (!table) return;

  let newValue = currentValue;
  const maxAllowed = Math.min(table.seatcapacity, table.availableSeat);

  if (action === 'increment') {
    newValue = currentValue + 1;
    if (newValue > maxAllowed) {
      newValue = maxAllowed;
    }
  } else if (action === 'decrement') {
    newValue = currentValue - 1;
    if (newValue < 1) {
      newValue = 1;
    }
  }

  // Create a synthetic event object to reuse your existing handler
  const syntheticEvent = {
    target: {
      name: 'numberofperson',
      value: newValue.toString()
    }
  };

  handleNumberofPersonChange(syntheticEvent, tableId);
};

  const handleTabsClick = (index) => {
    setActiveTab(index);
  };


  const handleNumberofPersonChange = (e, tableId) => {
  const value = e.target.value;

  // Validate if the entered value is a valid positive integer
  if (/^[1-9]\d*$/.test(value) || value === "") {
    setNumberofPerson((prev) => ({
      ...prev,
      [tableId]: value
    }));
  }
};

const isValidNumber = (tableId) => {
  const table = filteredTables.find(t => t._id === tableId);
  if (!table) return false;

  const personCount = parseInt(numberofperson[tableId] || 0);
  const maxAllowed = Math.min(table.seatcapacity, table.availableSeat);

  return personCount > 0 && personCount <= maxAllowed;
};
const handleTakeway = (e) => {
  setTabEnabled({
    dineIn: false,
    delivery: false,
    takeaway: true,
  });
  setOptions("Take Away");
  setEnableDinein(false);
  setShowCustomerTab(false);
  setShowDeliveryTab(false);
  setSelectTable("");
  setSelectCustomer("");
  setSelectDelivery("");
  setNumberofPerson("");
  // Directly enable food menu for takeaway
  setEnableFoodmenu(true);
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
  setEnableFoodmenu(false); // Don't enable food menu until both are selected
  setShowFoodMenuTab(false);
};
  const handleCustomer = (e) => {
    setShowDeliveryTab(false);
  };
  const handleMenu = (e) => {
     setEnableFoodmenu(true);
  setShowFoodMenuTab(true);
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
      posData.append('numberofperson', numberofperson[selectTable._id] || '');
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

        // Call handleClearClick to reset everything
        handleClearClick();
      } else {
        // User clicked "No, continue"
        // Just call handleClearClick to reset everything
        handleClearClick();
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
    posData.append("numberofperson", numberofperson[selectTable._id] || '');
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

          // Call handleClearClick to reset everything
          handleClearClick();
        } else {
          // User clicked "No, continue"
          // Just call handleClearClick to reset everything
          handleClearClick();
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

  const handleDeliverySession =()=>
  {
      setModalDeliveryReport(true);
  }

  const handleTodayorderReport =() =>{
    setModalTodayOrderReport(true);
  }

const tabStyle = {
  display: showFoodMenuTab ? 'block' : 'none',

};
  return (
    <div className="row">



  <div className="col-12 col-sm-12 col-md-3 col-lg-1 " >
   <div className="pos-menu poscards">

    <button className="pos-btn active" onClick={handleClearClick}>
      <FaHistory className="pos-icon" />
      Clear
    </button>


     <button className="pos-btn" onClick={handleClearClick}>
      <FaHistory className="pos-icon" />
      <span>Customer Add</span>
    </button>


    <button className="pos-btn" onClick={handleTabClick}>
      <TbToolsKitchen3 className="pos-icon" />
      KOT
    </button>

    <button className="pos-btn" onClick={handleHoldClick}>
      <BsFillPauseCircleFill className="pos-icon" />
      <span>Hold Order</span>
    </button>

    <button className="pos-btn" onClick={handleDropoutClick}>
      <FaHandHoldingDroplet className="pos-icon" />
      <span>Cash Drop/Out</span>
    </button>

    <button className="pos-btn">
      <RiArchiveDrawerLine className="pos-icon" />
      <span>Open Cash Drawer</span>
    </button>

    <button className="pos-btn" onClick={handleClosingBalance}>
      <LiaFileInvoiceSolid className="pos-icon" />
      <span>Closing Balance</span>
    </button>

    <button className="pos-btn" onClick={handleInvoiceClick}>
      <LiaFileInvoiceSolid className="pos-icon" />
      <span>Invoice Report</span>
    </button>

    <button className="pos-btn" onClick={handleCancelOrders}>
      <LiaFileInvoiceSolid className="pos-icon" />
      <span>Cancel Orders</span>
    </button>

     <button className="pos-btn" onClick={handleDeliverySession}>
      <LiaFileInvoiceSolid className="pos-icon" />
      <span>Delivery Settlement</span>
    </button>
     <button className="pos-btn" onClick={handleTodayorderReport}>
      <LiaFileInvoiceSolid className="pos-icon" />
      <span>Settlement Report</span>
    </button>



  </div>
  </div>

  <div className="col-12 col-sm-12 col-md-4 col-lg-4 poscards">

          <div
            className="table-responsive vh-40"
            style={{ overflowY: "scroll" }}
          >
            <table className="table cart-scroll">
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
                      <td className="cartfoodmenuname">{cartProduct.foodmenuname}</td>
                      <td>{cartProduct.salesprice}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
  <button
    className="btn btn-danger btn-sm"
    onClick={() => handleDecrement(cartProduct)}
    style={{
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      padding: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
      lineHeight: '1',
      marginTop:'5px'
    }}
  >
     <FiMinus size={14} />
  </button>

  <input
    type="text"
    style={{
      width: "22px",
      height: "22px",
      textAlign: "center",
      border: "1px solid #ddd",
      borderRadius: "4px",
      padding: "0",
      fontSize: "14px",
      boxSizing: "border-box",
      marginTop:'-2px',
    }}
    value={cartProduct.quantity}
    readOnly
  />

  <button
    className="btn btn-success btn-sm"
    onClick={() => handleIncrement(cartProduct)}
    style={{
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      padding: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
      lineHeight: '1',
        marginTop:'5px'
    }}
  >
     <FiPlus size={14} />
  </button>
</div>
</td>

<td>
  <button
    className="btn btn-danger btn-sm"
    onClick={() => removeProduct(cartProduct)}
    style={{
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      padding: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
      fontWeight: 'bold',
      lineHeight: '1',
        marginTop:'5px'
    }}
  >
    <FiX size={14} />
  </button>
</td>


                      {/* <td>{cartProduct.totalAmount}</td> */}

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


       <div className="pos-action-wrapper">

  {/* Top Row */}
  <div className="pos-row">
    <button className="pos-btns cancel-btn">
      Cancel
    </button>

    <button
      onClick={handleHold}
      className="pos-btns hold-btn"
    >
      Hold
    </button>

    <button
      onClick={handleQuickPay}
      className="pos-btns quickpay-btn"
      disabled={loadingQuickPay}
    >
      {loadingQuickPay ? "Processing..." : "Quick Pay ›"}
    </button>
  </div>

  {/* Bottom Row */}
  <div className="pos-row">
    <button className="pos-btns ebill-btn">
      E-Bill
    </button>

    <button
      onClick={handlePlaceorder}
      className="pos-btns placeorder-btn"
      disabled={loadingPlaceOrder}
    >
      {loadingPlaceOrder ? "Placing Order..." : "Place Order"}
    </button>
  </div>

</div>

  </div>

 <div className="col-12 col-sm-12 col-md-5 col-lg-7 ">
      <div className="poscards">
          <div className="tbl-h ">
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
      className="nav-link pos posdinein"
      style={{
        background: options === "Dine In"
          ? 'linear-gradient(320deg, #28a745 0%, #28a745 100%)'
          : '',
        border: 0,
        borderRadius: '10px',
        marginTop: '0px',
        color: '#fff !important',
        fontWeight: 700,
        padding: '13px'
      }}
      onClick={() => {
        handleDinein();
        setactiveTableTab(1);
      }}
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
       className="nav-link pos posdinein"
      style={{
        background: options === "Take Away"
          ? 'linear-gradient(320deg, #28a745 0%, #28a745 100%)'
          : '',
        border: 0,
        borderRadius: '10px',
        marginTop: '0px',
        color: '#fff !important',
        fontWeight: 500,
        padding: '13px'
      }}
      onClick={handleTakeway}
      data-toggle="tab"
      href="#foodmenu"
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
      className={`nav-link pos ${showFoodMenuTab ? 'active show' : ''}`}
      onClick={handleMenu}
      data-toggle="tab"
      href="#foodmenu"
      role="tab"
      aria-controls="duck2"
      aria-selected={showFoodMenuTab}
    >
      <IoFastFoodSharp className="mr-2" />
      Food Menu
    </a>
  </li>
            )}
          </ul>
        </div>
        <div className="tab-content mt-3" style={{overflowY: 'scroll' }}>

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
  {filteredWaiters.map((wait, index) => {
    const isSelected = selectWaiter === wait;

    return (
      <div key={index} className="col-6 col-sm-4 col-md-3 mb-3">
        <div
          className={`waiter-box ${isSelected ? "active" : ""}`}
          onClick={() => handleWaiter(wait)}
        >
          <TbChefHat className="waiter-icon" />
          <h6 className="waiter-name">
            {wait.firstname} {wait.lastname}
          </h6>
        </div>
      </div>
    );
  })}
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
    {/* Hide table list when table is selected */}
    {!selectTable ? (
      <>
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
    className={`col-sm-3 col-md-3 ${
      selectTable === tables ? "disabled" : ""
    }`}
  >
    <div className="card">
      <div
        className={`menu-box ${
          selectTable ? "read-only" : "selectable"
        }`}
      >
        <h6>{tables.tablename}</h6>
        <p>Seat Capacity: {tables.seatcapacity}</p>
        <p>Available Seats: {tables.availableSeat}</p>
      </div>

      <div className="card-footer">
        <div className="flex-row-container">
          <div className="flex-row-item mr-1">
           <div className="input-group input-group-sm" style={{ marginLeft: '-5px' }}>
              <div className="input-group-prepend">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  type="button"
                  onClick={() => handlePersonCountChange(tables._id, 'decrement')}
                  disabled={
                    tables.availableSeat === 0 ||
                    parseInt(numberofperson[tables._id] || 0) <= 1
                  }
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                >
                  -
                </button>
              </div>

              <input
                type="number"
                name="numberofperson"
                value={numberofperson[tables._id] || ""}
                onChange={(e) => {
                  handleNumberofPersonChange(e, tables._id);
                }}
                className="form-control form-control-sm text-center"
                placeholder="No"
                min="1"
                max={Math.min(tables.seatcapacity, tables.availableSeat)}
                readOnly={tables.availableSeat === 0}
                style={{ maxWidth: '80px', padding: '0.25rem' }}
              />

              <div className="input-group-append" >
                <button
                  className="btn btn-outline-secondary btn-sm"
                  type="button"
                  onClick={() => handlePersonCountChange(tables._id, 'increment')}
                  disabled={
                    tables.availableSeat === 0 ||
                    parseInt(numberofperson[tables._id] || 0) >=
                    Math.min(tables.seatcapacity, tables.availableSeat)
                  }
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="flex-row-item " style={{ marginRight: '-15px' }}>
            <a
              className={`btn btn-outline-primary tablebtn btn-sm ${
                !isValidNumber(tables._id) ||
                tables.availableSeat === 0 ||
                parseInt(numberofperson[tables._id] || 0) >
                Math.min(tables.seatcapacity, tables.availableSeat)
                  ? "disabled"
                  : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleTable(tables);
              }}
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
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
      </>
    ) : (
      // Show selected table info when table is selected
      <div className="selected-table-info">
        <p>
          Selected Table: {selectTable.tablename} | Number of Persons: {numberofperson[selectTable._id]}
        </p>
      </div>
    )}
  </div>
)}
       <div
  className="tab-pane"
  id="customer"
  role="tabpanel"
  aria-labelledby="duck-tab"
>
  {!selectCustomer ? (
    <>
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
          <div className="col-sm-3 col-md-3" key={index}>
            <div
              className="menu-box"
              onClick={(e) => {
                setSelectCustomer(customer);
                setShowCustomerTab(false);
                setShowDeliveryTab(true);
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
    </>
  ) : (
    <div className="selected-customer-info">
      <p>Selected Customer: {selectCustomer.customername}</p>
      <button
        className="btn btn-sm btn-primary"
        onClick={() => {
          setSelectCustomer(null);
          setShowCustomerTab(true);
          setEnableFoodmenu(false);
          setShowFoodMenuTab(false);
        }}
      >
        Change Customer
      </button>
    </div>
  )}
</div>
        <div
  className="tab-pane"
  id="delivery"
  role="tabpanel"
  aria-labelledby="duck-tab"
>
  {!selectDelivery ? (
    <>
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
          <div className="col-sm-3 col-md-3" key={index}>
            <div
              className="menu-box"
              onClick={(e) => {
                setSelectDelivery(delivery);
                setShowDeliveryTab(false);

                // Enable food menu if customer is already selected
                if (selectCustomer && selectCustomer._id) {
                  setEnableFoodmenu(true);
                  setShowFoodMenuTab(true);
                  setActiveTab(0);

                  setTimeout(() => {
                    const foodMenuTab = document.querySelector('a[href="#foodmenu"]');
                    if (foodMenuTab) {
                      foodMenuTab.click();
                    }
                  }, 100);
                }
              }}
            >
              <h6>
                <MdDeliveryDining className="mr-2" />
                <br />
                {delivery.firstname} {delivery.lastname}
              </h6>
            </div>
          </div>
        ))}
      </div>
    </>
  ) : (
    <div className="selected-delivery-info">
      <p>Selected Delivery: {selectDelivery.firstname} {selectDelivery.lastname}</p>
      <button
        className="btn btn-sm btn-primary"
        onClick={() => {
          setSelectDelivery(null);
          setShowDeliveryTab(true);
          setEnableFoodmenu(false);
          setShowFoodMenuTab(false);
        }}
      >
        Change Delivery Person
      </button>
    </div>
  )}
</div>
{enableFoodmenu && (
  <div
  className={`tab-pane ${showFoodMenuTab ? 'active show' : ''}`}
  id="foodmenu"
  role="tabpanel"
  style={{ display: showFoodMenuTab ? 'block' : 'none' }}
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

      {/* Vertical Tabs Layout */}
      <div className="row" style={{ margin: 0 }}>
        {/* Left Side - Fixed Vertical Categories with Scroll */}
        <div className="col-md-3" style={{ paddingRight: 0 }}>
          <div
            className="nav flex-column nav-pills shdw-lft"
            id="v-tabs"
            role="tablist"
            aria-orientation="vertical"
            style={{
              height: '500px',
              maxHeight: '500px',
              minHeight: '500px',      /* Add min-height */
              overflowY: 'scroll',
              overflowX: 'hidden',
              position: 'relative',    /* Changed from sticky/fixed */
              top: '0',
              padding: '10px 5px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px 0 0 8px',
              display: 'block',        /* Ensure block display */
            }}
          >
            {distinctCategories && distinctCategories.length > 0 ? (
              distinctCategories.map((category, index) => (
                <a
                  key={index}
                  className={`nav-link text-left ${index === activeTab ? "active" : ""}`}
                  onClick={() => handleTabsClick(index)}
                  style={{
                    cursor: 'pointer',
                    marginBottom: '5px',
                    borderRadius: '5px',
                    whiteSpace: 'normal',
                    wordWrap: 'break-word',
                    textAlign: 'left',
                    fontSize: '12px',
                    display: 'block',   /* Ensure block display */
                    width: '100%',      /* Full width */
                  }}
                >
                  {category}
                </a>
              ))
            ) : (
              <div className="text-center p-3">No categories found</div>
            )}
          </div>
        </div>

        {/* Right Side - Menu Items */}
        <div className="col-md-9" style={{ paddingLeft: 0 }}>
          <div
            className="tab-content p-3"
            id="v-tabContents"
            style={{
              height: '500px',
              maxHeight: '500px',
              minHeight: '500px',      /* Add min-height */
              overflowY: 'scroll',
              backgroundColor: '#fff',
              borderRadius: '0 8px 8px 0',
              border: '1px solid #dee2e6'
            }}
          >
            {isLoading ? (
              <div className="text-center p-5">Loading...</div>
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
                      <div className="col-sm-6 col-md-4 col-lg-3" key={index}>
                     <div className="foodmenu-box" onClick={() => addProductToCart(menu)}>
  <div className="foodmenu-div">
    <img src={`/uploads/${menu.photo}`} className="foodimg" alt={menu.foodmenuname} />
    <div className="menu-details">
      <h6 className="mt-2">{menu.foodmenuname}</h6>
      <p>AED: {menu.salesprice}</p>
    </div>
  </div>
</div>
                      </div>
                    ))}
                {foodCategory.filter(
                  (item) =>
                    item.foodcategory.foodcategoryname ===
                      distinctCategories[activeTab] &&
                    item.foodmenuname
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                ).length === 0 && (
                  <div className="col-12 text-center p-4">
                    No items found in this category
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
)}
        </div>
      </div>

      </div>

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

    <PosDeliverySession
      isModalDeliveryReport={isModalDeliveryReport}
      setModalDeliveryReport={setModalDeliveryReport}
    />

    <PosTodayOrder
      isModalTodayOrderReport ={isModalTodayOrderReport}
      setModalTodayOrderReport ={setModalTodayOrderReport}
    />

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
              onClick={() => {
      setShowPrintModal(false);
      handleClearClick(); // Add this to clear everything when closing
    }}
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

  );
};

export default PosNewOrder;

