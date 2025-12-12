document.addEventListener('DOMContentLoaded', () => {
    const heroButton = document.querySelector('.btn-info');
    const teamsSection = document.querySelector('.teams');

    if (heroButton && teamsSection) {
        heroButton.addEventListener('click', (event) => {
            event.preventDefault();
            teamsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

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

    const contactLink = document.querySelector('.contact');

    if (contactLink) {
        contactLink.addEventListener('click', (event) => {
            if (contactLink.getAttribute('href') === '#') {
                event.preventDefault();
                alert('Envoyez-nous un e-mail a contact@f1.fr');
            }
        });
    }
});
