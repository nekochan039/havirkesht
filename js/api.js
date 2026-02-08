import CONFIG from './config.js';

/* ---------- AUTH ---------- */
async function login(username, password) {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  const response = await fetch(`${CONFIG.API_BASE_URL}/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'نام کاربری یا رمز عبور اشتباه است');
  }

  return response.json();
}

/* ---------- PROVINCE ---------- */
function authHeader() {
  const token = localStorage.getItem('access_token');
  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
}

function getAuthHeader() {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function getProvinces() {
  const res = await fetch(`${CONFIG.API_BASE_URL}/province/`, {
    headers: {
      ...authHeader(),
    },
  });

  if (!res.ok) throw new Error('خطا در دریافت استان‌ها');
  return res.json();
}


async function createProvince(data) {
  const res = await fetch(`${CONFIG.API_BASE_URL}/province/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
    },
    body: JSON.stringify({
      province: data.name,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    console.error('CREATE PROVINCE ERROR:', err);
    throw new Error('خطا در ثبت استان');
  }

  return res.json();
}




async function deleteProvince(name) {
  const res = await fetch(
    `${CONFIG.API_BASE_URL}/province/${encodeURIComponent(name)}`,
    {
      method: 'DELETE',
      headers: {
        ...authHeader(),
      },
    }
  );

  if (!res.ok) throw new Error('خطا در حذف استان');
}


export {
  login,
  getProvinces,
  createProvince,
  deleteProvince,
};
