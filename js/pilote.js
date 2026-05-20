async function chargerPilotes(filtre = '') {
  const tbody = document.getElementById('pilote-body');
  tbody.innerHTML = '<tr><td colspan="7">Chargement…</td></tr>';
  try {
    let items = await getAll('pilote');
    if (filtre) items = items.filter(p => p.nom_pilote?.toLowerCase().includes(filtre.toLowerCase()));
    if (items.length === 0) { tbody.innerHTML = '<tr><td colspan="7">Aucun pilote trouvé.</td></tr>'; return; }
    tbody.innerHTML = items.map(p => `
      <tr>
        <td>${p.id_pilote}</td>
        <td>${escapeHtml(p.nom_pilote)}</td>
        <td>${escapeHtml(p.nationalite ?? '—')}</td>
        <td>${p.date_naissance ? p.date_naissance.substring(0,10) : '—'}</td>
        <td>${p.numero_voiture ?? '—'}</td>
        <td>${p.id_ecurie ?? '—'}</td>
        <td class="actions">
          <button class="btn-edit" onclick="ouvrirModifPilote(${p.id_pilote},'${escapeHtml(p.nom_pilote)}','${escapeHtml(p.nationalite||'')}','${p.date_naissance?.substring(0,10)||''}',${p.numero_voiture??0},${p.id_ecurie??0})">✏️</button>
          <button class="btn-delete" onclick="supprimerPilote(${p.id_pilote})">🗑️</button>
        </td>
      </tr>`).join('');
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="7" style="color:#e10600">Erreur : ${e.message}</td></tr>`;
  }
}

async function supprimerPilote(id) {
  if (!confirm(`Supprimer le pilote #${id} ?`)) return;
  try {
    await remove('pilote', id);
    setMessage('pilote-message', `Pilote #${id} supprimé.`);
    chargerPilotes();
  } catch (e) { setMessage('pilote-message', `Erreur : ${e.message}`, true); }
}

function ouvrirModifPilote(id, nom, nat, naiss, num, ecurie) {
  document.getElementById('edit-id').value = id;
  document.getElementById('edit-nom').value = nom;
  document.getElementById('edit-nat').value = nat;
  document.getElementById('edit-naiss').value = naiss;
  document.getElementById('edit-num').value = num;
  document.getElementById('edit-ecurie').value = ecurie;
  document.getElementById('edit-modal').style.display = 'flex';
}

document.addEventListener('DOMContentLoaded', () => {
  chargerPilotes();
  document.getElementById('reload-pilotes')?.addEventListener('click', () => chargerPilotes());
  document.getElementById('close-modal')?.addEventListener('click', () => {
    document.getElementById('edit-modal').style.display = 'none';
  });
  document.getElementById('search-pilote')?.addEventListener('input', e => chargerPilotes(e.target.value));
  document.getElementById('edit-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    const body = {
      nom_pilote: document.getElementById('edit-nom').value,
      nationalite: document.getElementById('edit-nat').value,
      date_naissance: document.getElementById('edit-naiss').value,
      numero_voiture: parseInt(document.getElementById('edit-num').value),
      id_ecurie: parseInt(document.getElementById('edit-ecurie').value)
    };
    try {
      await update('pilote', id, body);
      setMessage('pilote-message', `Pilote #${id} modifié.`);
      document.getElementById('edit-modal').style.display = 'none';
      chargerPilotes();
    } catch (e) { setMessage('pilote-message', `Erreur : ${e.message}`, true); }
  });
  document.getElementById('pilote-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const body = {
      nom_pilote: document.getElementById('new-nom').value,
      nationalite: document.getElementById('new-nat').value,
      date_naissance: document.getElementById('new-naiss').value,
      numero_voiture: parseInt(document.getElementById('new-num').value),
      id_ecurie: parseInt(document.getElementById('new-ecurie').value)
    };
    try {
      await create('pilote', body);
      setMessage('pilote-message', 'Pilote ajouté.');
      e.target.reset();
      chargerPilotes();
    } catch (e) { setMessage('pilote-message', `Erreur : ${e.message}`, true); }
  });
});