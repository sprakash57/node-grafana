import express from 'express';
import slowService from './services/slowService';
import logger from './services/logger';
import promClient from 'prom-client';
import responseTime from 'response-time';

const app = express();

promClient.collectDefaultMetrics({ register: promClient.register });

const totalTimeHistogram = new promClient.Histogram({
  name: 'task_total_time',
  help: 'Total time taken for a task',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [1, 20, 50, 100, 200, 500, 700, 800, 1000, 2000, 3000],
});

const totalRequestsCounter = new promClient.Counter({
  name: 'task_total_requests',
  help: 'Total number of requests',
});

app.use(
  responseTime((req, res, time) => {
    totalRequestsCounter.inc();
    totalTimeHistogram.labels({ method: req.method, route: req.url, status_code: res.statusCode }).observe(time);
  }),
);

app.get('/', (_req, res) => {
  res.status(200).send('OK... Health check is successful');
});

app.get('/task', async (_req, res) => {
  try {
    const delayInMs = await slowService.executeTask();
    logger.info(`Task completed in ${delayInMs}ms`, { route: '/task' });
    res.status(200).send(`Task completed in ${delayInMs}ms`);
  } catch (error) {
    logger.error(`Error executing task: ${error}`, { route: '/task' });
    res.status(500).send(`Error executing task: ${error}`);
  }
});

app.get('/metrics', async (_req, res) => {
  res.setHeader('Content-Type', promClient.register.contentType);
  const metrics = await promClient.register.metrics();
  res.send(metrics);
});

app.listen(6000, () => {
  console.log('Server started on port 6000');
});
