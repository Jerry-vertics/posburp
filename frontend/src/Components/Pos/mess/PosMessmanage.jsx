import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Swal from 'sweetalert2';
import { MessDailyPunching } from "./MessDailyPunching";
import MessCustomerSubscription from "./MessCustomerSubscription";
import { MessManageHold } from "./MessManageHold";

export const PosMessmanage = () => {
  const navigate = useNavigate();

  // State for active tab
  const [activeTab, setActiveTab] = useState("punch");

  // State for customer search
  const [searchTerm, setSearchTerm] = useState("");

  // State for selected customer
  const [selectedCustomer, setSelectedCustomer] = useState({
    name: "Ahmed Abdullah",
    id: "#8801",
    status: "Active Member",
    plan: "Executive 3-Meal",
    remainingMeals: 42,
    meals: {
      breakfast: { done: true, time: "08:30AM", disabled: true },
      lunch: { done: false, time: "Ready to Serve", disabled: false },
      dinner: { done: false, time: "Opens at 07:00PM", disabled: true }
    }
  });

  // State for new subscription form
  const [newSubscription, setNewSubscription] = useState({
    name: "",
    mobile: "",
    package: "Monthly (3 Meals/Day)",
    startDate: "2024-05-20",
    expiryDate: "2024-06-19",
    totalAmount: "AED 1200",
    paidAmount: ""
  });

  // State for menu items
  const [menuItems, setMenuItems] = useState([
    { day: "Monday", breakfast: "Masala Dosa", lunch: "Chicken Biryani", dinner: "Roti & Daal" },
    { day: "Tuesday", breakfast: "Omelette & Bread", lunch: "Mutton Curry", dinner: "Mixed Veg" }
  ]);

  // Handle punch lunch action
  const handlePunchLunch = () => {
    Swal.fire({
      title: 'Success!',
      text: 'Lunch Punched! Ticket Printing...',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });
  };

  // Handle form input changes
  const handleSubscriptionChange = (e) => {
    const { name, value } = e.target;
    setNewSubscription(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle menu changes
  const handleMenuChange = (index, mealType, value) => {
    const updatedMenu = [...menuItems];
    updatedMenu[index][mealType] = value;
    setMenuItems(updatedMenu);
  };

  // Handle activate subscription
  const handleActivateSubscription = () => {
    Swal.fire({
      title: 'Success!',
      text: 'Subscription activated and card printed!',
      icon: 'success',
      confirmButtonText: 'OK'
    });
  };

  // Handle hold subscription
  const handleHoldSubscription = (customerId) => {
    Swal.fire({
      title: 'Hold Subscription',
      text: `Are you sure you want to hold subscription for ${customerId}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, hold it!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Held!',
          'Subscription has been put on hold.',
          'success'
        );
      }
    });
  };

  // Handle resume subscription
  const handleResumeSubscription = (customerId) => {
    Swal.fire({
      title: 'Resume Subscription',
      text: `Resume subscription for ${customerId}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      confirmButtonText: 'Yes, resume!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Resumed!',
          'Subscription has been resumed.',
          'success'
        );
      }
    });
  };

  // Handle renew subscription
  const handleRenewSubscription = (customerId) => {
    Swal.fire({
      title: 'Renew Subscription',
      text: `Renew subscription for ${customerId}?`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#007bff',
      confirmButtonText: 'Yes, renew!'
    });
  };

  // Handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  // Handle QR scan
  const handleQRScan = () => {
    Swal.fire({
      title: 'Scan QR Code',
      text: 'Camera initialized. Point at QR code...',
      icon: 'info',
      timer: 3000,
      showConfirmButton: false
    });
  };

  return (
    <>


      <div className="container-fluid ">
        <ul className="nav nav-pills nav-fill mb-4 division" id="messTab" role="tablist">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'punch' ? 'active' : ''}`}
              onClick={() => handleTabChange('punch')}
            >
              <i className="bi bi-qr-code-scan"></i> Daily Punching
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'subscribe' ? 'active' : ''}`}
              onClick={() => handleTabChange('subscribe')}
            >
              <i className="bi bi-person-plus"></i> New Subscription
            </button>
          </li>

          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'manage' ? 'active' : ''}`}
              onClick={() => handleTabChange('manage')}
            >
              <i className="bi bi-gear"></i> Manage/Hold
            </button>
          </li>
        </ul>

        <div className="tab-content" id="messTabContent">
          {/* Daily Punching Tab */}
          {activeTab === 'punch' && (
            <div className="tab-pane fade show active" id="punch-content">
              <MessDailyPunching />
            </div>
          )}

          {/* New Subscription Tab */}
          {activeTab === 'subscribe' && (
            <div className="tab-pane fade show active" id="subscribe-content">
              <MessCustomerSubscription />
            </div>
          )}

          {/* Menu Scheduler Tab */}
          {activeTab === 'menu' && (
            <div className="tab-pane fade show active" id="menu-content">
              <div className="card p-4">
                <div className="d-flex justify-content-between mb-3">
                  <h4>Weekly Menu Rotation</h4>
                  <button className="btn btn-sm btn-outline-primary">Apply to All Weeks</button>
                </div>
                <div className="table-responsive">
                  <table className="table table-bordered align-middle text-center">
                    <thead className="table-light">
                      <tr>
                        <th>Day</th>
                        <th>Breakfast</th>
                        <th>Lunch (Special)</th>
                        <th>Dinner</th>
                      </tr>
                    </thead>
                    <tbody>
                      {menuItems.map((item, index) => (
                        <tr key={index}>
                          <td><strong>{item.day}</strong></td>
                          <td>
                            <select
                              className="form-select form-select-sm"
                              value={item.breakfast}
                              onChange={(e) => handleMenuChange(index, 'breakfast', e.target.value)}
                            >
                              <option>Masala Dosa</option>
                              <option>Omelette & Bread</option>
                              <option>Poha</option>
                              <option>Idli Sambhar</option>
                            </select>
                          </td>
                          <td>
                            <select
                              className="form-select form-select-sm"
                              value={item.lunch}
                              onChange={(e) => handleMenuChange(index, 'lunch', e.target.value)}
                            >
                              <option>Chicken Biryani</option>
                              <option>Mutton Curry</option>
                              <option>Veg Biryani</option>
                              <option>Fish Curry</option>
                            </select>
                          </td>
                          <td>
                            <select
                              className="form-select form-select-sm"
                              value={item.dinner}
                              onChange={(e) => handleMenuChange(index, 'dinner', e.target.value)}
                            >
                              <option>Roti & Daal</option>
                              <option>Mixed Veg</option>
                              <option>Paneer Butter Masala</option>
                              <option>Chicken Curry</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Manage/Hold Tab */}
          {activeTab === 'manage' && (
            <div className="tab-pane fade show active" id="manage-content">
             <MessManageHold />
            </div>
          )}
        </div>
      </div>
    </>
  );
};