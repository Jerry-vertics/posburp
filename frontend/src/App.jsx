
import React, { Suspense, lazy,useState,useEffect   } from 'react';
import { BrowserRouter,Routes,Route} from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css'
import Swal from 'sweetalert2';
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import axios from 'axios';
import apiConfig from './Components/layouts/base_url';

const Login =lazy(() => import('./Components/userPages/login'));
const Dashboard =lazy(()=> import('./Components/Dashboard/dashboard'));
const AddCategory =lazy(() =>import('./Components/Category/AddCategory'));
const ViewCategory =lazy(() =>import('./Components/Category/ViewCategory'));
const ViewIngredientUnit =lazy(() =>import('./Components/Ingredient/unit/viewIngredientUnit'));
const AddIngredientUnit =lazy(() =>import('./Components/Ingredient/unit/AddIngredientUnit'));
const ViewIngredients =lazy(() =>import('./Components/Ingredient/ingredients/viewingredients'));
const AddIngredients =lazy(() =>import('./Components/Ingredient/ingredients/addingredients'));
const AddVat =lazy(() =>import('./Components/vat/addVat'));
const ViewVat =lazy(() =>import('./Components/vat/viewVat'));


import AddTable from './Components/table/addTable'
import ViewTable from './Components/table/viewTable'
import AddFoodCategory from './Components/Foodcategory/addFoodcategory'
import ViewFoodCategory from './Components/Foodcategory/viewFoodcategory'
import AddFoodMenu from './Components/Foodmenu/addfoodmenu'
import ViewFoodMenu from './Components/Foodmenu/viewfoodmenu'
import EditCategory from './Components/Category/EditCategory'
import Pos from './Components/Pos/Pos'
import EditFoodCategory from './Components/Foodcategory/editFoodcategory'
import EditIngredientUnit from './Components/Ingredient/unit/EditIngredientUnit'
import EditTable from './Components/table/editTable'
import EditVat from './Components/vat/editVat'
import AddWaiter from './Components/Waiter/addWaiter'
import ViewWaiter from './Components/Waiter/viewWaiter'
import EditWaiter from './Components/Waiter/editWaiter'
import ViewCustomer from './Components/Customer/viewCustomer'
import AddCustomer from './Components/Customer/addCustomer'
import EditCustomer from './Components/Customer/editCustomer'
import ViewPosOrder from './Components/Orders/viewPosorder'
import ViewPosOrderdetails from './Components/Orders/viewOrderdetails'
import ViewDelivery from './Components/Delivery/viewDelivery';
import AddDelivery from './Components/Delivery/addDelivery';
import ViewSupplier from './Components/Supplier/viewSupplier';
import AddSupplier from './Components/Supplier/addSupplier';
import Spinner from './Components/layouts/Spinner';
import ViewPurchase from './Components/Purchase/viewPurchase';
import AddPurchase from './Components/Purchase/addPurchase';
import EditPurchase from './Components/Purchase/editPurchase';
import DeliveryReport from './Components/Report/deliveryReport';
import CustomerReport from './Components/Report/customerReport';
import WaiterReport from './Components/Report/waiterReport';
import PosNewOrder from './Components/Pos/posNeworder';

import OnlineOrder from './Components/Pos/onlineOrder';
import OngoingOrder from './Components/Pos/ongoingOrder';
import SettlementReport from './Components/Pos/settlementReport';
import DeliverySession from './Components/Pos/deliverySession';
import EditIngredients from './Components/Ingredient/ingredients/editIngredients';
import EditFoodMenu from './Components/Foodmenu/editfoodmenu';
import { RequireToken,setlastNames,setfirstNames,setUserId } from './Components/routes/PrivateRoutes';
import PosEdit from './Components/Pos/posEdit';

import NavbarButton from './Components/layouts/navbarButton';
import OpenningBalance from './Components/OpenningBalance/openningbalance';

