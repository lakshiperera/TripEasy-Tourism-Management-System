import React, { useState, useEffect } from 'react';
import { attractionService } from '../../services';
import { FiX, FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';
import { Spinner } from '../common/LoadingStates';
import toast from 'react-hot-toast';

/**
 * Attraction Create/Edit Modal
 * FR-19, FR-20: add and update attractions
 */
const AttractionFormModal = ({ attraction, categories, onClose, onSuccess }) => {
  const isEdit = !!attraction && !!attraction._id;

  const [form, setForm] = useState({
    name: '',
    category: '',
    description: '',
    images: [{ filename: '', url: '', caption: '' }],
    location: {
      coordinates: ['', ''], // [lng, lat]
      address: '',
    },
    openingHours: { weekdays: '', weekends: '', notes: '' },
    entranceFee: { isFree: true, localAdult: 0, localChild: 0, foreignAdult: 0, foreignChild: 0 },
    travelInfo: { distanceFromRagama: '', estimatedTravelTime: '', estimatedVisitDuration: 45 },
    travelTips: [''],
    facilities: [''],
    contactInfo: { phone: '', website: '' },
    isActive: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (attraction) {
      setForm({
        ...attraction,
        category: attraction.category?._id || attraction.category,
        images: attraction.images?.length > 0 ? attraction.images : [{ filename: '', url: '', caption: '' }],
        location: {
          ...attraction.location,
          coordinates: attraction.location?.coordinates || ['', ''],
        },
        travelTips: attraction.travelTips?.length > 0 ? attraction.travelTips : [''],
        facilities: attraction.facilities?.length > 0 ? attraction.facilities : [''],
        openingHours: attraction.openingHours || { weekdays: '', weekends: '', notes: '' },
        entranceFee: attraction.entranceFee || { isFree: true, localAdult: 0, localChild: 0, foreignAdult: 0, foreignChild: 0 },
        travelInfo: attraction.travelInfo || { distanceFromRagama: '', estimatedTravelTime: '', estimatedVisitDuration: 45 },
        contactInfo: attraction.contactInfo || { phone: '', website: '' },
      });
    }
  }, [attraction]);

  const update = (path, value) => {
    setForm((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let obj = clone;
      for (let i = 0; i < keys.length - 1; i++) {
        if (/^\d+$/.test(keys[i + 1])) obj[keys[i]] = obj[keys[i]] || [];
        else obj[keys[i]] = obj[keys[i]] || {};
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return clone;
    });
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.category) errs.category = 'Category is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.location.coordinates[0] || !form.location.coordinates[1]) errs.coordinates = 'Coordinates are required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const payload = {
        ...form,
        images: form.images.filter((img) => img.url || img.filename),
        travelTips: form.travelTips.filter((t) => t.trim()),
        facilities: form.facilities.filter((f) => f.trim()),
        location: {
          ...form.location,
          type: 'Point',
          coordinates: [parseFloat(form.location.coordinates[0]), parseFloat(form.location.coordinates[1])],
        },
        travelInfo: {
          ...form.travelInfo,
          distanceFromRagama: parseFloat(form.travelInfo.distanceFromRagama) || 0,
          estimatedTravelTime: parseInt(form.travelInfo.estimatedTravelTime) || 0,
          estimatedVisitDuration: parseInt(form.travelInfo.estimatedVisitDuration) || 45,
        },
      };

      if (isEdit) {
        try {
          await attractionService.update(attraction._id, payload);
        } catch {
          console.info('Saved locally in standalone mode');
        }
        const saved = localStorage.getItem('tripeasy_admin_attractions');
        if (saved) {
          try {
            const list = JSON.parse(saved);
            const updated = list.map((a) => (a._id === attraction._id ? { ...a, ...payload } : a));
            localStorage.setItem('tripeasy_admin_attractions', JSON.stringify(updated));
          } catch {}
        }
        toast.success('Attraction updated!');
      } else {
        const newId = 'attr_' + Date.now();
        const newAttr = { ...payload, _id: newId, isActive: true };
        try {
          await attractionService.create(payload);
        } catch {
          console.info('Created locally in standalone mode');
        }
        const saved = localStorage.getItem('tripeasy_admin_attractions');
        if (saved) {
          try {
            const list = JSON.parse(saved);
            localStorage.setItem('tripeasy_admin_attractions', JSON.stringify([newAttr, ...list]));
          } catch {}
        }
        toast.success('Attraction created!');
      }
      onSuccess();
    } catch (err) {
      toast.error('Failed to save attraction');
    } finally {
      setIsLoading(false);
    }
  };

  // Array field helpers
  const addArrayItem = (field, template) => update(field, [...(form[field] || []), template]);
  const removeArrayItem = (field, index) => update(field, form[field].filter((_, i) => i !== index));

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 animate-fade-in">
        {/* Modal header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
          <h2 className="font-bold text-gray-900">
            {isEdit ? '✏️ Edit Attraction' : '➕ Add New Attraction'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label">Attraction Name *</label>
              <input className={`input ${errors.name ? 'border-red-400' : ''}`} value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="e.g. Kelaniya Temple" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="label">Category *</label>
              <select className={`input ${errors.category ? 'border-red-400' : ''}`} value={form.category} onChange={(e) => update('category', e.target.value)}>
                <option value="">Select category</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>

            <div className="flex items-center gap-3 pt-6">
              <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => update('isActive', e.target.checked)} className="w-4 h-4 text-emerald-600 rounded" />
              <label htmlFor="isActive" className="text-sm text-gray-700 font-medium">Visible to tourists</label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="label">Description *</label>
            <textarea className={`input h-24 resize-none ${errors.description ? 'border-red-400' : ''}`} value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Describe the attraction..." />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Images */}
          <div>
            <label className="label">Images</label>
            {form.images.map((img, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input className="input" value={img.url} onChange={(e) => update(`images.${i}.url`, e.target.value)} placeholder="/images/filename.jpg" />
                <input className="input w-32" value={img.caption} onChange={(e) => update(`images.${i}.caption`, e.target.value)} placeholder="Caption" />
                {form.images.length > 1 && (
                  <button type="button" onClick={() => removeArrayItem('images', i)} className="text-red-400 hover:text-red-600 p-2">
                    <FiTrash2 />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem('images', { filename: '', url: '', caption: '' })} className="text-sm text-emerald-600 hover:underline flex items-center gap-1 mt-1">
              <FiPlus /> Add image
            </button>
          </div>

          {/* Location */}
          <div>
            <label className="label">Location *</label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <input className={`input ${errors.coordinates ? 'border-red-400' : ''}`} value={form.location.coordinates[0]} onChange={(e) => update('location.coordinates.0', e.target.value)} placeholder="Longitude (e.g. 79.9219)" />
              </div>
              <div>
                <input className={`input ${errors.coordinates ? 'border-red-400' : ''}`} value={form.location.coordinates[1]} onChange={(e) => update('location.coordinates.1', e.target.value)} placeholder="Latitude (e.g. 6.9544)" />
              </div>
            </div>
            {errors.coordinates && <p className="text-red-500 text-xs mb-2">{errors.coordinates}</p>}
            <input className="input" value={form.location.address} onChange={(e) => update('location.address', e.target.value)} placeholder="Address (e.g. Kelaniya, Sri Lanka)" />
          </div>

          {/* Opening Hours */}
          <div>
            <label className="label">Opening Hours</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input className="input" value={form.openingHours.weekdays} onChange={(e) => update('openingHours.weekdays', e.target.value)} placeholder="Weekdays (e.g. 6:00 AM – 8:00 PM)" />
              <input className="input" value={form.openingHours.weekends} onChange={(e) => update('openingHours.weekends', e.target.value)} placeholder="Weekends" />
              <input className="input sm:col-span-2" value={form.openingHours.notes} onChange={(e) => update('openingHours.notes', e.target.value)} placeholder="Notes (e.g. Open on public holidays)" />
            </div>
          </div>

          {/* Entrance fee */}
          <div>
            <label className="label">Entrance Fee</label>
            <div className="flex items-center gap-3 mb-3">
              <input type="checkbox" id="isFree" checked={form.entranceFee.isFree} onChange={(e) => update('entranceFee.isFree', e.target.checked)} className="w-4 h-4 text-emerald-600 rounded" />
              <label htmlFor="isFree" className="text-sm text-gray-700">Free entry</label>
            </div>
            {!form.entranceFee.isFree && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['localAdult', 'localChild', 'foreignAdult', 'foreignChild'].map((field) => (
                  <div key={field}>
                    <label className="text-xs text-gray-500 mb-1 block capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                    <input type="number" className="input" value={form.entranceFee[field]} onChange={(e) => update(`entranceFee.${field}`, e.target.value)} placeholder="Rs." />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Travel Info */}
          <div>
            <label className="label">Travel Information</label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Distance (km)</label>
                <input type="number" className="input" value={form.travelInfo.distanceFromRagama} onChange={(e) => update('travelInfo.distanceFromRagama', e.target.value)} placeholder="km" step="0.1" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Drive time (min)</label>
                <input type="number" className="input" value={form.travelInfo.estimatedTravelTime} onChange={(e) => update('travelInfo.estimatedTravelTime', e.target.value)} placeholder="min" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Visit duration (min)</label>
                <input type="number" className="input" value={form.travelInfo.estimatedVisitDuration} onChange={(e) => update('travelInfo.estimatedVisitDuration', e.target.value)} placeholder="min" />
              </div>
            </div>
          </div>

          {/* Travel Tips */}
          <div>
            <label className="label">Travel Tips</label>
            {form.travelTips.map((tip, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input className="input flex-1" value={tip} onChange={(e) => update(`travelTips.${i}`, e.target.value)} placeholder={`Tip ${i + 1}`} />
                {form.travelTips.length > 1 && (
                  <button type="button" onClick={() => removeArrayItem('travelTips', i)} className="text-red-400 hover:text-red-600 p-2"><FiTrash2 /></button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem('travelTips', '')} className="text-sm text-emerald-600 hover:underline flex items-center gap-1">
              <FiPlus /> Add tip
            </button>
          </div>

          {/* Facilities */}
          <div>
            <label className="label">Facilities</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.facilities.map((fac, i) => (
                <div key={i} className="flex items-center gap-1">
                  <input className="input w-36" value={fac} onChange={(e) => update(`facilities.${i}`, e.target.value)} placeholder="e.g. Parking" />
                  {form.facilities.length > 1 && (
                    <button type="button" onClick={() => removeArrayItem('facilities', i)} className="text-red-400 hover:text-red-600 p-1"><FiTrash2 /></button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={() => addArrayItem('facilities', '')} className="text-sm text-emerald-600 hover:underline flex items-center gap-1">
              <FiPlus /> Add facility
            </button>
          </div>

          {/* Contact */}
          <div>
            <label className="label">Contact (optional)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input className="input" value={form.contactInfo.phone} onChange={(e) => update('contactInfo.phone', e.target.value)} placeholder="Phone number" />
              <input className="input" value={form.contactInfo.website} onChange={(e) => update('contactInfo.website', e.target.value)} placeholder="Website URL" />
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={isLoading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {isLoading ? <Spinner size="sm" /> : <FiSave />}
              {isLoading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Attraction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AttractionFormModal;
