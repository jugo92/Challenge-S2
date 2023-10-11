# Utilisez une image Node.js basée sur ARM64
FROM arm64v8/node:latest
# FROM node:latest

# Installation de Chromium pour Puppeteer
RUN apt-get update && apt-get install -y chromium

# Copiez votre application Node.js dans le conteneur
WORKDIR /app
COPY . .

# Installation des dépendances Node.js
RUN npm install

# Commande pour démarrer votre application
CMD ["npm", "start"]
