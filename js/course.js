async function chargerCourses() {
  const tbody = document.getElementById('course-body');
  tbody.innerHTML = '<tr><td colspan="6">Chargement…</td></tr>';
  try {
    const items = await getAll('course');
    if (items.length === 0) { tbody.innerHTML = '<tr><td colspan="6">Aucune course.</td></tr>'; return; }
    tbody.innerHTML = items.map(c => `
      <tr>
        <td>${c.id_course}</td>
        <td>${escapeHtml(c.nom_course ?? '—')}</td>
        <td>${escapeHtml(c.circuit ?? '—')}</td>
        <td>${c.date_course ? c.date_course.substring(0,10) : '—'}</td>
        <td>${c.nb_tours ?? '—'}</td>
        <td class="actions">
          <button class="btn-items" onclick="voirResultats(${c.id_course})">📋 Résultats</button>
          <button class="btn-delete" onclick="supprimerCourse(${c.id_course})">🗑️</button>
        </td>
      </tr>`).join('');
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="6" style="color:#e10600">Erreur : ${e.message}</td></tr>`;
  }
}

async function voirResultats(idCourse) {
  const tbody = document.getElementById('resultat-body');
  const section = document.getElementById('resultat-section');
  document.getElementById('resultat-title').textContent = `Résultats — Course #${idCourse}`;
  section.style.display = 'block';
  tbody.innerHTML = '<tr><td colspan="5">Chargement…</td></tr>';
  try {
    const items = await getAll(`resultat?q={%22id_course%22:{%22$eq%22:${idCourse}}}`);
    if (items.length === 0) { tbody.innerHTML = '<tr><td colspan="5">Aucun résultat.</td></tr>'; return; }
    tbody.innerHTML = items.map(r => `
      <tr>
        <td>${r.id_resultat}</td>
        <td>${r.id_pilote}</td>
        <td>${r.position ?? '—'}</td>
        <td>${r.points ?? '—'}</td>
        <td>${r.temps_total ?? '—'}</td>
      </tr>`).join('');
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="5" style="color:#e10600">Erreur résultats : ${e.message}</td></tr>`;
  }
}

async function supprimerCourse(id) {
  if (!confirm(`Supprimer la course #${id} ?`)) return;
  try {
    await remove('course', id);
    setMessage('course-message', `Course #${id} supprimée.`);
    chargerCourses();
  } catch (e) { setMessage('course-message', `Erreur : ${e.message}`, true); }
}

document.addEventListener('DOMContentLoaded', () => {
  chargerCourses();
  document.getElementById('reload-courses')?.addEventListener('click', chargerCourses);
  document.getElementById('course-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const body = {
      nom_course: document.getElementById('new-nom').value,
      circuit: document.getElementById('new-circuit').value,
      date_course: document.getElementById('new-date').value,
      nb_tours: parseInt(document.getElementById('new-tours').value)
    };
    try {
      await create('course', body);
      setMessage('course-message', 'Course ajoutée.');
      e.target.reset();
      chargerCourses();
    } catch (e) { setMessage('course-message', `Erreur : ${e.message}`, true); }
  });
});