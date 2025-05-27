import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Users, 
  Home, 
  MessageSquare, 
  Mail, 
  Bookmark, 
  BarChart3, 
  Search, 
  Eye,
  ChevronLeft,
  ChevronRight,
  Calendar,
  TrendingUp,
  Activity,
  Filter,
  Download,
  Settings,
  Bell,
  Edit,
  Trash2,
  Plus,
  Menu
} from 'lucide-react';

import './adminDashboard.scss'; // Import your CSS styles
import apiRequest from "../../lib/apiRequest"; // Adjust the import path as necessary
import  Alert  from '../../components/alert/Alert.jsx';
import UserPreviewModal from './components/UserPreviewModal/UserPreviewModal';
import PropertyPreviewModal from './components/PropertyPreviewModal/PropertyPreviewModal';
import Chats from './components/Chats/Chats';
import SavedPosts from './components/SavedPosts/SavedPosts';
import Messages from './components/Messages/Messages';
import Analytics from './components/Analytics/Analytics';
// // Mock your apiRequest import
// const apiRequest = {
//   get: async (url) => {
//     await new Promise(resolve => setTimeout(resolve, 300));
//     if (url === '/admin/dashboard-stats') {
//       return {
//         data: {
//           totalUsers: 1247,
//           totalPosts: 856,
//           totalChats: 324,
//           totalMessages: 2847,
//           totalSavedPosts: 439,
//           recentUsers: 23,
//           recentPosts: 12,
//           rentPosts: 524,
//           salePosts: 332
//         }
//       };
//     }
//     if (url.includes('/admin/users')) {
//       return {
//         data: {
//           users: [
//             {
//               id: 1,
//               username: 'John Doe',
//               email: 'john@example.com',
//               avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
//               createdAt: '2024-01-15T10:30:00Z',
//               _count: { posts: 5, savedPosts: 12, chats: 3 }
//             },
//             {
//               id: 2,
//               username: 'Sarah Wilson',
//               email: 'sarah@example.com',
//               avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c54a?w=40&h=40&fit=crop&crop=face',
//               createdAt: '2024-02-20T14:45:00Z',
//               _count: { posts: 8, savedPosts: 6, chats: 7 }
//             }
//           ],
//           pagination: { current: 1, total: 5, count: 45 }
//         }
//       };
//     }
//     if (url.includes('/admin/posts')) {
//       return {
//         data: {
//           posts: [
//             {
//               id: 1,
//               title: 'Modern Downtown Apartment',
//               property: 'Apartment',
//               type: 'rent',
//               price: 2500,
//               city: 'New York',
//               address: '123 Main St',
//               images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=60&h=40&fit=crop'],
//               user: { username: 'John Doe' },
//               createdAt: '2024-01-20T10:30:00Z',
//               _count: { savedPosts: 8 }
//             },
//             {
//               id: 2,
//               title: 'Luxury Villa with Pool',
//               property: 'House',
//               type: 'sale',
//               price: 850000,
//               city: 'Los Angeles',
//               address: '456 Oak Ave',
//               images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=60&h=40&fit=crop'],
//               user: { username: 'Sarah Wilson' },
//               createdAt: '2024-02-15T14:20:00Z',
//               _count: { savedPosts: 15 }
//             }
//           ],
//           pagination: { current: 1, total: 3, count: 25 }
//         }
//       };
//     }
//     return { data: [] };
//   },
//   delete: async (url) => {
//     await new Promise(resolve => setTimeout(resolve, 300));
//     return { status: 200 };
//   }
// };

// Memoize the DashboardHeader component
const DashboardHeader = React.memo(({ activeTab, searchTerm, setSearchTerm, onMenuClick }) => (
  <header className="dashboard-header">
    <div className="dashboard-header__left">
      <button className="mobile-menu-btn" onClick={onMenuClick} title="Menu">
        <Menu size={24} />
      </button>
      <h1 className="dashboard-header__title">
        {activeTab === 'dashboard' ? 'Dashboard Overview' : 
         activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}
      </h1>
      <div className="dashboard-header__breadcrumb">
        Admin / {activeTab}
      </div>
    </div>
    
    <div className="dashboard-header__right">
      {(activeTab === 'users' || activeTab === 'posts' || activeTab === 'messages') && (
        <div className="search-container">
          <Search className="search-container__icon" size={16} />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-container__input"
          />
        </div>
      )}
      
      <div className="header-actions">
        <button className="btn" title="Notifications">
          <Bell size={18} />
        </button>
        <button className="btn" title="Settings">
          <Settings size={18} />
        </button>
      </div>
    </div>
  </header>
));

