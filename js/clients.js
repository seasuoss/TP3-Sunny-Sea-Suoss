async function chargerClients() {
  const tbody = document.getElementById('clients-body');
  tbody.innerHTML = '<tr><td colspan="7">Chargement…</td></tr>';
  try {
    const items = await getAll('client');
    if (items.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7">Aucun client trouvé.</td></tr>';
      return;
    }
    tbody.innerHTML = items.map(c => `
      <tr>
        <td>${c.id_client}</td>
        <td>${escapeHtml(c.nom_client)}</td>
        <td>${escapeHtml(c.telephone ?? '—')}</td>
        <td>${escapeHtml(c.region ?? '—')}</td>
        <td>${escapeHtml(c.pays ?? '—')}</td>
        <td>${escapeHtml(c.vendeur ?? '—')}</td>
        <td class="actions">
          <button class="btn-edit" onclick="ouvrirModif(${c.id_client}, '${escapeHtml(c.nom_client)}', '${escapeHtml(c.telephone||'')}', '${escapeHtml(c.region||'')}', '${escapeHtml(c.pays||'')}', '${escapeHtml(c.vendeur||'')}')">✏️</button>
          <button class="btn-delete" onclick="supprimerClient(${c.id_client})">🗑️</button>
        </td>
      </tr>`).join('');
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="7" style="color:#e10600">Erreur : ${e.message}</td></tr>`;
  }
}

async function supprimerClient(id) {
  if (!confirm(`Supprimer le client #${id} ?`)) return;
  try {
    await remove('client', id);
    setMessage('client-message', `Client #${id} supprimé.`);
    chargerClients();
  } catch (e) {
    setMessage('client-message', `Erreur suppression : ${e.message}`, true);
  }
}

function ouvrirModif(id, nom, tel, region, pays, vendeur) {
  document.getElementById('edit-id').value = id;
  document.getElementById('edit-nom').value = nom;
  document.getElementById('edit-tel').value = tel;
  document.getElementById('edit-region').value = region;
  document.getElementById('edit-pays').value = pays;
  document.getElementById('edit-vendeur').value = vendeur;
  document.getElementById('edit-modal').style.display = 'flex';
}

document.addEventListener('DOMContentLoaded', () => {
  chargerClients();

  document.getElementById('reload-clients')?.addEventListener('click', chargerClients);

  document.getElementById('close-modal')?.addEventListener('click', () => {
    document.getElementById('edit-modal').style.display = 'none';
  });

  document.getElementById('edit-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    const body = {
      nom_client: document.getElementById('edit-nom').value,
      telephone:  document.getElementById('edit-tel').value,
      region:     document.getElementById('edit-region').value,
      pays:       document.getElementById('edit-pays').value,
      vendeur:    document.getElementById('edit-vendeur').value
    };
    try {
      await update('client', id, body);
      setMessage('client-message', `Client #${id} modifié.`);
      document.getElementById('edit-modal').style.display = 'none';
      chargerClients();
    } catch (e) {
      setMessage('client-message', `Erreur modification : ${e.message}`, true);
    }
  });

  document.getElementById('client-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const body = {
      nom_client: document.getElementById('nomclient').value,
      adresse:    document.getElementById('adresse').value,
      pays:       document.getElementById('pays').value,
      telephone:  document.getElementById('telephone').value,
      vendeur:    document.getElementById('vendeur').value,
      region:     document.getElementById('region').value
    };
    try {
      await create('client', body);
      setMessage('client-message', 'Client ajouté avec succès !');
      e.target.reset();
      chargerClients();
    } catch (err) {
      setMessage('client-message', `Erreur ajout : ${err.message}`, true);
    }
  });
});
