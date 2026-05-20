function setMessage(id, msg, erreur = false) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.style.color = erreur ? '#e10600' : '#00c853';
}

function escapeHtml(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function formatMoney(val) {
  return val != null ? Number(val).toLocaleString('fr-CA', { style:'currency', currency:'CAD' }) : '—';
}