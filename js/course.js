// ── course.js ──────────────────────────────────────────────
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
  set('nom',''); set('lieu',''); set('date_course',''); set('saison','');
  $('form-title').textContent = 'Ajouter';
  $('mode-pill').textContent = 'AJOUT'; $('mode-pill').classList.remove('edit');
  $('btn-submit').textContent = 'Ajouter'; $('btn-cancel').style.display = 'none';
}

async function load() {
  $('tbody').innerHTML = '<tr><td colspan="6" class="loading">Chargement…</td></tr>';
  const rows = await getAll('course');
  $('count').textContent = (rows.length || 0) + ' entrée(s)';
  if (!rows.length) { $('tbody').innerHTML = '<tr><td colspan="6" class="loading">Aucun enregistrement.</td></tr>'; return; }
  $('tbody').innerHTML = rows.map(r => `<tr>
    <td>${r.course_id ?? r.id}</td><td>${r.nom ?? ''}</td><td>${r.lieu ?? ''}</td>
    <td>${r.date_course ? r.date_course.substring(0,10) : ''}</td><td>${r.saison ?? ''}</td>
    <td><div class="actions">
      <button class="btn-edit" onclick="editRow(${r.course_id ?? r.id})">✏️ Modifier</button>
      <button class="btn-del"  onclick="deleteRow(${r.course_id ?? r.id})">🗑️ Supprimer</button>
    </div></td></tr>`).join('');
}

async function editRow(id) {
  const d = await getById('course', id);
  if (!d) { toast('Introuvable.', 'err'); return; }
  $('f-pk').value = d.course_id ?? d.id;
  set('nom', d.nom ?? ''); set('lieu', d.lieu ?? '');
  set('date_course', d.date_course ? d.date_course.substring(0,10) : '');
  set('saison', d.saison ?? '');
  $('form-title').textContent = 'Modifier';
  $('mode-pill').textContent = 'MODIFICATION'; $('mode-pill').classList.add('edit');
  $('btn-submit').textContent = 'Enregistrer'; $('btn-cancel').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteRow(id) {
  if (!confirm('Supprimer cet enregistrement ?')) return;
  const ok = await remove('course', id);
  ok ? (toast('Course supprimée.'), load()) : toast('Erreur suppression.', 'err');
}

$('crud-form').addEventListener('submit', async () => {
  const _nom = v('nom'), _lieu = v('lieu'), _date_course = v('date_course'), _saison = v('saison');
  if (!_nom || !_lieu) { toast('Champs obligatoires manquants.', 'err'); return; }
  const body = { nom: _nom, lieu: _lieu, date_course: _date_course || null, saison: _saison ? parseInt(_saison) : null };
  const pk = $('f-pk').value;
  pk ? (await update('course', pk, body), toast('Course modifiée.'))
     : (await create('course', body), toast('Course ajoutée.'));
  resetForm(); load();
});

$('btn-cancel').addEventListener('click', resetForm);
load();
