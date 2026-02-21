import React from 'react';
import { useState, useEffect } from 'react';
import apiConfig from '../layouts/base_url';
import Monthlywisechart from '../Dashboard/graphs/monthlywiseChart';
import Dailysalesgraphs from '../Dashboard/graphs/dailysalesGraph';
import Weeklysalesgraphs from '../Dashboard/graphs/weeklysaleGraph';
import FoodOptionsGraph from '../Dashboard/graphs/dashboardoptionGraph';
import HighSales from '../Dashboard/graphs/dashboardhighSales';
import YearlySalesChart from '../Dashboard/graphs/yearlywiseGraph';

const DashboardGraph = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiConfig.baseURL}/api/dashboard/monthlywiseweek`);
        const data = await response.json();
        setSalesData(data.monthlyWeeklySalesData);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  // Show loading state if needed
  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  return (
    <>
      {/* First Row - Monthly and Weekly Charts */}
      <div className="row">
        <div className="col-md-8 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="clearfix">
                <h4 className="card-title float-left">Monthly Sales Statistics</h4>
                <div id="visit-sale-chart-legend" className="rounded-legend legend-horizontal legend-top-right float-right"></div>
              </div>
              <Monthlywisechart />
            </div>
          </div>
        </div>
        <div className="col-md-4 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="clearfix">
                <h4 className="card-title float-left">Weekly Sales Statistics</h4>
                <div id="weekly-sale-chart-legend" className="rounded-legend legend-horizontal legend-top-right float-right"></div>
              </div>
              <Weeklysalesgraphs />
            </div>
          </div>
        </div>
      </div>

      {/* Second Row - Daily Sales and Food Options */}
      <div className="row">
        <div className="col-md-8 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="clearfix">
                <h4 className="card-title float-left">Daily Sales Statistics</h4>
                <div id="daily-sale-chart-legend" className="rounded-legend legend-horizontal legend-top-right float-right"></div>
              </div>
              <Dailysalesgraphs />
            </div>
          </div>
        </div>
        <div className="col-md-4 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Food Options Distribution</h4>
              <FoodOptionsGraph />
              <div id="traffic-chart-legend" className="rounded-legend legend-vertical legend-bottom-left pt-4"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Third Row - Highest Sales and Yearly Chart */}
      <div className="row">
        <div className="col-md-8 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="clearfix">
                <h4 className="card-title float-left">Highest Selling Food Items</h4>
              </div>
              <HighSales />
            </div>
          </div>
        </div>
        <div className="col-md-4 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Yearly Sales Overview</h4>
              <YearlySalesChart />
              <div id="yearly-chart-legend" className="rounded-legend legend-vertical legend-bottom-left pt-4"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Optional: Pass salesData as props to charts that need it */}
      {/* <Monthlywisechart salesData={salesData} /> */}
    </>
  );
};

export default DashboardGraph;