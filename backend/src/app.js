import express from 'express';
import routes from './routes/index.routes.js';
import cors from "cors";
import prisma from './db/client.js';

function validateDatabaseConnection() {
    try {
        prisma.$connect();
        console.log('Conexão com o banco realizada com sucesso');
    } catch (error) {
        console.error('Erro de conexão com o banco:', error);
        process.exit(1);
    }
}

validateDatabaseConnection();

const app = express();
app.use(express.json({ limit: "1000mb" }));
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
}));
app.use(routes);


export default app;