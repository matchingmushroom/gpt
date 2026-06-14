import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'staff' });
  const [editingId, setEditingId] = useState(null);

  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    const { data } = await axios.get(`${API}/users`, { headers });
    setUsers(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      await axios.put(`${API}/users/${editingId}`, payload, { headers });
    } else {
      await axios.post(`${API}/users`, form, { headers });
    }
    setShowForm(false);
    setForm({ name: '', email: '', password: '', role: 'staff' });
    setEditingId(null);
    fetchUsers();
  };

  const handleEdit = (user) => {
    setForm({ name: user.name, email: user.email, password: '', role: user.role });
    setEditingId(user._id);
    setShowForm(true);
  };

  const handleToggleActive = async (user) => {
    await axios.put(`${API}/users/${user._id}`, { isActive: !user.isActive }, { headers });
    fetchUsers();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this user?')) {
      await axios.delete(`${API}/users/${id}`, { headers });
      fetchUsers();
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h2>Staff Management</h2>
        <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ name: '', email: '', password: '', role: 'staff' }); }}>
          {showForm ? 'Cancel' : 'Add Staff'}
        </button>
      </div>

      {showForm && (
        <div className="card mt-3">
          <div className="card-body">
            <h5>{editingId ? 'Edit Staff' : 'Add New Staff'}</h5>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-3 mb-2">
                  <input className="form-control" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="col-md-3 mb-2">
                  <input type="email" className="form-control" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div className="col-md-2 mb-2">
                  <input className="form-control" placeholder={editingId ? 'Leave blank to keep' : 'Password'} type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required={!editingId} />
                </div>
                <div className="col-md-2 mb-2">
                  <select className="form-select" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="col-md-2 mb-2">
                  <button type="submit" className="btn btn-success w-100">{editingId ? 'Update' : 'Create'}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <table className="table table-striped mt-3">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td><span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>{user.role}</span></td>
              <td><span className={`badge ${user.isActive ? 'bg-success' : 'bg-secondary'}`}>{user.isActive ? 'Active' : 'Inactive'}</span></td>
              <td>
                <button className="btn btn-sm btn-warning me-1" onClick={() => handleEdit(user)}>Edit</button>
                <button className="btn btn-sm btn-secondary me-1" onClick={() => handleToggleActive(user)}>{user.isActive ? 'Deactivate' : 'Activate'}</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
