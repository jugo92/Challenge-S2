# Utilisez une image Node.js basée sur ARM64
FROM arm64v8/node:latest

# Installation de Chromium pour Puppeteer
RUN apt-get update && apt-get install -y chromium

# Définissez l'environnement pour indiquer l'emplacement de Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Copiez votre application Node.js dans le conteneur
WORKDIR /app
COPY . .

# Installation des dépendances Node.js
RUN npm install

# Commande pour démarrer votre application
CMD ["npm", "start"]
