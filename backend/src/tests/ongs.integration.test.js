import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import prisma from "../db/client.js";

// Dizemos ao Vitest para substituir o ficheiro de autenticação por este mock.
vi.mock("../services/authentication.js", () => ({
  authenticateUserOrOng: (req, res, next) => {
    next();
  },
}));

// Mock do Prisma (continua igual)
vi.mock("../db/client.js", () => ({
  default: {
    ongs: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

// Mock do bcrypt (continua igual)
vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("senha_mockada"),
  },
}));

describe("Testes de Integração para as Rotas de ONGs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/v1/ongs", () => {
    it("deve retornar uma lista de ONGs e status 200", async () => {
      // Arrange
      const mockOngs = [
        { id: 1, nameONG: "ONG Teste 1", cnpj: "11.111.111/0001-11" },
        { id: 2, nameONG: "ONG Teste 2", cnpj: "22.222.222/0001-22" },
      ];
      prisma.ongs.findMany.mockResolvedValue(mockOngs);

      // Act
      const response = await request(app).get("/api/v1/ongs");

      // Assert
      expect(response.status).toBe(200); // Agora deve ser 200!
      expect(response.body).toEqual(mockOngs);
    });
  });

  describe("POST /api/v1/ongs", () => {
    it("deve criar uma nova ONG e retornar status 201", async () => {
      const newOngData = {
        nameONG: "Nova ONG",
        socialName: "Nova ONG Social",
        cnpj: "33.333.333/0001-33",
        foundationDate: "2024-01-01",
        area: "Social",
        goals: "Ajudar",
        cep: "12345-678",
        street: "Rua Nova",
        emailONG: "nova@ong.com",
        nameLegalGuardian: "Responsável Novo",
        password: "senha_valida",
      };
      const createdOng = { id: 3, ...newOngData };
      delete createdOng.password;

      prisma.ongs.findUnique.mockResolvedValue(null);
      prisma.ongs.create.mockResolvedValue(createdOng);

      const response = await request(app).post("/api/v1/ongs").send(newOngData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({ nameONG: "Nova ONG" })
      );
    });

    it("deve retornar erro 400 se o CNPJ já existir", async () => {
      const existingOngData = {
        nameONG: "Existente",
        cnpj: "44.444.444/0001-44",
        password: "123",
      };
      prisma.ongs.findUnique.mockResolvedValue({ id: 4, ...existingOngData });

      const response = await request(app)
        .post("/api/v1/ongs")
        .send(existingOngData);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "Já existe uma ONG com este CNPJ",
      });
    });
  });
});
