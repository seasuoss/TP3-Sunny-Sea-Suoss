// shared.js — Utilitaires partagés entre toutes les pages

function setMessage(elementId, msg, isError = false) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = msg;
  el.style.color = isError ? '#e10600' : '#27ae60';
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 4000);
}

function formatMoney(val) {
  return Number(val).toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' });
}

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str ?? '';
  return d.innerHTML;
}
