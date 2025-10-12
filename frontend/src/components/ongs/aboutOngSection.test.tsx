import { render, screen, waitFor } from '@testing-library/react';
import AboutSection from './aboutOngSection';

// Mock global da API fetch para podermos controlar suas respostas nos testes
global.fetch = vi.fn();

describe('Componente AboutOngSection', () => {

  // Limpa o mock do fetch antes de cada teste para garantir que os testes sejam isolados
  beforeEach(() => {
    (fetch as vi.Mock).mockClear();
  });

  it('deve exibir a mensagem de "carregando" enquanto busca os dados', () => {
    // 1. Arrange
    render(<AboutSection id={123} />);

    // 2. Assert
    // Verificamos se o texto de carregamento está na tela imediatamente após a renderização
    expect(screen.getByText(/carregando informações.../i)).toBeInTheDocument();
  });

  it('deve exibir as informações da ONG após a busca de dados ser bem-sucedida', async () => {
    // 1. Arrange
    const mockOng = {
      id: 123,
      description: 'Esta é a descrição detalhada da nossa ONG.',
      goals: 'Nosso principal objetivo é ajudar a comunidade local.',
    };

    // Configuramos o mock do fetch para simular uma resposta bem-sucedida da API
    (fetch as vi.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockOng),
    });

    // 2. Act
    render(<AboutSection id={123} />);

    // 3. Assert
    // `findByText` é assíncrono. Ele espera até que o elemento apareça na tela.
    // Usamos isso porque o componente precisa primeiro buscar os dados e depois re-renderizar.
    expect(await screen.findByText('Sobre a ONG')).toBeInTheDocument();

    // Após o carregamento, verificamos se os dados corretos são exibidos
    expect(screen.getByText(mockOng.description)).toBeInTheDocument();
    expect(screen.getByText(mockOng.goals)).toBeInTheDocument();

    // Também é uma boa prática garantir que a mensagem de "carregando" desapareceu
    expect(screen.queryByText(/carregando informações.../i)).not.toBeInTheDocument();
  });

  it('deve continuar exibindo a mensagem de "carregando" se a busca de dados falhar', async () => {
    // 1. Arrange
    // Simulamos uma resposta de erro da API
    (fetch as vi.Mock).mockRejectedValue(new Error('Falha na API'));

    // 2. Act
    render(<AboutSection id={404} />);

    // 3. Assert
    // Usamos `waitFor` para garantir que o componente teve tempo de processar o erro do fetch.
    // Depois, verificamos se a mensagem de "carregando" ainda está na tela,
    // que é o comportamento atual do seu componente em caso de falha.
    await waitFor(() => {
      expect(screen.getByText(/carregando informações.../i)).toBeInTheDocument();
    });

    // Verificamos também que os títulos da seção de sucesso NÃO foram renderizados
    expect(screen.queryByText('Sobre a ONG')).not.toBeInTheDocument();
  });
});