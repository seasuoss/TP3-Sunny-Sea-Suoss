# Journal d’apprentissage individuel — TP3

**Cours :** 420-2CW-BB — Hiver 2026  
**Étudiant :**Sunny Sea Suos
**Équipe :** Sunny Sea Suos 
**Date de remise :** 20 mai 2026  

---

## 1. Lien TP2 — TP3 : de la conception à la réalisation

Lors du TP2, j’avais conçu un diagramme entité-association avec les tables `client`, `produit`, `utilisateur`, `panier` et `item`, ainsi que des maquettes d’écrans montrant les formulaires d’ajout et les tableaux de données. Cette conception a directement guidé mon développement dans le TP3 : chaque entité est devenue une page HTML distincte (`client.html`, `produit.html`, etc.) et un fichier JavaScript associé dans le dossier `js/`. La structure était donc déjà planifiée, ce qui a accéléré la mise en place.

Toutefois, j’ai remarqué des écarts entre ce que j’avais prévu et ce que j’ai finalement implémenté. Par exemple, dans mes maquettes, j’avais imaginé une interface de gestion des items directement intégrée dans la page panier, mais sans prévoir que cela nécessiterait une requête supplémentaire vers l’API ORDS pour récupérer les items en fonction de l’ID du panier sélectionné. J’ai donc dû ajouter une fonction `getItemsByPanier` dans `api.js` qui ne figurait pas dans ma conception initiale. Cet écart m’a appris qu’une bonne maquette doit aussi prendre en compte les dépendances de données entre les entités, et pas seulement l’apparence visuelle des écrans.

---

## 2. Apprentissages techniques significatifs

**Premier apprentissage : la centralisation des appels `fetch` dans `api.js`**

Avant ce TP, je savais utiliser `fetch()` pour récupérer des données d’une URL, mais je le faisais directement dans mes fichiers HTML ou dans des scripts en ligne. Je ne comprenais pas pourquoi il fallait isoler ces appels dans un fichier séparé. Maintenant, je comprends que centraliser tous les `fetch` dans `api.js` crée une seule source de vérité pour toute la communication réseau. Si l’URL de l’API ORDS change (par exemple le port 8080), je n’ai qu’un seul endroit à modifier plutôt que de chercher dans chaque fichier. Cet apprentissage s’est produit quand j’ai dû modifier la `BASE_URL` et que j’ai réalisé à quel point c’est plus facile quand tout est régis par une seule constante au sommet de `api.js`.

**Deuxième apprentissage : la manipulation dynamique du DOM avec JavaScript pur**

Avant ce TP, je générais du contenu HTML surtout côté serveur ou en modifiant des éléments statiques. Je ne savais pas vraiment comment construire un tableau HTML entier à partir d’un tableau de données JSON. J’ai appris à utiliser `innerHTML`, `createElement`, `appendChild`, et surtout `insertAdjacentHTML` pour générer des lignes de tableau `<tr>` dynamiquement à chaque chargement. Ce que je comprends maintenant, c’est que le DOM est un arbre que JavaScript peut modifier en temps réel sans rechargement de page, ce qui est l’essence même d’une application Web dynamique. Cet apprentissage s’est produit concrètement dans `js/clients.js` quand j’ai implémenté la fonction `renderClients()` qui reconstruit tout le `<tbody>` du tableau à chaque mise à jour.

---

## 3. Architecture de l’application : les trois couches

L’application repose sur trois couches distinctes qui communiquent en séquence : la **base de données Oracle**, l’**API REST ORDS** et l’**interface Web**.

La base de données Oracle stocke physiquement les données dans des tables relationnelles comme `client` ou `produit`. Elle ne communique pas directement avec le navigateur. C’est ORDS (Oracle REST Data Services) qui joue le rôle d’intermédiaire : il expose chaque table comme un endpoint HTTP, par exemple `http://localhost:8080/ords/commande/client`. Quand on fait une requête `GET` sur cet endpoint, ORDS interroge Oracle et retourne les données en format JSON avec une structure `{ items: [...] }`. C’est pourquoi, dans `api.js`, j’utilise `data.items` pour accéder aux enregistrements :

```javascript
export async function getAll(endpoint) {
  const res = await fetch(BASE_URL + endpoint);
  const data = await res.json();
  return data.items;
}
```

Finalement, l’interface Web en HTML/CSS/JS reçoit ce tableau `items`, puis `clients.js` génère dynamiquement les lignes du tableau affiché dans le navigateur. Chaque couche a une responsabilité claire et bien séparée : Oracle stocke, ORDS expose, et l’interface affiche et interagit.

---

## 4. Regard critique

Avec du recul, j’aurais fait plusieurs choses différemment dans ce projet. Premièrement, j’aurais testé les endpoints ORDS bien plus tôt, directement dans le navigateur comme conseillé dans les consignes, avant d’écrire une seule ligne de JavaScript. J’ai perdu du temps à déboguer des erreurs de `fetch` dans le code alors que le problème venait simplement du fait que l’endpoint n’était pas encore activé dans ORDS. Une simple vérification dans l’URL du navigateur aurait identifié le problème en quelques secondes.

Deuxièmement, concernant la structure du projet, j’aurais nommé les fichiers selon les entités du TP2 dès le début, sans partir du modèle exemple avec les noms génériques. J’ai dû renommer plusieurs fichiers en cours de route, ce qui a causé des erreurs de liens brisés dans les pages HTML et m’a obligé à tout corriger manuellement. La leçon est qu’en développement Web, un bon plan de nommage au départ évite beaucoup de dette technique ensuite. Finalement, sur le plan du travail d’équipe, j’aurais utilisé des branches Git séparées pour chaque fonctionnalité plutôt que de travailler directement sur `main`, ce qui aurait évité des conflits lors des fusions de code.
