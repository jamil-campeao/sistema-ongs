import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import prisma from "../db/client.js";

vi.mock("../services/authentication.js", () => ({
  authenticateUserOrOng: (req, res, next) => {
    // Para os testes, vamos simular que um utilizador/ONG válido está logado
    req.user = { id: 1, tipo: "ONG" }; // Simula uma ONG logada
    next();
  },
}));

// Mock do Prisma para isolar o teste do banco de dados
vi.mock("../db/client.js", () => ({
  default: {
    projects: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe("Testes de Integração para as Rotas de Projetos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Testando a Rota GET /api/v1/projects ---
  describe("GET /api/v1/projects", () => {
    it("deve retornar uma lista de projetos e status 200", async () => {
      // Arrange
      const mockProjects = [
        { id: 1, name: "Projeto Limpeza de Praia", ongId: 1 },
        { id: 2, name: "Projeto Agasalho", ongId: 1 },
      ];
      prisma.projects.findMany.mockResolvedValue(mockProjects);

      // Act
      const response = await request(app).get("/api/v1/projects");

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProjects);
      expect(prisma.projects.findMany).toHaveBeenCalledTimes(1);
    });
  });

  // --- Testando a Rota POST /api/v1/projects ---
  describe("POST /api/v1/projects", () => {
    it("deve criar um novo projeto e retornar status 201", async () => {
      // Arrange
      const newProjectData = {
        name: "Projeto Horta Comunitária",
        description: "Cultivo de vegetais para a comunidade.",
        ongId: 1,
      };

      const createdProject = { id: 3, ...newProjectData };

      // Simula que não existe um projeto com o mesmo nome para a mesma ONG
      prisma.projects.findFirst.mockResolvedValue(null);
      prisma.projects.create.mockResolvedValue(createdProject);

      // Act
      const response = await request(app)
        .post("/api/v1/projects")
        .send(newProjectData);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          name: "Projeto Horta Comunitária",
        })
      );
    });

    it("deve retornar erro 400 se os campos obrigatórios não forem fornecidos", async () => {
      // Act
      const response = await request(app)
        .post("/api/v1/projects")
        .send({ name: "Projeto Incompleto" }); // Faltando description e ongId

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "Os campos nome, descrição e OngId são obrigatórios",
      });
    });
  });

  // --- Testando a Rota DELETE /api/v1/projects/:id ---
  describe("DELETE /api/v1/projects/:id", () => {
    it("deve apagar um projeto e retornar status 200", async () => {
      // Arrange
      const projectId = 1;
      // Simula que o projeto a ser apagado existe
      prisma.projects.findUnique.mockResolvedValue({
        id: projectId,
        name: "Projeto a ser apagado",
      });
      // Simula o sucesso da operação de apagar
      prisma.projects.delete.mockResolvedValue({ id: projectId });

      // Act
      const response = await request(app).delete(
        `/api/v1/projects/${projectId}`
      );

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: "Projeto deletado com sucesso",
      });
      expect(prisma.projects.delete).toHaveBeenCalledWith({
        where: { id: projectId },
      });
    });

    it("deve retornar erro 404 se o projeto não for encontrado", async () => {
      // Arrange
      const projectId = 999; // Um ID que não existe
      // Simula que o projeto não foi encontrado
      prisma.projects.findUnique.mockResolvedValue(null);

      // Act
      const response = await request(app).delete(
        `/api/v1/projects/${projectId}`
      );

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Projeto não encontrado" });
    });
  });
});
