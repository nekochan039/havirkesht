import {
  getProvinces,
  createProvince,
  deleteProvince,
} from './api.js';


function showWarning(message) {
  Swal.fire({
    icon: 'warning',
    title: 'هشدار',
    text: message,
    confirmButtonText: 'باشه',
  });
}

async function showConfirm(message) {
  const result = await Swal.fire({
    icon: 'question',
    title: 'تأیید',
    text: message,
    showCancelButton: true,
    confirmButtonText: 'بله',
    cancelButtonText: 'خیر',
  });

  return result.isConfirmed;
}

let loaded = false;

async function loadProvincesOnce() {
  if (loaded) return;
  loaded = true;

  const table = document.getElementById('provinceTable');
  const input = document.getElementById('provinceName');
  const addBtn = document.getElementById('addProvinceBtn');

  async function load() {
    table.innerHTML = '';
  
    const response = await getProvinces();
    const provinces = response.items || response || [];
  
    provinces.forEach((p, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${i + 1}</td>
        <td>${p.province}</td>
        <td>
          <button data-name="${p.province}">حذف</button>
        </td>
      `;
      table.appendChild(tr);
    });
  }
  

  addBtn.addEventListener('click', async () => {
    const name = input.value.trim();
    if (!name) {
      showWarning('نام استان را وارد کنید');
      return;
    }
    

    await createProvince({ name });
    input.value = '';
    load();
  });

  table.addEventListener('click', async (e) => {
    if (e.target.tagName !== 'BUTTON') return;

    const name = e.target.dataset.name;
    const ok = await showConfirm(`حذف ${name}؟`);
if (!ok) return;


    await deleteProvince(name);
    load();
  });

  load();
}

document
  .querySelector('[data-page="province"]')
  .addEventListener('click', loadProvincesOnce);
