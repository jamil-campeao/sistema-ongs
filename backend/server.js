import app from "./app.js";
import prisma from "./db/client.js";

const PORT = process.env.PORT || 3000;

async function validateDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log("Conexão com o banco realizada com sucesso");
  } catch (error) {
    console.error("Erro de conexão com o banco:", error);
    process.exit(1);
  }
}

app.listen(PORT, async () => {
  await validateDatabaseConnection();
  console.log(`Servidor rodando na porta ${PORT}`);
});
