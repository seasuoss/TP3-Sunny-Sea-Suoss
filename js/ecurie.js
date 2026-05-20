async function chargerEcuries() {
  const tbody = document.getElementById('ecurie-body');
  tbody.innerHTML = '<tr><td colspan="6">Chargement…</td></tr>';
  try {
    const items = await getAll('ecurie');
    if (items.length === 0) { tbody.innerHTML = '<tr><td colspan="6">Aucune écurie trouvée.</td></tr>'; return; }
    tbody.innerHTML = items.map(e => `
      <tr>
        <td>${e.id_ecurie}</td>
        <td>${escapeHtml(e.nom_ecurie)}</td>
        <td>${escapeHtml(e.pays ?? '—')}</td>
        <td>${escapeHtml(e.directeur ?? '—')}</td>
        <td>${e.annee_fondation ?? '—'}</td>
        <td class="actions">
          <button class="btn-edit" onclick="ouvrirModif(${e.id_ecurie},'${escapeHtml(e.nom_ecurie)}','${escapeHtml(e.pays||'')}','${escapeHtml(e.directeur||'')}',${e.annee_fondation||0})">✏️</button>
          <button class="btn-delete" onclick="supprimerEcurie(${e.id_ecurie})">🗑️</button>
        </td>
      </tr>`).join('');
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="6" style="color:#e10600">Erreur : ${e.message}</td></tr>`;
  }
}

async function supprimerEcurie(id) {
  if (!confirm(`Supprimer l'écurie #${id} ?`)) return;
  try {
    await remove('ecurie', id);
    setMessage('ecurie-message', `Écurie #${id} supprimée.`);
    chargerEcuries();
  } catch (e) { setMessage('ecurie-message', `Erreur : ${e.message}`, true); }
}

function ouvrirModif(id, nom, pays, dir, annee) {
  document.getElementById('edit-id').value = id;
  document.getElementById('edit-nom').value = nom;
  document.getElementById('edit-pays').value = pays;
  document.getElementById('edit-directeur').value = dir;
  document.getElementById('edit-annee').value = annee;
  document.getElementById('edit-modal').style.display = 'flex';
}

document.addEventListener('DOMContentLoaded', () => {
  chargerEcuries();
  document.getElementById('reload-ecuries')?.addEventListener('click', chargerEcuries);
  document.getElementById('close-modal')?.addEventListener('click', () => {
    document.getElementById('edit-modal').style.display = 'none';
  });
  document.getElementById('edit-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    const body = {
      nom_ecurie: document.getElementById('edit-nom').value,
      pays: document.getElementById('edit-pays').value,
      directeur: document.getElementById('edit-directeur').value,
      annee_fondation: parseInt(document.getElementById('edit-annee').value)
    };
    try {
      await update('ecurie', id, body);
      setMessage('ecurie-message', `Écurie #${id} modifiée.`);
      document.getElementById('edit-modal').style.display = 'none';
      chargerEcuries();
    } catch (e) { setMessage('ecurie-message', `Erreur : ${e.message}`, true); }
  });
  document.getElementById('ecurie-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const body = {
      nom_ecurie: document.getElementById('new-nom').value,
      pays: document.getElementById('new-pays').value,
      directeur: document.getElementById('new-directeur').value,
      annee_fondation: parseInt(document.getElementById('new-annee').value)
    };
    try {
      await create('ecurie', body);
      setMessage('ecurie-message', 'Écurie ajoutée.');
      e.target.reset();
      chargerEcuries();
    } catch (e) { setMessage('ecurie-message', `Erreur : ${e.message}`, true); }
  });
});