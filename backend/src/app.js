import express from "express";
import routes from "./routes/index.routes.js";
import cors from "cors";
const app = express();
import "./instrument.js";
import * as Sentry from "@sentry/node";
import client from "prom-client";

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5] // Buckets de tempo: 100ms, 500ms, 1s, 2s...
});

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const route = req.path; 
    
    httpRequestDurationMicroseconds
      .labels(req.method, route, res.statusCode.toString())
      .observe(duration / 1000); // Converte ms para segundos
  });
  next();
});

app.use(express.json({ limit: "1000mb" }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.get("/", async (req, res) => {
  res.status(200).json({ message: "API is running" });
});

app.get("/debug-error", (req, res) => {
  res.status(500).json({ error: "Erro de teste para o grafana!" });
});

import errorHandler from "./middlewares/errorHandler.js";

app.use(routes);

app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", client.register.contentType);
    res.end(await client.register.metrics());
  } catch (ex) {
    res.status(500).end(ex);
  }
});

Sentry.setupExpressErrorHandler(app);

app.use(errorHandler);

export default app;
