# Challenge-S2

## Points d'attention

Effectuer des tests unitaires sur les routes et les modèles.

### Code de retour HTTP

- 200: OK -> requête traitée avec succès
- 201: Created -> requête traitée avec succès et création d’un document
- 204: No Content -> requête traitée avec succès mais pas d’information à renvoyer
- 400: Bad Request -> la syntaxe de la requête est erronée
- 404: Not Found -> la ressource demandée n’existe pas
- 500: Internal Server Error -> erreur interne du serveur

### Documentation

- Mongoose: https://mongoosejs.com/docs/guide.html
- Sequelize: https://sequelize.org/master/manual/getting-started.html

### Fausses données 

- dummyjson: https://dummyjson.com/docs
- jsonplaceholder: https://jsonplaceholder.typicode.com/
- dummy-json: https://www.npmjs.com/package/dummy-json
- fake-schema: https://www.npmjs.com/package/fake-schema
