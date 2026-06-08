const BASE_URL = 'http://localhost:5002/api';

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('mlm_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

export const api = {
  // Auth endpoints
  auth: {
    login: (loginId, password) =>
      fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ loginId, password }),
      }).then(handleResponse),

    register: (userData) =>
      fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(userData),
      }).then(handleResponse),

    sendOTP: (email, name) =>
      fetch(`${BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, name }),
      }).then(handleResponse),

    verifyOTP: (email, otp) =>
      fetch(`${BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, otp }),
      }).then(handleResponse),

    verifySponsor: (sponsorId) =>
      fetch(`${BASE_URL}/auth/verify-sponsor/${sponsorId}`, {
        method: 'GET',
        headers: getHeaders(),
      }).then(handleResponse),

    verifyParent: (parentId, position) =>
      fetch(`${BASE_URL}/auth/verify-parent?parentId=${parentId}&position=${position}`, {
        method: 'GET',
        headers: getHeaders(),
      }).then(handleResponse),
  },

  // User profiles & settings
  user: {
    getProfile: () =>
      fetch(`${BASE_URL}/users/profile`, {
        method: 'GET',
        headers: getHeaders(),
      }).then(handleResponse),

    updateProfile: (profileData) =>
      fetch(`${BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(profileData),
      }).then(handleResponse),

    changePassword: (passwords) =>
      fetch(`${BASE_URL}/users/change-password`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(passwords),
      }).then(handleResponse),

    getNotifications: () =>
      fetch(`${BASE_URL}/users/notifications`, {
        method: 'GET',
        headers: getHeaders(),
      }).then(handleResponse),

    readNotifications: () =>
      fetch(`${BASE_URL}/users/notifications`, {
        method: 'PUT',
        headers: getHeaders(),
      }).then(handleResponse),
  },

  // Team structures
  team: {
    getDirectTeam: (page = 1, limit = 10, search = '') =>
      fetch(`${BASE_URL}/team/direct?page=${page}&limit=${limit}&search=${search}`, {
        method: 'GET',
        headers: getHeaders(),
      }).then(handleResponse),

    getGenealogyTree: (username = '') =>
      fetch(`${BASE_URL}/team/genealogy${username ? `?username=${username}` : ''}`, {
        method: 'GET',
        headers: getHeaders(),
      }).then(handleResponse),
  },

  // Wallets, transactions and transfers
  wallet: {
    getBalances: () =>
      fetch(`${BASE_URL}/wallet/balances`, {
        method: 'GET',
        headers: getHeaders(),
      }).then(handleResponse),

    getTransactions: (filters = {}) => {
      const params = new URLSearchParams(filters).toString();
      return fetch(`${BASE_URL}/wallet/transactions?${params}`, {
        method: 'GET',
        headers: getHeaders(),
      }).then(handleResponse);
    },

    transferFunds: (transferData) =>
      fetch(`${BASE_URL}/wallet/transfer`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(transferData),
      }).then(handleResponse),

    requestWithdrawal: (amount) =>
      fetch(`${BASE_URL}/wallet/withdraw`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ amount }),
      }).then(handleResponse),

    getWithdrawals: () =>
      fetch(`${BASE_URL}/wallet/withdrawals`, {
        method: 'GET',
        headers: getHeaders(),
      }).then(handleResponse),
  },

  // Package buying
  packages: {
    getPackages: () =>
      fetch(`${BASE_URL}/packages`, {
        method: 'GET',
        headers: getHeaders(),
      }).then(handleResponse),

    buyPackage: (packageId) =>
      fetch(`${BASE_URL}/packages/buy`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ packageId }),
      }).then(handleResponse),
  },

  // Admin capabilities
  admin: {
    getStats: () =>
      fetch(`${BASE_URL}/admin/stats`, {
        method: 'GET',
        headers: getHeaders(),
      }).then(handleResponse),

    getUsers: (search = '', status = '') =>
      fetch(`${BASE_URL}/admin/users?search=${search}&status=${status}`, {
        method: 'GET',
        headers: getHeaders(),
      }).then(handleResponse),

    getUserById: (id) =>
      fetch(`${BASE_URL}/admin/users/${id}`, {
        method: 'GET',
        headers: getHeaders(),
      }).then(handleResponse),

    toggleUserStatus: (id) =>
      fetch(`${BASE_URL}/admin/users/${id}/status`, {
        method: 'PUT',
        headers: getHeaders(),
      }).then(handleResponse),

    creditUserWallet: (id, walletType, amount, description) =>
      fetch(`${BASE_URL}/admin/users/${id}/credit-wallet`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ walletType, amount, description }),
      }).then(handleResponse),

    getWithdrawals: (status = '') =>
      fetch(`${BASE_URL}/admin/withdrawals?status=${status}`, {
        method: 'GET',
        headers: getHeaders(),
      }).then(handleResponse),

    approveWithdrawal: (id, remarks = '') =>
      fetch(`${BASE_URL}/admin/withdrawals/${id}/approve`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ remarks }),
      }).then(handleResponse),

    rejectWithdrawal: (id, remarks = '') =>
      fetch(`${BASE_URL}/admin/withdrawals/${id}/reject`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ remarks }),
      }).then(handleResponse),

    createPackage: (data) =>
      fetch(`${BASE_URL}/admin/packages`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      }).then(handleResponse),

    updatePackage: (id, data) =>
      fetch(`${BASE_URL}/admin/packages/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      }).then(handleResponse),

    deletePackage: (id) =>
      fetch(`${BASE_URL}/admin/packages/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      }).then(handleResponse),

    getTransactions: (filters = {}) => {
      const params = new URLSearchParams(filters).toString();
      return fetch(`${BASE_URL}/admin/transactions?${params}`, {
        method: 'GET',
        headers: getHeaders(),
      }).then(handleResponse);
    },

    broadcastNotification: (title, message) =>
      fetch(`${BASE_URL}/admin/notifications/broadcast`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ title, message }),
      }).then(handleResponse),

    runRoiCron: () =>
      fetch(`${BASE_URL}/admin/cron/run-roi`, {
        method: 'POST',
        headers: getHeaders(),
      }).then(handleResponse),
  },
};
