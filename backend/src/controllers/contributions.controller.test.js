// src/controllers/contributions.controller.test.js
import { postContributionUser, deleteContributionByID } from './contributions.controller.js';
import prisma from '../db/client.js';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Controlador de Contribuições', () => {
  // --- Testes para postContributionUser ---
  describe('POST /contributions', () => {
    it('deve criar uma nova contribuição e retornar status 201', async () => {
      const mockContributionData = {
        name: "Ação Voluntária",
        date: "2024-10-26",
        type: "VOLUNTEERING",
        description: "Limpeza de praia",
        hours: "4",
        location: "Praia Central",
        ongName: "ONG Mar Limpo",
      };

      // Simula o usuário logado que vem do middleware de autenticação
      const mockUser = { id: '10' };
      const mockReq = {
        body: mockContributionData,
        user: mockUser,
      };
      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const expectedData = { ...mockContributionData, id: 1, userId: 10 };
      prisma.contribution.create.mockResolvedValue(expectedData);

      await postContributionUser(mockReq, mockRes);

      expect(prisma.contribution.create).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(expectedData);
    });
  });

  // --- Testes para deleteContributionByID ---
  describe('DELETE /contributions/:id', () => {
    it('deve deletar uma contribuição e retornar status 200 com mensagem', async () => {
      // Simula que a contribuição existe
      prisma.contribution.findUnique.mockResolvedValue({ id: 1 });
      prisma.contribution.delete.mockResolvedValue({});

      const mockReq = { params: { id: '1' } };
      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await deleteContributionByID(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Contribuição deletada com sucesso" });
    });

    it('deve retornar erro 404 se a contribuição não for encontrada', async () => {
      // Simula que a contribuição não existe
      prisma.contribution.findUnique.mockResolvedValue(null);

      const mockReq = { params: { id: '99' } };
      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await deleteContributionByID(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Contribuição não encontrada" });
    });
  });
});