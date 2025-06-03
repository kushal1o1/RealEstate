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
import { Calendar, DollarSign, Users, Home, MessageSquare, Activity } from 'lucide-react';
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
    revenue: { sales: [], rentals: [] },
    propertyTypes: [],
    topLocations: [],
    userEngagement: {
      activeUsers: 0,
      topPosters: [],
      topSavedProperties: []
    },
    communicationMetrics: {
      topChats: [],
      topParticipants: []
    }
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
        revenue: {
          sales: Array.isArray(response.data?.revenue?.sales) ? response.data.revenue.sales : [],
          rentals: Array.isArray(response.data?.revenue?.rentals) ? response.data.revenue.rentals : []
        },
        propertyTypes: Array.isArray(response.data?.propertyTypes) ? response.data.propertyTypes : [],
        topLocations: Array.isArray(response.data?.topLocations) ? response.data.topLocations : [],
        userEngagement: {
          activeUsers: response.data?.userEngagement?.activeUsers || 0,
          topPosters: Array.isArray(response.data?.userEngagement?.topPosters) ? response.data.userEngagement.topPosters : [],
          topSavedProperties: Array.isArray(response.data?.userEngagement?.topSavedProperties) ? response.data.userEngagement.topSavedProperties : []
        },
        communicationMetrics: {
          topChats: Array.isArray(response.data?.communicationMetrics?.topChats) ? response.data.communicationMetrics.topChats : [],
          topParticipants: Array.isArray(response.data?.communicationMetrics?.topParticipants) ? response.data.communicationMetrics.topParticipants : []
        }
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      // Reset to empty arrays on error
      setAnalyticsData({
        userGrowth: [],
        propertyListings: [],
        messageTrends: [],
        revenue: { sales: [], rentals: [] },
        propertyTypes: [],
        topLocations: [],
        userEngagement: {
          activeUsers: 0,
          topPosters: [],
          topSavedProperties: []
        },
        communicationMetrics: {
          topChats: [],
          topParticipants: []
        }
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
        labels: {
          color: 'var(--color-text)'
        }
      },
      title: {
        display: true,
        text: 'User Growth',
        color: 'var(--color-text)'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          color: 'var(--color-text)'
        },
        grid: {
          color: 'var(--color-border)'
        }
      },
      x: {
        ticks: {
          color: 'var(--color-text)'
        },
        grid: {
          color: 'var(--color-border)'
        }
      }
    }
  };

  const propertyListingsOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'var(--color-text)'
        }
      },
      title: {
        display: true,
        text: 'Property Listings',
        color: 'var(--color-text)'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          color: 'var(--color-text)'
        },
        grid: {
          color: 'var(--color-border)'
        }
      },
      x: {
        ticks: {
          color: 'var(--color-text)'
        },
        grid: {
          color: 'var(--color-border)'
        }
      }
    }
  };

  const messageTrendsOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'var(--color-text)'
        }
      },
      title: {
        display: true,
        text: 'Message Trends',
        color: 'var(--color-text)'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          color: 'var(--color-text)'
        },
        grid: {
          color: 'var(--color-border)'
        }
      },
      x: {
        ticks: {
          color: 'var(--color-text)'
        },
        grid: {
          color: 'var(--color-border)'
        }
      }
    }
  };

  const revenueOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'var(--color-text)'
        }
      },
      title: {
        display: true,
        text: 'Revenue Overview',
        color: 'var(--color-text)'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value.toLocaleString()}`,
          color: 'var(--color-text)'
        },
        grid: {
          color: 'var(--color-border)'
        }
      },
      x: {
        ticks: {
          color: 'var(--color-text)'
        },
        grid: {
          color: 'var(--color-border)'
        }
      }
    }
  };

  const propertyTypesOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: 'var(--color-text)'
        }
      },
      title: {
        display: true,
        text: 'Property Types Distribution',
        color: 'var(--color-text)'
      }
    }
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
          ) : !Array.isArray(analyticsData.revenue.sales) || analyticsData.revenue.sales.length === 0 ? (
            <div className="no-data-message">No revenue data available</div>
          ) : (
            <Bar
              data={{
                labels: analyticsData.revenue.sales.map(item => item?.date || ''),
                datasets: [
                  {
                    label: 'Sales',
                    data: analyticsData.revenue.sales.map(item => item?.amount || 0),
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                  },
                  {
                    label: 'Rentals',
                    data: analyticsData.revenue.rentals.map(item => item?.amount || 0),
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

        {/* User Engagement Overview */}
        <div className="analytics-card">
          <div className="analytics-card__header">
            <Activity size={20} />
            <h3>User Engagement</h3>
          </div>
          {loading ? (
            <div className="loading-skeleton" />
          ) : (
            <div className="engagement-overview">
              <div className="engagement-stat">
                <h4>Active Users</h4>
                <p>{analyticsData.userEngagement.activeUsers}</p>
              </div>
              <div className="engagement-lists">
                <div className="engagement-list">
                  <h4>Top Posters</h4>
                  {analyticsData.userEngagement.topPosters.map((user, index) => (
                    <div key={user.username} className="list-item">
                      <span className="rank">#{index + 1}</span>
                      <span className="name">{user.username}</span>
                      <span className="count">{user.postCount} posts</span>
                    </div>
                  ))}
                </div>
                <div className="engagement-list">
                  <h4>Most Saved Properties</h4>
                  {analyticsData.userEngagement.topSavedProperties.map((property, index) => (
                    <div key={property.title} className="list-item">
                      <span className="rank">#{index + 1}</span>
                      <span className="name">{property.title}</span>
                      <span className="count">{property.savedCount} saves</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Communication Metrics */}
        <div className="analytics-card">
          <div className="analytics-card__header">
            <MessageSquare size={20} />
            <h3>Communication Activity</h3>
          </div>
          {loading ? (
            <div className="loading-skeleton" />
          ) : (
            <div className="communication-overview">
              <div className="communication-section">
                <h4>Top Chats</h4>
                {analyticsData.communicationMetrics.topChats.map((chat, index) => (
                  <div key={chat.id} className="list-item">
                    <span className="rank">#{index + 1}</span>
                    <span className="count">{chat.messageCount} messages</span>
                  </div>
                ))}
              </div>
              <div className="communication-section">
                <h4>Top Participants</h4>
                {analyticsData.communicationMetrics.topParticipants.map((user, index) => (
                  <div key={user.username} className="list-item">
                    <span className="rank">#{index + 1}</span>
                    <span className="name">{user.username}</span>
                    <span className="count">{user.chatCount} chats</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics; 