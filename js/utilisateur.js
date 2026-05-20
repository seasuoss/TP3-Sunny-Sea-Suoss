// ── utilisateur.js ─────────────────────────────────────────
const $ = id => document.getElementById(id);
const v = id => ($('f-' + id).value ?? '').trim();
const set = (id, val) => $('f-' + id).value = val;

function toast(msg, type = 'ok') {
  const t = $('toast');
  t.textContent = msg; t.className = 'show ' + type;
  setTimeout(() => t.className = '', 2800);
}

function resetForm() {
  $('f-pk').value = '';
  set('username',''); set('email',''); set('mot_de_passe',''); set('role','user');
  $('form-title').textContent = 'Ajouter';
  $('mode-pill').textContent = 'AJOUT'; $('mode-pill').classList.remove('edit');
  $('btn-submit').textContent = 'Ajouter'; $('btn-cancel').style.display = 'none';
}

async function load() {
  $('tbody').innerHTML = '<tr><td colspan="5" class="loading">Chargement…</td></tr>';
  const rows = await getAll('utilisateur');
  $('count').textContent = (rows.length || 0) + ' entrée(s)';
  if (!rows.length) { $('tbody').innerHTML = '<tr><td colspan="5" class="loading">Aucun enregistrement.</td></tr>'; return; }
  $('tbody').innerHTML = rows.map(r => `<tr>
    <td>${r.utilisateur_id ?? r.id}</td>
    <td>${r.username ?? r.nom_utilisateur ?? ''}</td>
    <td>${r.email ?? r.courriel ?? ''}</td>
    <td>${r.role ?? ''}</td>
    <td><div class="actions">
      <button class="btn-edit" onclick="editRow(${r.utilisateur_id ?? r.id})">✏️ Modifier</button>
      <button class="btn-del"  onclick="deleteRow(${r.utilisateur_id ?? r.id})">🗑️ Supprimer</button>
    </div></td></tr>`).join('');
}

async function editRow(id) {
  const d = await getById('utilisateur', id);
  if (!d) { toast('Introuvable.', 'err'); return; }
  $('f-pk').value = d.utilisateur_id ?? d.id;
  set('username', d.username ?? d.nom_utilisateur ?? '');
  set('email', d.email ?? d.courriel ?? '');
  set('mot_de_passe', '');
  set('role', d.role ?? 'user');
  $('form-title').textContent = 'Modifier';
  $('mode-pill').textContent = 'MODIFICATION'; $('mode-pill').classList.add('edit');
  $('btn-submit').textContent = 'Enregistrer'; $('btn-cancel').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteRow(id) {
  if (!confirm('Supprimer cet enregistrement ?')) return;
  const ok = await remove('utilisateur', id);
  ok ? (toast('Utilisateur supprimé.'), load()) : toast('Erreur suppression.', 'err');
}

$('crud-form').addEventListener('submit', async () => {
  const _username = v('username'), _email = v('email');
  const _mdp = v('mot_de_passe'), _role = v('role');
  if (!_username || !_email) { toast('Champs obligatoires manquants.', 'err'); return; }
  const body = { username: _username, email: _email, role: _role };
  if (_mdp) body.mot_de_passe = _mdp;
  const pk = $('f-pk').value;
  pk ? (await update('utilisateur', pk, body), toast('Utilisateur modifié.'))
     : (await create('utilisateur', body), toast('Utilisateur ajouté.'));
  resetForm(); load();
});

$('btn-cancel').addEventListener('click', resetForm);
load();
