// src/controllers/ongs.controller.test.js
import { getOngByID, postOng } from './ongs.controller.js';
import prisma from '../db/client.js';
import bcrypt from 'bcryptjs';

// Mockando o bcrypt para não precisar gerar hashes reais nos testes
vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('senha_hasheada_mock'),
  },
}));

// Limpa os mocks antes de cada teste para garantir que um teste não interfira no outro
beforeEach(() => {
  vi.clearAllMocks();
});

describe('Controlador de ONGs', () => {

  // --- Testes para postOng ---
  describe('POST /ongs', () => {
    it('deve criar uma nova ONG e retornar status 201', async () => {
      // 1. Arrange (Organizar)
      const mockOngData = {
        nameONG: "ONG de Teste",
        socialName: "Razão Social Teste",
        cnpj: "00.000.000/0001-00",
        foundationDate: "2023-01-01",
        area: "Meio Ambiente",
        goals: "Plantar árvores",
        cep: "12345-678",
        street: "Rua dos Testes",
        emailONG: "contato@ongteste.com",
        nameLegalGuardian: "Responsável Teste",
        password: "senha_forte_123"
      };

      const mockReq = { body: mockOngData };
      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      // Simula que o CNPJ ainda não existe
      prisma.ongs.findUnique.mockResolvedValue(null);
      // Simula a criação da ONG, retornando o dado mockado sem a senha
      const { password, ...ongSemSenha } = mockOngData;
      prisma.ongs.create.mockResolvedValue(ongSemSenha);

      // 2. Act (Agir)
      await postOng(mockReq, mockRes);

      // 3. Assert (Verificar)
      expect(prisma.ongs.create).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(ongSemSenha);
    });

    it('deve retornar erro 400 se um CNPJ já existir', async () => {
      const mockReq = { body: { cnpj: "00.000.000/0001-00" } };
      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };
      prisma.ongs.findUnique.mockResolvedValue({ id: 1, cnpj: "00.000.000/0001-00" });

      await postOng(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Já existe uma ONG com este CNPJ" });
    });
  });

  // --- Testes para getOngByID ---
  describe('GET /ongs/:id', () => {
    it('deve retornar uma ONG e status 200 se o ID for encontrado', async () => {
      const mockOng = { id: 1, nameONG: 'ONG Encontrada' };
      prisma.ongs.findUnique.mockResolvedValue(mockOng);

      const mockReq = { params: { id: '1' } };
      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await getOngByID(mockReq, mockRes);

      expect(prisma.ongs.findUnique).toHaveBeenCalledWith({ where: { id: 1 }, select: expect.any(Object) });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockOng);
    });
  });
});