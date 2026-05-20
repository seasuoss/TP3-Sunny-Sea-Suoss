// produits.js — Gestion de la page produit.html

async function chargerProduits(filtre = '') {
  const tbody = document.getElementById('produits-body');
  tbody.innerHTML = '<tr><td colspan="7">Chargement…</td></tr>';
  try {
    let items = await getAll('produit');
    if (filtre) items = items.filter(p => p.nom?.toLowerCase().includes(filtre.toLowerCase()));
    if (items.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7">Aucun produit trouvé.</td></tr>';
      return;
    }
    tbody.innerHTML = items.map(p => `
      <tr>
        <td>${p.id_produit}</td>
        <td>${escapeHtml(p.nom)}</td>
        <td>${formatMoney(p.prix)}</td>
        <td>${formatMoney(p.cout)}</td>
        <td>${p.stock ?? '—'}</td>
        <td>${p.categorie ?? '—'}</td>
        <td class="actions">
          <button class="btn-edit" onclick="ouvrirModifProduit(${p.id_produit}, '${escapeHtml(p.nom)}', ${p.prix}, ${p.cout}, ${p.stock??0}, ${p.categorie??0})">✏️</button>
          <button class="btn-delete" onclick="supprimerProduit(${p.id_produit})">🗑️</button>
        </td>
      </tr>`).join('');
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="7" style="color:#e10600">Erreur : ${e.message}</td></tr>`;
  }
}

async function supprimerProduit(id) {
  if (!confirm(`Supprimer le produit #${id} ?`)) return;
  try {
    await remove('produit', id);
    setMessage('produit-message', `Produit #${id} supprimé.`);
    chargerProduits();
  } catch (e) {
    setMessage('produit-message', `Erreur : ${e.message}`, true);
  }
}

function ouvrirModifProduit(id, nom, prix, cout, stock, cat) {
  document.getElementById('edit-id').value = id;
  document.getElementById('edit-nom').value = nom;
  document.getElementById('edit-prix').value = prix;
  document.getElementById('edit-cout').value = cout;
  document.getElementById('edit-stock').value = stock;
  document.getElementById('edit-categorie').value = cat;
  document.getElementById('edit-modal').style.display = 'flex';
}

document.addEventListener('DOMContentLoaded', () => {
  chargerProduits();

  document.getElementById('reload-produits')?.addEventListener('click', () => chargerProduits());
  document.getElementById('close-modal')?.addEventListener('click', () => {
    document.getElementById('edit-modal').style.display = 'none';
  });

  document.getElementById('search-produit')?.addEventListener('input', e => {
    chargerProduits(e.target.value);
  });

  document.getElementById('edit-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    const body = {
      nom:       document.getElementById('edit-nom').value,
      prix:      parseFloat(document.getElementById('edit-prix').value),
      cout:      parseFloat(document.getElementById('edit-cout').value),
      stock:     parseInt(document.getElementById('edit-stock').value),
      categorie: parseInt(document.getElementById('edit-categorie').value)
    };
    try {
      await update('produit', id, body);
      setMessage('produit-message', `Produit #${id} modifié.`);
      document.getElementById('edit-modal').style.display = 'none';
      chargerProduits();
    } catch (e) {
      setMessage('produit-message', `Erreur : ${e.message}`, true);
    }
  });

  document.getElementById('produit-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const body = {
      nom:       document.getElementById('nom').value,
      prix:      parseFloat(document.getElementById('prix').value),
      cout:      parseFloat(document.getElementById('cout').value),
      stock:     parseInt(document.getElementById('stock').value),
      categorie: parseInt(document.getElementById('categorie').value) || null
    };
    try {
      await create('produit', body);
      setMessage('produit-message', 'Produit ajouté !');
      e.target.reset();
      chargerProduits();
    } catch (err) {
      setMessage('produit-message', `Erreur : ${err.message}`, true);
    }
  });
});
