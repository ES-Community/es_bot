# Installation & Usage

```
npm install
npm start
```

Config settings in /config/prod.json and set the following env var:
```
DISCORD_TOKEN=
TWITTER_CONSUMER_KEY=
TWITTER_CONSUMER_SECRET=
TWITTER_ACCESS_TOKEN=
TWITTER_ACCESS_TOKEN_SECRET=
LOKI_DB_PATH=
```

## Available commands (Liste des commandes du bot)

> Les commandes doivent être prefixer d'un point d'exclamation, par exemple `!help`

Certaines commandes sont réservées aux mentors de la communauté (la case mentor sera donc égal à oui si la commande leur est réservée).

| Nom de la commande | Description | Mentor |
| --- | --- | --- |
| help | Retourne la liste complète des commandes du bot en MP | non |
| doc | Permet de retourner le lien d'une documentation Node.JS ou MDN | non |
| sub / subscribe | Permet de souscrire aux alertes d'un salon | non |
| unsubscribe | Permets de supprimer la souscription précédemment faite à un ou plusieurs salons | non |
| alert | Lance une alerte pour les souscripteurs d'un salon | oui |
