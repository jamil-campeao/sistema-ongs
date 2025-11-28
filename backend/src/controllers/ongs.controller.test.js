// src/controllers/ongs.controller.test.js
import { getOngByID, postOng } from './ongs.controller.js';
import * as ongService from '../services/ongs.service.js';

// Mockando o serviço
vi.mock('../services/ongs.service.js');

// Limpa os mocks antes de cada teste
beforeEach(() => {
  vi.clearAllMocks();
});

describe('Controlador de ONGs', () => {

  // --- Testes para postOng ---
  describe('POST /ongs', () => {
    it('deve criar uma nova ONG e retornar status 201', async () => {
      // 1. Arrange
      const mockOngData = {
        nameONG: "ONG de Teste",
        cnpj: "00.000.000/0001-00",
        password: "senha_forte_123",
        foundationDate: "2023-01-01",
        area: "Meio Ambiente",
        goals: "Salvar o planeta",
        cep: "12345-678",
        street: "Rua das Flores",
        emailONG: "contato@ongteste.com",
        nameLegalGuardian: "João Silva"
      };

      const mockReq = { body: mockOngData };
      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };
      const mockNext = vi.fn();

      // Simula que o CNPJ não existe
      ongService.getOngByCnpj.mockResolvedValue(null);
      // Simula a criação
      ongService.createOng.mockResolvedValue({ ...mockOngData, id: 1 });

      // 2. Act
      await postOng(mockReq, mockRes, mockNext);

      // 3. Assert
      expect(ongService.createOng).toHaveBeenCalledWith(mockOngData);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ nameONG: "ONG de Teste" }));
    });

    it('deve retornar erro 400 se um CNPJ já existir', async () => {
      const mockReq = { 
        body: { 
          cnpj: "00.000.000/0001-00",
          nameONG: "ONG Duplicada",
          password: "senha_forte_123",
          foundationDate: "2023-01-01",
          area: "Meio Ambiente",
          goals: "Salvar o planeta",
          cep: "12345-678",
          street: "Rua das Flores",
          emailONG: "duplicada@ongteste.com",
          nameLegalGuardian: "Maria Silva"
        } 
      };
      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };
      const mockNext = vi.fn();

      // Simula que o CNPJ JÁ existe
      ongService.getOngByCnpj.mockResolvedValue({ id: 1, cnpj: "00.000.000/0001-00" });

      await postOng(mockReq, mockRes, mockNext);

      // O controller deve chamar next(error)
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
      const errorArg = mockNext.mock.calls[0][0];
      expect(errorArg.message).toBe("ONG já cadastrada");
      expect(errorArg.statusCode).toBe(400);
    });
  });

  // --- Testes para getOngByID ---
  describe('GET /ongs/:id', () => {
    it('deve retornar uma ONG e status 200 se o ID for encontrado', async () => {
      const mockOng = { id: 1, nameONG: 'ONG Encontrada' };
      ongService.getOngById.mockResolvedValue(mockOng);

      const mockReq = { params: { id: '1' } };
      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };
      const mockNext = vi.fn();

      await getOngByID(mockReq, mockRes, mockNext);

      expect(ongService.getOngById).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockOng);
    });
  });
});