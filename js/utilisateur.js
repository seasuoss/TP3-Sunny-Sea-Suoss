async function chargerUtilisateurs() {
  const tbody = document.getElementById('utilisateur-body');
  tbody.innerHTML = '<tr><td colspan="5">Chargement…</td></tr>';
  try {
    const items = await getAll('utilisateur');
    if (items.length === 0) { tbody.innerHTML = '<tr><td colspan="5">Aucun utilisateur.</td></tr>'; return; }
    tbody.innerHTML = items.map(u => `
      <tr>
        <td>${u.id_utilisateur}</td>
        <td>${escapeHtml(u.nom_utilisateur)}</td>
        <td>${escapeHtml(u.email ?? '—')}</td>
        <td>${escapeHtml(u.role ?? '—')}</td>
        <td class="actions">
          <button class="btn-edit" onclick="ouvrirModifUtil(${u.id_utilisateur},'${escapeHtml(u.nom_utilisateur)}','${escapeHtml(u.email||'')}','${escapeHtml(u.role||'')}')">✏️</button>
          <button class="btn-delete" onclick="supprimerUtilisateur(${u.id_utilisateur})">🗑️</button>
        </td>
      </tr>`).join('');
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="5" style="color:#e10600">Erreur : ${e.message}</td></tr>`;
  }
}

async function supprimerUtilisateur(id) {
  if (!confirm(`Supprimer l'utilisateur #${id} ?`)) return;
  try {
    await remove('utilisateur', id);
    setMessage('util-message', `Utilisateur #${id} supprimé.`);
    chargerUtilisateurs();
  } catch (e) { setMessage('util-message', `Erreur : ${e.message}`, true); }
}

function ouvrirModifUtil(id, nom, email, role) {
  document.getElementById('edit-id').value = id;
  document.getElementById('edit-nom').value = nom;
  document.getElementById('edit-email').value = email;
  document.getElementById('edit-role').value = role;
  document.getElementById('edit-modal').style.display = 'flex';
}

document.addEventListener('DOMContentLoaded', () => {
  chargerUtilisateurs();
  document.getElementById('reload-utilisateurs')?.addEventListener('click', chargerUtilisateurs);
  document.getElementById('close-modal')?.addEventListener('click', () => {
    document.getElementById('edit-modal').style.display = 'none';
  });
  document.getElementById('edit-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    const body = {
      nom_utilisateur: document.getElementById('edit-nom').value,
      email: document.getElementById('edit-email').value,
      role: document.getElementById('edit-role').value
    };
    try {
      await update('utilisateur', id, body);
      setMessage('util-message', `Utilisateur #${id} modifié.`);
      document.getElementById('edit-modal').style.display = 'none';
      chargerUtilisateurs();
    } catch (e) { setMessage('util-message', `Erreur : ${e.message}`, true); }
  });
  document.getElementById('util-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const body = {
      nom_utilisateur: document.getElementById('new-nom').value,
      email: document.getElementById('new-email').value,
      role: document.getElementById('new-role').value,
      mot_de_passe: document.getElementById('new-mdp').value
    };
    try {
      await create('utilisateur', body);
      setMessage('util-message', 'Utilisateur ajouté.');
      e.target.reset();
      chargerUtilisateurs();
    } catch (e) { setMessage('util-message', `Erreur : ${e.message}`, true); }
  });
});