# Runs the assistant on any Docker host (Hugging Face Spaces, Koyeb, Fly, a VPS).
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# Hugging Face Spaces expects 7860; other hosts set PORT themselves.
ENV PORT=7860
EXPOSE 7860

CMD ["node", "server.js"]
