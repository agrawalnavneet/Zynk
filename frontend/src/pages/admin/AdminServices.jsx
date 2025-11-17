import { useEffect, useState, useCallback } from 'react';
import { useToast } from '../../context/ToastContext';
import api from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import './AdminPanel.css';
import './AdminServices.css';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: 'deep-cleaning',
    image: '',
    isQuickService: false,
    isActive: true,
    pricingPlans: {
      hourly: '',
      daily: '',
      weekly: '',
      monthly: '',
      yearly: '',
    },
  });
  const { showToast } = useToast();

  const fetchServices = useCallback(async () => {
    try {
      // Fetch all services including inactive ones from admin route
      const res = await api.get('/admin/services');
      setServices(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching services:', error);
      showToast('Error loading services', 'error');
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('pricingPlans.')) {
      const planKey = name.split('.')[1];
      setFormData({
        ...formData,
        pricingPlans: {
          ...formData.pricingPlans,
          [planKey]: value ? parseFloat(value) : null,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const serviceData = {
        ...formData,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        pricingPlans: Object.keys(formData.pricingPlans).reduce((acc, key) => {
          acc[key] = formData.pricingPlans[key] ? parseFloat(formData.pricingPlans[key]) : null;
          return acc;
        }, {}),
      };

      if (editingService) {
        await api.put(`/services/${editingService._id}`, serviceData);
        showToast('Service updated successfully', 'success');
      } else {
        await api.post('/services', serviceData);
        showToast('Service created successfully', 'success');
      }

      setShowModal(false);
      setEditingService(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        duration: '',
        category: 'deep-cleaning',
        image: '',
        isQuickService: false,
        isActive: true,
        pricingPlans: {
          hourly: '',
          daily: '',
          weekly: '',
          monthly: '',
          yearly: '',
        },
      });
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      const errorMessage = error.response?.data?.message || 'Error saving service';
      showToast(errorMessage, 'error');
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      category: service.category,
      image: service.image || '',
      isQuickService: service.isQuickService || false,
      isActive: service.isActive !== undefined ? service.isActive : true,
      pricingPlans: {
        hourly: service.pricingPlans?.hourly || '',
        daily: service.pricingPlans?.daily || '',
        weekly: service.pricingPlans?.weekly || '',
        monthly: service.pricingPlans?.monthly || '',
        yearly: service.pricingPlans?.yearly || '',
      },
    });
    setShowModal(true);
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      await api.delete(`/services/${serviceId}`);
      showToast('Service deleted successfully', 'success');
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      const errorMessage = error.response?.data?.message || 'Error deleting service';
      showToast(errorMessage, 'error');
    }
  };

  const openNewServiceModal = () => {
    setEditingService(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      category: 'deep-cleaning',
      image: '',
      isQuickService: false,
      isActive: true,
      pricingPlans: {
        hourly: '',
        daily: '',
        weekly: '',
        monthly: '',
        yearly: '',
      },
    });
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="admin-services">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-services">
      <div className="admin-page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Manage Services</h1>
            <p>Create, update, and delete services</p>
          </div>
          <button onClick={openNewServiceModal} className="admin-btn admin-btn-primary">
            + Add New Service
          </button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="services-grid">
        {services.length > 0 ? (
          services.map((service) => (
            <div key={service._id} className="service-admin-card">
              {service.image && (
                <div className="service-admin-image">
                  <img src={service.image} alt={service.name} />
                </div>
              )}
              <div className="service-admin-content">
                <div className="service-admin-header">
                  <h3>{service.name}</h3>
                  <span className={`admin-status-badge ${service.isActive ? 'admin-status-confirmed' : 'admin-status-cancelled'}`}>
                    {service.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="service-admin-description">{service.description}</p>
                <div className="service-admin-details">
                  <div className="detail-item">
                    <span className="detail-label">Price:</span>
                    <span className="detail-value">₹{service.price?.toLocaleString('en-IN') || 0}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Duration:</span>
                    <span className="detail-value">{service.duration} min</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Category:</span>
                    <span className="detail-value">{service.category}</span>
                  </div>
                </div>
                <div className="service-admin-actions">
                  <button
                    onClick={() => handleEdit(service)}
                    className="admin-btn admin-btn-secondary admin-btn-small"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(service._id)}
                    className="admin-btn admin-btn-danger admin-btn-small"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="admin-empty-state">
            <div className="admin-empty-state-icon">🔧</div>
            <h3>No services found</h3>
            <p>Create your first service to get started.</p>
            <button onClick={openNewServiceModal} className="admin-btn admin-btn-primary" style={{ marginTop: '16px' }}>
              Add New Service
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingService ? 'Edit Service' : 'Create New Service'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="service-form">
              <div className="form-group">
                <label>Service Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Duration (minutes) *</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="deep-cleaning">Deep Cleaning</option>
                  <option value="regular-cleaning">Regular Cleaning</option>
                  <option value="move-in-out">Move In/Out</option>
                  <option value="office-cleaning">Office Cleaning</option>
                  <option value="post-construction">Post Construction</option>
                  <option value="quick-service">Quick Service</option>
                </select>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      name="isQuickService"
                      checked={formData.isQuickService}
                      onChange={handleInputChange}
                    />
                    Quick Service
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                    />
                    Active
                  </label>
                </div>
              </div>
              <div className="form-section">
                <h3>Pricing Plans (Optional)</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Hourly (₹)</label>
                    <input
                      type="number"
                      name="pricingPlans.hourly"
                      value={formData.pricingPlans.hourly}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="form-group">
                    <label>Daily (₹)</label>
                    <input
                      type="number"
                      name="pricingPlans.daily"
                      value={formData.pricingPlans.daily}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Weekly (₹)</label>
                    <input
                      type="number"
                      name="pricingPlans.weekly"
                      value={formData.pricingPlans.weekly}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="form-group">
                    <label>Monthly (₹)</label>
                    <input
                      type="number"
                      name="pricingPlans.monthly"
                      value={formData.pricingPlans.monthly}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Yearly (₹)</label>
                    <input
                      type="number"
                      name="pricingPlans.yearly"
                      value={formData.pricingPlans.yearly}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="admin-btn admin-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  {editingService ? 'Update' : 'Create'} Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;

