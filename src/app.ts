import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { requestId } from 'hono/request-id';

import db from './database/lib';
import { user } from './database/schema/user';

const app = new Hono().basePath('/api');

app.use(logger());
app.use('*', cors());
app.use('*', requestId());

app.get('/hello', () => {
  return new Response('Hello, World!');
});

app.get('/users', async () => {
  const users = await db.select().from(user);
  console.log(users);
  return new Response(JSON.stringify(users));
});

export default app;
