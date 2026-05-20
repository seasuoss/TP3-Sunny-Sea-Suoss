const BASE_URL = 'http://localhost:8080/ords/f1/';

async function getAll(entite) {
  const res = await fetch(`${BASE_URL}${entite}/`);
  if (!res.ok) throw new Error(`Erreur getAll(${entite}) : ${res.status}`);
  const data = await res.json();
  return data.items ?? [];
}

async function getById(entite, id) {
  const res = await fetch(`${BASE_URL}${entite}/${id}`);
  if (!res.ok) throw new Error(`Erreur getById(${entite}, ${id}) : ${res.status}`);
  return await res.json();
}

async function create(entite, body) {
  const res = await fetch(`${BASE_URL}${entite}/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`Erreur create(${entite}) : ${res.status}`);
  return await res.json();
}

async function update(entite, id, body) {
  const res = await fetch(`${BASE_URL}${entite}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`Erreur update(${entite}, ${id}) : ${res.status}`);
  return await res.json();
}

async function remove(entite, id) {
  const res = await fetch(`${BASE_URL}${entite}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Erreur remove(${entite}, ${id}) : ${res.status}`);
  return true;
}