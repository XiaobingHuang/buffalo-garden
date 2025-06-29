import React, { useState } from 'react';
import Navigation from '../../components/Navigation';
import './InventoryPage.css';

interface Product {
  id: string;
  name: string;
  brand: string;
  size: string;
  thc: string;
  cbd: string;
  price: number;
  stock: number;
  expiry: string;
  status: 'active' | 'low' | 'out' | 'expired' | 'archived';
  category: string;
  image: string;
  description?: string;
  complianceCert?: string;
  batchId?: string;
  type: string;
}

interface Category {
  name: string;
  emoji: string;
  products: number;
  units: string;
  totalUnits: number;
  collapsed: boolean;
  health: 'healthy' | 'low' | 'critical';
}

const InventoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All Types');
  const [sortBy, setSortBy] = useState('Name');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  const categories: Category[] = [
    { name: 'Pre-Rolls', emoji: '🔥', products: 18, units: 'joints', totalUnits: 400, collapsed: false, health: 'low' },
    { name: 'Cartridges', emoji: '🛢️', products: 15, units: 'units', totalUnits: 300, collapsed: true, health: 'critical' },
    { name: 'Flower', emoji: '🌿', products: 24, units: 'grams', totalUnits: 720, collapsed: true, health: 'healthy' },
    { name: 'Edibles', emoji: '🧁', products: 12, units: 'units', totalUnits: 360, collapsed: true, health: 'healthy' },
    { name: 'Beverages', emoji: '🧃', products: 8, units: 'bottles', totalUnits: 120, collapsed: true, health: 'healthy' },
    { name: 'Disposables', emoji: '💨', products: 10, units: 'pens', totalUnits: 200, collapsed: true, health: 'low' },
    { name: 'Capsules', emoji: '💊', products: 6, units: 'units', totalUnits: 150, collapsed: true, health: 'healthy' },
    { name: 'Concentrates', emoji: '🌬️', products: 5, units: 'grams', totalUnits: 50, collapsed: true, health: 'healthy' },
    { name: 'Topicals', emoji: '🧴', products: 3, units: 'units', totalUnits: 40, collapsed: true, health: 'healthy' },
  ];

  const products: Product[] = [
    {
      id: '1',
      name: 'Blue Dream Joint',
      brand: 'Buffalo',
      size: '1g',
      thc: '22%',
      cbd: '0.2%',
      price: 9.00,
      stock: 32,
      expiry: '09/2025',
      status: 'active',
      category: 'Pre-Rolls',
      image: '🌿',
      description: 'Premium Blue Dream strain pre-rolled joint with smooth draw and balanced effects.',
      type: 'Pre-Roll'
    },
    {
      id: '2',
      name: 'Sour Diesel Mini',
      brand: 'Elevate',
      size: '0.5g',
      thc: '20%',
      cbd: '0.3%',
      price: 6.00,
      stock: 12,
      expiry: '07/2025',
      status: 'low',
      category: 'Pre-Rolls',
      image: '🔥',
      description: 'Compact Sour Diesel mini joint for quick sessions.',
      type: 'Pre-Roll'
    },
    {
      id: '3',
      name: 'OG Kush Cartridge',
      brand: 'Buffalo',
      size: '1g',
      thc: '85%',
      cbd: '0.1%',
      price: 45.00,
      stock: 8,
      expiry: '12/2025',
      status: 'low',
      category: 'Cartridges',
      image: '🛢️',
      description: 'High-potency OG Kush cartridge with authentic strain profile.',
      type: 'Cartridge'
    },
    {
      id: '4',
      name: 'Gelato Flower',
      brand: 'Premium',
      size: '3.5g',
      thc: '24%',
      cbd: '0.5%',
      price: 35.00,
      stock: 15,
      expiry: '08/2025',
      status: 'active',
      category: 'Flower',
      image: '🌿',
      description: 'Premium Gelato strain with sweet aroma and balanced effects.',
      type: 'Flower'
    },
    {
      id: '5',
      name: 'Chocolate Brownie',
      brand: 'Sweet Treats',
      size: '100mg',
      thc: '10mg',
      cbd: '0mg',
      price: 12.00,
      stock: 25,
      expiry: '06/2025',
      status: 'active',
      category: 'Edibles',
      image: '🧁',
      description: 'Delicious chocolate brownie with precise THC dosing.',
      type: 'Edible'
    }
  ];

  const [collapsedCategories, setCollapsedCategories] = useState<{[key: string]: boolean}>({
    'Pre-Rolls': false,
    'Cartridges': true,
    'Flower': true,
    'Edibles': true,
    'Beverages': true,
    'Disposables': true,
    'Capsules': true,
    'Concentrates': true,
    'Topicals': true,
  });

  const toggleCategory = (categoryName: string) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="status-active">✅ Active</span>;
      case 'low':
        return <span className="status-low">🟡 Low Stock</span>;
      case 'out':
        return <span className="status-out">🟥 Out</span>;
      case 'expired':
        return <span className="status-expired">⚠️ Expired</span>;
      case 'archived':
        return <span className="status-archived">🟥 Archived</span>;
      default:
        return <span className="status-active">✅ Active</span>;
    }
  };

  const getHealthDisplay = (health: string) => {
    switch (health) {
      case 'healthy':
        return <span className="health-healthy">🟢 Healthy</span>;
      case 'low':
        return <span className="health-low">🟠 Low</span>;
      case 'critical':
        return <span className="health-critical">🔴 Critical</span>;
      default:
        return <span className="health-healthy">🟢 Healthy</span>;
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setModalMode('edit');
    setShowModal(true);
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setModalMode('add');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = () => {
    // TODO: Implement save logic
    console.log('Saving product:', editingProduct);
    closeModal();
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'All Types' || product.category === filterType;
    return matchesSearch && matchesFilter;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'Name':
        return a.name.localeCompare(b.name);
      case 'Brand':
        return a.brand.localeCompare(b.brand);
      case 'Price':
        return a.price - b.price;
      case 'Stock':
        return a.stock - b.stock;
      case 'THC':
        return parseFloat(a.thc) - parseFloat(b.thc);
      case 'Expiry':
        return a.expiry.localeCompare(b.expiry);
      default:
        return 0;
    }
  });

  return (
    <div className="dashboard-container">
      <Navigation currentPage="inventory" />
      <div className="dashboard-content">
        <div className="inventory-page">
          <div className="inventory-header">
            <div className="header-left">
              <h1>🧾 Inventory Manager</h1>
            </div>
            <div className="header-right">
              <button className="add-product-btn" onClick={openAddModal}>+ Add Product</button>
            </div>
          </div>

          <div className="inventory-controls">
            <div className="search-section">
              <input
                type="text"
                placeholder="Search products, brands, or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-section">
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
                className="filter-select"
              >
                <option>All Types</option>
                <option>Low Stock</option>
                <option>Archived</option>
                <option>Expired</option>
                {categories.map(cat => (
                  <option key={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="sort-section">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option>Name</option>
                <option>Brand</option>
                <option>Price</option>
                <option>Stock</option>
                <option>THC</option>
                <option>Expiry</option>
              </select>
            </div>
          </div>

          <div className="inventory-content">
            {categories.map(category => {
              const categoryProducts = sortedProducts.filter(p => p.category === category.name);
              const isCollapsed = collapsedCategories[category.name];
              
              return (
                <div key={category.name} className="category-section">
                  <div 
                    className="category-header"
                    onClick={() => toggleCategory(category.name)}
                  >
                    <div className="category-info">
                      <span className="category-emoji">{category.emoji}</span>
                      <span className="category-name">{category.name}</span>
                      <span className="category-stats">
                        ({category.products} products, {category.totalUnits} {category.units} total)
                      </span>
                      {getHealthDisplay(category.health)}
                    </div>
                    <div className="category-toggle">
                      {isCollapsed ? '▼' : '▲'}
                    </div>
                  </div>

                  {!isCollapsed && categoryProducts.length > 0 && (
                    <div className="products-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Brand</th>
                            <th>Size</th>
                            <th>THC/CBD</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Expiry</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categoryProducts.map(product => (
                            <tr key={product.id} className="product-row" title={product.description}>
                              <td className="product-image">{product.image}</td>
                              <td className="product-name">{product.name}</td>
                              <td className="product-brand">{product.brand}</td>
                              <td className="product-size">{product.size}</td>
                              <td className="product-thc">{product.thc}/{product.cbd}</td>
                              <td className="product-price">${product.price.toFixed(2)}</td>
                              <td className="product-stock">{product.stock}</td>
                              <td className="product-expiry">{product.expiry}</td>
                              <td className="product-status">{getStatusDisplay(product.status)}</td>
                              <td className="product-actions">
                                {product.status === 'low' && (
                                  <button className="action-btn restock">Restock</button>
                                )}
                                <button className="action-btn edit" onClick={() => openEditModal(product)}>Edit</button>
                                <button className="action-btn archive">Archive</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {!isCollapsed && categoryProducts.length === 0 && (
                    <div className="no-products">
                      <p>No products found in this category.</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalMode === 'edit' ? 'Edit Product' : 'Add Product'} - {editingProduct?.name || 'New Product'}</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group photo-upload">
                  <label>Photo Upload</label>
                  <div className="upload-area">
                    <span>📷 Click to upload image</span>
                  </div>
                </div>
                <div className="form-group">
                  <label>Brand</label>
                  <input 
                    type="text" 
                    placeholder="Brand name"
                    defaultValue={editingProduct?.brand || ''}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input 
                    type="text" 
                    placeholder="Product name"
                    defaultValue={editingProduct?.name || ''}
                  />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select defaultValue={editingProduct?.type || 'Pre-Roll'}>
                    <option>Pre-Roll</option>
                    <option>Cartridge</option>
                    <option>Flower</option>
                    <option>Edible</option>
                    <option>Beverage</option>
                    <option>Disposable</option>
                    <option>Capsule</option>
                    <option>Concentrate</option>
                    <option>Topical</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Size</label>
                  <input 
                    type="text" 
                    placeholder="e.g., 1g, 100mg"
                    defaultValue={editingProduct?.size || ''}
                  />
                </div>
                <div className="form-group">
                  <label>Price</label>
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="0.00"
                    defaultValue={editingProduct?.price || ''}
                  />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input 
                    type="number" 
                    placeholder="0"
                    defaultValue={editingProduct?.stock || ''}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>THC %</label>
                  <input 
                    type="text" 
                    placeholder="e.g., 22%"
                    defaultValue={editingProduct?.thc || ''}
                  />
                </div>
                <div className="form-group">
                  <label>CBD %</label>
                  <input 
                    type="text" 
                    placeholder="e.g., 0.2%"
                    defaultValue={editingProduct?.cbd || ''}
                  />
                </div>
                <div className="form-group">
                  <label>Expiry</label>
                  <input 
                    type="text" 
                    placeholder="MM/YYYY"
                    defaultValue={editingProduct?.expiry || ''}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>📎 Upload Compliance Certificate (PDF)</label>
                  <input type="file" accept=".pdf" />
                </div>
                <div className="form-group">
                  <label>🗃️ Batch ID</label>
                  <input 
                    type="text" 
                    placeholder="Optional batch identifier"
                    defaultValue={editingProduct?.batchId || ''}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn-primary" onClick={handleSaveProduct}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage; 