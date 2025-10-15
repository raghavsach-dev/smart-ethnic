'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Plus, Edit, Trash2, Package, Tag, Percent, Eye, EyeOff, Save, X, Upload, Star } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  subcategory?: string;
  rating?: number;
  isNew?: boolean;
  isSale?: boolean;
  stock: number;
  description: string;
  sizes: string[];
  colors: string[];
  material: string;
  careInstructions: string;
  discount?: number;
  specialOffer?: string;
  isActive: boolean;
}

const initialProducts: Product[] = [
  // Shirts
  {
    id: '1',
    name: 'Premium Cotton Casual Shirt',
    price: 2499,
    originalPrice: 3499,
    image: '/api/placeholder/400/400',
    category: 'shirts',
    subcategory: 'casual',
    rating: 4.8,
    isNew: true,
    isSale: true,
    stock: 25,
    description: 'Premium quality cotton shirt perfect for casual wear. Made from 100% organic cotton with comfortable fit.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Blue', 'Gray', 'Black'],
    material: '100% Organic Cotton',
    careInstructions: 'Machine wash cold, tumble dry low, do not bleach',
    discount: 20,
    specialOffer: 'Buy 2 Get 10% Off',
    isActive: true
  },
  {
    id: '2',
    name: 'Classic Formal Shirt',
    price: 3299,
    image: '/api/placeholder/400/400',
    category: 'shirts',
    subcategory: 'formal',
    rating: 4.6,
    isNew: false,
    isSale: false,
    stock: 15,
    description: 'Elegant formal shirt made from premium Egyptian cotton. Perfect for business meetings and formal occasions.',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Light Blue', 'Gray'],
    material: 'Egyptian Cotton Blend',
    careInstructions: 'Dry clean only',
    isActive: true
  },
  {
    id: '3',
    name: 'Designer Printed Shirt',
    price: 2799,
    image: '/api/placeholder/400/400',
    category: 'shirts',
    subcategory: 'printed',
    rating: 4.7,
    isNew: true,
    isSale: false,
    stock: 30,
    description: 'Designer printed shirt with unique patterns. Made from breathable fabric perfect for all seasons.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Multicolor'],
    material: 'Polyester Cotton Blend',
    careInstructions: 'Machine wash warm, iron on reverse',
    discount: 10,
    isActive: true
  }
];

const categories = [
  'shirts', 'pants', 'suits', 'blazers', 'jodhpuri', 'indo-western',
  'koti-kurta', 'sherwani', 'paghdi/shafa', 'juti/mojdi', 'lowers'
];

