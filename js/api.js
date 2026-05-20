// ────────────────────────────────────────────────────────────
// api.js  — toutes les requêtes fetch passent ici UNIQUEMENT
// Modifier BASE_URL selon votre configuration ORDS.
// ────────────────────────────────────────────────────────────
const BASE_URL = 'http://localhost:8080/ords/f1/';

async function getAll(entite) {
  try {
    const res = await fetch(BASE_URL + entite + '/');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    return data.items ?? data ?? [];
  } catch(e) { console.error('getAll:', entite, e); return []; }
}

async function getById(entite, id) {
  try {
    const res = await fetch(BASE_URL + entite + '/' + id);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.json();
  } catch(e) { console.error('getById:', entite, id, e); return null; }
}

async function create(entite, body) {
  try {
    const res = await fetch(BASE_URL + entite + '/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.json();
  } catch(e) { console.error('create:', entite, e); return null; }
}

async function update(entite, id, body) {
  try {
    const res = await fetch(BASE_URL + entite + '/' + id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.json();
  } catch(e) { console.error('update:', entite, id, e); return null; }
}

async function remove(entite, id) {
  try {
    const res = await fetch(BASE_URL + entite + '/' + id, { method: 'DELETE' });
    return res.ok;
  } catch(e) { console.error('remove:', entite, id, e); return false; }
}
