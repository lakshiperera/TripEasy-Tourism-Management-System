const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { initialCategories, initialAttractions, initialAdmin } = require('./initialData');

const DATA_DIR = path.join(__dirname, '../../data');
const STORE_FILE = path.join(DATA_DIR, 'tripeasy_store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory state
let store = {
  categories: [],
  attractions: [],
  admins: [],
};

// Generate 24-hex ObjectId-like string
const generateId = () => {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  const random = Math.random().toString(16).substring(2, 18).padEnd(16, '0');
  return (timestamp + random).substring(0, 24);
};

// Save store to disk synchronously
const saveStore = () => {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist store:', err);
  }
};

// Initialize store from disk or initial data
const initStore = async () => {
  if (fs.existsSync(STORE_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(STORE_FILE, 'utf-8'));
      if (data.categories && data.attractions && data.admins) {
        store = data;
        return;
      }
    } catch (e) {
      console.warn('Could not parse existing store file, resetting to initial seed...');
    }
  }

  // Pre-seed
  const hashedAdminPassword = await bcrypt.hash(initialAdmin.password, 10);
  store = {
    categories: JSON.parse(JSON.stringify(initialCategories)),
    attractions: JSON.parse(JSON.stringify(initialAttractions)),
    admins: [
      {
        ...initialAdmin,
        password: hashedAdminPassword,
      },
    ],
  };
  saveStore();
};

// Query chain helper for attractions/categories
class QueryChain {
  constructor(dataPromise) {
    this.dataPromise = Promise.resolve(dataPromise);
  }

  populate(field, select) {
    this.dataPromise = this.dataPromise.then((data) => {
      if (!data) return null;
      if (Array.isArray(data)) {
        return data.map((item) => populateItem(item, field, select));
      }
      return populateItem(data, field, select);
    });
    return this;
  }

  select(fields) {
    // fields like '+password'
    return this;
  }

  sort(sortObj) {
    this.dataPromise = this.dataPromise.then((list) => {
      if (!Array.isArray(list)) return list;
      const sorted = [...list];
      if (typeof sortObj === 'object') {
        const key = Object.keys(sortObj)[0];
        const dir = sortObj[key] >= 0 ? 1 : -1;
        sorted.sort((a, b) => {
          const valA = getNestedVal(a, key);
          const valB = getNestedVal(b, key);
          if (valA === valB) return 0;
          return valA > valB ? dir : -dir;
        });
      }
      return sorted;
    });
    return this;
  }

  lean() {
    return this.dataPromise;
  }

  then(resolve, reject) {
    return this.dataPromise.then(resolve, reject);
  }

  catch(reject) {
    return this.dataPromise.catch(reject);
  }
}

const getNestedVal = (obj, keyPath) => {
  if (!obj) return undefined;
  return keyPath.split('.').reduce((acc, part) => (acc ? acc[part] : undefined), obj);
};

const populateItem = (item, field, select) => {
  if (!item || !item[field]) return item;
  const clone = { ...item };
  const catId = typeof clone[field] === 'object' ? clone[field]._id : clone[field];
  const cat = store.categories.find((c) => c._id.toString() === catId?.toString());
  if (cat) {
    clone[field] = {
      _id: cat._id,
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon,
      color: cat.color,
      description: cat.description,
    };
  }
  return clone;
};

// Attach comparePassword method to admin object
const wrapAdmin = (adminObj) => {
  if (!adminObj) return null;
  const admin = { ...adminObj };
  admin.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, admin.password);
  };
  return admin;
};

