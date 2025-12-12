document.addEventListener('DOMContentLoaded', () => {
	// Bouton de la bannière permettant de faire défiler vers la section équipes
	const heroButton = document.querySelector('.btn-info');
	const teamsSection = document.querySelector('.teams');

	if (heroButton && teamsSection) {
		heroButton.addEventListener('click', (event) => {
			event.preventDefault();
			teamsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
		});
	}

	// Animation progressive des lignes d'équipes
	const teamRows = document.querySelectorAll('.teams-table tbody tr');

	if (teamRows.length) {
		if ('IntersectionObserver' in window) {
			const observer = new IntersectionObserver((entries, observerInstance) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('is-visible');
						entry.target.classList.remove('is-hidden');
						observerInstance.unobserve(entry.target);
					}
				});
			}, { threshold: 0.2 });

			teamRows.forEach((row) => {
				row.classList.add('is-hidden');
				observer.observe(row);
			});
		} else {
			teamRows.forEach((row) => row.classList.add('is-visible'));
		}
	}

	// Comportements spécifiques au formulaire de contact
	const contactForm = document.querySelector('#contact-form');

	if (contactForm) {
		const contactFields = contactForm.querySelectorAll('.contact-input');

		contactFields.forEach((field) => {
			field.addEventListener('input', () => {
				field.classList.add('is-editing');
			});

			field.addEventListener('blur', () => {
				if (!field.value.trim()) {
					field.classList.remove('is-editing');
				}
			});
		});

		contactForm.addEventListener('submit', (event) => {
			const emptyField = Array.from(contactFields).find((field) => !field.value.trim());

			if (emptyField) {
				event.preventDefault();
				alert(`Veuillez remplir le champ "${emptyField.dataset.label}" avant d'envoyer.`);
				emptyField.focus();
			}
		});

		const passwordField = contactForm.querySelector('[data-password]');
		const passwordToggle = contactForm.querySelector('.contact-password-toggle');

		if (passwordField && passwordToggle) {
			passwordToggle.addEventListener('click', () => {
				const shouldReveal = passwordField.type === 'password';
				passwordField.type = shouldReveal ? 'text' : 'password';
				passwordToggle.textContent = shouldReveal ? 'Masquer' : 'Afficher';
				passwordToggle.setAttribute('aria-pressed', String(shouldReveal));
			});
		}
	}
});

