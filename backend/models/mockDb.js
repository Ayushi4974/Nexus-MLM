const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '../mockDb.json');

// Initialize default mock database JSON structure
const initDb = () => {
  let shouldInit = false;
  if (!fs.existsSync(dbPath)) {
    shouldInit = true;
  } else {
    try {
      const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      if (!data.users || data.users.length === 0) {
        shouldInit = true;
      } else {
        // If file exists, check if ADMIN / admin exists. If not, seed it.
        const adminExists = data.users.some(u => u.username === 'ADMIN' || u.username === 'admin');
        if (!adminExists) {
          const adminHash = bcrypt.hashSync('123456', 10);
          data.users.push({
            _id: "admin_user_seed_id_999",
            username: "ADMIN",
            name: "System Admin",
            email: "admin@gmail.com",
            mobile: "9999999999",
            password: adminHash,
            sponsor: null,
            sponsorId: "",
            parent: null,
            parentId: "",
            position: "root",
            leftCount: 0,
            rightCount: 0,
            leftBV: 0,
            rightBV: 0,
            status: "active",
            activePackage: null,
            rank: "Member",
            wallets: {
              main: 0.0,
              income: 0.0,
              recharge: 0.0,
              reward: 0.0
            },
            bankDetails: {
              accountNumber: "",
              ifsc: "",
              bankName: "",
              holderName: ""
            },
            isAdmin: true,
            totalROIPaid: 0,
            packageActivatedAt: null,
            createdAt: new Date().toISOString()
          });
          fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
          console.log('Admin user seeded into existing mock database.');
        }
      }
    } catch (e) {
      shouldInit = true;
    }
  }

  if (shouldInit) {
    const adminHash = bcrypt.hashSync('123456', 10);
    const defaultData = {
      users: [
        {
          _id: "root_user_seed_id_888",
          username: "MLM888888",
          name: "Admin Root Member",
          email: "admin@nexusmlm.com",
          mobile: "9876543210",
          password: "$2a$10$tM.yF.Npxp81kZqGvU2O/.97V9g6x1Q.N0N7G51pL9J2wPms5J49K", // password123
          sponsor: null,
          sponsorId: "",
          parent: null,
          parentId: "",
          position: "root",
          leftCount: 0,
          rightCount: 0,
          leftBV: 0,
          rightBV: 0,
          status: "active",
          activePackage: "p1", // Starter Package
          rank: "Bronze",
          wallets: {
            main: 500.0,
            income: 250.0,
            recharge: 100.0,
            reward: 50.0
          },
          bankDetails: {
            accountNumber: "987654321098",
            ifsc: "CHAS0000102",
            bankName: "Chase Bank",
            holderName: "Admin Root Member"
          },
          isAdmin: true,
          totalROIPaid: 0,
          packageActivatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString()
        },
        {
          _id: "admin_user_seed_id_999",
          username: "ADMIN",
          name: "System Admin",
          email: "admin@gmail.com",
          mobile: "9999999999",
          password: adminHash,
          sponsor: null,
          sponsorId: "",
          parent: null,
          parentId: "",
          position: "root",
          leftCount: 0,
          rightCount: 0,
          leftBV: 0,
          rightBV: 0,
          status: "active",
          activePackage: null,
          rank: "Member",
          wallets: {
            main: 0.0,
            income: 0.0,
            recharge: 0.0,
            reward: 0.0
          },
          bankDetails: {
            accountNumber: "",
            ifsc: "",
            bankName: "",
            holderName: ""
          },
          isAdmin: true,
          totalROIPaid: 0,
          packageActivatedAt: null,
          createdAt: new Date().toISOString()
        }
      ],
      packages: [
        { _id: 'p1', name: 'Starter Package', price: 100, roi: 1.0, bv: 100, validity: 360, maxIncome: 200 },
        { _id: 'p2', name: 'Premium Package', price: 500, roi: 1.2, bv: 500, validity: 360, maxIncome: 1000 },
        { _id: 'p3', name: 'Elite Package', price: 1000, roi: 1.5, bv: 1000, validity: 360, maxIncome: 2500 },
        { _id: 'p4', name: 'VIP Package', price: 5000, roi: 2.0, bv: 5000, validity: 360, maxIncome: 15000 },
      ],
      transactions: [],
      withdrawals: [],
      notifications: [],
    };
    fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2));
    console.log('Mock database seeded with root user MLM888888 and ADMIN.');
  }
};

initDb();

const readData = () => {
  try {
    const content = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading mock database:', err);
    return { users: [], packages: [], transactions: [], withdrawals: [], notifications: [], otps: [] };
  }
};

const writeData = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing mock database:', err);
  }
};

// Generate MongoDB-like ObjectIds
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Mock User Model helper methods
const createUserInstance = (userObj) => {
  if (!userObj) return null;
  return {
    ...userObj,
    matchPassword: async function (enteredPassword) {
      return await bcrypt.compare(enteredPassword, this.password);
    },
    save: async function () {
      const db = readData();
      const idx = db.users.findIndex((u) => u._id === this._id);
      if (idx !== -1) {
        db.users[idx] = { ...this };
      } else {
        db.users.push({ ...this });
      }
      writeData(db);
      return this;
    },
  };
};

