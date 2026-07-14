FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Baked into this image at build time (see docker-compose.yml build.args).
# Anyone with access to this image can read these back out — keep the image
# in a private registry / on the server only, never push it publicly.
ARG ADMIN_PASSWORD
ARG RESEND_API_KEY
ARG MAIL_FROM
ARG BOOKING_NOTIFY_EMAILS
ENV ADMIN_PASSWORD=$ADMIN_PASSWORD
ENV RESEND_API_KEY=$RESEND_API_KEY
ENV MAIL_FROM=$MAIL_FROM
ENV BOOKING_NOTIFY_EMAILS=$BOOKING_NOTIFY_EMAILS

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Persisted at runtime via a volume — bookings.json must survive restarts/redeploys.
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
