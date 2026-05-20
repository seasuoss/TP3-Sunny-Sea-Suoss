// ── pilote.js ──────────────────────────────────────────────
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
  set('prenom',''); set('nom',''); set('nationalite',''); set('numero',''); set('ecurie_id','');
  $('form-title').textContent = 'Ajouter';
  $('mode-pill').textContent = 'AJOUT'; $('mode-pill').classList.remove('edit');
  $('btn-submit').textContent = 'Ajouter'; $('btn-cancel').style.display = 'none';
}

async function load() {
  $('tbody').innerHTML = '<tr><td colspan="7" class="loading">Chargement…</td></tr>';
  const rows = await getAll('pilote');
  $('count').textContent = (rows.length || 0) + ' entrée(s)';
  if (!rows.length) { $('tbody').innerHTML = '<tr><td colspan="7" class="loading">Aucun enregistrement.</td></tr>'; return; }
  $('tbody').innerHTML = rows.map(r => `<tr>
    <td>${r.pilote_id ?? r.id}</td><td>${r.prenom ?? ''}</td><td>${r.nom ?? ''}</td>
    <td>${r.nationalite ?? ''}</td><td>${r.numero ?? ''}</td><td>${r.ecurie_id ?? ''}</td>
    <td><div class="actions">
      <button class="btn-edit" onclick="editRow(${r.pilote_id ?? r.id})">✏️ Modifier</button>
      <button class="btn-del"  onclick="deleteRow(${r.pilote_id ?? r.id})">🗑️ Supprimer</button>
    </div></td></tr>`).join('');
}

async function editRow(id) {
  const d = await getById('pilote', id);
  if (!d) { toast('Introuvable.', 'err'); return; }
  $('f-pk').value = d.pilote_id ?? d.id;
  set('prenom', d.prenom ?? ''); set('nom', d.nom ?? '');
  set('nationalite', d.nationalite ?? ''); set('numero', d.numero ?? '');
  set('ecurie_id', d.ecurie_id ?? '');
  $('form-title').textContent = 'Modifier';
  $('mode-pill').textContent = 'MODIFICATION'; $('mode-pill').classList.add('edit');
  $('btn-submit').textContent = 'Enregistrer'; $('btn-cancel').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteRow(id) {
  if (!confirm('Supprimer cet enregistrement ?')) return;
  const ok = await remove('pilote', id);
  ok ? (toast('Pilote supprimé.'), load()) : toast('Erreur suppression.', 'err');
}

$('crud-form').addEventListener('submit', async () => {
  const _prenom = v('prenom'), _nom = v('nom'), _nationalite = v('nationalite');
  const _numero = v('numero'), _ecurie_id = v('ecurie_id');
  if (!_prenom || !_nom) { toast('Champs obligatoires manquants.', 'err'); return; }
  const body = { prenom: _prenom, nom: _nom, nationalite: _nationalite,
    numero: _numero ? parseInt(_numero) : null,
    ecurie_id: _ecurie_id ? parseInt(_ecurie_id) : null };
  const pk = $('f-pk').value;
  pk ? (await update('pilote', pk, body), toast('Pilote modifié.'))
     : (await create('pilote', body), toast('Pilote ajouté.'));
  resetForm(); load();
});

$('btn-cancel').addEventListener('click', resetForm);
load();
