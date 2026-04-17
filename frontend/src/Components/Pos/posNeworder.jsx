import React from "react";
import { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useNavigate, Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import apiConfig from "../layouts/base_url";
import {
  FaShoppingCart,
  FaHistory,
  FaPause,
  FaRegCalendarAlt,
  FaClock,
  FaCalendarAlt,
  FaCar,
  FaUserAlt,
  FaPlus,
} from "react-icons/fa";
import { TbToolsKitchen3, TbChefHat } from "react-icons/tb";
import { BsFillPauseCircleFill } from "react-icons/bs";
import { FaHandHoldingDroplet, FaCcDinersClub } from "react-icons/fa6";
import { RiArchiveDrawerLine } from "react-icons/ri";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { SiTablecheck } from "react-icons/si";
import { IoFastFoodSharp } from "react-icons/io5";
import { CiDeliveryTruck } from "react-icons/ci";
import { FiSettings, FiPlus, FiMinus, FiX } from "react-icons/fi";
import { MdOutlinePayment } from "react-icons/md";
import { MdBookOnline } from "react-icons/md";
import { MdDeliveryDining } from "react-icons/md";
import { MdOutlineTakeoutDining } from "react-icons/md";
import PosNeworderKotModal from './neworder/posNeworderkotmodal'
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
import PosNewCustomerModal from "./neworder/PosNewCustomerModal";

// ==================== THERMAL PRINTER COMPONENT ====================
const ThermalPrintComponent = React.forwardRef(({ orderData, restaurantInfo = {} }, ref) => {
  const defaultRestaurant = {
    name: "TAHA Cafeteria",
    address: "Electra street - opposite NMC",
    city: "Al Danah - Zone 1 - Abu Dhabi",
    phone: "02 632 8382",
    vatNumber: "100123456789",
    footer: "Thank you for dining with us!"
  };

  const restaurant = { ...defaultRestaurant, ...restaurantInfo };

  // Safe number conversion
  const safeToNumber = (value) => {
    if (value === null || value === undefined) return 0;
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  // Calculate totals
  const subtotal = orderData?.cart?.reduce((sum, item) =>
    sum + (safeToNumber(item.quantity) * safeToNumber(item.salesprice)), 0) || 0;
  const vatPercent = 5;
  const vatAmount = (subtotal * vatPercent) / 100;
  const netTotal = subtotal - vatAmount;
  const grandTotal = subtotal;

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear().toString().slice(-2)} ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
  };

  const formatPrice = (price) => {
    const num = safeToNumber(price);
    return num.toFixed(2);
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
          <span>Time:</span>
          <span>{new Date(orderData?.date || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div style={thermalStyles.row}>
          <span>Type:</span>
          <span style={{ textTransform: 'uppercase' }}>{orderData?.options || 'N/A'}</span>
        </div>
        {orderData?.options === 'Carhop' && orderData?.vehicle && (
          <div style={thermalStyles.row}>
            <span>Vehicle:</span>
            <span>{orderData.vehicle.carNumber}</span>
          </div>
        )}
        {orderData?.tableDetails?.tablename && (
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

      {orderData?.cart?.map((item, index) => {
        const quantity = safeToNumber(item.quantity);
        const price = safeToNumber(item.salesprice);
        const total = quantity * price;
        const itemName = item.menuItemDetails?.foodmenuname || item.foodmenuname || 'N/A';

        return (
          <div key={index} style={thermalStyles.itemRow}>
            <span style={thermalStyles.itemName}>{itemName}</span>
            <span style={thermalStyles.itemQty}>x{quantity}</span>
            <span style={thermalStyles.itemPrice}>{formatPrice(total)}</span>
          </div>
        );
      })}

      <div style={thermalStyles.divider} />

      <div style={{ marginTop: '5px' }}>
        <div style={thermalStyles.row}>
          <span>Subtotal:</span>
          <span>{formatPrice(netTotal)}</span>
        </div>
        <div style={thermalStyles.row}>
          <span>VAT ({vatPercent}%):</span>
          <span>{formatPrice(vatAmount)}</span>
        </div>
        <div style={{ ...thermalStyles.row, ...thermalStyles.totalRow }}>
          <span style={{ fontSize: '12px' }}>GRAND TOTAL:</span>
          <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{formatPrice(grandTotal)} AED</span>
        </div>
      </div>

      {orderData?.paymentType && (
        <div style={thermalStyles.row}>
          <span>Payment:</span>
          <span>{orderData.paymentType}</span>
        </div>
      )}

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

ThermalPrintComponent.displayName = 'ThermalPrintComponent';

// ==================== MAIN COMPONENT ====================
const PosNewOrder = () => {
  // ============= STATE DECLARATIONS =============
  const [addedby, setuserid] = useState("");
  const [shiftstoken, setShiftstoken] = useState('');
  const [shiftAccess, setShiftAccess] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const { id } = useParams();
  const navigate = useNavigate();

  // Vehicle details state (Carhop)
  const [vehicleDetails, setVehicleDetails] = useState({
    carName: '',
    carNumber: ''
  });
  const [showVehicleTab, setShowVehicleTab] = useState(false);

  // Order flow state
  const [orderFlow, setOrderFlow] = useState({
    step: 'options',
    selectedOption: null
  });

  const [designationname, setDesignationName] = useState("");
  const [enableDinein, setEnableDinein] = useState(false);
  const [enableFoodmenu, setEnableFoodmenu] = useState(false);

  // Data states
  const [waiter, setWaiter] = useState([]);
  const [selectWaiter, setSelectWaiter] = useState();
  const [delivery, setDelivery] = useState([]);
  const [selectDelivery, setSelectDelivery] = useState();
  const [table, setTable] = useState([]);
  const [ordertable, setOrderTable] = useState([]);
  const [selectTable, setSelectTable] = useState();
  const [foodCategory, setFoodcategory] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectCustomer, setSelectCustomer] = useState();

  // UI states
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
  const [placeorder, setPlaceOrder] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [refresh, setRefresh] = useState(false);

  // Search states
  const [searchWaiter, setSearchWaiter] = useState("");
  const [searchTable, setSearchTable] = useState("");
  const [searchCustomer, setSearchCustomer] = useState("");
  const [searchDeliveryPerson, setSearchDeliveryPerson] = useState("");

  // Modal states
  const [showTable, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [posHoldingorder, setPosHoldingorder] = useState([]);
  const [isModalHold, setModalHold] = useState(false);
  const [isModalCashDrop, setModalCashDrop] = useState(false);
  const [numberofperson, setNumberofPerson] = useState({});
  const [isModalInvoiceReport, setModalInvoiceReport] = useState(false);
  const [isModalClosingBalance, setModalClosingBalance] = useState(false);
  const [isModalCanelOrders, setModalCancelOrders] = useState(false);
  const [isModalDeliveryReport, setModalDeliveryReport] = useState(false);
  const [isModalTodayOrderReport, setModalTodayOrderReport] = useState(false);
  const [isModalNewCustomer, setModalNewCustomer] = useState(false);

  // Loading states
  const [loadingPlaceOrder, setLoadingPlaceOrder] = useState(false);
  const [loadingQuickPay, setLoadingQuickPay] = useState(false);
  const [activeTabletab, setactiveTableTab] = useState(0);
  const [loading, setLoading] = useState(false);

  // Print states
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const componentRef = useRef(null);
  const printComponentRef = useRef();

  // Derived data
  const distinctCategories = [
    ...new Set(foodCategory.map((item) => item.foodcategory.foodcategoryname)),
  ];

  // ============= FILTERED DATA =============
  const filteredWaiters = waiter.filter((wait) =>
    wait.firstname.toLowerCase().includes(searchWaiter.toLowerCase()) ||
    wait.lastname.toLowerCase().includes(searchWaiter.toLowerCase())
  );

  const filteredTables = table.filter((tables) =>
    tables.tablename.toLowerCase().includes(searchTable.toLowerCase())
  );

  const filteredCustomers = customers.filter((customer) =>
    customer.customername.toLowerCase().includes(searchCustomer.toLowerCase())
  );

  const filteredDelivery = delivery.filter((delivery) =>
    delivery.firstname.toLowerCase().includes(searchDeliveryPerson.toLowerCase()) ||
    delivery.lastname.toLowerCase().includes(searchDeliveryPerson.toLowerCase())
  );

  // ============= EFFECTS =============
  useEffect(() => {
    const storeid = localStorage.getItem("_id");
    const storetoken = localStorage.getItem('shifttoken');
    const storeaccess = localStorage.getItem('shiftacess');

    setuserid(storeid);
    setShiftstoken(storetoken);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
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

  // Fetch initial data
  useEffect(() => {
    axios
      .get(`${apiConfig.baseURL}/api/pos/posWaiter`)
      .then((response) => {
        setWaiter(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get(`${apiConfig.baseURL}/api/pos/posDelivery`)
      .then((response) => {
        setDelivery(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get(`${apiConfig.baseURL}/api/pos/tableorder`)
      .then((response) => {
        setTable(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    fetchCustomers();

    axios
      .get(`${apiConfig.baseURL}/api/pos/posfood`)
      .then((response) => {
        setFoodcategory(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [refresh]);

  // Calculate totals when cart changes
  useEffect(() => {
    let newTotalAmount = 0;
    let newVatAmount = 0;

    cart.forEach((item) => {
      const quantity = Number(item.quantity) || 0;
      const price = Number(item.salesprice) || 0;
      const vatPercentage = Number(item.vat?.percentage) || 5;

      const itemSubtotal = quantity * price;
      newTotalAmount += itemSubtotal;

      if (vatPercentage > 0) {
        const itemVat = itemSubtotal * (vatPercentage / 100);
        newVatAmount += itemVat;
      }
    });

    setTotalAmount((newTotalAmount - newVatAmount).toFixed(2));
    setTotalVat(newVatAmount.toFixed(2));
    setGrandTotal((newTotalAmount).toFixed(2));
  }, [cart]);

  useEffect(() => {
    if (orderData) {
      setShowPrintModal(true);
    }
  }, [orderData]);

  // ============= API CALLS =============
  const fetchCustomers = () => {
    axios
      .get(`${apiConfig.baseURL}/api/pos/posCustomer`)
      .then((response) => {
        setCustomers(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // ============= THERMAL PRINT FUNCTION =============
  const handleThermalPrint = () => {
    if (componentRef.current) {
      const printContent = componentRef.current.innerHTML;
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Receipt</title>
            <meta charset="UTF-8">
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              @page {
                size: 58mm auto;
                margin: 0mm;
              }
              body {
                margin: 0;
                padding: 0;
                font-family: 'Courier New', 'Fira Code', monospace;
                background: white;
                width: 58mm;
              }
              @media print {
                body {
                  margin: 0;
                  padding: 0;
                  width: 58mm;
                }
              }
            </style>
          </head>
          <body>
            ${printContent}
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  // ============= HANDLERS =============
  const handleQuickSalesSelect = () => {
    setOptions('Quick Sales');
    setOrderFlow({ step: 'foodmenu', selectedOption: 'Quick Sales' });
    setEnableFoodmenu(true);
    setShowFoodMenuTab(true);

    setTimeout(() => {
      const foodMenuTab = document.querySelector('a[href="#foodmenu"]');
      if (foodMenuTab) {
        foodMenuTab.click();
      }
    }, 100);
  };

  const handleVehicleDetailsChange = (e) => {
    const { name, value } = e.target;
    setVehicleDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVehicleSubmit = (e) => {
    e.preventDefault();
    if (!vehicleDetails.carName.trim() || !vehicleDetails.carNumber.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Information',
        text: 'Please enter both car name and car number',
      });
      return;
    }
    setOrderFlow({ step: 'waiter', selectedOption: 'Carhop' });
    setShowVehicleTab(false);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchWaiter = (e) => {
    setSearchWaiter(e.target.value);
  };

  const handleSearchTable = (e) => {
    setSearchTable(e.target.value);
  };

  const handleSearchCustomer = (e) => {
    setSearchCustomer(e.target.value);
  };

  const handleSearchDelivery = (e) => {
    setSearchDeliveryPerson(e.target.value);
  };

  const handleClearClick = () => {
    setSelectWaiter("");
    setSelectCustomer("");
    setSelectDelivery("");
    setSelectTable("");
    setOptions("");
    setEnableDinein(false);
    setShowCustomerTab(false);
    setShowFoodMenuTab(false);
    setShowDeliveryTab(false);
    setCart([]);
    setVehicleDetails({ carName: '', carNumber: '' });
    setOrderFlow({
      step: 'options',
      selectedOption: null
    });
  };

  const handleOptionSelect = (option) => {
    setOptions(option);
    setOrderFlow({ step: 'next', selectedOption: option });

    switch(option) {
      case 'Dine In':
        setEnableDinein(true);
        setOrderFlow({ step: 'table', selectedOption: option });
        break;
      case 'Take Away':
        setOrderFlow({ step: 'waiter', selectedOption: option });
        break;
      case 'Delivery':
        setShowCustomerTab(true);
        setOrderFlow({ step: 'customer', selectedOption: option });
        break;
      case 'Online':
        setOrderFlow({ step: 'waiter', selectedOption: option });
        break;
      case 'Carhop':
        setOrderFlow({ step: 'vehicle', selectedOption: option });
        setShowVehicleTab(true);
        break;
      default:
        break;
    }
  };

  const handleWaiter = (details) => {
    setSelectWaiter(details);

    if (options === 'Carhop') {
      setOrderFlow({ step: 'foodmenu', selectedOption: options, vehicle: vehicleDetails });
    } else {
      setOrderFlow({ step: 'foodmenu', selectedOption: options });
    }

    setEnableFoodmenu(true);
    setShowFoodMenuTab(true);

    setTimeout(() => {
      const foodMenuTab = document.querySelector('a[href="#foodmenu"]');
      if (foodMenuTab) {
        foodMenuTab.click();
      }
    }, 100);
  };

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
      setOrderFlow({ step: 'waiter', selectedOption: 'Dine In' });
    }
  };

  const handleCustomerSelect = (customer) => {
    setSelectCustomer(customer);
    setOrderFlow({ step: 'delivery', selectedOption: 'Delivery' });
    setShowDeliveryTab(true);
  };

  const handleDeliveryPersonSelect = (deliveryPerson) => {
    setSelectDelivery(deliveryPerson);
    setOrderFlow({ step: 'foodmenu', selectedOption: 'Delivery' });
    setEnableFoodmenu(true);
    setShowFoodMenuTab(true);

    setTimeout(() => {
      const foodMenuTab = document.querySelector('a[href="#foodmenu"]');
      if (foodMenuTab) {
        foodMenuTab.click();
      }
    }, 100);
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

    const syntheticEvent = {
      target: {
        name: 'numberofperson',
        value: newValue.toString()
      }
    };

    handleNumberofPersonChange(syntheticEvent, tableId);
  };

  const handleNumberofPersonChange = (e, tableId) => {
    const value = e.target.value;
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

  const addProductToCart = async (menu) => {
    let findProductInCart = cart.find((i) => {
      return i._id === menu._id;
    });
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
        }
      });
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

  const handleIncrement = (prod) => {
    const { _id, salesprice } = prod;
    let addQuantity = cart.map((item) => {
      if (item["_id"] == prod["_id"]) {
        item.quantity = item.quantity + 1;
        return item;
      }
      return item;
    });
    setCart(addQuantity);
  };

  const handleDecrement = (prod) => {
    const { _id, salesprice } = prod;
    let addQuantity = cart.map((item) => {
      if (item["_id"] == _id) {
        item.quantity = item.quantity > 1 ? item.quantity - 1 : 1;
        return item;
      }
      return item;
    });
    setCart(addQuantity);
  };

  const handleTabsClick = (index) => {
    setActiveTab(index);
  };

  const handlePlaceorder = async (event) => {
    event.preventDefault();

    if (options === 'Quick Sales') {
      if (cart.length < 1) {
        Swal.fire({
          icon: 'error',
          title: 'Cart is empty',
          text: 'Please add items to your cart before placing an order.',
        });
        return;
      }
    } else if (options === 'Delivery') {
      if (!selectCustomer) {
        Swal.fire({
          icon: 'error',
          title: 'Customer is Empty',
          text: 'Please select a customer before placing an order.',
        });
        return;
      }
      if (!selectDelivery) {
        Swal.fire({
          icon: 'error',
          title: 'Delivery Person is Empty',
          text: 'Please select a delivery person before placing an order.',
        });
        return;
      }
      if (cart.length < 1) {
        Swal.fire({
          icon: 'error',
          title: 'Cart is empty',
          text: 'Please add items to your cart before placing an order.',
        });
        return;
      }
    } else if (options === 'Dine In') {
      if (!selectTable) {
        Swal.fire({
          icon: 'error',
          title: 'Table is Empty',
          text: 'Please select a table before placing an order.',
        });
        return;
      }
      if (!selectWaiter) {
        Swal.fire({
          icon: 'error',
          title: 'Waiter is Empty',
          text: 'Please select a waiter before placing an order.',
        });
        return;
      }
      if (cart.length < 1) {
        Swal.fire({
          icon: 'error',
          title: 'Cart is empty',
          text: 'Please add items to your cart before placing an order.',
        });
        return;
      }
    } else if (options === 'Carhop') {
      if (!vehicleDetails.carName || !vehicleDetails.carNumber) {
        Swal.fire({
          icon: 'error',
          title: 'Vehicle Details Missing',
          text: 'Please enter vehicle details before placing an order.',
        });
        return;
      }
      if (!selectWaiter) {
        Swal.fire({
          icon: 'error',
          title: 'Waiter is Empty',
          text: 'Please select a waiter before placing an order.',
        });
        return;
      }
      if (cart.length < 1) {
        Swal.fire({
          icon: 'error',
          title: 'Cart is empty',
          text: 'Please add items to your cart before placing an order.',
        });
        return;
      }
    } else {
      if (!selectWaiter) {
        Swal.fire({
          icon: 'error',
          title: 'Waiter is Empty',
          text: 'Please select a waiter before placing an order.',
        });
        return;
      }
      if (cart.length < 1) {
        Swal.fire({
          icon: 'error',
          title: 'Cart is empty',
          text: 'Please add items to your cart before placing an order.',
        });
        return;
      }
    }

    setLoadingPlaceOrder(true);

    try {
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

      if (options === 'Carhop' && vehicleDetails.carName && vehicleDetails.carNumber) {
        posData.append('vehicleName', vehicleDetails.carName);
        posData.append('vehicleNumber', vehicleDetails.carNumber);
      }

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

      Swal.fire({
        title: 'Order Placed Successfully!',
        text: 'Do you want to print the receipt?',
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Yes, print receipt',
        cancelButtonText: 'No, continue',
        showCloseButton: true,
        focusConfirm: false,
        allowOutsideClick: false
      }).then((result) => {
        if (result.isConfirmed) {
          setOrderData(response.data);
          setShowPrintModal(true);
          handleClearClick();
        } else {
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
      setLoadingPlaceOrder(false);
    }
  };

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
        vehicle: options === 'Carhop' ? vehicleDetails : null,
      });

      var posData = new FormData();
      if (selectCustomer && selectCustomer._id) {
        posData.append("customers", selectCustomer._id);
      }
      if (selectDelivery && selectDelivery._id) {
        posData.append("delivery", selectDelivery._id);
      }
      posData.append("options", options);
      posData.append("grandTotal", grandTotal);

      if (options === 'Carhop' && vehicleDetails.carName && vehicleDetails.carNumber) {
        posData.append('vehicleName', vehicleDetails.carName);
        posData.append('vehicleNumber', vehicleDetails.carNumber);
      }

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

    if (options === 'Carhop' && vehicleDetails.carName && vehicleDetails.carNumber) {
      posData.append('vehicleName', vehicleDetails.carName);
      posData.append('vehicleNumber', vehicleDetails.carNumber);
    }

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
        Swal.fire({
          title: 'Quick Pay Successful!',
          text: 'Do you want to print the receipt?',
          icon: 'success',
          showCancelButton: true,
          confirmButtonText: 'Yes, print receipt',
          cancelButtonText: 'No, continue',
          showCloseButton: true,
          focusConfirm: false,
          allowOutsideClick: false
        }).then((result) => {
          if (result.isConfirmed) {
            const orderData = {
              ordernumber: res.data.newEntry.ordernumber,
              billnumber: res.data.updatedDocuments.billnumber,
              cart: res.data.newEntry.cart,
              total: res.data.newEntry.total,
              vatAmount: res.data.newEntry.vatAmount,
              grandTotal: res.data.newEntry.grandTotal,
              date: res.data.newEntry.date,
              options: options,
              vehicle: options === 'Carhop' ? vehicleDetails : null
            };
            setOrderData(orderData);
            setShowPrintModal(true);
            handleClearClick();
          } else {
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

  const handleClosingBalance = () => {
    setModalClosingBalance(true);
  };

  const handleCancelOrders = () => {
    setModalCancelOrders(true);
  };

  const handleDeliverySession = () => {
    setModalDeliveryReport(true);
  };

  const handleTodayorderReport = () => {
    setModalTodayOrderReport(true);
  };

  const handleClosePrint = () => {
    setShowPrintModal(false);
  };

  // ============= RENDER FUNCTIONS =============
  const getCurrentTabContent = () => {
    if (!options) {
      return (
        <div className="tab-pane active" id="options" role="tabpanel">
          <div className="options-container">
            <div className="row">
              <div className="col-custom-5 mb-3">
                <div
                  className="option-box"
                  onClick={() => handleOptionSelect('Dine In')}
                >
                  <img src="assets/images/dinein.png" className="foodiconimg" />
                  <h5>Dine In</h5>
                </div>
              </div>
              <div className="col-custom-5 mb-3">
                <div
                  className="option-box"
                  onClick={() => handleOptionSelect('Take Away')}
                >
                  <img src="assets/images/takeway.png" className="foodiconimg" />
                  <h5>Take Away</h5>
                </div>
              </div>
              <div className="col-custom-5 mb-3">
                <div
                  className="option-box"
                  onClick={() => handleOptionSelect('Delivery')}
                >
                  <img src="assets/images/delivery.png" className="foodiconimg" />
                  <h5>Delivery</h5>
                </div>
              </div>
              <div className="col-custom-5 mb-3">
                <div
                  className="option-box"
                  onClick={() => handleOptionSelect('Online')}
                >
                  <img src="assets/images/online.png" className="foodiconimg" />
                  <h5>Online</h5>
                </div>
              </div>
              <div className="col-custom-5 mb-3">
                <div
                  className="option-box"
                  onClick={() => handleOptionSelect('Carhop')}
                >
                  <img src="assets/images/carhop.png" className="foodiconimg" />
                  <h5>Carhop</h5>
                </div>
              </div>
              <div className="col-custom-5 mb-3">
                <div
                  className="option-box"
                  onClick={handleQuickSalesSelect}
                  style={{ backgroundColor: '#f0f9ff', borderColor: '#0ea5e9' }}
                >
                  <img src="assets/images/quick-sales.png" className="foodiconimg" />
                  <h5>Quick Sales</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (orderFlow.step === 'vehicle' && options === 'Carhop') {
      return (
        <div className="tab-pane active" id="vehicle" role="tabpanel">
          <div className="vehicle-details-container p-4">
            <h5 className="mb-4">Enter Vehicle Details</h5>
            <form onSubmit={handleVehicleSubmit}>
              <div className="form-group mb-3">
                <label htmlFor="carName" className="form-label">Car Name/Model</label>
                <input
                  type="text"
                  className="form-control"
                  id="carName"
                  name="carName"
                  value={vehicleDetails.carName}
                  onChange={handleVehicleDetailsChange}
                  placeholder=""
                  autoComplete="off"
                />
              </div>

              <div className="form-group mb-4">
                <label htmlFor="carNumber" className="form-label">Car Number/Plate</label>
                <input
                  type="text"
                  className="form-control"
                  id="carNumber"
                  name="carNumber"
                  value={vehicleDetails.carNumber}
                  onChange={handleVehicleDetailsChange}
                  placeholder=""
                  autoComplete="off"
                />
              </div>

              <div className="d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setVehicleDetails({ carName: '', carNumber: '' });
                    setOrderFlow({ step: 'options', selectedOption: null });
                    setOptions('');
                  }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Continue to Waiter Selection
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    }

    if (orderFlow.step === 'table' && options === 'Dine In') {
      return (
        <div className="tab-pane active" id="table" role="tabpanel">
          {!selectTable ? (
            <>
              <h5 className="mb-3">Select Table for Dine In</h5>
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
                  <div key={index} className="col-sm-6 col-md-4 col-lg-3">
                    <div className="card">
                      <div className="menu-box selectable">
                        <h6>{tables.tablename}</h6>
                        <p>Seat Capacity: {tables.seatcapacity}</p>
                        <p>Available Seats: {tables.availableSeat}</p>
                      </div>
                      <div className="card-footer">
                        <div className="flex-row-container">
                          <div className="flex-row-item mr-1">
                            <div className="input-group input-group-sm">
                              <div className="input-group-prepend">
                                <button
                                  className="btn btn-outline-secondary btn-sm"
                                  type="button"
                                  style={{ marginLeft: "-10px" }}
                                  onClick={() => handlePersonCountChange(tables._id, 'decrement')}
                                  disabled={
                                    tables.availableSeat === 0 ||
                                    parseInt(numberofperson[tables._id] || 0) <= 1
                                  }
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
                                style={{ maxWidth: '90px' }}
                              />
                              <div className="input-group-append">
                                <button
                                  className="btn btn-outline-secondary btn-sm"
                                  type="button"
                                  onClick={() => handlePersonCountChange(tables._id, 'increment')}
                                  disabled={
                                    tables.availableSeat === 0 ||
                                    parseInt(numberofperson[tables._id] || 0) >=
                                    Math.min(tables.seatcapacity, tables.availableSeat)
                                  }
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="flex-row-item">
                            <a
                              className={`btn btn-outline-primary tablebtn btn-sm ${
                                !isValidNumber(tables._id) || tables.availableSeat === 0
                                  ? "disabled"
                                  : ""
                              }`}
                              onClick={(e) => {
                                e.preventDefault();
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
            </>
          ) : (
            <div className="selected-table-info">
              <p>Selected Table: {selectTable.tablename} | Number of Persons: {numberofperson[selectTable._id]}</p>
            </div>
          )}
        </div>
      );
    }

    if (orderFlow.step === 'waiter' && options !== 'Delivery' && options !== 'Quick Sales') {
      return (
        <div className="tab-pane active" id="waiter" role="tabpanel">
          <h5 className="mb-3">Select Waiter</h5>
          <input
            type="text"
            placeholder="Search waiters..."
            value={searchWaiter}
            className="form-control"
            onChange={handleSearchWaiter}
          />
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
        </div>
      );
    }

    if (orderFlow.step === 'customer' && options === 'Delivery') {
      return (
        <div className="tab-pane active" id="customer" role="tabpanel">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Select Customer</h5>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setModalNewCustomer(true)}
            >
              <FaPlus className="mr-1" size={12} />
              New Customer
            </button>
          </div>

          <input
            type="text"
            placeholder="Search Customers..."
            value={searchCustomer}
            className="form-control mb-3"
            onChange={handleSearchCustomer}
          />

          {filteredCustomers.length === 0 ? (
            <div className="text-center p-4 border rounded bg-light">
              <p className="mb-2">No customers found</p>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => setModalNewCustomer(true)}
              >
                <FaPlus className="mr-1" size={12} />
                Add New Customer
              </button>
            </div>
          ) : (
            <div className="row">
              {filteredCustomers.map((customer, index) => (
                <div className="col-sm-6 col-md-4 col-lg-3" key={index}>
                  <div
                    className="menu-box"
                    onClick={() => handleCustomerSelect(customer)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="text-center p-3">
                      <FaUserAlt className="mb-2" size={24} />
                      <h6 className="mb-1 customername">{customer.customername}</h6>
                      <small className="text-muted d-block">
                        {customer.customermobile}
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (orderFlow.step === 'delivery' && options === 'Delivery') {
      return (
        <div className="tab-pane active" id="delivery" role="tabpanel">
          <h5 className="mb-3">Select Delivery Person</h5>
          <input
            type="text"
            placeholder="Search Delivery..."
            value={searchDeliveryPerson}
            className="form-control"
            onChange={handleSearchDelivery}
          />
          <br />
          <div className="row">
            {filteredDelivery.map((deliveryPerson, index) => (
              <div className="col-sm-6 col-md-4 col-lg-3" key={index}>
                <div
                  className="menu-box"
                  onClick={() => handleDeliveryPersonSelect(deliveryPerson)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="text-center p-3">
                    <MdDeliveryDining size={24} className="mb-2" />
                    <h6 className="mb-1">
                      {deliveryPerson.firstname} {deliveryPerson.lastname}
                    </h6>
                    {deliveryPerson.phone && (
                      <small className="text-muted d-block">{deliveryPerson.phone}</small>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (orderFlow.step === 'foodmenu' && showFoodMenuTab) {
      return (
        <div className="tab-pane active" id="foodmenu" role="tabpanel">
          {options === 'Carhop' && vehicleDetails.carName && (
            <div className="vehicle-info alert alert-info mb-3 p-2">
              <FaCar className="mr-2" />
              <strong>Vehicle:</strong> {vehicleDetails.carName} - {vehicleDetails.carNumber}
            </div>
          )}
          {options === 'Delivery' && selectCustomer && (
            <div className="customer-info alert alert-primary mb-3 p-2">
              <FaUserAlt className="mr-2" />
              <strong>Customer:</strong> {selectCustomer.customername}
              {selectCustomer.customermobile && ` (${selectCustomer.customermobile})`}
              {selectDelivery && (
                <>
                  <br />
                  <MdDeliveryDining className="mr-2" />
                  <strong>Delivery Boy:</strong> {selectDelivery.firstname} {selectDelivery.lastname}
                </>
              )}
            </div>
          )}
          {options === 'Dine In' && selectTable && (
            <div className="table-info alert alert-success mb-3 p-2">
              <SiTablecheck className="mr-2" />
              <strong>Table:</strong> {selectTable.tablename} | Persons: {numberofperson[selectTable._id]}
              {selectWaiter && (
                <> | <TbChefHat className="mr-1" /> Waiter: {selectWaiter.firstname} {selectWaiter.lastname}</>
              )}
            </div>
          )}
          {(options === 'Take Away' || options === 'Online') && selectWaiter && (
            <div className="waiter-info alert alert-warning mb-3 p-2">
              <TbChefHat className="mr-2" />
              <strong>Order Type:</strong> {options} | Waiter: {selectWaiter.firstname} {selectWaiter.lastname}
            </div>
          )}
          {options === 'Quick Sales' && (
            <div className="quick-sales-info alert alert-info mb-3 p-2">
              <IoFastFoodSharp className="mr-2" />
              <strong>Quick Sales Order</strong> - No waiter assignment required
            </div>
          )}

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
            <div className="row" style={{ margin: 0 }}>
              <div className="col-md-3" style={{ paddingRight: 0 }}>
                <div
                  className="nav flex-column nav-pills shdw-lft"
                  id="v-tabs"
                  role="tablist"
                  aria-orientation="vertical"
                  style={{
                    height: '500px',
                    maxHeight: '500px',
                    minHeight: '500px',
                    overflowY: 'scroll',
                    overflowX: 'hidden',
                    padding: '10px 5px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px 0 0 8px',
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
                          width: '100%',
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
              <div className="col-md-9" style={{ paddingLeft: 0 }}>
                <div
                  className="tab-content p-3"
                  id="v-tabContents"
                  style={{
                    height: '500px',
                    maxHeight: '500px',
                    minHeight: '500px',
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
                                  <img src="assets/images/foodmenu.jpg" className="foodimg" alt={menu.foodmenuname} />
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
      );
    }

    return null;
  };

  // ============= MAIN RENDER =============
  return (
    <div className="pos-neworder-container">
      <div className="pos-flex-container">
        {/* Cart Column */}
        <div className="pos-cart-column">
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
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cart
                  ? cart.map((cartProduct, key) => (
                    <tr key={key}>
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
                              marginTop: '5px'
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
                              marginTop: '-2px',
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
                              marginTop: '5px'
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
                            marginTop: '5px'
                          }}
                        >
                          <FiX size={14} />
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
              <tbody>
                <tr>
                  <td>Total</td>
                  <th className="text-right">{totalAmount}</th>
                </tr>
                <tr>
                  <td>Discount</td>
                  <th className="text-right"></th>
                </tr>
                <tr>
                  <td>VAT</td>
                  <th className="text-right">{vatAmount}</th>
                </tr>
                <tr>
                  <th>Grand Total</th>
                  <th className="text-right">{grandTotal}</th>
                </tr>
              </tbody>
            </table>
          </div>

          {options === 'Carhop' && vehicleDetails.carName && (
            <div className="vehicle-info alert alert-info mt-2 p-2">
              <FaCar className="mr-2" />
              <strong>Vehicle:</strong> {vehicleDetails.carName} - {vehicleDetails.carNumber}
            </div>
          )}

          {options === 'Delivery' && selectCustomer && (
            <div className="customer-info alert alert-primary mt-2 p-2">
              <FaUserAlt className="mr-2" />
              <strong>{selectCustomer.customername}</strong>
              {selectDelivery && (
                <> | <MdDeliveryDining /> {selectDelivery.firstname}</>
              )}
            </div>
          )}

          <div className="pos-action-wrapper">
            <div className="pos-row">
              <button className="pos-btns cancel-btn">Cancel</button>
              <button onClick={handleHold} className="pos-btns hold-btn">Hold</button>
              <button
                onClick={handleQuickPay}
                className="pos-btns quickpay-btn"
                disabled={loadingQuickPay}
              >
                {loadingQuickPay ? "Processing..." : "Quick Pay ›"}
              </button>
            </div>
            <div className="pos-row">
              <button className="pos-btns ebill-btn">E-Bill</button>
              <button
                onClick={handlePlaceorder}
                className="pos-btns placeorder-btn"
                disabled={loadingPlaceOrder}
              >
                {loadingPlaceOrder ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
          <div className="datetime-display border-bottom d-flex justify-content-between align-items-center">
            <div className="current-time">
              <FaClock className="mr-2" />
              <span>{currentDateTime.toLocaleTimeString()}</span>
            </div>

            <div className="current-date">
              <FaCalendarAlt className="mr-2" />
              <span>{currentDateTime.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
          </div>
        </div>

        {/* Menu Buttons Column */}
        <div className="pos-menu-column">
          <div className="pos-menu">
            <button className="pos-btn active" onClick={handleClearClick} title="Clear all items">
              <FaHistory className="pos-icon" />
              Clear
            </button>

            <button
              className="pos-btn"
              onClick={() => setModalNewCustomer(true)}
              title="Add new customer"
            >
              <FaUserAlt className="pos-icon" />
              <span>Customer Add</span>
            </button>

            <button className="pos-btn" onClick={handleTabClick} title="View Kitchen Order Tickets">
              <TbToolsKitchen3 className="pos-icon" />
              KOT
            </button>

            <button className="pos-btn" onClick={handleHoldClick} title="Hold current order">
              <BsFillPauseCircleFill className="pos-icon" />
              <span>Hold Order</span>
            </button>

            <button className="pos-btn" onClick={handleDropoutClick} title="Cash drop or cash out">
              <FaHandHoldingDroplet className="pos-icon" />
              <span>Cash Drop/Out</span>
            </button>

            <button className="pos-btn" title="Open cash drawer">
              <RiArchiveDrawerLine className="pos-icon" />
              <span>Open Cash Drawer</span>
            </button>

            <button className="pos-btn" onClick={handleClosingBalance} title="View closing balance">
              <LiaFileInvoiceSolid className="pos-icon" />
              <span>Closing Balance</span>
            </button>

            <button className="pos-btn" onClick={handleInvoiceClick} title="View invoice report">
              <LiaFileInvoiceSolid className="pos-icon" />
              <span>Invoice Report</span>
            </button>

            <button className="pos-btn" onClick={handleCancelOrders} title="Cancel orders">
              <LiaFileInvoiceSolid className="pos-icon" />
              <span>Cancel Orders</span>
            </button>

            <button className="pos-btn" onClick={handleDeliverySession} title="Delivery settlement">
              <LiaFileInvoiceSolid className="pos-icon" />
              <span>Delivery Settlement</span>
            </button>

            <button className="pos-btn" onClick={handleTodayorderReport} title="View settlement report">
              <LiaFileInvoiceSolid className="pos-icon" />
              <span>Settlement Report</span>
            </button>
          </div>
        </div>

        {/* Main Content Column */}
        <div className="pos-content-column">
          <div className="poscards">
            <div className="tbl-h">
            </div>

            <div className="tab-content" style={{ overflowY: 'scroll' }}>
              {getCurrentTabContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PosNeworderKotModal
        isModalOpen={isModalOpen}
        setModalOpen={setModalOpen}
      />

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
        isModalTodayOrderReport={isModalTodayOrderReport}
        setModalTodayOrderReport={setModalTodayOrderReport}
      />

      <PosNewCustomerModal
        isModalOpen={isModalNewCustomer}
        setModalOpen={setModalNewCustomer}
        onCustomerAdded={fetchCustomers}
      />

      {/* Thermal Printer Print Modal */}
      {showPrintModal && (
        <>
          <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999 }} tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-sm" role="document" style={{ maxWidth: '320px', marginTop: '50px' }}>
              <div className="modal-content" style={{ borderRadius: '8px' }}>
                <div className="modal-header bg-primary text-white" style={{ padding: '10px 15px' }}>
                  <h5 className="modal-title" style={{ fontSize: '16px' }}>
                    <i className="fas fa-print mr-2"></i>
                    Print Preview
                  </h5>
                  <button
                    type="button"
                    className="close text-white"
                    onClick={() => {
                      setShowPrintModal(false);
                      handleClearClick();
                    }}
                    style={{ opacity: 1 }}
                  >
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body p-0" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                  <ThermalPrintComponent
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
                </div>
                <div className="modal-footer" style={{ padding: '10px', justifyContent: 'space-between' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setShowPrintModal(false);
                      handleClearClick();
                    }}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={handleThermalPrint}
                  >
                    <i className="fas fa-print mr-1"></i> Print
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" style={{ zIndex: 9998 }}></div>
        </>
      )}
    </div>
  );
};

export default PosNewOrder;