// Memoize the MobileSearch component
const MobileSearch = React.memo(({ activeTab, searchTerm, setSearchTerm }) => {
  if (!['users', 'posts', 'messages'].includes(activeTab)) return null;
  
  return (
    <div className="mobile-search">
      <div className="search-container search-container--mobile">
        <Search className="search-container__icon" size={16} />
        <input
          type="text"
          placeholder={`Search ${activeTab}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-container__input"
        />
      </div>
    </div>
  );
});

// Memoize the Sidebar component
const Sidebar = React.memo(({ activeTab, setActiveTab, isOpen, onClose }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'posts', label: 'Properties', icon: Home },
    { id: 'chats', label: 'Chats', icon: MessageSquare },
    { id: 'messages', label: 'Messages', icon: Mail },
    { id: 'saved-posts', label: 'Saved', icon: Bookmark }
  ];

  const handleItemClick = (id) => {
    setActiveTab(id);
    onClose(); // Close sidebar on mobile after selection
  };

  return (
    <>
      <div 
        className={`sidebar__overlay ${isOpen ? 'sidebar__overlay--visible' : ''}`}
        onClick={onClose}
      />
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__brand">
          <div className="sidebar__logo">
            <Home size={24} />
          </div>
          <h2 className="sidebar__title">RealEstate</h2>
        </div>
        
        <nav className="sidebar__nav">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`sidebar__item ${activeTab === item.id ? 'sidebar__item--active' : ''}`}
              onClick={() => handleItemClick(item.id)}
            >
              <item.icon className="sidebar__icon" size={20} />
              <span className="sidebar__label">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
});

// Memoize the StatCard component
const StatCard = React.memo(({ title, value, icon: Icon, trend, loading = false }) => (
  <div className="stat-card">
    <div className="stat-card__header">
      <div className="stat-card__icon">
        <Icon size={24} />
      </div>
      <h3 className="stat-card__title">{title}</h3>
    </div>
    <div className="stat-card__value">
      {loading ? <div className="skeleton-text skeleton-text--large" /> : value?.toLocaleString()}
    </div>
    {trend && !loading && (
      <div className="stat-card__trend">
        <TrendingUp size={14} />
        <span>{trend}</span>
      </div>
    )}
  </div>
));

// Memoize the DataTable component
const DataTable = React.memo(({ headers, children, loading }) => (
  <div className="table-wrapper">
    <table className="data-table">
      <thead className="data-table__head">
        <tr>
          {headers.map((header, index) => (
            <th key={index} className="data-table__header">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {loading ? (
          Array(5).fill().map((_, i) => (
            <tr key={i} className="data-table__row">
              {headers.map((_, j) => (
                <td key={j} className="data-table__cell">
                  <div className="skeleton-text" />
                </td>
              ))}
            </tr>
          ))
        ) : children}
      </tbody>
    </table>
  </div>
));

// Memoize the Pagination component
const Pagination = React.memo(({ pagination, onPageChange }) => (
  <div className="pagination">
    <button 
      onClick={() => onPageChange(pagination.current - 1)}
      disabled={pagination.current <= 1}
      className="pagination__btn"
    >
      <ChevronLeft size={16} />
    </button>
    
    <div className="pagination__info">
      <span className="pagination__current">Page {pagination.current}</span>
      <span className="pagination__total">of {pagination.total}</span>
    </div>
    
    <button 
      onClick={() => onPageChange(pagination.current + 1)}
      disabled={pagination.current >= pagination.total}
      className="pagination__btn"
    >
      <ChevronRight size={16} />
    </button>
  </div>
));

// Main Dashboard Component
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteItem, setDeleteItem] = useState({ id: null, type: null });
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loadingProperty, setLoadingProperty] = useState(false);
  
  
  // Dashboard Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalChats: 0,
    totalMessages: 0,
    totalSavedPosts: 0,
    recentUsers: 0,
    recentPosts: 0,
    rentPosts: 0,
    salePosts: 0
  });
  
  // Data states
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, total: 1, count: 0 });
  
  // Filters
  const [filters, setFilters] = useState({
    type: '',
    property: '',
    city: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loadingChat, setLoadingChat] = useState(false);

  const [savedPosts, setSavedPosts] = useState([]);
  const [selectedSavedPost, setSelectedSavedPost] = useState(null);
  const [loadingSavedPost, setLoadingSavedPost] = useState(false);

  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState(false);

  // Memoize the fetch functions
  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiRequest.get('/admin/dashboard-stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async (page = 1, search = '') => {
    try {
      setLoading(true);
      const response = await apiRequest.get(
        `/admin/users?page=${page}&limit=${itemsPerPage}&search=${search}&sortBy=${filters.sortBy}&sortOrder=${filters.sortOrder}`
      );
      setUsers(response.data.users || []);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage, filters.sortBy, filters.sortOrder]);

  const fetchPosts = useCallback(async (page = 1, search = '') => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page,
        limit: itemsPerPage,
        search,
        type: filters.type,
        property: filters.property,
        city: filters.city,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      });
      
      const response = await apiRequest.get(`/admin/posts?${queryParams}`);
      setPosts(response.data.posts || []);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage, filters]);

  const fetchChats = useCallback(async (page = 1, search = '') => {
    try {
      setLoading(true);
      const response = await apiRequest.get(
        `/admin/chats?page=${page}&limit=${itemsPerPage}&search=${search}&sortBy=${filters.sortBy}&sortOrder=${filters.sortOrder}`
      );
      setChats(response.data.chats || []);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage, filters.sortBy, filters.sortOrder]);

  const fetchSavedPosts = useCallback(async (page = 1, search = '') => {
    try {
      setLoading(true);
      const response = await apiRequest.get(
        `/admin/saved-posts?page=${page}&limit=${itemsPerPage}&search=${search}&sortBy=${filters.sortBy}&sortOrder=${filters.sortOrder}`
      );
      setSavedPosts(response.data.savedPosts || []);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching saved posts:', error);
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage, filters.sortBy, filters.sortOrder]);

  const fetchMessages = useCallback(async (page = 1, search = '') => {
    try {
      setLoading(true);
      const response = await apiRequest.get(
        `/admin/messages?page=${page}&limit=${itemsPerPage}&search=${search}&sortBy=${filters.sortBy}&sortOrder=${filters.sortOrder}`
      );
      setMessages(response.data.messages || []);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage, filters.sortBy, filters.sortOrder]);

  // Memoize handlers
  const handleDelete = useCallback((id, type) => {
    setDeleteItem({ id, type });
    setShowConfirm(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    try {
      await apiRequest.delete(`/admin/${deleteItem.type}/${deleteItem.id}`);
      
      switch (activeTab) {
        case 'users':
          await fetchUsers(currentPage, searchTerm);
          break;
        case 'posts':
          await fetchPosts(currentPage, searchTerm);
          break;
        case 'chats':
          await fetchChats(currentPage, searchTerm);
          break;
        case 'saved-posts':
          await fetchSavedPosts(currentPage, searchTerm);
          break;
        case 'messages':
          await fetchMessages(currentPage, searchTerm);
          break;
        default:
          break;
      }
      await fetchDashboardStats();
      setShowConfirm(false);
      setDeleteItem({ id: null, type: null });
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }, [activeTab, currentPage, deleteItem, fetchUsers, fetchPosts, fetchChats, fetchSavedPosts, fetchMessages, fetchDashboardStats, searchTerm]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    switch (activeTab) {
      case 'users':
        fetchUsers(page, searchTerm);
        break;
      case 'posts':
        fetchPosts(page, searchTerm);
        break;
      case 'chats':
        fetchChats(page, searchTerm);
        break;
      case 'saved-posts':
        fetchSavedPosts(page, searchTerm);
        break;
      case 'messages':
        fetchMessages(page, searchTerm);
        break;
      default:
        break;
    }
  }, [activeTab, fetchUsers, fetchPosts, fetchChats, fetchSavedPosts, fetchMessages, searchTerm]);

  const handleMenuClick = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const handleSidebarClose = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  const handleViewUser = useCallback(async (userId) => {
    try {
      setLoadingUser(true);
      const response = await apiRequest.get(`/admin/users/${userId}`);
      setSelectedUser(response.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoadingUser(false);
    }
  }, []);

  const handleCloseUserPreview = useCallback(() => {
    setSelectedUser(null);
  }, []);

  const handleViewProperty = useCallback(async (propertyId) => {
    try {
      setLoadingProperty(true);
      const response = await apiRequest.get(`/admin/posts/${propertyId}`);
      setSelectedProperty(response.data);
    } catch (error) {
      console.error('Error fetching property details:', error);
    } finally {
      setLoadingProperty(false);
    }
  }, []);

  const handleClosePropertyPreview = useCallback(() => {
    setSelectedProperty(null);
  }, []);

  const handleViewChat = useCallback(async (chatId) => {
    try {
      setLoadingChat(true);
      const response = await apiRequest.get(`/admin/chats/${chatId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chat details:', error);
      return null;
    } finally {
      setLoadingChat(false);
    }
  }, []);

  const handleDeleteChat = useCallback(async (chatId) => {
    try {
      await apiRequest.delete(`/admin/chats/${chatId}`);
      await fetchChats(currentPage, searchTerm);
      await fetchDashboardStats();
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  }, [currentPage, fetchChats, fetchDashboardStats, searchTerm]);

  const handleViewSavedPost = useCallback(async (savedPostId) => {
    try {
      setLoadingSavedPost(true);
      const response = await apiRequest.get(`/admin/saved-posts/${savedPostId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching saved post details:', error);
      return null;
    } finally {
      setLoadingSavedPost(false);
    }
  }, []);

  const handleDeleteSavedPost = useCallback(async (savedPostId) => {
    try {
      await apiRequest.delete(`/admin/saved-posts/${savedPostId}`);
      await fetchSavedPosts(currentPage, searchTerm);
      await fetchDashboardStats();
    } catch (error) {
      console.error('Error deleting saved post:', error);
    }
  }, [currentPage, fetchSavedPosts, fetchDashboardStats, searchTerm]);

  const handleViewMessage = useCallback(async (messageId) => {
    try {
      setLoadingMessage(true);
      const response = await apiRequest.get(`/admin/messages/${messageId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching message details:', error);
      return null;
    } finally {
      setLoadingMessage(false);
    }
  }, []);

  const handleDeleteMessage = useCallback(async (messageId) => {
    try {
      await apiRequest.delete(`/admin/messages/${messageId}`);
      await fetchMessages(currentPage, searchTerm);
      await fetchDashboardStats();
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  }, [currentPage, fetchMessages, fetchDashboardStats, searchTerm]);

  // Memoize the Alert component props
  const alertProps = useMemo(() => ({
    showConfirm,
    setShowConfirm,
    message: `Are you sure you want to delete this ${deleteItem.type === 'users' ? 'user' : 'property'}?`,
    btnText: "Yes, Delete",
    handleAction: handleConfirmDelete
  }), [showConfirm, deleteItem.type, handleConfirmDelete]);

  // Memoize the render functions
  const renderDashboard = useCallback(() => (
    <div className="dashboard-content">
      <div className="dashboard-stats">
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon={Users} 
          trend={`+${stats.recentUsers} this month`}
          loading={loading}
        />
        <StatCard 
          title="Total Properties" 
          value={stats.totalPosts} 
          icon={Home} 
          trend={`+${stats.recentPosts} this month`}
          loading={loading}
        />
        <StatCard 
          title="Active Chats" 
          value={stats.totalChats} 
          icon={MessageSquare} 
          loading={loading}
        />
        <StatCard 
          title="Messages" 
          value={stats.totalMessages} 
          icon={Mail} 
          loading={loading}
        />
        <StatCard 
          title="Saved Posts" 
          value={stats.totalSavedPosts} 
          icon={Bookmark} 
          loading={loading}
        />
        <StatCard 
          title="Rent Properties" 
          value={stats.rentPosts} 
          icon={Home} 
          loading={loading}
        />
        <StatCard 
          title="Sale Properties" 
          value={stats.salePosts} 
          icon={Activity} 
          loading={loading}
        />
      </div>
    </div>
  ), [stats, loading]);

  const renderUsers = useCallback(() => (
    <div className="content-section">
      <Alert {...alertProps} />
      {selectedUser && (
        <UserPreviewModal 
          user={selectedUser} 
          onClose={handleCloseUserPreview}
        />
      )}
      <div className="content-actions">
        <button className="btn btn--primary">
          <Plus size={16} />
          Add User
        </button>
        <button className="btn">
          <Download size={16} />
          Export
        </button>
      </div>
      
      <DataTable 
        headers={['User', 'Email', 'Properties', 'Saved', 'Chats', 'Joined', 'Actions']}
        loading={loading}
      >
        {users.map(user => (
          <tr key={user.id} className="data-table__row">
            <td className="data-table__cell">
              <div className="user-info">
                <img src={user.avatar || '/placeholder.png'} alt="" className="user-info__avatar" />
                <span className="user-info__name">{user.username}</span>
              </div>
            </td>
            <td className="data-table__cell">{user.email}</td>
            <td className="data-table__cell">
              <span className="badge">{user._count?.posts || 0}</span>
            </td>
            <td className="data-table__cell">
              <span className="badge">{user._count?.savedPosts || 0}</span>
            </td>
            <td className="data-table__cell">
              <span className="badge">{user._count?.chats || 0}</span>
            </td>
            <td className="data-table__cell">{formatDate(user.createdAt)}</td>
            <td className="data-table__cell">
              <div className="content-actions">
                <button 
                  className="btn" 
                  onClick={() => handleViewUser(user.id)}
                  disabled={loadingUser}
                  title="View"
                >
                  <Eye size={14} />
                </button>
                <button 
                  className="btn" 
                  onClick={() => handleDelete(user.id, 'users')}
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>
      
      <Pagination pagination={pagination} onPageChange={handlePageChange} />
    </div>
  ), [alertProps, users, loading, pagination, handlePageChange, handleDelete, selectedUser, loadingUser, handleViewUser, handleCloseUserPreview]);

  const renderPosts = useCallback(() => (
    <div className="content-section">
      <Alert {...alertProps} />
      {selectedProperty && (
        <PropertyPreviewModal 
          property={selectedProperty} 
          onClose={handleClosePropertyPreview}
        />
      )}
      <div className="content-filters">
        <select 
          value={filters.type} 
          onChange={(e) => setFilters({...filters, type: e.target.value})}
          className="filter-select"
        >
          <option value="">All Types</option>
          <option value="rent">Rent</option>
          <option value="sale">Sale</option>
        </select>
        
        <select 
          value={filters.property} 
          onChange={(e) => setFilters({...filters, property: e.target.value})}
          className="filter-select"
        >
          <option value="">All Properties</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="condo">Condo</option>
        </select>
      </div>
      
      <div className="content-actions">
        <button className="btn btn--primary">
          <Plus size={16} />
          Add Property
        </button>
        <button className="btn">
          <Download size={16} />
          Export
        </button>
      </div>
      
      <DataTable 
        headers={['Property', 'Type', 'Price', 'Location', 'Owner', 'Saves', 'Created', 'Actions']}
        loading={loading}
      >
        {posts.map(post => (
          <tr key={post.id} className="data-table__row">
            <td className="data-table__cell">
              <div className="property-info">
                <img 
                  src={post.images?.[0] || '/placeholder.png'} 
                  alt="" 
                  className="property-info__image" 
                />
                <div className="property-info__details">
                  <div className="property-info__title">{post.title}</div>
                  <div className="property-info__type">{post.property}</div>
                </div>
              </div>
            </td>
            <td className="data-table__cell">
              <span className="badge">{post.type}</span>
            </td>
            <td className="data-table__cell">
              ${post.price?.toLocaleString()}
            </td>
            <td className="data-table__cell">
              <div className="location-info">
                <div className="location-info__city">{post.city}</div>
                <div className="location-info__address">{post.address}</div>
              </div>
            </td>
            <td className="data-table__cell">{post.user?.username}</td>
            <td className="data-table__cell">
              <span className="badge">{post._count?.savedPosts || 0}</span>
            </td>
            <td className="data-table__cell">{formatDate(post.createdAt)}</td>
            <td className="data-table__cell">
              <div className="content-actions">
                <button 
                  className="btn" 
                  onClick={() => handleViewProperty(post.id)}
                  disabled={loadingProperty}
                  title="View"
                >
                  <Eye size={14} />
                </button>
                <button className="btn" title="Edit">
                  <Edit size={14} />
                </button>
                <button 
                  className="btn" 
                  onClick={() => handleDelete(post.id, 'posts')}
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>
      
      <Pagination pagination={pagination} onPageChange={handlePageChange} />
    </div>
  ), [alertProps, posts, loading, pagination, filters, handlePageChange, handleDelete, selectedProperty, loadingProperty, handleViewProperty, handleClosePropertyPreview]);

  const renderChats = useCallback(() => (
    <Chats
      chats={chats}
      loading={loading}
      pagination={pagination}
      onPageChange={handlePageChange}
      onDelete={handleDeleteChat}
      onViewChat={handleViewChat}
    />
  ), [chats, loading, pagination, handlePageChange, handleDeleteChat, handleViewChat]);

  const renderSavedPosts = useCallback(() => (
    <SavedPosts
      savedPosts={savedPosts}
      loading={loading}
      pagination={pagination}
      onPageChange={handlePageChange}
      onDelete={handleDeleteSavedPost}
      onViewSavedPost={handleViewSavedPost}
    />
  ), [savedPosts, loading, pagination, handlePageChange, handleDeleteSavedPost, handleViewSavedPost]);

  const renderMessages = useCallback(() => (
    <Messages
      messages={messages}
      loading={loading}
      pagination={pagination}
      onPageChange={handlePageChange}
      onDelete={handleDeleteMessage}
      onViewMessage={handleViewMessage}
    />
  ), [messages, loading, pagination, handlePageChange, handleDeleteMessage, handleViewMessage]);

  // Memoize the content renderer
  const renderContent = useCallback(() => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            {renderDashboard()}
            <Analytics />
          </>
        );
      case 'users':
        return renderUsers();
      case 'posts':
        return renderPosts();
      case 'chats':
        return renderChats();
      case 'messages':
        return renderMessages();
      case 'saved-posts':
        return renderSavedPosts();
      default:
        return <div className="content-section">Content for {activeTab} coming soon...</div>;
    }
  }, [activeTab, renderDashboard, renderUsers, renderPosts, renderChats, renderMessages, renderSavedPosts]);

  // Optimize useEffect dependencies
  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  useEffect(() => {
    setCurrentPage(1);
    switch (activeTab) {
      case 'users':
        fetchUsers(1, searchTerm);
        break;
      case 'posts':
        fetchPosts(1, searchTerm);
        break;
      case 'chats':
        fetchChats(1, searchTerm);
        break;
      case 'messages':
        fetchMessages(1, searchTerm);
        break;
      case 'saved-posts':
        fetchSavedPosts(1, searchTerm);
        break;
      default:
        break;
    }
  }, [activeTab, searchTerm, filters, fetchUsers, fetchPosts, fetchChats, fetchMessages, fetchSavedPosts]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="admin-dashboard">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
      />
      
      <main className="main-content">
        <DashboardHeader 
          activeTab={activeTab} 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm}
          onMenuClick={handleMenuClick}
        />
        
        <MobileSearch 
          activeTab={activeTab}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        
        <div className="content-container">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default React.memo(AdminDashboard);