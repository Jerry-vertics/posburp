import React, { useState, useEffect } from 'react';
import Header from '../layouts/Header';
import Sidebar from '../layouts/Sidebar';
import Footer from '../layouts/Footer';
import { useNavigate } from "react-router-dom";
import apiConfig from '../layouts/base_url';
import DashboardGraph from './dashboardGraph';

const Dashboard = () => {
  const navigate = useNavigate();

  // State management
  const [dashboardData, setDashboardData] = useState({
    todayOrderCount: 0,
    totalOrderCount: 0,
    todayPaidCount: 0,
    totalPaidAmount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sign out function
  const signOut = () => {
    localStorage.removeItem('token');
    navigate("/");
  };

  // Fetch all dashboard data in one effect
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use Promise.all to fetch all data concurrently
        const [todayOrderRes, totalOrderRes, todayPaidRes, totalPaidRes] = await Promise.all([
          fetch(`${apiConfig.baseURL}/api/dashboard/todayorder`),
          fetch(`${apiConfig.baseURL}/api/dashboard/totalorder`),
          fetch(`${apiConfig.baseURL}/api/dashboard/todaypaidsales`),
          fetch(`${apiConfig.baseURL}/api/dashboard/oveallsales`)
        ]);

        // Check if all responses are ok
        if (!todayOrderRes.ok || !totalOrderRes.ok || !todayPaidRes.ok || !totalPaidRes.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        // Parse all responses
        const [todayOrderData, totalOrderData, todayPaidData, totalPaidData] = await Promise.all([
          todayOrderRes.json(),
          totalOrderRes.json(),
          todayPaidRes.json(),
          totalPaidRes.json()
        ]);

        setDashboardData({
          todayOrderCount: todayOrderData.count || 0,
          totalOrderCount: totalOrderData.count || 0,
          todayPaidCount: todayPaidData.sum || 0,
          totalPaidAmount: totalPaidData.sum || 0
        });

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []); // Empty dependency array means this runs once on mount

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Loading state
  if (loading) {
    return (
      <div className="container-scroller">
        <Header />
        <div className="container-fluid page-body-wrapper">
          <Sidebar />
          <div className="main-panel">
            <div className="content-wrapper">
              <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container-scroller">
        <Header />
        <div className="container-fluid page-body-wrapper">
          <Sidebar />
          <div className="main-panel">
            <div className="content-wrapper">
              <div className="alert alert-danger" role="alert">
                Error loading dashboard: {error}
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </div>
    );
  }

  // Stats cards configuration
  const statCards = [
    {
      title: "Today's Orders",
      value: dashboardData.todayOrderCount,
      icon: "mdi-chart-line",
      gradient: "bg-gradient-danger",
      color: "text-white"
    },
    {
      title: "Today's Sales",
      value: formatCurrency(dashboardData.todayPaidCount),
      icon: "mdi-bookmark-outline",
      gradient: "bg-gradient-info",
      color: "text-white"
    },
    {
      title: "Total Orders",
      value: dashboardData.totalOrderCount,
      icon: "mdi-diamond",
      gradient: "bg-gradient-success",
      color: "text-white"
    },
    {
      title: "Total Sales",
      value: formatCurrency(dashboardData.totalPaidAmount),
      icon: "mdi-cash-multiple",
      gradient: "bg-gradient-success",
      color: "text-white"
    }
  ];

  return (
    <div className="container-scroller">
      <Header />
      <div className="container-fluid page-body-wrapper">
        <Sidebar />
        <div className="main-panel">
          <div className="content-wrapper">
            {/* Page Header */}
            <div className="page-header">
              <h3 className="page-title">
                <span className="page-title-icon bg-gradient-primary text-white me-2">
                  <i className="mdi mdi-home"></i>
                </span>
                Dashboard
              </h3>
              <nav aria-label="breadcrumb">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item active" aria-current="page">
                    <span></span>Overview
                    <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
                  </li>
                </ul>
              </nav>
            </div>

            {/* Stats Cards */}
            <div className="row">
              {statCards.map((card, index) => (
                <div key={index} className="col-md-3 stretch-card grid-margin">
                  <div className={`card ${card.gradient} card-img-holder ${card.color}`}>
                    <div className="card-body">
                      <img
                        src="assets/images/dashboard/circle.svg"
                        className="card-img-absolute"
                        alt="circle-background"
                      />
                      <h4 className="font-weight-normal mb-3">
                        {card.title}
                        <i className={`mdi ${card.icon} mdi-24px float-right`}></i>
                      </h4>
                      <h2 className="mb-5">{card.value}</h2>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Graphs Section */}
            <DashboardGraph />
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;