async function chargerPaniers(filtre = '') {
  const tbody = document.getElementById('paniers-body');
  tbody.innerHTML = '<tr><td colspan="6">Chargement…</td></tr>';
  try {
    let items = await getAll('panier');
    if (filtre) items = items.filter(p => String(p.id_panier).includes(filtre));
    if (items.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6">Aucun panier.</td></tr>';
      return;
    }
    tbody.innerHTML = items.map(p => `
      <tr>
        <td>${p.id_panier}</td>
        <td>${p.id_client}</td>
        <td>${p.id_utilisateur}</td>
        <td>${p.date_creation ? p.date_creation.substring(0,10) : '—'}</td>
        <td>${escapeHtml(p.note ?? '—')}</td>
        <td class="actions">
          <button class="btn-items" onclick="voirItems(${p.id_panier})">📋 Items</button>
          <button class="btn-delete" onclick="supprimerPanier(${p.id_panier})">🗑️</button>
        </td>
      </tr>`).join('');
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="6" style="color:#e10600">Erreur : ${e.message}</td></tr>`;
  }
}

async function voirItems(idPanier) {
  const tbody = document.getElementById('items-body');
  const section = document.getElementById('items-section');
  document.getElementById('items-title').textContent = `Items du panier #${idPanier}`;
  section.style.display = 'block';
  tbody.innerHTML = '<tr><td colspan="5">Chargement…</td></tr>';
  try {
    const items = await getAll(`item?q={%22id_panier%22:{%22$eq%22:${idPanier}}}`);
    if (items.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5">Aucun item dans ce panier.</td></tr>';
      return;
    }
    tbody.innerHTML = items.map(i => `
      <tr>
        <td>${i.id_item}</td>
        <td>${i.id_produit}</td>
        <td>${i.qte_commande}</td>
        <td>${formatMoney(i.prix)}</td>
        <td>${i.escompte ?? 0} %</td>
      </tr>`).join('');
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="5" style="color:#e10600">Erreur items : ${e.message}</td></tr>`;
  }
}

async function supprimerPanier(id) {
  if (!confirm(`Supprimer le panier #${id} ?`)) return;
  try {
    await remove('panier', id);
    setMessage('panier-message', `Panier #${id} supprimé.`);
    chargerPaniers();
  } catch (e) {
    setMessage('panier-message', `Erreur : ${e.message}`, true);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  chargerPaniers();

  document.getElementById('reload-paniers')?.addEventListener('click', () => chargerPaniers());

  document.getElementById('filtre-panier-id')?.addEventListener('input', e => {
    chargerPaniers(e.target.value);
  });

  document.getElementById('panier-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const body = {
      id_client:      parseInt(document.getElementById('idclient').value),
      id_utilisateur: parseInt(document.getElementById('idutilisateur').value),
      note:           document.getElementById('note').value
    };
    try {
      await create('panier', body);
      setMessage('panier-message', 'Panier créé !');
      e.target.reset();
      chargerPaniers();
    } catch (err) {
      setMessage('panier-message', `Erreur : ${err.message}`, true);
    }
  });
});
