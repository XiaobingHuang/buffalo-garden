import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navigation.css';

interface NavigationProps {
  currentPage: 'home' | 'inventory' | 'sales' | 'settings';
}

const Navigation: React.FC<NavigationProps> = ({ currentPage }) => {
  const navigate = useNavigate();

  const handleNavClick = (tab: string) => {
    switch (tab) {
      case 'home':
        navigate('/dashboard');
        break;
      case 'inventory':
        navigate('/inventory');
        break;
      case 'sales':
        navigate('/sales');
        break;
      case 'settings':
        navigate('/settings');
        break;
      default:
        break;
    }
  };

  const getTabClass = (tab: string) => {
    return `nav-tab ${currentPage === tab ? 'active' : ''}`;
  };

  return (
    <nav className="navbar">
      <div className="logo">Buffalo Garden</div>
      <div className="nav-tabs">
        <span 
          className={getTabClass('home')} 
          onClick={() => handleNavClick('home')}
        >
          🏠 Home
        </span>
        <span 
          className={getTabClass('inventory')} 
          onClick={() => handleNavClick('inventory')}
        >
          📦 Inventory
        </span>
        <span 
          className={getTabClass('sales')} 
          onClick={() => handleNavClick('sales')}
        >
          💳 Sales
        </span>
        <span 
          className={getTabClass('settings')} 
          onClick={() => handleNavClick('settings')}
        >
          ⚙️ Settings
        </span>
      </div>
    </nav>
  );
};

export default Navigation; 