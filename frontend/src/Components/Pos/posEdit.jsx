import React from "react";
import { useState,useEffect } from "react";


import {useNavigate,Link } from "react-router-dom";

import PosNewOrder from "./posNeworder";

import { FaShoppingCart, FaHistory, FaPause,FaRegCalendarAlt    } from 'react-icons/fa';
import { MdBookOnline } from "react-icons/md";
import { IoMdToday } from "react-icons/io";
import PosOrderEdit from "./neworder/posOrderEdit";
import BasePosLayout from "../layouts/BasePosLayout";
const PosEdit =() =>{




      const [activeTab, setActiveTab] = useState('neworder');

      const handleTabClick = (tabName) => {
        setActiveTab(tabName);
      };
      const imageName = "burps.png";
    return (



     <BasePosLayout activeTab="neworder">
      <div className="tab-pane active" id="neworder" role="tabpanel">
        <PosOrderEdit />
      </div>
    </BasePosLayout>
  );
};

export default PosEdit;