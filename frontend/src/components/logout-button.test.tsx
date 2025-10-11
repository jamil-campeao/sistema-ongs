import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LogoutButton from './logout-button'; 
import { useUser } from "@/context/userContext"; 
import { useOng } from "@/context/ongContext"; 
import { useRouter } from "next/navigation";  

// 1. Mockando as dependências externas (Hooks e APIs)
// --------------------------------------------------------------------

// Mock do Next.js Router
// Dizemos ao Vitest: "quando o código pedir por 'next/navigation', entregue este objeto em vez do real."
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(), // `vi.fn()` cria uma função espiã que podemos verificar se foi chamada
}));

// Mock do Contexto de Usuário
vi.mock('@/context/userContext', () => ({
  useUser: vi.fn(),
}));

// Mock do Contexto de ONG
vi.mock('@/context/ongContext', () => ({
  useOng: vi.fn(),
}));

// Mock global da API fetch para controlar as respostas da rede
global.fetch = vi.fn();

// --------------------------------------------------------------------


describe('Componente LogoutButton', () => {

  // Limpa todos os mocks antes de cada teste para evitar que um teste interfira no outro
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve chamar a função de logout do usuário e redirecionar quando um usuário está logado', async () => {
    // 1. Arrange (Organizar o cenário do teste)
    // ----------------------------------------------------------------
    const mockLogoutUser = vi.fn();
    const mockRouterPush = vi.fn();

    // Configura o retorno dos hooks mockados para este teste específico
    // Simulamos que o hook `useUser` retorna um usuário logado e a função de logout
    (useUser as vi.Mock).mockReturnValue({
      user: { id: 123, name: 'Usuário Teste' }, // Simula um usuário logado
      logout: mockLogoutUser,
    });
    
    // Simulamos que o hook `useOng` não retorna nenhuma ONG logada
    (useOng as vi.Mock).mockReturnValue({
      ong: null,
      logoutOng: vi.fn(),
    });

    // Simulamos o retorno do `useRouter`
    (useRouter as vi.Mock).mockReturnValue({
      push: mockRouterPush,
    });
    
    // Simulamos uma resposta bem-sucedida da API de logout
    (fetch as vi.Mock).mockResolvedValue({
      ok: true,
    });
    
    // Renderiza o componente
    render(<LogoutButton />);
    
    // Encontra o botão na tela
    const button = screen.getByRole('button', { name: /logout/i });

    // 2. Act (Agir - simular a interação do usuário)
    // ----------------------------------------------------------------
    // `userEvent.click` é a melhor forma de simular um clique real
    await userEvent.click(button);

    // 3. Assert (Verificar se o resultado foi o esperado)
    // ----------------------------------------------------------------
    expect(mockLogoutUser).toHaveBeenCalledTimes(1); // A função `logout()` do usuário foi chamada?
    expect(useOng().logoutOng).not.toHaveBeenCalled(); // A função `logoutOng()` NÃO foi chamada?
    
    // A API de logout foi chamada corretamente?
    expect(fetch).toHaveBeenCalledWith('/api/logout', { method: 'POST' });
    
    // O usuário foi redirecionado para a página de login?
    expect(mockRouterPush).toHaveBeenCalledWith('/login');
  });

  it('deve chamar a função de logout da ONG quando uma ONG está logada', async () => {
    // Arrange
    const mockLogoutOng = vi.fn();
    const mockRouterPush = vi.fn();

    (useUser as vi.Mock).mockReturnValue({ user: null, logout: vi.fn() });
    (useOng as vi.Mock).mockReturnValue({ ong: { id: 456, nameONG: 'ONG Teste' }, logoutOng: mockLogoutOng });
    (useRouter as vi.Mock).mockReturnValue({ push: mockRouterPush });
    (fetch as vi.Mock).mockResolvedValue({ ok: true });

    render(<LogoutButton />);
    const button = screen.getByRole('button', { name: /logout/i });

    // Act
    await userEvent.click(button);

    // Assert
    expect(useUser().logout).not.toHaveBeenCalled();
    expect(mockLogoutOng).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('/api/logout', { method: 'POST' });
    expect(mockRouterPush).toHaveBeenCalledWith('/login');
  });

  it('NÃO deve redirecionar se a chamada da API de logout falhar', async () => {
    // Arrange
    const mockLogoutUser = vi.fn();
    const mockRouterPush = vi.fn();

    (useUser as vi.Mock).mockReturnValue({ user: { id: 123 }, logout: mockLogoutUser });
    (useOng as vi.Mock).mockReturnValue({ ong: null, logoutOng: vi.fn() });
    (useRouter as vi.Mock).mockReturnValue({ push: mockRouterPush });

    // Simulamos uma resposta com falha da API
    (fetch as vi.Mock).mockResolvedValue({
      ok: false,
    });

    render(<LogoutButton />);
    const button = screen.getByRole('button', { name: /logout/i });

    // Act
    await userEvent.click(button);

    // Assert
    expect(mockLogoutUser).toHaveBeenCalledTimes(1); // A limpeza do contexto ainda deve acontecer
    expect(fetch).toHaveBeenCalledWith('/api/logout', { method: 'POST' });
    expect(mockRouterPush).not.toHaveBeenCalled(); // O redirecionamento NÃO deve acontecer
  });
});