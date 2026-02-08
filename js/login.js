import Auth from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  if (Auth.isAuthenticated()) {
    window.location.href = 'pages/dashboard.html';
    return;
  }

  const btn = document.getElementById('loginBtn');
  const errorEl = document.getElementById('error');

  btn.addEventListener('click', async () => {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    errorEl.style.display = 'none';

    if (!username || !password) {
      errorEl.innerText = 'نام کاربری و رمز عبور را وارد کنید';
      errorEl.style.display = 'block';
      return;
    }

    btn.disabled = true;
    btn.innerText = 'در حال ورود...';

    try {
      await Auth.login(username, password);
      window.location.href = 'pages/dashboard.html';
    } catch (err) {
      errorEl.innerText = err.message || 'خطا در ورود';
      errorEl.style.display = 'block';
      btn.disabled = false;
      btn.innerText = 'ورود';
    }
  });
});