// ── Embedded Category Model ───────────────────────────────────────────────────
const EmbeddedCategory = {
  find: (filter = {}) => {
    let result = [...store.categories];
    return new QueryChain(result);
  },

  findById: (id) => {
    const cat = store.categories.find((c) => c._id.toString() === id.toString());
    return new QueryChain(cat || null);
  },

  create: async (data) => {
    const newCat = {
      _id: data._id || generateId(),
      name: data.name,
      slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      icon: data.icon || '📍',
      color: data.color || '#355637',
      description: data.description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.categories.push(newCat);
    saveStore();
    return newCat;
  },

  findByIdAndUpdate: async (id, update, options = {}) => {
    const index = store.categories.findIndex((c) => c._id.toString() === id.toString());
    if (index === -1) return null;
    store.categories[index] = {
      ...store.categories[index],
      ...update,
      updatedAt: new Date().toISOString(),
    };
    saveStore();
    return store.categories[index];
  },

  findByIdAndDelete: async (id) => {
    const index = store.categories.findIndex((c) => c._id.toString() === id.toString());
    if (index === -1) return null;
    const deleted = store.categories.splice(index, 1)[0];
    saveStore();
    return deleted;
  },

  countDocuments: async (filter = {}) => {
    return store.categories.length;
  },

  insertMany: async (arr) => {
    for (const item of arr) {
      if (!item._id) item._id = generateId();
      store.categories.push(item);
    }
    saveStore();
    return arr;
  },

  deleteMany: async () => {
    store.categories = [];
    saveStore();
    return { acknowledged: true, deletedCount: 0 };
  },
};

// ── Embedded Attraction Model ─────────────────────────────────────────────────
const EmbeddedAttraction = {
  find: (filter = {}) => {
    let list = [...store.attractions];

    // Filter by isActive
    if (filter.isActive !== undefined) {
      list = list.filter((a) => a.isActive === filter.isActive);
    }

    // Filter by category
    if (filter.category && filter.category !== 'all') {
      list = list.filter((a) => {
        const catId = typeof a.category === 'object' ? a.category._id : a.category;
        return catId?.toString() === filter.category.toString();
      });
    }

    // Search by name
    if (filter.name && filter.name.$regex) {
      const reg = new RegExp(filter.name.$regex, filter.name.$options || 'i');
      list = list.filter((a) => reg.test(a.name));
    }

    return new QueryChain(list);
  },

  findById: (id) => {
    const attr = store.attractions.find((a) => a._id.toString() === id.toString());
    return new QueryChain(attr ? JSON.parse(JSON.stringify(attr)) : null);
  },

  findOne: (filter = {}) => {
    let attr = null;
    if (filter.slug) {
      attr = store.attractions.find((a) => a.slug === filter.slug);
    } else if (filter._id) {
      attr = store.attractions.find((a) => a._id.toString() === filter._id.toString());
    }
    return new QueryChain(attr ? JSON.parse(JSON.stringify(attr)) : null);
  },

  create: async (data) => {
    const newAttr = {
      ...data,
      _id: data._id || generateId(),
      slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.attractions.push(newAttr);
    saveStore();
    return newAttr;
  },

  findByIdAndUpdate: async (id, update, options = {}) => {
    const index = store.attractions.findIndex((a) => a._id.toString() === id.toString());
    if (index === -1) return null;
    store.attractions[index] = {
      ...store.attractions[index],
      ...update,
      updatedAt: new Date().toISOString(),
    };
    saveStore();
    return store.attractions[index];
  },

  findByIdAndDelete: async (id) => {
    const index = store.attractions.findIndex((a) => a._id.toString() === id.toString());
    if (index === -1) return null;
    const deleted = store.attractions.splice(index, 1)[0];
    saveStore();
    return deleted;
  },

  countDocuments: async (filter = {}) => {
    let list = [...store.attractions];
    if (filter.category) {
      list = list.filter((a) => {
        const catId = typeof a.category === 'object' ? a.category._id : a.category;
        return catId?.toString() === filter.category.toString();
      });
    }
    if (filter.isActive !== undefined) {
      list = list.filter((a) => a.isActive === filter.isActive);
    }
    return list.length;
  },

  insertMany: async (arr) => {
    for (const item of arr) {
      if (!item._id) item._id = generateId();
      store.attractions.push(item);
    }
    saveStore();
    return arr;
  },

  deleteMany: async () => {
    store.attractions = [];
    saveStore();
    return { acknowledged: true, deletedCount: 0 };
  },
};

// ── Embedded Admin Model ──────────────────────────────────────────────────────
const EmbeddedAdmin = {
  findOne: (filter = {}) => {
    const admin = store.admins.find((a) => a.username === filter.username);
    return new QueryChain(wrapAdmin(admin));
  },

  findById: (id) => {
    const admin = store.admins.find((a) => a._id.toString() === id.toString());
    return new QueryChain(wrapAdmin(admin));
  },

  create: async (data) => {
    const hashedPassword = data.password.startsWith('$2')
      ? data.password
      : await bcrypt.hash(data.password, 10);
    const newAdmin = {
      _id: data._id || generateId(),
      username: data.username,
      password: hashedPassword,
      email: data.email || 'admin@tripeasy.lk',
      role: data.role || 'admin',
      createdAt: new Date().toISOString(),
    };
    store.admins.push(newAdmin);
    saveStore();
    return wrapAdmin(newAdmin);
  },

  deleteMany: async () => {
    store.admins = [];
    saveStore();
    return { acknowledged: true, deletedCount: 0 };
  },
};

module.exports = {
  initStore,
  EmbeddedCategory,
  EmbeddedAttraction,
  EmbeddedAdmin,
};
