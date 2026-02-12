import React from "react";
import { useState,useEffect } from "react";


import { redirect, useNavigate,Link } from "react-router-dom";

import PosNewOrder from "./posNeworder";

import { FaShoppingCart, FaHistory, FaPause,FaRegCalendarAlt    } from 'react-icons/fa';
import { MdBookOnline } from "react-icons/md";
import { IoMdToday } from "react-icons/io";
const Pos =() =>{




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

                <Link
                    className={`nav-link ${activeTab === 'neworder' ? 'active' : ''}`}
                    to="/pos"
                    role="tab"
                    aria-controls="neworder"
                    onClick={() => handleTabClick('neworder')}
                  ><FaShoppingCart className="mr-1" /> New Order</Link>
                </li>
                <li className="nav-item">


                    <Link className="nav-link "  data-toggle="tab"
                   to="/runningorder"
                    role="tab"
                    aria-controls="neworder" ><FaHistory className="mr-2" />Running Order</Link>
                </li>


                <li className="nav-item">

                    <Link className="nav-link "  data-toggle="tab"
                   to="/onlineorder"
                    role="tab"
                    aria-controls="neworder" ><MdBookOnline  className="mr-1" /> Online Order</Link>
                </li>
                <li className="nav-item">

                   <Link className="nav-link "  data-toggle="tab"
                   to="/deliverysession"
                    role="tab"
                    aria-controls="neworder" >  <FaRegCalendarAlt className="mr-2" /> Mess Management</Link>
                </li>
                <li className="nav-item">

                   <Link className="nav-link "  data-toggle="tab"
                   to="/settlementreport"
                    role="tab"
                    aria-controls="neworder" >  <IoMdToday  className="mr-2" /> Settlment Report</Link>
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
            <PosNewOrder  />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Pos;