import React, { useState } from 'react';
import { categoryService } from '../../services';
import { FiPlus, FiEdit2, FiTrash2, FiLayers, FiX, FiCheck } from 'react-icons/fi';
import { Spinner } from '../common/LoadingStates';
import toast from 'react-hot-toast';

/**
 * CategoryManager component for Admin Dashboard
 * Allows CRUD operations for attraction categories
 */
const CategoryManager = ({ categories, onUpdate }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '', icon: '🌿', color: '#2d5a43', description: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const resetForm = () => {
    setForm({ name: '', slug: '', icon: '🌿', color: '#2d5a43', description: '' });
    setEditingCategory(null);
    setModalOpen(false);
  };

  const handleOpenAdd = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setForm({
      name: cat.name || '',
      slug: cat.slug || '',
      icon: cat.icon || '🌿',
      color: cat.color || '#2d5a43',
      description: cat.description || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    const payload = {
      ...form,
      slug: form.slug.trim() || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    };

    setIsLoading(true);
    try {
      if (editingCategory) {
        try {
          await categoryService.update(editingCategory._id, payload);
        } catch {
          console.info('Updated category in standalone mode');
        }
        const saved = localStorage.getItem('tripeasy_admin_categories');
        if (saved) {
          try {
            const list = JSON.parse(saved);
            const updated = list.map((c) => (c._id === editingCategory._id ? { ...c, ...payload } : c));
            localStorage.setItem('tripeasy_admin_categories', JSON.stringify(updated));
          } catch {}
        }
        toast.success('Category updated successfully');
      } else {
        const newCat = { ...payload, _id: 'cat_' + Date.now() };
        try {
          await categoryService.create(payload);
        } catch {
          console.info('Created category in standalone mode');
        }
        const saved = localStorage.getItem('tripeasy_admin_categories');
        if (saved) {
          try {
            const list = JSON.parse(saved);
            localStorage.setItem('tripeasy_admin_categories', JSON.stringify([...list, newCat]));
          } catch {}
        }
        toast.success('Category created successfully');
      }
      resetForm();
      onUpdate();
    } catch (err) {
      toast.error('Failed to save category');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Delete category "${cat.name}"?`)) return;
    setDeletingId(cat._id);
    try {
      try {
        await categoryService.delete(cat._id);
      } catch {
        console.info('Deleted category in standalone mode');
      }
      const saved = localStorage.getItem('tripeasy_admin_categories');
      if (saved) {
        try {
          const list = JSON.parse(saved);
          const updated = list.filter((c) => c._id !== cat._id);
          localStorage.setItem('tripeasy_admin_categories', JSON.stringify(updated));
        } catch {}
      }
      toast.success('Category deleted');
      onUpdate();
    } catch (err) {
      toast.error('Failed to delete category');
    } finally {
      setDeletingId(null);
    }
  };

  const presetColors = [
    '#1e3d2f', // Forest Green
    '#3a6047', // Moss Green
    '#6b8e23', // Olive
    '#87a987', // Sage
    '#8b5e34', // Warm Earth / Wood
    '#b45309', // Amber / Hiking
    '#0f766e', // Deep Teal / Sightseeing
    '#7c3aed', // Purple / Religious
    '#be123c', // Crimson / Heritage
  ];

  const presetIcons = ['🌿', '⛰️', '🕌', '🏛️', '🎡', '🍽️', '🏖️', '🌲', '🏕️', '🚶'];

  return (
    <div className="space-y-6">
      {/* Header toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-stone-200/80 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <FiLayers className="text-forest-700" /> Attraction Categories
          </h2>
          <p className="text-xs text-stone-500">
            Manage categories used to organize day-trip destinations
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="btn-primary flex items-center justify-center gap-2 text-sm"
        >
          <FiPlus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="card p-5 bg-stone-50/60 border border-stone-200/80 hover:border-forest-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm"
                  style={{ backgroundColor: `${cat.color}15`, border: `2px solid ${cat.color}` }}
                >
                  {cat.icon || '🌿'}
                </span>
                <span
                  className="badge px-3 py-1 text-white font-medium shadow-sm"
                  style={{ backgroundColor: cat.color }}
                >
                  {cat.attractionCount || 0} places
                </span>
              </div>
              <h3 className="font-bold text-stone-900 text-lg mb-1">{cat.name}</h3>
              <p className="text-xs text-stone-500 mb-2 font-mono">slug: {cat.slug}</p>
              <p className="text-sm text-stone-600 line-clamp-2">
                {cat.description || 'No description provided.'}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-stone-200/70">
              <button
                onClick={() => handleOpenEdit(cat)}
                className="p-2 text-stone-500 hover:text-forest-700 hover:bg-forest-50 rounded-lg transition-colors"
                title="Edit category"
              >
                <FiEdit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(cat)}
                disabled={deletingId === cat._id}
                className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete category"
              >
                {deletingId === cat._id ? <Spinner size="sm" /> : <FiTrash2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-stone-200 animate-slide-up">
            <div className="bg-forest-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-lg">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button
                onClick={resetForm}
                className="text-stone-300 hover:text-white transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="label">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wildlife, Waterfalls"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="label">Icon (Emoji)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    className="input w-20 text-center text-xl"
                  />
                  <div className="flex flex-wrap gap-1">
                    {presetIcons.map((ic) => (
                      <button
                        type="button"
                        key={ic}
                        onClick={() => setForm({ ...form, icon: ic })}
                        className={`w-8 h-8 rounded border flex items-center justify-center text-base hover:bg-stone-100 ${
                          form.icon === ic ? 'border-forest-600 bg-forest-50' : 'border-stone-200'
                        }`}
                      >
                        {ic}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="label">Color Accent</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="w-12 h-10 p-0 border border-stone-300 rounded-lg cursor-pointer"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {presetColors.map((clr) => (
                      <button
                        type="button"
                        key={clr}
                        onClick={() => setForm({ ...form, color: clr })}
                        className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
                        style={{
                          backgroundColor: clr,
                          borderColor: form.color === clr ? '#ffffff' : 'transparent',
                          boxShadow: form.color === clr ? '0 0 0 2px #1e3d2f' : 'none',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="label">Description</label>
                <textarea
                  rows={3}
                  placeholder="Short summary of this category"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="input"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary py-2 px-4 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary py-2 px-5 text-sm flex items-center gap-2"
                >
                  {isLoading ? <Spinner size="sm" /> : <FiCheck className="w-4 h-4" />}
                  {editingCategory ? 'Update' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
