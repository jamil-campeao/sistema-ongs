
import { postUser, deleteUserByID } from './users.controller.js';
import prisma from '../db/client.js';
import bcrypt from 'bcryptjs';

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('senha_hasheada_mock'),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Controlador de Usuários', () => {
  // --- Testes para postUser ---
  describe('POST /users', () => {
    it('deve criar um novo usuário e retornar status 201', async () => {
      const mockUserData = {
        name: "Usuário de Teste",
        email: "usuario@teste.com",
        password: "senha_segura",
        location: "Cidade Teste",
        role: "VOLUNTARY",
      };
      const { password, ...userSemSenha } = mockUserData;
      prisma.users.findUnique.mockResolvedValue(null); // E-mail não existe
      prisma.users.create.mockResolvedValue(userSemSenha);

      const mockReq = { body: mockUserData };
      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await postUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(userSemSenha);
    });

    it('deve retornar erro 400 se o e-mail já estiver cadastrado', async () => {
      prisma.users.findUnique.mockResolvedValue({ id: 1, email: "existente@teste.com" });

      const mockReq = { body: { name:'Usuário de Teste', email: "existente@teste.com", password: "senha_hasheada_mock", location: "Cidade Teste", role: "VOLUNTARY" } };
      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await postUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "E-mail já cadastrado" });
    });
  });

  // --- Testes para deleteUserByID ---
  describe('DELETE /users/:id', () => {
    it('deve deletar um usuário e retornar status 204', async () => {
      // Simula que o usuário a ser deletado existe
      prisma.users.findUnique.mockResolvedValue({ id: 1, name: "Usuário a ser deletado" });
      // Simula que a deleção ocorreu com sucesso
      prisma.users.delete.mockResolvedValue({});

      const mockReq = { params: { id: '1' } };
      const mockRes = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn(),
      };

      await deleteUserByID(mockReq, mockRes);

      expect(prisma.users.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });
  });
});