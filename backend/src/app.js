import express from "express";
import routes from "./routes/index.routes.js";
import cors from "cors";
const app = express();
import "./instrument.js";
import * as Sentry from "@sentry/node"
import client from 'prom-client';

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

app.use(express.json({ limit: "1000mb" }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(routes);

app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  } catch (ex) {
    res.status(500).end(ex);
  }
});

Sentry.setupExpressErrorHandler(app);

export default app;
