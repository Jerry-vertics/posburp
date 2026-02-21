import React from 'react';
import { useState, useEffect } from 'react';
import apiConfig from '../../layouts/base_url';
import Chart from 'chart.js/auto';

const Monthlywisechart = () => {
  const [monthlySalesData, setMonthlySalesData] = useState([]);
  const [chart, setChart] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiConfig.baseURL}/api/dashboard/monthlygraph`);
        const data = await response.json();
        setMonthlySalesData(data.monthlySalesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Destroy existing chart instance if it exists
    if (chart) {
      chart.destroy();
    }

    if (monthlySalesData.length > 0) {
      const allMonths = generateAllMonths(); // Generate an array of all months
      const salesByMonth = monthlySalesData.reduce((obj, item) => {
        obj[item.month] = item.sales;
        return obj;
      }, {});

      const salesData = allMonths.map(month => ({
        month,
        sales: salesByMonth[month] || 0
      }));

      const ctx = document.getElementById('monthlySalesChart').getContext('2d');
      const newChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: salesData.map(entry => entry.month),
          datasets: [{
            label: 'Monthly Sales',
            data: salesData.map(entry => entry.sales),
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Sales Amount'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Month'
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Monthly Sales Overview'
            },
            legend: {
              display: true,
              position: 'top'
            }
          },
          responsive: true,
          maintainAspectRatio: false
        }
      });

      setChart(newChart);
    }

    // Cleanup function
    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, [monthlySalesData]);

  const generateAllMonths = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const months = [];

    for (let month = 0; month < 12; month++) {
      // Format: YYYY-MM (e.g., "2024-01")
      months.push(`${currentYear}-${(month + 1).toString().padStart(2, '0')}`);
    }

    return months;
  };

  return (
    <div style={{ position: 'relative', height: '400px', width: '100%' }}>
      <canvas id="monthlySalesChart" className="mt-4"></canvas>
    </div>
  );
};

export default Monthlywisechart;