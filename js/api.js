const BASE_URL = 'http://localhost:8080/ords/commande/';

async function getAll(entity) {
  const res = await fetch(`${BASE_URL}${entity}/`);
  if (!res.ok) throw new Error(`Erreur getAll(${entity}) : ${res.status}`);
  const data = await res.json();
  return data.items ?? [];
}

async function getById(entity, id) {
  const res = await fetch(`${BASE_URL}${entity}/${id}`);
  if (!res.ok) throw new Error(`Erreur getById(${entity}, ${id}) : ${res.status}`);
  return await res.json();
}

async function create(entity, body) {
  const res = await fetch(`${BASE_URL}${entity}/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`Erreur create(${entity}) : ${res.status}`);
  return await res.json();
}

async function update(entity, id, body) {
  const res = await fetch(`${BASE_URL}${entity}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`Erreur update(${entity}, ${id}) : ${res.status}`);
  return await res.json();
}

async function remove(entity, id) {
  const res = await fetch(`${BASE_URL}${entity}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Erreur remove(${entity}, ${id}) : ${res.status}`);
  return true;
}
