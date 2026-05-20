// utilisateurs.js — Gestion de la page utilisateur.html

async function chargerUtilisateurs() {
  const tbody = document.getElementById('utilisateurs-body');
  tbody.innerHTML = '<tr><td colspan="7">Chargement…</td></tr>';
  try {
    const items = await getAll('utilisateur');
    if (items.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7">Aucun utilisateur.</td></tr>';
      return;
    }
    tbody.innerHTML = items.map(u => `
      <tr>
        <td>${u.id_utilisateur}</td>
        <td>${escapeHtml(u.nom)}</td>
        <td>${escapeHtml(u.prenom)}</td>
        <td>${escapeHtml(u.ville ?? '—')}</td>
        <td>${escapeHtml(u.courriel)}</td>
        <td><span class="mdp-mask" title="Cliquer pour voir" onclick="this.textContent = this.textContent === '••••••' ? '${escapeHtml(u.mdp)}' : '••••••'">••••••</span></td>
        <td class="actions">
          <button class="btn-edit" onclick="ouvrirModifUser(${u.id_utilisateur},'${escapeHtml(u.nom)}','${escapeHtml(u.prenom)}','${escapeHtml(u.adresse||'')}','${escapeHtml(u.ville||'')}','${escapeHtml(u.courriel)}')">✏️</button>
          <button class="btn-delete" onclick="supprimerUser(${u.id_utilisateur})">🗑️</button>
        </td>
      </tr>`).join('');
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="7" style="color:#e10600">Erreur : ${e.message}</td></tr>`;
  }
}

async function supprimerUser(id) {
  if (!confirm(`Supprimer l'utilisateur #${id} ?`)) return;
  try {
    await remove('utilisateur', id);
    setMessage('utilisateur-message', `Utilisateur #${id} supprimé.`);
    chargerUtilisateurs();
  } catch (e) {
    setMessage('utilisateur-message', `Erreur : ${e.message}`, true);
  }
}

function ouvrirModifUser(id, nom, prenom, adresse, ville, courriel) {
  document.getElementById('edit-id').value = id;
  document.getElementById('edit-nom').value = nom;
  document.getElementById('edit-prenom').value = prenom;
  document.getElementById('edit-adresse').value = adresse;
  document.getElementById('edit-ville').value = ville;
  document.getElementById('edit-courriel').value = courriel;
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
      nom:     document.getElementById('edit-nom').value,
      prenom:  document.getElementById('edit-prenom').value,
      adresse: document.getElementById('edit-adresse').value,
      ville:   document.getElementById('edit-ville').value,
      courriel:document.getElementById('edit-courriel').value
    };
    try {
      await update('utilisateur', id, body);
      setMessage('utilisateur-message', `Utilisateur #${id} modifié.`);
      document.getElementById('edit-modal').style.display = 'none';
      chargerUtilisateurs();
    } catch (e) {
      setMessage('utilisateur-message', `Erreur : ${e.message}`, true);
    }
  });

  document.getElementById('utilisateur-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const body = {
      nom:     document.getElementById('nom').value,
      prenom:  document.getElementById('prenom').value,
      adresse: document.getElementById('adresse').value,
      ville:   document.getElementById('ville').value,
      courriel:document.getElementById('courriel').value,
      mdp:     document.getElementById('mdp').value
    };
    try {
      await create('utilisateur', body);
      setMessage('utilisateur-message', 'Utilisateur ajouté !');
      e.target.reset();
      chargerUtilisateurs();
    } catch (err) {
      setMessage('utilisateur-message', `Erreur : ${err.message}`, true);
    }
  });
});
