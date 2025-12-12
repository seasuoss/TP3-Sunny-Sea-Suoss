document.addEventListener('DOMContentLoaded', () => {
	// Classe appliquée pendant la saisie pour indiquer le champ actif
	const highlightClass = 'is-editing';

	// Active un surlignage léger lors du focus/saisie
	const attachFieldHighlight = (fields) => {
		fields.forEach((field) => {
			field.addEventListener('focus', () => field.classList.add(highlightClass));
			field.addEventListener('input', () => field.classList.add(highlightClass));
			field.addEventListener('blur', () => field.classList.remove(highlightClass));
		});
	};

	// Empêche l'envoi si un champ est vide et affiche un message
	const enforceFilledFields = (form, fields, emptyMessage) => {
		form.addEventListener('submit', (event) => {
			const emptyField = fields.find((field) => !field.value.trim());

			if (emptyField) {
				event.preventDefault();
				emptyField.classList.add(highlightClass);
				emptyField.focus();
				alert(emptyMessage);
			}
		});
	};

	// Crée un bouton local pour afficher/masquer un champ mot de passe
	const createPasswordToggle = (passwordField, index = 0) => {
		if (!passwordField || passwordField.dataset.toggleAttached === 'true') {
			return;
		}

		const toggleButton = document.createElement('button');
		toggleButton.type = 'button';
		toggleButton.className = 'password-toggle';
		toggleButton.textContent = 'Afficher';
		toggleButton.style.marginTop = '6px';
		toggleButton.style.alignSelf = 'flex-start';
		toggleButton.style.background = 'transparent';
		toggleButton.style.border = '1px solid #3a3a40';
		toggleButton.style.borderRadius = '20px';
		toggleButton.style.padding = '4px 12px';
		toggleButton.style.color = '#ffffff';
		toggleButton.style.cursor = 'pointer';

		if (!passwordField.id) {
			passwordField.id = `password-input-${index}`;
		}
		toggleButton.setAttribute('aria-controls', passwordField.id);
		toggleButton.setAttribute('aria-pressed', 'false');

		toggleButton.addEventListener('click', () => {
			const shouldReveal = passwordField.type === 'password';
			passwordField.type = shouldReveal ? 'text' : 'password';
			toggleButton.textContent = shouldReveal ? 'Masquer' : 'Afficher';
			toggleButton.setAttribute('aria-pressed', String(shouldReveal));
		});

		passwordField.insertAdjacentElement('afterend', toggleButton);
		passwordField.dataset.toggleAttached = 'true';
	};
	// Attache un bouton externe pour afficher/masquer un champ mot de passe
	const attachExternalToggle = (button, passwordField) => {
		if (!button || !passwordField) {
			return;
		}

		button.addEventListener('click', () => {
			const shouldReveal = passwordField.type === 'password';
			passwordField.type = shouldReveal ? 'text' : 'password';
			button.textContent = shouldReveal ? 'Masquer' : 'Afficher';
			button.setAttribute('aria-pressed', String(shouldReveal));
		});
	};

	// Ajoute toutes les améliorations à un formulaire donné
	const enhanceForm = ({
		form,
		emptyMessage = 'Veuillez remplir tous les champs avant de continuer.',
		autoTogglePassword = true,
		toggleSelector = null,
	}) => {
		if (!form) {
			return;
		}

		const fields = Array.from(form.querySelectorAll('input, textarea'));
		attachFieldHighlight(fields);
		enforceFilledFields(form, fields, emptyMessage);

		const passwordFields = fields.filter((field) => field.type === 'password');

		if (autoTogglePassword) {
			passwordFields.forEach((passwordField, index) => createPasswordToggle(passwordField, index));
		} else if (toggleSelector) {
			const toggleButton = form.querySelector(toggleSelector);
			attachExternalToggle(toggleButton, passwordFields[0]);
		}
	};

	// Améliore automatiquement les formulaires de connexion et d'inscription
	document
		.querySelectorAll('.page-connexion .auth-form, .page-inscription .auth-form')
		.forEach((form) => {
			enhanceForm({ form });
		});

	// Fait de même pour le formulaire de contact, sans bascule de mot de passe
	const contactForm = document.querySelector('.page-contact .contact-form');
	if (contactForm) {
		enhanceForm({
			form: contactForm,
			emptyMessage: "Merci de compléter tous les champs requis avant d'envoyer votre message.",
			autoTogglePassword: false,
		});
	}
});
