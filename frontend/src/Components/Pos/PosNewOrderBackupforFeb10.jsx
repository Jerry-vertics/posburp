import React from "react";
import { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { redirect, useNavigate, Link, useParams } from "react-router-dom";
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
  const navigate = useNavigate();
  const { id } = useParams();

  // State Declarations
  const [addedby, setuserid] = useState("");
  const [shiftstoken, setShiftstoken] = useState('');
  const [shiftAccess, setShiftAccess] = useState('');

  // Order Flow States
  const [currentStep, setCurrentStep] = useState(1); // 1: Waiter, 2: Option, 3: Details, 4: Food Menu
  const [selectedOption, setSelectedOption] = useState("");

  // Data States
  const [waiter, setWaiter] = useState([]);
  const [selectWaiter, setSelectWaiter] = useState(null);
  const [delivery, setDelivery] = useState([]);
  const [selectDelivery, setSelectDelivery] = useState(null);
  const [table, setTable] = useState([]);
  const [ordertable, setOrderTable] = useState([]);
  const [selectTable, setSelectTable] = useState(null);
  const [foodCategory, setFoodcategory] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectCustomer, setSelectCustomer] = useState(null);

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [vatAmount, setTotalVat] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [numberofperson, setNumberofPerson] = useState("");

  // Search States
  const [searchWaiter, setSearchWaiter] = useState("");
  const [searchTable, setSearchTable] = useState("");
  const [searchCustomer, setSearchCustomer] = useState("");
  const [searchDeliveryPerson, setSearchDeliveryPerson] = useState("");
  const [searchFood, setSearchFood] = useState("");

  // Modal States
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalHold, setModalHold] = useState(false);
  const [isModalCashDrop, setModalCashDrop] = useState(false);
  const [isModalInvoiceReport, setModalInvoiceReport] = useState(false);
  const [isModalClosingBalance, setModalClosingBalance] = useState(false);
  const [isModalCanelOrders, setModalCancelOrders] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [orderData, setOrderData] = useState(null);

  // Loading States
  const [loadingPlaceOrder, setLoadingPlaceOrder] = useState(false);
  const [loadingQuickPay, setLoadingQuickPay] = useState(false);

  // Refs
  const componentRef = useRef();
  const printComponentRef = useRef();

  // Print Function
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // Initial Data Fetch
  useEffect(() => {
    const storeid = localStorage.getItem("_id");
    const storetoken = localStorage.getItem('shifttoken');

    if (storeid) {
      setuserid(storeid);
    }
    if (storetoken) {
      setShiftstoken(storetoken);
    }

    // Fetch shift access
    const fetchShiftAccess = async () => {
      try {
        const response = await axios.get(`${apiConfig.baseURL}/api/pos/getShiftAccess`, {
          params: { id: storeid }
        });
        setShiftAccess(response.data.shiftacess);
      } catch (error) {
        console.error('Error fetching shift access:', error);
      }
    };

    if (storeid) {
      fetchShiftAccess();
    }
  }, []);

  // Fetch all data
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);

        const [
          waiterRes,
          deliveryRes,
          tableRes,
          customerRes,
          foodRes
        ] = await Promise.all([
          axios.get(`${apiConfig.baseURL}/api/pos/posWaiter`),
          axios.get(`${apiConfig.baseURL}/api/pos/posDelivery`),
          axios.get(`${apiConfig.baseURL}/api/pos/tableorder`),
          axios.get(`${apiConfig.baseURL}/api/pos/posCustomer`),
          axios.get(`${apiConfig.baseURL}/api/pos/posfood`)
        ]);

        setWaiter(waiterRes.data);
        setDelivery(deliveryRes.data);
        setTable(tableRes.data);
        setCustomers(customerRes.data);
        setFoodcategory(foodRes.data);

      } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load data. Please refresh the page.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Cart Calculations
  useEffect(() => {
    let newTotalAmount = 0;
    let newVatAmount = 0;

    cart.forEach((item) => {
      newTotalAmount += item.quantity * parseInt(item.salesprice);
      if (item.vat && parseInt(item.vat.percentage) !== 0) {
        newVatAmount += item.quantity * parseInt(item.salesprice) * (parseInt(item.vat.percentage) / 100);
      }
    });

    setTotalAmount(newTotalAmount);
    setTotalVat(newVatAmount.toFixed(2));
    setGrandTotal((newTotalAmount + newVatAmount).toFixed());
  }, [cart]);

  // Filter Functions
  const filteredWaiters = waiter.filter((wait) =>
    `${wait.firstname} ${wait.lastname}`.toLowerCase().includes(searchWaiter.toLowerCase())
  );

  const filteredTables = table.filter((tables) =>
    tables.tablename.toLowerCase().includes(searchTable.toLowerCase())
  );

  const filteredCustomers = customers.filter((customer) =>
    customer.customername.toLowerCase().includes(searchCustomer.toLowerCase())
  );

  const filteredDelivery = delivery.filter((delivery) =>
    `${delivery.firstname} ${delivery.lastname}`.toLowerCase().includes(searchDeliveryPerson.toLowerCase())
  );

  const distinctCategories = [
    ...new Set(foodCategory.map((item) => item.foodcategory?.foodcategoryname || "Uncategorized")),
  ];

  // Step 1: Select Waiter
  const handleWaiterSelect = (waiter) => {
    setSelectWaiter(waiter);
    setCurrentStep(2); // Move to option selection
  };

  // Step 2: Select Option
  const handleOptionSelect = (option) => {
    setSelectedOption(option);

    switch(option) {
      case "Dine In":
        setCurrentStep(3); // Move to table selection
        break;
      case "Take Away":
        setSelectTable(null);
        setNumberofPerson("");
        setCurrentStep(4); // Move directly to food menu
        break;
      case "Delivery":
        setCurrentStep(3.5); // Move to customer selection
        break;
      default:
        break;
    }
  };

  // Step 3: Select Table (for Dine In)
  const handleTableSelect = (table) => {
    if (!numberofperson.trim()) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter the number of persons!",
      });
      return;
    }

    if (parseInt(numberofperson) > parseInt(table.seatcapacity)) {
      Swal.fire({
        icon: "error",
        title: "Capacity Exceeded",
        text: `Number of persons exceeds table capacity (${table.seatcapacity})`,
      });
      return;
    }

    setSelectTable(table);
    setCurrentStep(4); // Move to food menu
  };

  // Step 3.5: Select Customer (for Delivery)
  const handleCustomerSelect = (customer) => {
    setSelectCustomer(customer);
    setCurrentStep(3.6); // Move to delivery person selection
  };

  // Step 3.6: Select Delivery Person
  const handleDeliveryPersonSelect = (deliveryPerson) => {
    setSelectDelivery(deliveryPerson);
    setCurrentStep(4); // Move to food menu
  };

  // Reset everything
  const handleClearAll = () => {
    setSelectWaiter(null);
    setSelectCustomer(null);
    setSelectDelivery(null);
    setSelectTable(null);
    setSelectedOption("");
    setNumberofPerson("");
    setCurrentStep(1);
    setCart([]);
    setTotalAmount(0);
    setTotalVat(0);
    setGrandTotal(0);

    // Reset search
    setSearchWaiter("");
    setSearchTable("");
    setSearchCustomer("");
    setSearchDeliveryPerson("");
    setSearchFood("");
  };

  // Cart Functions
  const addProductToCart = (menu) => {
    const existingItem = cart.find(item => item._id === menu._id);

    if (existingItem) {
      const updatedCart = cart.map(item =>
        item._id === menu._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...menu, quantity: 1 }]);
    }
  };

  const removeProductFromCart = (menu) => {
    setCart(cart.filter(item => item._id !== menu._id));
  };

  const handleIncrement = (product) => {
    setCart(cart.map(item =>
      item._id === product._id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    ));
  };

  const handleDecrement = (product) => {
    setCart(cart.map(item =>
      item._id === product._id
        ? { ...item, quantity: Math.max(1, item.quantity - 1) }
        : item
    ));
  };

  // Place Order Function
  const handlePlaceorder = async (event) => {
    event.preventDefault();

    // Validation
    if (!selectWaiter) {
      Swal.fire({ icon: 'error', title: 'Waiter Required', text: 'Please select a waiter.' });
      return;
    }

    if (cart.length === 0) {
      Swal.fire({ icon: 'error', title: 'Cart Empty', text: 'Please add items to cart.' });
      return;
    }

    if (!selectedOption) {
      Swal.fire({ icon: 'error', title: 'Option Required', text: 'Please select an order option.' });
      return;
    }

    if (selectedOption === "Dine In" && !selectTable) {
      Swal.fire({ icon: 'error', title: 'Table Required', text: 'Please select a table for dine in.' });
      return;
    }

    if (selectedOption === "Delivery" && (!selectCustomer || !selectDelivery)) {
      Swal.fire({ icon: 'error', title: 'Details Required', text: 'Please select customer and delivery person.' });
      return;
    }

    setLoadingPlaceOrder(true);

    try {
      const formData = new FormData();

      // Basic order info
      formData.append('options', selectedOption);
      formData.append('grandTotal', grandTotal);
      formData.append('vatAmount', vatAmount);
      formData.append('total', totalAmount);
      formData.append('addedby', addedby);
      formData.append('opentoken', shiftAccess);

      // People assignments
      formData.append('waiterId', selectWaiter._id);
      if (selectCustomer) formData.append('customers', selectCustomer._id);
      if (selectDelivery) formData.append('delivery', selectDelivery._id);

      // Table info for Dine In
      if (selectTable) {
        formData.append('tableId', selectTable._id);
        formData.append('numberofperson', numberofperson);
      }

      // Cart items
      cart.forEach((item, index) => {
        formData.append(`cart[${index}].foodmenuId`, item._id);
        formData.append(`cart[${index}].foodmenuname`, item.foodmenuname);
        formData.append(`cart[${index}].salesprice`, item.salesprice);
        formData.append(`cart[${index}].quantity`, item.quantity);
      });

      const config = { headers: { 'Content-Type': 'application/json' } };
      const response = await axios.post(
        `${apiConfig.baseURL}/api/pos/createpos`,
        formData,
        config
      );

      // Success - ask about printing
      Swal.fire({
        title: 'Order Placed!',
        text: 'Do you want to print the receipt?',
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Print',
        cancelButtonText: 'Continue',
      }).then((result) => {
        if (result.isConfirmed) {
          setOrderData(response.data);
          setShowPrintModal(true);
        }
        handleClearAll();
      });

    } catch (error) {
      console.error('Order error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Order Failed',
        text: 'Failed to place order. Please try again.',
      });
    } finally {
      setLoadingPlaceOrder(false);
    }
  };

  // Quick Pay Function
  const handleQuickPay = async (event) => {
    event.preventDefault();

    // Validation
    if (cart.length === 0) {
      Swal.fire({ icon: 'error', title: 'Cart Empty', text: 'Please add items to cart.' });
      return;
    }

    if (!selectedOption) {
      Swal.fire({ icon: 'error', title: 'Option Required', text: 'Please select an order option.' });
      return;
    }

    if (selectedOption === "Dine In") {
      Swal.fire({ icon: 'error', title: 'Invalid Option', text: 'Quick Pay is not available for Dine In orders.' });
      return;
    }

    setLoadingQuickPay(true);

    try {
      const formData = new FormData();

      formData.append('options', selectedOption);
      formData.append('grandTotal', grandTotal);
      formData.append('vatAmount', vatAmount);
      formData.append('total', totalAmount);
      formData.append('addedby', addedby);
      formData.append('shiftstoken', shiftstoken);
      formData.append('opentoken', shiftAccess);

      if (selectCustomer) formData.append('customers', selectCustomer._id);
      if (selectDelivery) formData.append('delivery', selectDelivery._id);

      cart.forEach((item, index) => {
        formData.append(`cart[${index}].foodmenuId`, item._id);
        formData.append(`cart[${index}].foodmenuname`, item.foodmenuname);
        formData.append(`cart[${index}].salesprice`, item.salesprice);
        formData.append(`cart[${index}].quantity`, item.quantity);
      });

      const config = { headers: { 'Content-Type': 'application/json' } };
      const response = await axios.post(
        `${apiConfig.baseURL}/api/pos/createQuickpay`,
        formData,
        config
      );

      Swal.fire({
        title: 'Quick Pay Successful!',
        text: 'Do you want to print the receipt?',
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Print',
        cancelButtonText: 'Continue',
      }).then((result) => {
        if (result.isConfirmed) {
          setOrderData({
            ordernumber: response.data.newEntry.ordernumber,
            billnumber: response.data.updatedDocuments.billnumber,
            cart: response.data.newEntry.cart,
            date: response.data.newEntry.date,
            options: selectedOption
          });
          setShowPrintModal(true);
        }
        handleClearAll();
      });

    } catch (error) {
      console.error('Quick Pay error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Quick Pay Failed',
        text: 'Failed to process quick payment.',
      });
    } finally {
      setLoadingQuickPay(false);
    }
  };

  // Modal Handlers
  const handleKOTClick = () => setModalOpen(true);
  const handleHoldClick = () => setModalHold(true);
  const handleDropoutClick = () => setModalCashDrop(true);
  const handleInvoiceClick = () => setModalInvoiceReport(true);
  const handleClosingBalance = () => setModalClosingBalance(true);
  const handleCancelOrders = () => setModalCancelOrders(true);

  // Render Current Step
  const renderCurrentStep = () => {
    switch(currentStep) {
      case 1: // Select Waiter
        return (
          <div className="step-content">
            <h5 className="text-center mb-4">Step 1: Select Waiter</h5>
            <input
              type="text"
              placeholder="Search waiters..."
              value={searchWaiter}
              onChange={(e) => setSearchWaiter(e.target.value)}
              className="form-control mb-3"
            />
            <div className="row">
              {filteredWaiters.map((wait, index) => (
                <div key={index} className="col-sm-3 col-md-3 mb-3">
                  <div
                    className={`menu-box ${selectWaiter?._id === wait._id ? 'selected' : ''}`}
                    onClick={() => handleWaiterSelect(wait)}
                  >
                    <div className="text-center">
                      <TbChefHat size={30} className="mb-2" />
                      <h6>{wait.firstname} {wait.lastname}</h6>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 2: // Select Option
        return (
          <div className="step-content">
            <h5 className="text-center mb-4">Step 2: Select Order Type</h5>
            <div className="row">
              <div className="col-sm-4 col-md-4 mb-3">
                <div
                  className={`menu-box ${selectedOption === "Dine In" ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect("Dine In")}
                >
                  <div className="text-center">
                    <FaCcDinersClub size={40} className="mb-2" />
                    <h6>Dine In</h6>
                    <small>Eat at restaurant</small>
                  </div>
                </div>
              </div>

              <div className="col-sm-4 col-md-4 mb-3">
                <div
                  className={`menu-box ${selectedOption === "Take Away" ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect("Take Away")}
                >
                  <div className="text-center">
                    <MdOutlineTakeoutDining size={40} className="mb-2" />
                    <h6>Take Away</h6>
                    <small>Take with you</small>
                  </div>
                </div>
              </div>

              <div className="col-sm-4 col-md-4 mb-3">
                <div
                  className={`menu-box ${selectedOption === "Delivery" ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect("Delivery")}
                >
                  <div className="text-center">
                    <CiDeliveryTruck size={40} className="mb-2" />
                    <h6>Delivery</h6>
                    <small>Home delivery</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-4">
              <button
                className="btn btn-secondary mr-2"
                onClick={() => setCurrentStep(1)}
              >
                Back to Waiter
              </button>
            </div>
          </div>
        );

      case 3: // Select Table (for Dine In)
        return (
          <div className="step-content">
            <h5 className="text-center mb-4">Step 3: Select Table</h5>
            <input
              type="text"
              placeholder="Search tables..."
              value={searchTable}
              onChange={(e) => setSearchTable(e.target.value)}
              className="form-control mb-3"
            />

            <div className="row">
              {filteredTables.map((table, index) => (
                <div key={index} className="col-sm-3 col-md-3 mb-3">
                  <div className={`card ${selectTable?._id === table._id ? 'border-primary' : ''}`}>
                    <div className="card-body text-center">
                      <SiTablecheck size={30} className="mb-2" />
                      <h6>{table.tablename}</h6>
                      <p className="mb-1">Capacity: {table.seatcapacity}</p>
                      <p className="mb-3">Available: {table.availableSeat}</p>

                      <input
                        type="number"
                        min="1"
                        max={table.seatcapacity}
                        value={numberofperson}
                        onChange={(e) => setNumberofPerson(e.target.value)}
                        className="form-control mb-2"
                        placeholder="No. of persons"
                      />

                      <button
                        className="btn btn-primary btn-sm w-100"
                        onClick={() => handleTableSelect(table)}
                        disabled={!numberofperson || parseInt(numberofperson) > parseInt(table.seatcapacity)}
                      >
                        Select Table
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-4">
              <button
                className="btn btn-secondary mr-2"
                onClick={() => setCurrentStep(2)}
              >
                Back to Options
              </button>
            </div>
          </div>
        );

      case 3.5: // Select Customer (for Delivery)
        return (
          <div className="step-content">
            <h5 className="text-center mb-4">Step 3: Select Customer</h5>
            <input
              type="text"
              placeholder="Search customers..."
              value={searchCustomer}
              onChange={(e) => setSearchCustomer(e.target.value)}
              className="form-control mb-3"
            />

            <div className="row">
              {filteredCustomers.map((customer, index) => (
                <div key={index} className="col-sm-3 col-md-3 mb-3">
                  <div
                    className={`menu-box ${selectCustomer?._id === customer._id ? 'selected' : ''}`}
                    onClick={() => handleCustomerSelect(customer)}
                  >
                    <div className="text-center">
                      <FaUserAlt size={30} className="mb-2" />
                      <h6>{customer.customername}</h6>
                      <small>{customer.phone || 'No phone'}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-4">
              <button
                className="btn btn-secondary mr-2"
                onClick={() => setCurrentStep(2)}
              >
                Back to Options
              </button>
            </div>
          </div>
        );

      case 3.6: // Select Delivery Person
        return (
          <div className="step-content">
            <h5 className="text-center mb-4">Step 4: Select Delivery Person</h5>
            <input
              type="text"
              placeholder="Search delivery persons..."
              value={searchDeliveryPerson}
              onChange={(e) => setSearchDeliveryPerson(e.target.value)}
              className="form-control mb-3"
            />

            <div className="row">
              {filteredDelivery.map((person, index) => (
                <div key={index} className="col-sm-3 col-md-3 mb-3">
                  <div
                    className={`menu-box ${selectDelivery?._id === person._id ? 'selected' : ''}`}
                    onClick={() => handleDeliveryPersonSelect(person)}
                  >
                    <div className="text-center">
                      <MdDeliveryDining size={30} className="mb-2" />
                      <h6>{person.firstname} {person.lastname}</h6>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-4">
              <button
                className="btn btn-secondary mr-2"
                onClick={() => setCurrentStep(3.5)}
              >
                Back to Customers
              </button>
            </div>
          </div>
        );

      case 4: // Food Menu
        return (
          <div className="step-content">
            <h5 className="text-center mb-4">Step {selectedOption === "Take Away" ? "3" : "4"}: Select Food Items</h5>

            <input
              type="text"
              placeholder="Search food items..."
              value={searchFood}
              onChange={(e) => setSearchFood(e.target.value)}
              className="form-control mb-3"
            />

            <div className="nav-container mb-3">
              <ul className="nav nav-pills flex-row shdw-lft" id="category-tab" role="tablist">
                {distinctCategories.map((category, index) => (
                  <li className="nav-item" key={index}>
                    <button
                      className={`nav-link ${index === 0 ? 'active' : ''}`}
                      onClick={() => document.querySelector(`[href="#category-${index}"]`).click()}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="tab-content">
              {distinctCategories.map((category, catIndex) => (
                <div
                  key={catIndex}
                  className={`tab-pane ${catIndex === 0 ? 'active' : ''}`}
                  id={`category-${catIndex}`}
                >
                  <div className="row">
                    {foodCategory
                      .filter(item =>
                        item.foodcategory?.foodcategoryname === category &&
                        item.foodmenuname.toLowerCase().includes(searchFood.toLowerCase())
                      )
                      .map((menu, index) => (
                        <div key={index} className="col-sm-3 col-md-3 mb-3">
                          <div
                            className="menu-box"
                            onClick={() => addProductToCart(menu)}
                          >
                            <div className="text-center">
                              <h6>{menu.foodmenuname}</h6>
                              <p className="mb-1">Price: ₹{menu.salesprice}</p>
                              <small className="text-muted">Click to add</small>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-4">
              <button
                className="btn btn-secondary mr-2"
                onClick={() => {
                  if (selectedOption === "Dine In") setCurrentStep(3);
                  else if (selectedOption === "Delivery") setCurrentStep(3.6);
                  else setCurrentStep(2);
                }}
              >
                Back
              </button>
            </div>
          </div>
        );

      default:
        return <div>Invalid step</div>;
    }
  };

  // Add CSS styles
  const styles = `
    .menu-box {
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: center;
      height: 100%;
    }

    .menu-box:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      border-color: #007bff;
    }

    .menu-box.selected {
      border-color: #007bff;
      background-color: #f8f9fa;
    }

    .step-content {
      min-height: 400px;
      padding: 20px;
    }

    .nav-container {
      overflow-x: auto;
      white-space: nowrap;
      padding-bottom: 5px;
    }

    .nav-container .nav-pills {
      flex-wrap: nowrap;
    }

    .nav-container .nav-link {
      margin-right: 5px;
      min-width: 120px;
      text-align: center;
    }

    .cart-item-qty {
      width: 60px;
      text-align: center;
    }

    .step-indicator {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
    }

    .step-indicator .step {
      padding: 10px 20px;
      margin: 0 5px;
      border-radius: 20px;
      background: #e9ecef;
      color: #6c757d;
    }

    .step-indicator .step.active {
      background: #007bff;
      color: white;
    }
  `;

  return (
    <div className="row">
      <style>{styles}</style>

      {/* Cart Section (Left Sidebar) */}
      <div className="col-sm-4 col-lg-4">
        <div className="wraper shdw">
          <div className="table-responsive vh-70" style={{ overflowY: "scroll" }}>
            <table className="table table-sm">
              <thead>
                <tr className="thead-light">
                  <th>No.</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.length > 0 ? (
                  cart.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>{item.foodmenuname}</td>
                      <td>₹{item.salesprice}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDecrement(item)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="mx-2">{item.quantity}</span>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleIncrement(item)}
                        >
                          +
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => removeProductFromCart(item)}
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      No items in cart
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Cart Summary */}
          <div className="table-responsive">
            <table className="table">
              <tbody>
                <tr>
                  <td>Sub Total</td>
                  <td className="text-right">₹{totalAmount}</td>
                </tr>
                <tr>
                  <td>VAT</td>
                  <td className="text-right">₹{vatAmount}</td>
                </tr>
                <tr className="table-active">
                  <th>Grand Total</th>
                  <th className="text-right">₹{grandTotal}</th>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Action Buttons */}
          <div className="row">
            <div className="col-6">
              <button
                type="button"
                className="btn btn-danger w-100 mb-2"
                onClick={handleClearAll}
              >
                Clear All
              </button>
            </div>
            <div className="col-6">
              <button
                type="button"
                className="btn btn-warning w-100 mb-2"
                onClick={handlePlaceorder}
                disabled={loadingPlaceOrder || cart.length === 0}
              >
                {loadingPlaceOrder ? 'Processing...' : 'Place Order'}
              </button>
            </div>
            <div className="col-6">
              <button
                type="button"
                className="btn btn-secondary w-100 mb-2"
                onClick={handleHoldClick}
              >
                Hold Order
              </button>
            </div>
            <div className="col-6">
              <button
                type="button"
                className="btn btn-success w-100 mb-2"
                onClick={handleQuickPay}
                disabled={loadingQuickPay || cart.length === 0 || selectedOption === "Dine In"}
              >
                {loadingQuickPay ? 'Processing...' : 'Quick Pay'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions (Middle) */}
      <div className="col-lg-1">
        <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist">
          <a className="nav-link text-center navleft mb-2" onClick={handleClearAll}>
            <FaHistory className="mb-1" /><br />
            Clear
          </a>
          <a className="nav-link text-center navleft mb-2" onClick={handleKOTClick}>
            <TbToolsKitchen3 className="mb-1" /><br />
            KOT
          </a>
          <a className="nav-link text-center navleft mb-2" onClick={handleHoldClick}>
            <BsFillPauseCircleFill className="mb-1" /><br />
            Hold
          </a>
          <a className="nav-link text-center navleft mb-2" onClick={handleDropoutClick}>
            <FaHandHoldingDroplet className="mb-1" /><br />
            Cash Drop
          </a>
          <a className="nav-link text-center navleft mb-2">
            <RiArchiveDrawerLine className="mb-1" /><br />
            Drawer
          </a>
          <a className="nav-link text-center navleft mb-2" onClick={handleInvoiceClick}>
            <LiaFileInvoiceSolid className="mb-1" /><br />
            Invoice
          </a>
          <a className="nav-link text-center navleft mb-2" onClick={handleClosingBalance}>
            <LiaFileInvoiceSolid className="mb-1" /><br />
            Closing
          </a>
          <a className="nav-link text-center navleft mb-2" onClick={handleCancelOrders}>
            <LiaFileInvoiceSolid className="mb-1" /><br />
            Cancel
          </a>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="col-sm-7 col-lg-7">
        {/* Step Indicator */}
        <div className="step-indicator mb-4">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>1. Waiter</div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>2. Option</div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            {selectedOption === "Dine In" ? "3. Table" :
             selectedOption === "Delivery" ? "3. Customer" :
             "3. Food"}
          </div>
          {selectedOption === "Delivery" && (
            <div className={`step ${currentStep >= 3.6 ? 'active' : ''}`}>4. Delivery</div>
          )}
          <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
            {selectedOption === "Delivery" ? "5. Food" : "4. Food"}
          </div>
        </div>

        {/* Current Order Info */}
        <div className="card mb-4">
          <div className="card-body p-3">
            <div className="row">
              <div className="col-4">
                <strong>Waiter:</strong><br />
                {selectWaiter ? `${selectWaiter.firstname} ${selectWaiter.lastname}` : 'Not selected'}
              </div>
              <div className="col-4">
                <strong>Option:</strong><br />
                {selectedOption || 'Not selected'}
              </div>
              <div className="col-4">
                <strong>Table:</strong><br />
                {selectTable ? selectTable.tablename : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="tbl-h" style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <p className="mt-2">Loading data...</p>
            </div>
          ) : (
            renderCurrentStep()
          )}
        </div>
      </div>

      {/* Modals */}
      <PosNeworderKotModal isModalOpen={isModalOpen} setModalOpen={setModalOpen} />
      <PosNewHoldingModal isModalHold={isModalHold} setModalHold={setModalHold} />
      <PosCashDrop isModalCashDrop={isModalCashDrop} setModalCashDrop={setModalCashDrop} />
      <PosInvoiceReport isModalInvoiceReport={isModalInvoiceReport} setModalInvoiceReport={setModalInvoiceReport} />
      <PosClosingBalance isModalClosingBalance={isModalClosingBalance} setModalClosingBalance={setModalClosingBalance} />
      <PosCancelOrder isModalCanelOrders={isModalCanelOrders} setModalCancelOrders={setModalCancelOrders} />

      {/* Print Modal */}
      {showPrintModal && orderData && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Print Preview</h5>
                <button type="button" className="close text-white" onClick={() => setShowPrintModal(false)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body" ref={componentRef}>
                {/* Your print template here */}
                <div style={{ fontFamily: 'monospace', padding: '20px' }}>
                  <h4 className="text-center">RESTAURANT RECEIPT</h4>
                  <hr />
                  <p><strong>Order #:</strong> {orderData.ordernumber}</p>
                  <p><strong>Date:</strong> {new Date(orderData.date).toLocaleString()}</p>
                  <p><strong>Type:</strong> {orderData.options}</p>
                  <hr />

                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderData.cart?.map((item, index) => (
                        <tr key={index}>
                          <td>{item.foodmenuname}</td>
                          <td>{item.quantity}</td>
                          <td>₹{item.salesprice}</td>
                          <td>₹{item.quantity * item.salesprice}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <hr />
                  <div className="text-right">
                    <p><strong>Sub Total:</strong> ₹{orderData.total || totalAmount}</p>
                    <p><strong>VAT:</strong> ₹{orderData.vatAmount || vatAmount}</p>
                    <p><strong>Grand Total:</strong> ₹{orderData.grandTotal || grandTotal}</p>
                  </div>
                  <hr />
                  <p className="text-center">Thank you for your order!</p>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPrintModal(false)}>
                  Close
                </button>
                <button type="button" className="btn btn-primary" onClick={handlePrint}>
                  Print Receipt
                </button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}
    </div>
  );
};

export default PosNewOrder;