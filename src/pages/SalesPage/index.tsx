import React, { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import CustomerModal from '../../modals/CustomerModal';
import './SalesPage.css';

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  thc: string;
  cbd: string;
  image: string;
  description: string;
  batchId?: string;
  weight?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface Customer {
  id?: string;
  fullName: string;
  dateOfBirth: string;
  age: number;
  phoneNumber: string;
  email: string;
  preferredContact: 'sms' | 'email';
  idType: string;
  idNumber: string;
  idExpiry: string;
  verifiedBy: string;
  notes: string;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
  lastPurchase?: { date: string; amount: number };
}

interface Sale {
  id: string;
  customer: Customer;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'CASH' | 'CARD' | 'CASHAPP';
  timestamp: Date;
  cashierId: string;
  complianceData: {
    batchNumbers: string[];
    weights: string[];
    dosages: string[];
  };
}

const SalesPage: React.FC = () => {
  // State management
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<Customer>({
    fullName: 'Walk-in Customer',
    dateOfBirth: '',
    age: 21,
    phoneNumber: '',
    email: '',
    preferredContact: 'sms',
    idType: 'Driver\'s License',
    idNumber: '',
    idExpiry: '',
    verifiedBy: 'Jamie',
    notes: '',
    tags: []
  });
  const [discountCode, setDiscountCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'CASHAPP'>('CARD');
  const [ageVerified, setAgeVerified] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastSale, setLastSale] = useState<Sale | null>(null);
  
  // Customer modal state
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customerModalMode, setCustomerModalMode] = useState<'add' | 'edit' | 'select'>('add');
  const [savedCustomers, setSavedCustomers] = useState<Customer[]>([]);

  // Sample product data
  const sampleProducts: Product[] = [
    {
      id: '1',
      name: 'Blue Dream Joint',
      brand: 'Buffalo',
      category: 'Pre-Rolls',
      price: 9.00,
      stock: 32,
      thc: '22%',
      cbd: '0.2%',
      image: '🌿',
      description: 'Premium Blue Dream strain pre-rolled joint',
      batchId: 'BD-2024-001',
      weight: '1g'
    },
    {
      id: '2',
      name: 'OG Kush Cartridge',
      brand: 'Buffalo',
      category: 'Cartridges',
      price: 45.00,
      stock: 8,
      thc: '85%',
      cbd: '0.1%',
      image: '🛢️',
      description: 'High-potency OG Kush cartridge',
      batchId: 'OK-2024-002',
      weight: '1g'
    },
    {
      id: '3',
      name: 'Gelato Flower',
      brand: 'Premium',
      category: 'Flower',
      price: 35.00,
      stock: 15,
      thc: '24%',
      cbd: '0.5%',
      image: '🌿',
      description: 'Premium Gelato strain flower',
      batchId: 'GF-2024-003',
      weight: '3.5g'
    },
    {
      id: '4',
      name: 'Chocolate Brownie',
      brand: 'Sweet Treats',
      category: 'Edibles',
      price: 12.00,
      stock: 25,
      thc: '10mg',
      cbd: '0mg',
      image: '🧁',
      description: 'Delicious chocolate brownie',
      batchId: 'CB-2024-004',
      weight: '100mg'
    },
    {
      id: '5',
      name: 'Sour Diesel Mini',
      brand: 'Elevate',
      category: 'Pre-Rolls',
      price: 6.00,
      stock: 12,
      thc: '20%',
      cbd: '0.3%',
      image: '🔥',
      description: 'Compact Sour Diesel mini joint',
      batchId: 'SD-2024-005',
      weight: '0.5g'
    }
  ];

  const categories = ['All', 'Pre-Rolls', 'Cartridges', 'Flower', 'Edibles', 'Beverages', 'Disposables'];

  // Initialize products
  useEffect(() => {
    setProducts(sampleProducts);
    setFilteredProducts(sampleProducts);
  }, []);

  // Filter products based on search and category
  useEffect(() => {
    let filtered = products;
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm]);

  // Cart calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + tax - discountAmount;

  // Add to cart
  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  // Update cart quantity
  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
    } else {
      setCart(prevCart => prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      ));
    }
  };

  // Apply discount
  const applyDiscount = () => {
    if (discountCode.toLowerCase() === 'welcome10') {
      setDiscountAmount(subtotal * 0.10);
      alert('10% discount applied!');
    } else if (discountCode.toLowerCase() === 'medical20') {
      setDiscountAmount(subtotal * 0.20);
      alert('20% medical discount applied!');
    } else {
      alert('Invalid discount code');
    }
    setDiscountCode('');
  };

  // Customer modal handlers
  const handleNewCustomer = () => {
    setCustomerModalMode('add');
    setShowCustomerModal(true);
  };

  const handleSelectCustomer = () => {
    setCustomerModalMode('select');
    setShowCustomerModal(true);
  };

  const handleEditCustomer = () => {
    setCustomerModalMode('edit');
    setShowCustomerModal(true);
  };

  const handleSaveCustomer = (newCustomer: Customer) => {
    if (customerModalMode === 'add') {
      // Add new customer to saved customers
      const customerWithId = { ...newCustomer, id: Date.now().toString() };
      setSavedCustomers(prev => [...prev, customerWithId]);
      setCustomer(customerWithId);
      setAgeVerified(newCustomer.age >= 21);
    } else if (customerModalMode === 'edit') {
      // Update existing customer
      setCustomer(newCustomer);
      setAgeVerified(newCustomer.age >= 21);
    } else if (customerModalMode === 'select') {
      // Select existing customer
      setCustomer(newCustomer);
      setAgeVerified(newCustomer.age >= 21);
    }
  };

  // Process payment
  const processPayment = async () => {
    if (!ageVerified) {
      alert('Please verify customer age before processing payment.');
      return;
    }

    if (cart.length === 0) {
      alert('Cart is empty. Please add items before processing payment.');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create sale record
      const sale: Sale = {
        id: `SALE-${Date.now()}`,
        customer,
        items: cart,
        subtotal,
        tax,
        discount: discountAmount,
        total,
        paymentMethod,
        timestamp: new Date(),
        cashierId: 'Jamie',
        complianceData: {
          batchNumbers: cart.map(item => item.product.batchId || 'N/A'),
          weights: cart.map(item => item.product.weight || 'N/A'),
          dosages: cart.map(item => `${item.product.thc} THC, ${item.product.cbd} CBD`)
        }
      };

      setLastSale(sale);
      setShowReceipt(true);
      setCart([]);
      setDiscountAmount(0);
      setAgeVerified(false);
      
      // Reset to walk-in customer
      setCustomer({
        fullName: 'Walk-in Customer',
        dateOfBirth: '',
        age: 21,
        phoneNumber: '',
        email: '',
        preferredContact: 'sms',
        idType: 'Driver\'s License',
        idNumber: '',
        idExpiry: '',
        verifiedBy: 'Jamie',
        notes: '',
        tags: []
      });

      console.log('Sale processed:', sale);
      console.log('Compliance data:', sale.complianceData);

    } catch (error) {
      alert('Payment processing failed. Please try again.');
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Receipt functions
  const printReceipt = () => {
    if (lastSale) {
      console.log('Printing receipt for sale:', lastSale.id);
      alert('Receipt sent to printer');
    }
  };

  const emailReceipt = () => {
    if (lastSale && lastSale.customer.email) {
      console.log('Emailing receipt to:', lastSale.customer.email);
      alert(`Receipt sent to ${lastSale.customer.email}`);
    } else {
      alert('No email address available for customer');
    }
  };

  // Refund transaction
  const refundTransaction = () => {
    if (lastSale) {
      if (window.confirm('Are you sure you want to refund this transaction?')) {
        console.log('Processing refund for sale:', lastSale.id);
        alert('Refund processed successfully');
        setLastSale(null);
      }
    }
  };

  return (
    <div className="dashboard-container">
      <Navigation currentPage="sales" />
      <div className="dashboard-content">
        <div className="sales-page">
          <div className="sales-header">
            <h1>💳 Point of Sale</h1>
            <div className="sales-status">
              <span className={`status-indicator ${ageVerified ? 'verified' : 'unverified'}`}>
                {ageVerified ? '✅ Age Verified' : '⚠️ Age Not Verified'}
              </span>
            </div>
          </div>

          <div className="sales-layout">
            {/* Product Catalog Panel */}
            <div className="product-catalog">
              <div className="catalog-header">
                <h2>📦 Product Catalog</h2>
                <div className="catalog-controls">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="category-select"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="products-grid">
                {filteredProducts.map(product => (
                  <div key={product.id} className="product-card">
                    <div className="product-image">{product.image}</div>
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <p className="brand">{product.brand}</p>
                      <div className="product-badges">
                        <span className="thc-badge">THC: {product.thc}</span>
                        <span className="cbd-badge">CBD: {product.cbd}</span>
                      </div>
                      <div className="product-details">
                        <span className="price">${product.price.toFixed(2)}</span>
                        <span className="stock">Stock: {product.stock}</span>
                      </div>
                    </div>
                    <div className="product-actions">
                      <button 
                        className="add-to-cart-btn"
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                      >
                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sale Cart Panel */}
            <div className="sale-cart">
              <div className="cart-header">
                <h2>🛒 Sale Cart</h2>
                <button 
                  className="clear-cart-btn"
                  onClick={() => setCart([])}
                  disabled={cart.length === 0}
                >
                  Clear Cart
                </button>
              </div>

              {/* Customer Information */}
              <div className="customer-section">
                <h3>👤 Customer Info</h3>
                <div className="customer-display">
                  <div className="customer-info">
                    <strong>{customer.fullName}</strong>
                    {customer.age > 0 && <span> • Age: {customer.age}</span>}
                    {customer.phoneNumber && <span> • {customer.phoneNumber}</span>}
                    {customer.email && <span> • {customer.email}</span>}
                    {customer.tags.length > 0 && (
                      <div className="customer-tags">
                        {customer.tags.map(tag => (
                          <span key={tag} className="customer-tag">{tag}</span>
                        ))}
                      </div>
                    )}
                    {customer.lastPurchase && (
                      <div className="last-visit">
                        Last visit: {new Date(customer.lastPurchase.date).toLocaleDateString()} (${customer.lastPurchase.amount.toFixed(2)})
                      </div>
                    )}
                    {customer.idNumber && (
                      <div className="id-verification">
                        Verified ID: {customer.idNumber} (Expires {new Date(customer.idExpiry).toLocaleDateString()})
                      </div>
                    )}
                    {customer.phoneNumber && (
                      <div className="contact-info">
                        📞 Contact: {customer.phoneNumber}
                      </div>
                    )}
                  </div>
                  <div className="customer-actions">
                    <button 
                      className="customer-btn"
                      onClick={handleNewCustomer}
                    >
                      🆕 New Customer
                    </button>
                    <button 
                      className="customer-btn"
                      onClick={handleSelectCustomer}
                    >
                      👥 Select Customer
                    </button>
                    {customer.fullName !== 'Walk-in Customer' && (
                      <button 
                        className="customer-btn"
                        onClick={handleEditCustomer}
                      >
                        ✏️ Edit
                      </button>
                    )}
                  </div>
                  <button 
                    className={`age-verify-btn ${ageVerified ? 'verified' : ''}`}
                    onClick={() => setAgeVerified(!ageVerified)}
                    disabled={customer.age < 21}
                  >
                    {ageVerified ? '✅ Age Verified' : '🔍 Verify Age'}
                  </button>
                </div>
              </div>

              {/* Cart Items */}
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item.product.id} className="cart-item">
                    <div className="item-info">
                      <span className="item-name">{item.product.name}</span>
                      <span className="item-price">${item.product.price.toFixed(2)}</span>
                    </div>
                    <div className="item-quantity">
                      <button 
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="quantity-btn"
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button 
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="quantity-btn"
                        disabled={item.quantity >= item.product.stock}
                      >
                        +
                      </button>
                    </div>
                    <div className="item-total">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Discount */}
              <div className="discount-section">
                <input
                  type="text"
                  placeholder="Discount code"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  className="discount-input"
                />
                <button onClick={applyDiscount} className="apply-discount-btn">
                  Apply
                </button>
              </div>

              {/* Totals */}
              <div className="cart-totals">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>Tax (8%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="total-row discount">
                    <span>Discount:</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="total-row final">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="payment-methods">
                <h3>💳 Payment Method</h3>
                <div className="payment-buttons">
                  <button 
                    className={`payment-btn ${paymentMethod === 'CASH' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('CASH')}
                  >
                    💵 Cash
                  </button>
                  <button 
                    className={`payment-btn ${paymentMethod === 'CARD' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('CARD')}
                  >
                    💳 Card
                  </button>
                  <button 
                    className={`payment-btn ${paymentMethod === 'CASHAPP' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('CASHAPP')}
                  >
                    📱 Cash App
                  </button>
                </div>
              </div>

              {/* Process Payment */}
              <button 
                className="process-payment-btn"
                onClick={processPayment}
                disabled={!ageVerified || cart.length === 0 || isProcessing}
              >
                {isProcessing ? 'Processing...' : `Process ${paymentMethod} Payment`}
              </button>

              {/* Refund Button */}
              {lastSale && (
                <button 
                  className="refund-btn"
                  onClick={refundTransaction}
                >
                  🔄 Refund Last Transaction
                </button>
              )}
            </div>
          </div>

          {/* Customer Modal */}
          <CustomerModal
            isOpen={showCustomerModal}
            onClose={() => setShowCustomerModal(false)}
            onSave={handleSaveCustomer}
            existingCustomer={customerModalMode === 'edit' ? customer : undefined}
            mode={customerModalMode}
            savedCustomers={savedCustomers}
          />

          {/* Receipt Modal */}
          {showReceipt && lastSale && (
            <div className="modal-overlay" onClick={() => setShowReceipt(false)}>
              <div className="modal-content receipt-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>🧾 Receipt - {lastSale.id}</h2>
                  <button className="modal-close" onClick={() => setShowReceipt(false)}>×</button>
                </div>
                
                <div className="modal-body">
                  <div className="receipt-content">
                    <div className="receipt-header">
                      <h3>Buffalo Garden</h3>
                      <p>Cannabis Retailer</p>
                      <p>{lastSale.timestamp.toLocaleString()}</p>
                      <p>Cashier: {lastSale.cashierId}</p>
                    </div>

                    <div className="receipt-items">
                      {lastSale.items.map(item => (
                        <div key={item.product.id} className="receipt-item">
                          <span>{item.product.name} x{item.quantity}</span>
                          <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="receipt-totals">
                      <div>Subtotal: ${lastSale.subtotal.toFixed(2)}</div>
                      <div>Tax: ${lastSale.tax.toFixed(2)}</div>
                      {lastSale.discount > 0 && (
                        <div>Discount: -${lastSale.discount.toFixed(2)}</div>
                      )}
                      <div className="final-total">Total: ${lastSale.total.toFixed(2)}</div>
                    </div>

                    <div className="receipt-footer">
                      <p>Payment: {lastSale.paymentMethod}</p>
                      <p>Customer: {lastSale.customer.fullName}</p>
                      <p>Thank you for your purchase!</p>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button className="btn-secondary" onClick={printReceipt}>
                    🖨️ Print Receipt
                  </button>
                  <button className="btn-secondary" onClick={emailReceipt}>
                    📧 Email Receipt
                  </button>
                  <button className="btn-primary" onClick={() => setShowReceipt(false)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesPage; 