import express from "express";
import routes from "./routes/index.routes.js";
import cors from "cors";
const app = express();
import "./instrument.js";
import * as Sentry from "@sentry/node"

app.use(express.json({ limit: "1000mb" }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(routes);
Sentry.setupExpressErrorHandler(app);

export default app;
