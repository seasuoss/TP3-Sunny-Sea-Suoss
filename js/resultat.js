// ── resultat.js ────────────────────────────────────────────
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
  set('course_id',''); set('pilote_id',''); set('position','');
  set('points',''); set('statut','Finisher');
  $('form-title').textContent = 'Ajouter';
  $('mode-pill').textContent = 'AJOUT'; $('mode-pill').classList.remove('edit');
  $('btn-submit').textContent = 'Ajouter'; $('btn-cancel').style.display = 'none';
}

async function load() {
  $('tbody').innerHTML = '<tr><td colspan="7" class="loading">Chargement…</td></tr>';
  const rows = await getAll('resultat');
  $('count').textContent = (rows.length || 0) + ' entrée(s)';
  if (!rows.length) { $('tbody').innerHTML = '<tr><td colspan="7" class="loading">Aucun enregistrement.</td></tr>'; return; }
  $('tbody').innerHTML = rows.map(r => `<tr>
    <td>${r.resultat_id ?? r.id}</td><td>${r.course_id ?? ''}</td><td>${r.pilote_id ?? ''}</td>
    <td>${r.position ?? ''}</td><td>${r.points ?? 0}</td><td>${r.statut ?? ''}</td>
    <td><div class="actions">
      <button class="btn-edit" onclick="editRow(${r.resultat_id ?? r.id})">✏️ Modifier</button>
      <button class="btn-del"  onclick="deleteRow(${r.resultat_id ?? r.id})">🗑️ Supprimer</button>
    </div></td></tr>`).join('');
}

async function editRow(id) {
  const d = await getById('resultat', id);
  if (!d) { toast('Introuvable.', 'err'); return; }
  $('f-pk').value = d.resultat_id ?? d.id;
  set('course_id', d.course_id ?? ''); set('pilote_id', d.pilote_id ?? '');
  set('position', d.position ?? ''); set('points', d.points ?? '');
  set('statut', d.statut ?? 'Finisher');
  $('form-title').textContent = 'Modifier';
  $('mode-pill').textContent = 'MODIFICATION'; $('mode-pill').classList.add('edit');
  $('btn-submit').textContent = 'Enregistrer'; $('btn-cancel').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteRow(id) {
  if (!confirm('Supprimer cet enregistrement ?')) return;
  const ok = await remove('resultat', id);
  ok ? (toast('Résultat supprimé.'), load()) : toast('Erreur suppression.', 'err');
}

$('crud-form').addEventListener('submit', async () => {
  const _course_id = v('course_id'), _pilote_id = v('pilote_id'), _position = v('position');
  const _points = v('points'), _statut = v('statut');
  if (!_course_id || !_pilote_id || !_position) { toast('Champs obligatoires manquants.', 'err'); return; }
  const body = { course_id: parseInt(_course_id), pilote_id: parseInt(_pilote_id),
    position: parseInt(_position), points: _points ? parseFloat(_points) : 0, statut: _statut };
  const pk = $('f-pk').value;
  pk ? (await update('resultat', pk, body), toast('Résultat modifié.'))
     : (await create('resultat', body), toast('Résultat ajouté.'));
  resetForm(); load();
});

$('btn-cancel').addEventListener('click', resetForm);
load();