const mockDb = {
  User: {
    find: async (query = {}) => {
      const db = readData();
      let results = [...db.users];
      
      if (query.sponsor) {
        results = results.filter((u) => u.sponsor === query.sponsor);
      }
      
      return results.map(createUserInstance);
    },
    findOne: async (query) => {
      const db = readData();
      let user = null;
      
      if (query.email) {
        user = db.users.find((u) => u.email === query.email);
      } else if (query.mobile) {
        user = db.users.find((u) => u.mobile === query.mobile);
      } else if (query.username) {
        user = db.users.find((u) => u.username === query.username);
      } else if (query.parent && query.position) {
        user = db.users.find((u) => u.parent === query.parent && u.position === query.position);
      } else if (query.$or) {
        user = db.users.find((u) => {
          return query.$or.some((item) => {
            const field = Object.keys(item)[0];
            return u[field] === item[field];
          });
        });
      }
      
      return createUserInstance(user);
    },
    findById: async (id) => {
      const db = readData();
      const user = db.users.find((u) => u._id === id);
      return createUserInstance(user);
    },
    create: async (userObj) => {
      const db = readData();
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userObj.password, salt);
      
      const newUser = {
        _id: generateId(),
        ...userObj,
        password: hashedPassword,
        leftCount: 0,
        rightCount: 0,
        leftBV: 0,
        rightBV: 0,
        status: userObj.status || 'inactive',
        activePackage: null,
        rank: 'Member',
        wallets: { main: 0, income: 0, recharge: 0, reward: 0 },
        bankDetails: { accountNumber: '', ifsc: '', bankName: '', holderName: '' },
        isAdmin: false,
        totalROIPaid: 0,
        packageActivatedAt: null,
        createdAt: new Date().toISOString(),
      };
      
      db.users.push(newUser);
      writeData(db);
      return createUserInstance(newUser);
    },
    countDocuments: async (query = {}) => {
      const db = readData();
      if (query.sponsor) {
        return db.users.filter((u) => u.sponsor === query.sponsor).length;
      }
      return db.users.length;
    },
  },

  Package: {
    find: async () => {
      const db = readData();
      return db.packages;
    },
    findById: async (id) => {
      const db = readData();
      return db.packages.find((p) => p._id === id || p.id === id);
    },
    countDocuments: async () => {
      const db = readData();
      return db.packages.length;
    },
    create: async (pkgInput) => {
      const db = readData();
      const isArray = Array.isArray(pkgInput);
      const pkgList = isArray ? pkgInput : [pkgInput];
      const created = [];
      pkgList.forEach((p) => {
        const newPkg = {
          _id: p._id || generateId(),
          ...p,
        };
        db.packages.push(newPkg);
        created.push(newPkg);
      });
      writeData(db);
      return isArray ? created : created[0];
    },
    findByIdAndUpdate: async (id, updateData) => {
      const db = readData();
      const idx = db.packages.findIndex((p) => p._id === id || p.id === id);
      if (idx !== -1) {
        db.packages[idx] = { ...db.packages[idx], ...updateData };
        writeData(db);
        return db.packages[idx];
      }
      return null;
    },
    findByIdAndDelete: async (id) => {
      const db = readData();
      const idx = db.packages.findIndex((p) => p._id === id || p.id === id);
      if (idx !== -1) {
        const deleted = db.packages.splice(idx, 1);
        writeData(db);
        return deleted[0];
      }
      return null;
    },
  },

  Transaction: {
    find: async (query = {}) => {
      const db = readData();
      let results = [...db.transactions];
      
      if (query.user) {
        results = results.filter((tx) => tx.user === query.user);
      }
      if (query.type) {
        results = results.filter((tx) => tx.type === query.type);
      }
      if (query.incomeType) {
        results = results.filter((tx) => tx.incomeType === query.incomeType);
      }
      if (query.description && query.description.$regex) {
        const regex = new RegExp(query.description.$regex, query.description.$options || 'i');
        results = results.filter((tx) => regex.test(tx.description));
      }
      
      // Sort by newest
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      // Mock populate 'fromUser' details and 'user' details
      return results.map((tx) => {
        let fromUserDetail = null;
        if (tx.fromUser) {
          const fromUser = db.users.find((u) => u._id === tx.fromUser);
          if (fromUser) {
            fromUserDetail = { _id: fromUser._id, username: fromUser.username, name: fromUser.name };
          }
        }
        let userDetail = null;
        if (tx.user) {
          const user = db.users.find((u) => u._id === tx.user);
          if (user) {
            userDetail = { _id: user._id, username: user.username, name: user.name };
          }
        }
        return {
          ...tx,
          fromUser: fromUserDetail,
          user: userDetail,
        };
      });
    },
    create: async (txObj) => {
      const db = readData();
      const newTx = {
        _id: generateId(),
        ...txObj,
        createdAt: new Date().toISOString(),
      };
      db.transactions.push(newTx);
      writeData(db);
      return newTx;
    },
  },

  Withdrawal: {
    find: async (query = {}) => {
      const db = readData();
      let results = [...db.withdrawals];
      if (query.user) {
        results = results.filter((w) => w.user === query.user);
      }
      if (query.status) {
        results = results.filter((w) => w.status === query.status);
      }
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      const createWthInstance = (wth) => ({
        ...wth,
        save: async function () {
          const database = readData();
          const index = database.withdrawals.findIndex((x) => x._id === this._id);
          if (index !== -1) {
            // Strip out populated user relation before saving back to file
            const toSave = { ...this };
            if (toSave.user && toSave.user._id) {
              toSave.user = toSave.user._id;
            }
            database.withdrawals[index] = toSave;
            writeData(database);
          }
          return this;
        },
      });

      return results.map((w) => {
        const u = db.users.find((user) => user._id === w.user);
        return createWthInstance({
          ...w,
          user: u ? { _id: u._id, username: u.username, name: u.name } : null,
        });
      });
    },
    findById: async (id) => {
      const db = readData();
      const w = db.withdrawals.find((x) => x._id === id);
      if (!w) return null;
      
      const u = db.users.find((user) => user._id === w.user);
      return {
        ...w,
        user: u ? { _id: u._id, username: u.username, name: u.name } : null,
        save: async function () {
          const database = readData();
          const index = database.withdrawals.findIndex((x) => x._id === this._id);
          if (index !== -1) {
            const toSave = { ...this };
            if (toSave.user && toSave.user._id) {
              toSave.user = toSave.user._id;
            }
            database.withdrawals[index] = toSave;
            writeData(database);
          }
          return this;
        },
      };
    },
    create: async (wthObj) => {
      const db = readData();
      const newWth = {
        _id: generateId(),
        ...wthObj,
        createdAt: new Date().toISOString(),
      };
      db.withdrawals.push(newWth);
      writeData(db);
      return newWth;
    },
  },

  Notification: {
    find: async (query = {}) => {
      const db = readData();
      let results = [...db.notifications];
      if (query.user) {
        results = results.filter((n) => n.user === query.user);
      }
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return results;
    },
    create: async (notifObj) => {
      const db = readData();
      const newNotif = {
        _id: generateId(),
        isRead: false,
        ...notifObj,
        createdAt: new Date().toISOString(),
      };
      db.notifications.push(newNotif);
      writeData(db);
      return newNotif;
    },
    updateMany: async (query = {}, update = {}) => {
      const db = readData();
      db.notifications.forEach((n) => {
        if (n.user === query.user && n.isRead === query.isRead) {
          n.isRead = update.isRead;
        }
      });
      writeData(db);
      return { modifiedCount: db.notifications.length };
    },
  },

  // ── In-memory OTP store (not persisted to JSON, lives per-process) ──
  OTP: (() => {
    // Use a module-level array so it persists across requests in same process
    const otpStore = [];

    const createOtpInstance = (obj) => ({
      ...obj,
      save: async function () {
        const idx = otpStore.findIndex(o => o._id === this._id);
        if (idx !== -1) otpStore[idx] = { ...this };
        return this;
      },
    });

    return {
      findOne: async (query) => {
        const now = new Date();
        let result = null;
        // Purge expired first
        const active = otpStore.filter(o => new Date(o.expiresAt) > now);
        otpStore.length = 0;
        active.forEach(o => otpStore.push(o));

        if (query.email) {
          const conditions = Object.keys(query);
          result = otpStore.find(o => {
            if (o.email !== query.email) return false;
            if (query.verified !== undefined && o.verified !== query.verified) return false;
            if (query.expiresAt && query.expiresAt.$gt && new Date(o.expiresAt) <= query.expiresAt.$gt) return false;
            if (query.createdAt && query.createdAt.$gte && new Date(o.createdAt) < query.createdAt.$gte) return false;
            return true;
          }) || null;
        }
        return result ? createOtpInstance(result) : null;
      },
      create: async (otpObj) => {
        const newOtp = {
          _id: generateId(),
          ...otpObj,
          verified: false,
          attempts: 0,
          createdAt: new Date().toISOString(),
        };
        otpStore.push(newOtp);
        return createOtpInstance(newOtp);
      },
      deleteMany: async (query) => {
        if (query.email) {
          const before = otpStore.length;
          const toKeep = otpStore.filter(o => o.email !== query.email);
          otpStore.length = 0;
          toKeep.forEach(o => otpStore.push(o));
          return { deletedCount: before - otpStore.length };
        }
        return { deletedCount: 0 };
      },
      deleteOne: async (query) => {
        if (query._id) {
          const idx = otpStore.findIndex(o => o._id === query._id);
          if (idx !== -1) { otpStore.splice(idx, 1); return { deletedCount: 1 }; }
        }
        return { deletedCount: 0 };
      },
    };
  })(),
};

module.exports = mockDb;
