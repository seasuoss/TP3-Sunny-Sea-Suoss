// ── ecurie.js ──────────────────────────────────────────────
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
  set('nom',''); set('pays',''); set('motoriste',''); set('annee_fondation','');
  $('form-title').textContent = 'Ajouter';
  $('mode-pill').textContent = 'AJOUT';
  $('mode-pill').classList.remove('edit');
  $('btn-submit').textContent = 'Ajouter';
  $('btn-cancel').style.display = 'none';
}

async function load() {
  $('tbody').innerHTML = '<tr><td colspan="6" class="loading">Chargement…</td></tr>';
  const rows = await getAll('ecurie');
  $('count').textContent = (rows.length || 0) + ' entrée(s)';
  if (!rows.length) {
    $('tbody').innerHTML = '<tr><td colspan="6" class="loading">Aucun enregistrement.</td></tr>';
    return;
  }
  $('tbody').innerHTML = rows.map(r => `<tr>
    <td>${r.ecurie_id ?? r.id}</td><td>${r.nom ?? ''}</td><td>${r.pays ?? ''}</td>
    <td>${r.motoriste ?? ''}</td><td>${r.annee_fondation ?? ''}</td>
    <td><div class="actions">
      <button class="btn-edit" onclick="editRow(${r.ecurie_id ?? r.id})">✏️ Modifier</button>
      <button class="btn-del"  onclick="deleteRow(${r.ecurie_id ?? r.id})">🗑️ Supprimer</button>
    </div></td></tr>`).join('');
}

async function editRow(id) {
  const d = await getById('ecurie', id);
  if (!d) { toast('Introuvable.', 'err'); return; }
  $('f-pk').value = d.ecurie_id ?? d.id;
  set('nom', d.nom ?? ''); set('pays', d.pays ?? '');
  set('motoriste', d.motoriste ?? ''); set('annee_fondation', d.annee_fondation ?? '');
  $('form-title').textContent = 'Modifier';
  $('mode-pill').textContent = 'MODIFICATION'; $('mode-pill').classList.add('edit');
  $('btn-submit').textContent = 'Enregistrer'; $('btn-cancel').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteRow(id) {
  if (!confirm('Supprimer cet enregistrement ?')) return;
  const ok = await remove('ecurie', id);
  ok ? (toast('Écurie supprimée.'), load()) : toast('Erreur suppression.', 'err');
}

$('crud-form').addEventListener('submit', async () => {
  const _nom = v('nom'), _pays = v('pays'), _motoriste = v('motoriste'), _annee_fondation = v('annee_fondation');
  if (!_nom) { toast('Champs obligatoires manquants.', 'err'); return; }
  const body = { nom: _nom, pays: _pays, motoriste: _motoriste, annee_fondation: _annee_fondation ? parseInt(_annee_fondation) : null };
  const pk = $('f-pk').value;
  pk ? (await update('ecurie', pk, body), toast('Écurie modifiée.'))
     : (await create('ecurie', body), toast('Écurie ajoutée.'));
  resetForm(); load();
});

$('btn-cancel').addEventListener('click', resetForm);
load();