export default function AdminPanel() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'analytics' | 'orders'>('products');

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    originalPrice: 0,
    image: '',
    category: '',
    subcategory: '',
    stock: 0,
    description: '',
    sizes: [],
    colors: [],
    material: '',
    careInstructions: '',
    discount: 0,
    specialOffer: '',
    isActive: true,
    isNew: false,
    isSale: false
  });

  const handleInputChange = (field: keyof Product, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSizeChange = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes?.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...(prev.sizes || []), size]
    }));
  };

  const handleColorChange = (color: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors?.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...(prev.colors || []), color]
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: 0,
      originalPrice: 0,
      image: '',
      category: '',
      subcategory: '',
      stock: 0,
      description: '',
      sizes: [],
      colors: [],
      material: '',
      careInstructions: '',
      discount: 0,
      specialOffer: '',
      isActive: true,
      isNew: false,
      isSale: false
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingProduct) {
      setProducts(prev => prev.map(p =>
        p.id === editingProduct.id
          ? { ...p, ...formData, id: p.id }
          : p
      ));
      setEditingProduct(null);
    } else {
      const newProduct: Product = {
        ...formData as Product,
        id: Date.now().toString(),
        rating: 0
      };
      setProducts(prev => [...prev, newProduct]);
    }

    resetForm();
    setShowAddForm(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setShowAddForm(true);
  };

  const handleDelete = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  const toggleProductStatus = (productId: string) => {
    setProducts(prev => prev.map(p =>
      p.id === productId
        ? { ...p, isActive: !p.isActive }
        : p
    ));
  };

  const updateStock = (productId: string, newStock: number) => {
    setProducts(prev => prev.map(p =>
      p.id === productId
        ? { ...p, stock: Math.max(0, newStock) }
        : p
    ));
  };

  return (
    <div className="min-h-screen bg-primary-dark">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-accent-brown mb-4">Admin Panel</h1>
          <p className="text-secondary-brown">Manage your e-commerce inventory, pricing, and promotions</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-secondary-brown rounded-lg p-1 mb-8 w-fit">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              activeTab === 'products'
                ? 'bg-primary-dark text-cream shadow-sm'
                : 'text-primary-dark hover:bg-accent-brown hover:text-primary-dark'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              activeTab === 'analytics'
                ? 'bg-primary-dark text-cream shadow-sm'
                : 'text-primary-dark hover:bg-accent-brown hover:text-primary-dark'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              activeTab === 'orders'
                ? 'bg-primary-dark text-cream shadow-sm'
                : 'text-primary-dark hover:bg-accent-brown hover:text-primary-dark'
            }`}
          >
            Orders
          </button>
        </div>

        {activeTab === 'products' && (
          <div>
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-secondary-brown">Product Management</h2>
                <p className="text-accent-brown">Total Products: {products.length}</p>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setEditingProduct(null);
                  setShowAddForm(true);
                }}
                className="flex items-center gap-2 bg-accent-brown text-primary-dark px-6 py-3 rounded-lg font-semibold hover:bg-accent-brown/80 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Add Product
              </button>
            </div>

            {/* Add/Edit Product Form */}
            {showAddForm && (
              <div className="bg-secondary-brown rounded-xl p-6 mb-8 border border-accent-brown">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-primary-dark">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingProduct(null);
                      resetForm();
                    }}
                    className="text-primary-dark hover:text-accent-brown transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-primary-dark">Basic Information</h4>

                      <div>
                        <label className="block text-sm font-medium text-primary-dark mb-2">
                          Product Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name || ''}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full px-4 py-3 border border-accent-brown rounded-lg bg-primary-dark text-cream focus:ring-2 focus:ring-accent-brown focus:border-transparent outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-primary-dark mb-2">
                          Description *
                        </label>
                        <textarea
                          value={formData.description || ''}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 border border-accent-brown rounded-lg bg-primary-dark text-cream focus:ring-2 focus:ring-accent-brown focus:border-transparent outline-none"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-primary-dark mb-2">
                            Price (₹) *
                          </label>
                          <input
                            type="number"
                            value={formData.price || ''}
                            onChange={(e) => handleInputChange('price', Number(e.target.value))}
                            className="w-full px-4 py-3 border border-accent-brown rounded-lg bg-primary-dark text-cream focus:ring-2 focus:ring-accent-brown focus:border-transparent outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-primary-dark mb-2">
                            Original Price (₹)
                          </label>
                          <input
                            type="number"
                            value={formData.originalPrice || ''}
                            onChange={(e) => handleInputChange('originalPrice', Number(e.target.value))}
                            className="w-full px-4 py-3 border border-accent-brown rounded-lg bg-primary-dark text-cream focus:ring-2 focus:ring-accent-brown focus:border-transparent outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-primary-dark mb-2">
                            Category *
                          </label>
                          <select
                            value={formData.category || ''}
                            onChange={(e) => handleInputChange('category', e.target.value)}
                            className="w-full px-4 py-3 border border-accent-brown rounded-lg bg-primary-dark text-cream focus:ring-2 focus:ring-accent-brown focus:border-transparent outline-none"
                            required
                          >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-primary-dark mb-2">
                            Subcategory
                          </label>
                          <input
                            type="text"
                            value={formData.subcategory || ''}
                            onChange={(e) => handleInputChange('subcategory', e.target.value)}
                            className="w-full px-4 py-3 border border-accent-brown rounded-lg bg-primary-dark text-cream focus:ring-2 focus:ring-accent-brown focus:border-transparent outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-primary-dark mb-2">
                          Stock Quantity *
                        </label>
                        <input
                          type="number"
                          value={formData.stock || ''}
                          onChange={(e) => handleInputChange('stock', Number(e.target.value))}
                          className="w-full px-4 py-3 border border-accent-brown rounded-lg bg-primary-dark text-cream focus:ring-2 focus:ring-accent-brown focus:border-transparent outline-none"
                          required
                        />
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-primary-dark">Additional Details</h4>

                      <div>
                        <label className="block text-sm font-medium text-primary-dark mb-2">
                          Image URL *
                        </label>
                        <input
                          type="text"
                          value={formData.image || ''}
                          onChange={(e) => handleInputChange('image', e.target.value)}
                          className="w-full px-4 py-3 border border-accent-brown rounded-lg bg-primary-dark text-cream focus:ring-2 focus:ring-accent-brown focus:border-transparent outline-none"
                          placeholder="/api/placeholder/400/400"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-primary-dark mb-2">
                          Material
                        </label>
                        <input
                          type="text"
                          value={formData.material || ''}
                          onChange={(e) => handleInputChange('material', e.target.value)}
                          className="w-full px-4 py-3 border border-accent-brown rounded-lg bg-primary-dark text-cream focus:ring-2 focus:ring-accent-brown focus:border-transparent outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-primary-dark mb-2">
                          Care Instructions
                        </label>
                        <textarea
                          value={formData.careInstructions || ''}
                          onChange={(e) => handleInputChange('careInstructions', e.target.value)}
                          rows={2}
                          className="w-full px-4 py-3 border border-accent-brown rounded-lg bg-primary-dark text-cream focus:ring-2 focus:ring-accent-brown focus:border-transparent outline-none"
                        />
                      </div>

                      {/* Sizes */}
                      <div>
                        <label className="block text-sm font-medium text-primary-dark mb-2">
                          Available Sizes
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                            <button
                              key={size}
                              type="button"
                              onClick={() => handleSizeChange(size)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                formData.sizes?.includes(size)
                                  ? 'bg-primary-dark text-cream'
                                  : 'bg-accent-brown text-primary-dark hover:bg-accent-brown/80'
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Colors */}
                      <div>
                        <label className="block text-sm font-medium text-primary-dark mb-2">
                          Available Colors
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {['White', 'Black', 'Blue', 'Red', 'Green', 'Yellow', 'Gray', 'Brown'].map(color => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => handleColorChange(color)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                formData.colors?.includes(color)
                                  ? 'bg-primary-dark text-cream'
                                  : 'bg-accent-brown text-primary-dark hover:bg-accent-brown/80'
                              }`}
                            >
                              {color}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Special Offers */}
                  <div className="border-t border-accent-brown pt-6">
                    <h4 className="text-lg font-semibold text-primary-dark mb-4">Special Offers</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-primary-dark mb-2">
                          Discount (%)
                        </label>
                        <input
                          type="number"
                          value={formData.discount || ''}
                          onChange={(e) => handleInputChange('discount', Number(e.target.value))}
                          className="w-full px-4 py-3 border border-accent-brown rounded-lg bg-primary-dark text-cream focus:ring-2 focus:ring-accent-brown focus:border-transparent outline-none"
                          min="0"
                          max="100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary-dark mb-2">
                          Special Offer
                        </label>
                        <input
                          type="text"
                          value={formData.specialOffer || ''}
                          onChange={(e) => handleInputChange('specialOffer', e.target.value)}
                          className="w-full px-4 py-3 border border-accent-brown rounded-lg bg-primary-dark text-cream focus:ring-2 focus:ring-accent-brown focus:border-transparent outline-none"
                          placeholder="e.g., Buy 2 Get 1 Free"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Status Options */}
                  <div className="border-t border-accent-brown pt-6">
                    <h4 className="text-lg font-semibold text-primary-dark mb-4">Status & Visibility</h4>
                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.isActive || false}
                          onChange={(e) => handleInputChange('isActive', e.target.checked)}
                          className="rounded border-accent-brown text-accent-brown focus:ring-accent-brown"
                        />
                        <span className="text-primary-dark">Active Product</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.isNew || false}
                          onChange={(e) => handleInputChange('isNew', e.target.checked)}
                          className="rounded border-accent-brown text-accent-brown focus:ring-accent-brown"
                        />
                        <span className="text-primary-dark">New Arrival</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.isSale || false}
                          onChange={(e) => handleInputChange('isSale', e.target.checked)}
                          className="rounded border-accent-brown text-accent-brown focus:ring-accent-brown"
                        />
                        <span className="text-primary-dark">On Sale</span>
                      </label>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex gap-4 pt-6">
                    <button
                      type="submit"
                      className="flex items-center gap-2 bg-accent-brown text-primary-dark px-6 py-3 rounded-lg font-semibold hover:bg-accent-brown/80 transition-colors"
                    >
                      <Save className="h-5 w-5" />
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingProduct(null);
                        resetForm();
                      }}
                      className="flex items-center gap-2 bg-secondary-brown text-primary-dark px-6 py-3 rounded-lg font-semibold hover:bg-accent-brown/20 transition-colors"
                    >
                      <X className="h-5 w-5" />
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Products Table */}
            <div className="bg-secondary-brown rounded-xl overflow-hidden border border-accent-brown">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-primary-dark">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-cream">Product</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-cream">Category</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-cream">Price</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-cream">Stock</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-cream">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-cream">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-t border-accent-brown hover:bg-accent-brown/10">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary-dark rounded-lg flex items-center justify-center">
                              <Package className="h-6 w-6 text-cream" />
                            </div>
                            <div>
                              <div className="font-semibold text-primary-dark">{product.name}</div>
                              <div className="text-sm text-secondary-brown">ID: {product.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-secondary-brown capitalize">{product.category}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-primary-dark font-semibold">₹{product.price}</div>
                          {product.discount && (
                            <div className="text-accent-brown text-sm">-{product.discount}% off</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={product.stock}
                              onChange={(e) => updateStock(product.id, Number(e.target.value))}
                              className="w-16 px-2 py-1 border border-accent-brown rounded bg-primary-dark text-cream text-sm focus:ring-1 focus:ring-accent-brown outline-none"
                              min="0"
                            />
                            {product.stock === 0 && (
                              <span className="text-red-400 text-sm font-medium">Out of Stock</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleProductStatus(product.id)}
                              className={`p-1 rounded transition-colors ${
                                product.isActive
                                  ? 'text-green-400 hover:text-green-300'
                                  : 'text-red-400 hover:text-red-300'
                              }`}
                              title={product.isActive ? 'Active' : 'Inactive'}
                            >
                              {product.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            </button>
                            {product.isNew && <Tag className="h-4 w-4 text-blue-400" title="New" />}
                            {product.discount && <Percent className="h-4 w-4 text-green-400" title="Discount" />}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-2 text-accent-brown hover:text-primary-dark hover:bg-accent-brown/20 rounded transition-colors"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {products.length === 0 && (
                <div className="text-center py-16">
                  <Package className="h-16 w-16 text-secondary-brown mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-primary-dark mb-2">No Products</h3>
                  <p className="text-secondary-brown mb-6">Start by adding your first product to the inventory.</p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-accent-brown text-primary-dark px-6 py-3 rounded-lg font-semibold hover:bg-accent-brown/80 transition-colors"
                  >
                    Add First Product
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-2xl font-bold text-secondary-brown mb-6">Analytics Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-secondary-brown p-6 rounded-xl border border-accent-brown">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-secondary-brown text-sm">Total Products</p>
                    <p className="text-2xl font-bold text-primary-dark">{products.length}</p>
                  </div>
                  <Package className="h-8 w-8 text-accent-brown" />
                </div>
              </div>
              <div className="bg-secondary-brown p-6 rounded-xl border border-accent-brown">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-secondary-brown text-sm">Active Products</p>
                    <p className="text-2xl font-bold text-primary-dark">{products.filter(p => p.isActive).length}</p>
                  </div>
                  <Eye className="h-8 w-8 text-green-400" />
                </div>
              </div>
              <div className="bg-secondary-brown p-6 rounded-xl border border-accent-brown">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-secondary-brown text-sm">Out of Stock</p>
                    <p className="text-2xl font-bold text-primary-dark">{products.filter(p => p.stock === 0).length}</p>
                  </div>
                  <EyeOff className="h-8 w-8 text-red-400" />
                </div>
              </div>
              <div className="bg-secondary-brown p-6 rounded-xl border border-accent-brown">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-secondary-brown text-sm">On Sale</p>
                    <p className="text-2xl font-bold text-primary-dark">{products.filter(p => p.discount && p.discount > 0).length}</p>
                  </div>
                  <Tag className="h-8 w-8 text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-secondary-brown rounded-xl p-6 border border-accent-brown">
              <h3 className="text-xl font-bold text-primary-dark mb-4">Stock Alerts</h3>
              <div className="space-y-4">
                {products.filter(p => p.stock <= 5).map(product => (
                  <div key={product.id} className="flex items-center justify-between p-4 bg-primary-dark/20 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-primary-dark">{product.name}</h4>
                      <p className="text-secondary-brown text-sm">Stock: {product.stock} units</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      product.stock === 0
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {product.stock === 0 ? 'Out of Stock' : 'Low Stock'}
                    </div>
                  </div>
                ))}
                {products.filter(p => p.stock <= 5).length === 0 && (
                  <p className="text-secondary-brown text-center py-8">All products are well stocked! 🎉</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h2 className="text-2xl font-bold text-secondary-brown mb-6">Order Management</h2>
            <div className="bg-secondary-brown rounded-xl p-8 border border-accent-brown text-center">
              <Package className="h-16 w-16 text-secondary-brown mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-primary-dark mb-2">Order Management Coming Soon</h3>
              <p className="text-secondary-brown">
                This section will include order tracking, fulfillment, and customer management features.
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
