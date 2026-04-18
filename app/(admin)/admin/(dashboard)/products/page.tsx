'use client';

import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice: number | null;
  image: string | null;
  category: string | null;
  inStock: boolean;
  featured: boolean;
  order: number;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    oldPrice: '',
    image: '',
    category: '',
    inStock: true,
    featured: false,
    order: 0,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const res = await fetch('/api/admin/products');
    const data = await res.json();
    setProducts(data.products || []);
    setLoading(false);
  }

  function handleEdit(product: Product) {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      oldPrice: product.oldPrice?.toString() || '',
      image: product.image || '',
      category: product.category || '',
      inStock: product.inStock,
      featured: product.featured,
      order: product.order,
    });
  }

  function handleCancel() {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      oldPrice: '',
      image: '',
      category: '',
      inStock: true,
      featured: false,
      order: 0,
    });
  }

  async function handleSave() {
    const method = editingId ? 'PATCH' : 'POST';
    const body = editingId ? { id: editingId, ...formData } : formData;

    const res = await fetch('/api/admin/products', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      await loadProducts();
      handleCancel();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Видалити товар?')) return;
    const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
    if (res.ok) await loadProducts();
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setFormData(prev => ({ ...prev, image: data.url }));
      }
    } catch (error) {
      alert('Помилка завантаження');
    }
    setUploading(false);
  }

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files[0]);
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Управління товарами</h1>
        <button
          onClick={() => setEditingId('new')}
          className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          + Додати товар
        </button>
      </div>

      {/* Form */}
      {editingId && (
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {editingId === 'new' ? 'Новий товар' : 'Редагувати товар'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">Назва *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border-2 border-gray-200 focus:border-rose-500 p-3 w-full rounded-xl transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">Категорія</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="border-2 border-gray-200 focus:border-rose-500 p-3 w-full rounded-xl transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">Ціна (PLN) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="border-2 border-gray-200 focus:border-rose-500 p-3 w-full rounded-xl transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">Стара ціна (PLN)</label>
              <input
                type="number"
                step="0.01"
                value={formData.oldPrice}
                onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                className="border-2 border-gray-200 focus:border-rose-500 p-3 w-full rounded-xl transition-all outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2 text-sm">Опис *</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="border-2 border-gray-200 focus:border-rose-500 p-3 w-full rounded-xl transition-all outline-none resize-none"
              />
            </div>

            {/* Drag & Drop Image Upload */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2 text-sm">Зображення</label>

              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${
                  dragActive ? 'border-rose-500 bg-rose-50' : 'border-gray-300 hover:border-rose-400'
                }`}
              >
                {uploading ? (
                  <div className="text-center py-8">
                    <div className="inline-block w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-600">Завантаження...</p>
                  </div>
                ) : formData.image ? (
                  <div className="text-center">
                    <img src={formData.image} alt="Preview" className="max-h-48 mx-auto rounded-lg mb-4" />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: '' })}
                      className="text-red-600 text-sm hover:text-red-700"
                    >
                      Видалити
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-gray-600 mb-2">Перетягніть зображення сюди або</p>
                    <label className="inline-block px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full cursor-pointer hover:shadow-lg transition-all">
                      Вибрати файл
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileInput}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">Порядок</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                className="border-2 border-gray-200 focus:border-rose-500 p-3 w-full rounded-xl transition-all outline-none"
              />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.inStock}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  className="w-5 h-5 accent-rose-500 rounded"
                />
                <span className="text-gray-700 font-medium">В наявності</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-5 h-5 accent-rose-500 rounded"
                />
                <span className="text-gray-700 font-medium">Хіт продажів</span>
              </label>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={handleSave}
              className="px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Зберегти
            </button>
            <button
              onClick={handleCancel}
              className="px-8 py-3 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-all duration-300"
            >
              Скасувати
            </button>
          </div>
        </div>
      )}

      {/* Products List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-pink-200 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
              {product.image && (
                <div className="relative h-48 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl overflow-hidden mb-4">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
                {product.featured && (
                  <span className="px-2 py-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold rounded-full">
                    ХІТ
                  </span>
                )}
              </div>

              {product.category && (
                <span className="inline-block px-3 py-1 bg-rose-100 text-rose-600 text-xs font-medium rounded-full mb-2">
                  {product.category}
                </span>
              )}

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-bold text-rose-600">{product.price} PLN</span>
                {product.oldPrice && (
                  <span className="text-sm text-gray-400 line-through">{product.oldPrice} PLN</span>
                )}
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  product.inStock ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {product.inStock ? 'В наявності' : 'Немає'}
                </span>
                <span className="text-xs text-gray-500">Порядок: {product.order}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full text-sm font-medium hover:shadow-lg transition-all duration-300"
                >
                  Редагувати
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-medium hover:bg-red-100 transition-all duration-300"
                >
                  Видалити
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
