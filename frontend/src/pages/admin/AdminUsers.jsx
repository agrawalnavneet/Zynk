import { useEffect, useState, useCallback } from 'react';
import { useToast } from '../../context/ToastContext';
import api from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import './AdminPanel.css';
import './AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useToast();

  const fetchUsers = useCallback(async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      showToast('Error loading users', 'error');
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This will also delete all their bookings.`)) {
      return;
    }

    try {
      await api.delete(`/admin/users/${userId}`);
      showToast('User deleted successfully', 'success');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      const errorMessage = error.response?.data?.message || 'Error deleting user';
      showToast(errorMessage, 'error');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="admin-users">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-users">
      <div className="admin-page-header">
        <h1>Manage Users</h1>
        <p>View and manage all registered users</p>
      </div>

      {/* Search */}
      <div className="admin-card">
        <div className="search-group">
          <label htmlFor="search-users">Search Users:</label>
          <input
            id="search-users"
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="users-count">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </div>

      {/* Users Table */}
      <div className="admin-card">
        {filteredUsers.length > 0 ? (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td className="user-name-cell">
                      <div className="user-avatar">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      {user.name || 'N/A'}
                    </td>
                    <td>{user.email || 'N/A'}</td>
                    <td>{user.phone || 'N/A'}</td>
                    <td className="address-cell">
                      {user.address?.street
                        ? `${user.address.street}, ${user.address.city}, ${user.address.state}`
                        : 'N/A'}
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteUser(user._id, user.name)}
                        className="admin-btn admin-btn-danger admin-btn-small"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty-state">
            <div className="admin-empty-state-icon">👥</div>
            <h3>No users found</h3>
            <p>
              {searchTerm
                ? `No users match "${searchTerm}"`
                : 'No users have registered yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;

