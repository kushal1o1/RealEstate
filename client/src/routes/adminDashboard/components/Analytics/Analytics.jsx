import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Calendar, TrendingUp, DollarSign, Users, Home, MessageSquare } from 'lucide-react';
import apiRequest from '../../../../lib/apiRequest';
import './analytics.scss';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');
  const [analyticsData, setAnalyticsData] = useState({
    userGrowth: [],
    propertyListings: [],
    messageTrends: [],
    revenue: [],
    userActivity: [],
    propertyTypes: [],
    topLocations: []
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await apiRequest.get(`/admin/analytics?timeRange=${timeRange}`);
      // Ensure all data arrays exist, if not provide empty arrays as fallback
      setAnalyticsData({
        userGrowth: Array.isArray(response.data?.userGrowth) ? response.data.userGrowth : [],
        propertyListings: Array.isArray(response.data?.propertyListings) ? response.data.propertyListings : [],
        messageTrends: Array.isArray(response.data?.messageTrends) ? response.data.messageTrends : [],
        revenue: Array.isArray(response.data?.revenue) ? response.data.revenue : [],
        userActivity: Array.isArray(response.data?.userActivity) ? response.data.userActivity : [],
        propertyTypes: Array.isArray(response.data?.propertyTypes) ? response.data.propertyTypes : [],
        topLocations: Array.isArray(response.data?.topLocations) ? response.data.topLocations : []
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      // Reset to empty arrays on error
      setAnalyticsData({
        userGrowth: [],
        propertyListings: [],
        messageTrends: [],
        revenue: [],
        userActivity: [],
        propertyTypes: [],
        topLocations: []
      });
    } finally {
      setLoading(false);
    }
  };

  const userGrowthOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'User Growth',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  const propertyListingsOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Property Listings',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  const messageTrendsOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Message Trends',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  const revenueOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Revenue Overview',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value.toLocaleString()}`
        }
      }
    }
  };

  const propertyTypesOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Property Types Distribution',
      },
    },
  };

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h2>Analytics Dashboard</h2>
        <div className="time-range-selector">
          <button
            className={`time-range-btn ${timeRange === 'week' ? 'active' : ''}`}
            onClick={() => setTimeRange('week')}
          >
            Week
          </button>
          <button
            className={`time-range-btn ${timeRange === 'month' ? 'active' : ''}`}
            onClick={() => setTimeRange('month')}
          >
            Month
          </button>
          <button
            className={`time-range-btn ${timeRange === 'year' ? 'active' : ''}`}
            onClick={() => setTimeRange('year')}
          >
            Year
          </button>
        </div>
      </div>

      <div className="analytics-grid">
        {/* User Growth Chart */}
        <div className="analytics-card">
          <div className="analytics-card__header">
            <Users size={20} />
            <h3>User Growth</h3>
          </div>
          {loading ? (
            <div className="loading-skeleton" />
          ) : (
            <Line
              data={{
                labels: analyticsData.userGrowth.map(item => item.date),
                datasets: [{
                  label: 'New Users',
                  data: analyticsData.userGrowth.map(item => item.count),
                  borderColor: 'rgb(75, 192, 192)',
                  tension: 0.1
                }]
              }}
              options={userGrowthOptions}
            />
          )}
        </div>

        {/* Property Listings Chart */}
        <div className="analytics-card">
          <div className="analytics-card__header">
            <Home size={20} />
            <h3>Property Listings</h3>
          </div>
          {loading ? (
            <div className="loading-skeleton" />
          ) : (
            <Bar
              data={{
                labels: analyticsData.propertyListings.map(item => item.date),
                datasets: [{
                  label: 'New Listings',
                  data: analyticsData.propertyListings.map(item => item.count),
                  backgroundColor: 'rgba(54, 162, 235, 0.5)',
                }]
              }}
              options={propertyListingsOptions}
            />
          )}
        </div>

        {/* Message Trends Chart */}
        <div className="analytics-card">
          <div className="analytics-card__header">
            <MessageSquare size={20} />
            <h3>Message Trends</h3>
          </div>
          {loading ? (
            <div className="loading-skeleton" />
          ) : (
            <Line
              data={{
                labels: analyticsData.messageTrends.map(item => item.date),
                datasets: [{
                  label: 'Messages',
                  data: analyticsData.messageTrends.map(item => item.count),
                  borderColor: 'rgb(153, 102, 255)',
                  tension: 0.1
                }]
              }}
              options={messageTrendsOptions}
            />
          )}
        </div>

        {/* Revenue Chart */}
        <div className="analytics-card">
          <div className="analytics-card__header">
            <DollarSign size={20} />
            <h3>Revenue Overview</h3>
          </div>
          {loading ? (
            <div className="loading-skeleton" />
          ) : !Array.isArray(analyticsData.revenue) || analyticsData.revenue.length === 0 ? (
            <div className="no-data-message">No revenue data available</div>
          ) : (
            <Bar
              data={{
                labels: analyticsData.revenue.map(item => item?.date || ''),
                datasets: [
                  {
                    label: 'Sales',
                    data: analyticsData.revenue.map(item => item?.sales || 0),
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                  },
                  {
                    label: 'Rentals',
                    data: analyticsData.revenue.map(item => item?.rentals || 0),
                    backgroundColor: 'rgba(255, 159, 64, 0.5)',
                  }
                ]
              }}
              options={revenueOptions}
            />
          )}
        </div>

        {/* Property Types Distribution */}
        <div className="analytics-card">
          <div className="analytics-card__header">
            <Home size={20} />
            <h3>Property Types</h3>
          </div>
          {loading ? (
            <div className="loading-skeleton" />
          ) : (
            <Doughnut
              data={{
                labels: analyticsData.propertyTypes.map(item => item.type),
                datasets: [{
                  data: analyticsData.propertyTypes.map(item => item.count),
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                  ],
                }]
              }}
              options={propertyTypesOptions}
            />
          )}
        </div>

        {/* Top Locations */}
        <div className="analytics-card">
          <div className="analytics-card__header">
            <Calendar size={20} />
            <h3>Top Locations</h3>
          </div>
          {loading ? (
            <div className="loading-skeleton" />
          ) : (
            <div className="locations-list">
              {analyticsData.topLocations.map((location, index) => (
                <div key={location.city} className="location-item">
                  <span className="location-rank">#{index + 1}</span>
                  <span className="location-name">{location.city}</span>
                  <span className="location-count">{location.count} properties</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics; 