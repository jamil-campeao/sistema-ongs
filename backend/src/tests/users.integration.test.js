import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import prisma from "../db/client.js";

vi.mock("../services/authentication.js", () => ({
  authenticateUserOrOng: (req, res, next) => {
    req.user = { id: 1, tipo: "ADMIN" };
    next();
  },
}));

// Mock do Prisma para isolar os testes do banco de dados real
vi.mock("../db/client.js", () => ({
  default: {
    users: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

// Mock do bcrypt para a criação de utilizadores
vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("senha_hasheada_mock"),
  },
}));

describe("Testes de Integração para as Rotas de Utilizadores", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Limpa os mocks antes de cada teste
  });

  // --- Testando a Rota GET /api/v1/users ---
  describe("GET /api/v1/users", () => {
    it("deve retornar uma lista de utilizadores e status 200", async () => {
      // Arrange
      const mockUsers = [
        { id: 1, name: "Utilizador Teste 1", email: "user1@test.com" },
        { id: 2, name: "Utilizador Teste 2", email: "user2@test.com" },
      ];
      prisma.users.findMany.mockResolvedValue(mockUsers);

      // Act
      const response = await request(app).get("/api/v1/users");

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
      expect(prisma.users.findMany).toHaveBeenCalledTimes(1);
    });
  });

  // --- Testando a Rota POST /api/v1/users ---
  describe("POST /api/v1/users", () => {
    it("deve criar um novo utilizador e retornar status 201", async () => {
      // Arrange
      const newUserData = {
        name: "Novo Utilizador",
        email: "novo@user.com",
        password: "senha_valida_123",
        location: "Cidade Nova",
        role: "VOLUNTARY",
      };

      // A resposta do controlador não inclui a senha
      const { password, ...createdUserResponse } = newUserData;
      const createdUser = { id: 3, ...createdUserResponse };

      // Simula que o e-mail ainda não existe
      prisma.users.findUnique.mockResolvedValue(null);
      prisma.users.create.mockResolvedValue(createdUser);

      // Act
      const response = await request(app)
        .post("/api/v1/users")
        .send(newUserData);

      // Assert
      expect(response.status).toBe(201);
      // `expect.objectContaining` é útil porque a sua resposta pode ter mais campos (como id, createdAt)
      expect(response.body).toEqual(
        expect.objectContaining({
          name: "Novo Utilizador",
          email: "novo@user.com",
        })
      );
    });

    it("deve retornar erro 400 se um e-mail já estiver registado", async () => {
      // Arrange
      const existingUserData = {
        name: "Existente",
        email: "existente@user.com",
        password: "123",
        location: "Cidade",
        role: "VOLUNTARY",
      };
      // Simula que o Prisma encontrou um utilizador com o mesmo e-mail
      prisma.users.findUnique.mockResolvedValue({ id: 4, ...existingUserData });

      // Act
      const response = await request(app)
        .post("/api/v1/users")
        .send(existingUserData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "E-mail já cadastrado" });
    });
  });

  // --- Testando a Rota DELETE /api/v1/users/:id ---
  describe("DELETE /api/v1/users/:id", () => {
    it("deve apagar um utilizador e retornar status 204", async () => {
      // Arrange
      const userId = 1;
      // Simula que o utilizador a ser apagado existe
      prisma.users.findUnique.mockResolvedValue({
        id: userId,
        name: "Utilizador a Apagar",
      });
      // Simula o sucesso da operação de apagar
      prisma.users.delete.mockResolvedValue({ id: userId });

      // Act
      const response = await request(app).delete(`/api/v1/users/${userId}`);

      // Assert
      expect(response.status).toBe(204); // 204 No Content é a resposta correta para um DELETE bem-sucedido
      expect(prisma.users.delete).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    it("deve retornar erro 404 se o utilizador a ser apagado não for encontrado", async () => {
      // Arrange
      const userId = 999;
      // Simula que o utilizador não foi encontrado
      prisma.users.findUnique.mockResolvedValue(null);

      // Act
      const response = await request(app).delete(`/api/v1/users/${userId}`);

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Usuário não encontrado" });
    });
  });
});
