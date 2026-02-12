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
import Swal from 'sweetalert2';
import PosNewOrder from "./posNeworder";
import PosHoldingOrder from "./posHoldingorder";
import PosTodayOrder from "./posTodayorder";
import { FaShoppingCart, FaHistory, FaPause,FaRegCalendarAlt    } from 'react-icons/fa';
import { MdBookOnline } from "react-icons/md";
import { IoMdToday } from "react-icons/io";
import PosOnlineOrder from "./posOnlneorder";
const OnlineOrder =() =>{




      const [activeTab, setActiveTab] = useState('neworder');

      const handleTabClick = (tabName) => {
        setActiveTab(tabName);
      };
    return (

            <div className="container-fluid">
                    <div className="division">
                    <div className="row">
                        <div className="col-md-2">
                        <div className="w-100 d-inline-block text-center pb-4"> <Link to="/dashboard" ><img src="assets/images/pos/burps.png" className="img-fluid" /></Link> </div>
                        </div>
                        <div className="col-md-10 main-content">
            <div className="menumain">
              <ul className="nav nav-tabs nav-justified" role="tablist">
                <li className="nav-item ">

                  <Link className="nav-link "  data-toggle="tab"
                   to="/pos"
                    role="tab"
                    aria-controls="neworder" ><FaShoppingCart className="mr-1" /> New Order</Link>
                </li>
                <li className="nav-item">


                    <Link className="nav-link "  data-toggle="tab"
                   to="/runningorder"
                    role="tab"
                    aria-controls="neworder" ><FaHistory className="mr-2" />Running Order</Link>
                </li>


                <li className="nav-item">

                    <Link className="nav-link active"  data-toggle="tab"
                   to="/onlineorder"
                    role="tab"
                    aria-controls="neworder" ><MdBookOnline  className="mr-1" /> Online Order</Link>
                </li>
                <li className="nav-item">
                {/* <a
                    className={`nav-link ${activeTab === 'deliverysession' ? 'active' : ''}`}
                    data-toggle="tab"
                    href="#deliverysession"
                    role="tab"
                    aria-controls="deliverysession"
                    aria-selected={activeTab === 'deliverysession'}
                    onClick={() => setActiveTab('deliverysession')}
                  >
                  <FaRegCalendarAlt className="mr-2" />  Delivery Session
                  </a> */}
                   <Link className="nav-link "  data-toggle="tab"
                   to="/deliverysession"
                    role="tab"
                    aria-controls="neworder" >  <FaRegCalendarAlt className="mr-2" />Mess Management</Link>
                </li>
                <li className="nav-item">
                {/* <a
                    className={`nav-link ${activeTab === 'todayorder' ? 'active' : ''}`}
                    data-toggle="tab"
                    href="#todayorder"
                    role="tab"
                    aria-controls="todayorder"
                    aria-selected={activeTab === 'todayorder'}
                    onClick={() => setActiveTab('todayorder')}
                  >
                  <IoMdToday  className="mr-2" /> settlment Report
                  </a> */}
                   <Link className="nav-link "  data-toggle="tab"
                   to="/settlementreport"
                    role="tab"
                    aria-controls="neworder" >  <IoMdToday  className="mr-2" /> Settlement Report</Link>
                </li>
                {/* <li className="nav-item">
                <a
                    className={`nav-link ${activeTab === 'cashdrop' ? 'active' : ''}`}
                    data-toggle="tab"
                    href="#cashdrop"
                    role="tab"
                    aria-controls="cashdrop"
                    aria-selected={activeTab === 'cashdrop'}
                    onClick={() => setActiveTab('cashdrop')}
                  >
                  <FaRegCalendarAlt className="mr-2" /> Cash Drop/Out
                  </a>
                </li>

                <li className="nav-item">
                <a
                    className={`nav-link ${activeTab === 'opendrawer' ? 'active' : ''}`}
                    data-toggle="tab"
                    href="#opendrawer"
                    role="tab"
                    aria-controls="opendrawer"
                    aria-selected={activeTab === 'opendrawer'}
                    onClick={() => setActiveTab('opendrawer')}
                  >
                  <FaRegCalendarAlt className="mr-2" />Open Drawer
                  </a>
                </li>
                <li className="nav-item">
                <a
                    className={`nav-link ${activeTab === 'invoicereport' ? 'active' : ''}`}
                    data-toggle="tab"
                    href="#invoicereport"
                    role="tab"
                    aria-controls="invoicereport"
                    aria-selected={activeTab === 'invoicereport'}
                    onClick={() => setActiveTab('invoicereport')}
                  >
                  <FaRegCalendarAlt className="mr-2" /> Invoice Report
                  </a>
                </li> */}

              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="tab-content mt-3">
        <div className={`tab-pane ${activeTab === 'neworder' ? 'active' : ''}`} id="neworder" role="tabpanel" aria-labelledby="neworder-tab">
            <PosOnlineOrder  />
          </div>

        </div>
      </div>
    </div>
  );
};

export default OnlineOrder;