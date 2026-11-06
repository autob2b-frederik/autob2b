FROM node:22-bookworm-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY . .
ENV HOST=0.0.0.0
ENV COOKIE_SECURE=1
ENV PORT=10000
EXPOSE 10000
CMD ["npm","start"]
