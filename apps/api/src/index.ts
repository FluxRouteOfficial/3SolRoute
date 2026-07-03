import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { authRoutes } from './routes/auth.js';
import { registryRoutes } from './routes/registry.js';
import { paymentRoutes } from './routes/payment.js';
import { walletRoutes } from './routes/wallet.js';
import { healthRoutes } from './routes/health.js';

const app = Fastify({ logger: true });

const allowedOrigins = (process.env.CORS_ORIGIN ?? '')
  .split(/[,\s]+/)
  .map((origin) => origin.trim())
  .filter(Boolean);

await app.register(cors, {
  delegator: (req, callback) => {
    const origin = req.headers.origin;
    const isAllowedOrigin =
      typeof origin === 'string' && allowedOrigins.includes(origin);

    callback(null, {
      origin: !origin || isAllowedOrigin,
      credentials: true,
    });
  },
});
await app.register(rateLimit, { max: 100, timeWindow: '1 minute' });

app.addHook('onSend', async (_req, reply, payload) => {
  reply.header('X-Content-Type-Options', 'nosniff');
  reply.header('X-Frame-Options', 'DENY');
  reply.header('Referrer-Policy', 'no-referrer');
  reply.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  reply.header('Cross-Origin-Resource-Policy', 'same-origin');
  return payload;
});

await app.register(healthRoutes, { prefix: '/api' });
await app.register(authRoutes, { prefix: '/api/auth' });
await app.register(registryRoutes, { prefix: '/api/services' });
await app.register(paymentRoutes, { prefix: '/api/payments' });
await app.register(walletRoutes, { prefix: '/api/wallet' });

const port = Number(process.env.API_PORT) || 4000;
await app.listen({ port, host: '0.0.0.0' });
app.log.info(`FluxRoute API running on :${port}`);