import ViewExpense from './Components/Expense/viewExpense';
import AddExpense from './Components/Expense/addExpense'
import EditExpense from './Components/Expense/editExpense';
import ViewDesignation from './Components/Designation/viewDesignation';
import AddDesignation from './Components/Designation/addDesignation';
import EditDesignation from './Components/Designation/editDesignation';
import ViewExpenseInvoice from './Components/ExpenseInvoice/viewExpenseInvoice';
import AddExpenseInvoice from './Components/ExpenseInvoice/addExpenseInvoice';
import EditExpenseInvoice from './Components/ExpenseInvoice/editExpenseInvoice';
import ImportFoodmenu from './Components/Foodmenu/importfoodmenu';
import ImportFoodCategory from './Components/Foodcategory/importFoodcategory';
import ViewUser from './Components/userPages/users';
import AddUser from './Components/userPages/addUser';
import EditUser from './Components/userPages/editUser';
import PaidOrders from './Components/Orders/viewPaidorders';
import CancelOrders from './Components/Orders/viewCancelorders';
import NotPaidorders from './Components/Orders/viewNotpaidorders';
import Forgotpassword from './Components/userPages/forgotpassword';
import EditSupplier from './Components/Supplier/editSupplier';
import AddRole from './Components/Roles/addRole';
import ViewRole from './Components/Roles/viewRole';
import EditRole from './Components/Roles/editRole';
import LoadingSpinner from './Components/layouts/loadspinner';
function App() {

  //const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const Spinner = () => {
    return <div>Loading...</div>;
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setLoading(false); // Set loading to false after a delay
    }, 2000); // Simulating a 2-second loading delay

    return () => clearTimeout(delay); // Cleanup function to clear the timeout
  }, []);

  return (

  <BrowserRouter>


  <Suspense fallback={<Spinner />}>
  {loading ? (
        <LoadingSpinner />
      ) : (
    <Routes>


                 <Route path='/' element={<Login />} />
                 <Route path='/forgotpassword' element={<Forgotpassword />}></Route>

                 <Route path='/dashboard' element={<RequireToken><Dashboard /></RequireToken>}></Route>


              <Route exact path="/dashboard" element={<Dashboard />} />

              <Route path='/addingredientfoodcategory' element={<RequireToken><AddCategory/></RequireToken>}></Route>
              <Route path='/viewingredientfoodcategory' element={<RequireToken><ViewCategory /></RequireToken>}></Route>
              <Route path='/editingrdientfoodcategory/:id' element={<RequireToken><EditCategory /></RequireToken>}></Route>

              <Route path='/viewingredientunit' element={<RequireToken><ViewIngredientUnit /></RequireToken>}></Route>
              <Route path='/addingredientunit' element={<RequireToken><AddIngredientUnit /></RequireToken>}></Route>
              <Route path='/editingredientunit/:id' element={<RequireToken><EditIngredientUnit /></RequireToken>}></Route>


              <Route path='/viewingredients' element={<RequireToken><ViewIngredients /></RequireToken>}></Route>
              <Route path='/addingredients' element={<RequireToken><AddIngredients /></RequireToken>}></Route>
              <Route path='/editingredients/:id' element={<RequireToken><EditIngredients /></RequireToken>}></Route>

              <Route path='/addVat' element={<RequireToken><AddVat /></RequireToken>}></Route>
              <Route path='/viewVat' element={<RequireToken><ViewVat /></RequireToken>}></Route>
              <Route path='/editVat/:id' element={<RequireToken><EditVat /></RequireToken>}></Route>

              <Route path='/addTable' element={<RequireToken><AddTable /></RequireToken>}></Route>
              <Route path='/viewTable' element={<RequireToken><ViewTable /></RequireToken>}></Route>
              <Route path='/editTable/:id' element={<RequireToken><EditTable /></RequireToken>} ></Route>

              <Route path='/addfoodcategory' element={<RequireToken><AddFoodCategory /></RequireToken>}></Route>
              <Route path='/editfoodcategory/:id' element={<RequireToken><EditFoodCategory /></RequireToken>}></Route>
              <Route path='/viewfoodcategory' element={<RequireToken><ViewFoodCategory /></RequireToken>}></Route>
              <Route path='/importfoodcategory' element={<RequireToken><ImportFoodCategory /></RequireToken>}></Route>

              <Route path='/addfoodmenu' element={<RequireToken><AddFoodMenu /></RequireToken>}></Route>
              <Route path='/viewfoodmenu' element={<RequireToken><ViewFoodMenu /></RequireToken>}></Route>
              <Route path='/editfoodmenu/:id' element={<RequireToken><EditFoodMenu /></RequireToken>}></Route>
              <Route path='/importfoodmenu' element={<RequireToken><ImportFoodmenu /></RequireToken>}></Route>
              <Route path='/addWaiter' element={<RequireToken><AddWaiter /></RequireToken>}></Route>
              <Route path='/viewWaiter' element={<RequireToken><ViewWaiter /></RequireToken>}></Route>
              <Route path='/editWaiter/:id' element={<RequireToken><EditWaiter /></RequireToken>}></Route>


              <Route path='/pos' element={<RequireToken><Pos /></RequireToken>}></Route>
              <Route path='/openningbalance' element={<RequireToken><OpenningBalance /></RequireToken>}></Route>

              <Route path='/posedit/:id' element={<RequireToken><PosEdit /></RequireToken>}></Route>
              <Route path='/runningorder' element={<RequireToken><OngoingOrder /></RequireToken>}></Route>
              <Route path='/onlineorder' element={<RequireToken><OnlineOrder /></RequireToken>}></Route>
              <Route path='/settlementreport' element={<RequireToken><SettlementReport /></RequireToken>}></Route>
              <Route path='/deliverysession' element={<RequireToken><DeliverySession /></RequireToken>}></Route>


              <Route path='/posorder' element={<RequireToken><ViewPosOrder /></RequireToken>}></Route>
              <Route path='/pos/neworder' element={<RequireToken><PosNewOrder /></RequireToken>}></Route>
              <Route path='/posorderdetails/:id' element={<RequireToken><ViewPosOrderdetails /></RequireToken>}></Route>
              <Route path='/paidorders' element={<RequireToken><PaidOrders /></RequireToken>}></Route>
              <Route path='/cancelorders' element={<RequireToken><CancelOrders /></RequireToken>}></Route>
              <Route path='/runningorders' element={<RequireToken><NotPaidorders /></RequireToken>}></Route>


              <Route path='/viewCustomer' element={<RequireToken><ViewCustomer /></RequireToken>}></Route>
              <Route path='/addCustomer' element={<RequireToken><AddCustomer /></RequireToken>}></Route>
              <Route path='/editCustomer/:id' element={<RequireToken><EditCustomer /></RequireToken>}></Route>


              <Route path='/viewDelivery' element={<RequireToken><ViewDelivery /></RequireToken>}></Route>
              <Route path='/addDelivery' element={<RequireToken><AddDelivery /></RequireToken>}></Route>



              <Route path='/viewSupplier' element={<RequireToken><ViewSupplier /></RequireToken>}></Route>
              <Route path='/addSupplier' element={<RequireToken><AddSupplier /></RequireToken>}></Route>
              <Route path='/editSupplier/:id' element={<RequireToken><EditSupplier /></RequireToken>}></Route>


              <Route path='/viewPurchase' element={<RequireToken><ViewPurchase /></RequireToken>}></Route>
              <Route path='/addPurchase' element={<RequireToken><AddPurchase /></RequireToken>}></Route>
              <Route path='/editPurchase/:id' element={<RequireToken><EditPurchase /></RequireToken>}></Route>

              {/* Reports */}
              <Route path='/dailveryReport' element={<RequireToken><DeliveryReport /></RequireToken>}></Route>
              <Route path='/customerReport' element={<RequireToken><CustomerReport /></RequireToken>}></Route>
              <Route path='/waiterReport' element={<RequireToken><WaiterReport /></RequireToken>}></Route>

              {/* Expense */}

              <Route path='/viewExpense' element={<RequireToken><ViewExpense /></RequireToken>}></Route>
              <Route path='/addExpense' element={<RequireToken><AddExpense /></RequireToken>}></Route>
              <Route path='/editExpense/:id' element={<RequireToken><EditExpense /></RequireToken>}></Route>


              {/* ExpenseInvoice */}
              <Route path='/viewExpenseinvoice' element={<RequireToken><ViewExpenseInvoice /></RequireToken>}></Route>
              <Route path='/addExpenseinvoice' element={<RequireToken><AddExpenseInvoice /></RequireToken>}></Route>
              <Route path='/editExpenseinvoice/:id' element={<RequireToken><EditExpenseInvoice /></RequireToken>}></Route>

              {/* Designation */}
              <Route path='/viewDesignation' element={<RequireToken><ViewDesignation /></RequireToken>}></Route>
              <Route path='/addDesignation' element={<RequireToken><AddDesignation /></RequireToken>}></Route>
              <Route path='/editDesignation/:id' element={<RequireToken><EditDesignation /></RequireToken>}></Route>


              <Route path='/viewuser' element={<RequireToken><ViewUser /></RequireToken>}></Route>
              <Route path='/adduser' element={<RequireToken><AddUser /></RequireToken>}></Route>
              <Route path='/edituser/:id' element={<RequireToken><EditUser /></RequireToken>}></Route>


              {/* Roles */}
              <Route path='/addroles' element={<RequireToken><AddRole /></RequireToken>}></Route>
              <Route path='/viewroles' element={<RequireToken><ViewRole /></RequireToken>}></Route>
              <Route path='editroles/:id' element={<RequireToken><EditRole /></RequireToken>}></Route>





    </Routes>
      )}
    </Suspense>

  </BrowserRouter>



  )
}

export default App
