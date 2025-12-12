document.addEventListener('DOMContentLoaded', () => {
	const highlightClass = 'is-editing';

	const attachFieldHighlight = (fields) => {
		fields.forEach((field) => {
			field.addEventListener('focus', () => field.classList.add(highlightClass));
			field.addEventListener('input', () => field.classList.add(highlightClass));
			field.addEventListener('blur', () => field.classList.remove(highlightClass));
		});
	};

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

	document
		.querySelectorAll('.page-connexion .auth-form, .page-inscription .auth-form')
		.forEach((form) => {
			enhanceForm({ form });
		});

	const contactForm = document.querySelector('.page-contact .contact-form');
	if (contactForm) {
		enhanceForm({
			form: contactForm,
			emptyMessage: "Merci de compléter tous les champs requis avant d'envoyer votre message.",
			autoTogglePassword: false,
		});
	}
});
