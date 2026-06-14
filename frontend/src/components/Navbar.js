import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">GPT — Great Pickle Taste</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
            {user.role === 'admin' && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/admin">Dashboard</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/admin/users">Staff</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/admin/products">Inventory</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/admin/orders">Orders</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/admin/sales">Sales Log</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/admin/reports">Reports</Link></li>
              </>
            )}
            {user.role === 'staff' && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/staff">Dashboard</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/staff/new-sale">New Sale</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/staff/my-sales">My Sales</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/staff/inventory">Inventory</Link></li>
              </>
            )}
          </ul>
          <span className="navbar-text me-3">{user.name} ({user.role})</span>
          <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
