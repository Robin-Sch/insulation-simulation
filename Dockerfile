FROM node:20-alpine AS base


# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

# Install dependencies
COPY package*.json ./
RUN npm ci --omit=dev


# Rebuild the source code only when needed
FROM base AS builder
ENV NODE_ENV=production
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build


# Final image
FROM nginx:1.27-alpine

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/out /var/www/html/

EXPOSE 3000

ENTRYPOINT ["nginx","-g","daemon off;"]
