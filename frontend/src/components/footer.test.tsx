import { render, screen } from '@testing-library/react';
import Footer from './footer';

vi.mock('next/link', () => {
  return {
    default: ({ href, children }: { href: string; children: React.ReactNode }) => {
      return <a href={href}>{children}</a>;
    },
  };
});

describe('Componente Footer', () => {
  
  // Primeiro caso de teste: verificar a presença e os atributos dos links
  it('deve renderizar todos os links de navegação com os hrefs corretos', () => {
    // 1. Arrange (Organizar): Renderizamos o componente no DOM virtual.
    render(<Footer />);

    // 2. Act (Agir): Nenhuma ação é necessária, estamos apenas verificando a renderização inicial.

    // 3. Assert (Verificar): Procuramos pelos elementos na tela e checamos seus atributos.

    // Procura por um link com o texto "Sobre" (ignorando maiúsculas/minúsculas)
    const sobreLink = screen.getByRole('link', { name: /sobre/i });
    expect(sobreLink).toBeInTheDocument(); // Garante que o link está na tela
    expect(sobreLink).toHaveAttribute('href', '/about'); // Garante que o atributo href está correto

    // Repete o processo para os outros links
    const politicaLink = screen.getByRole('link', { name: /política de privacidade/i });
    expect(politicaLink).toBeInTheDocument();
    expect(politicaLink).toHaveAttribute('href', '/privacy-policy');
    
    const termosLink = screen.getByRole('link', { name: /termos de uso/i });
    expect(termosLink).toBeInTheDocument();
    expect(termosLink).toHaveAttribute('href', '/terms-of-use');

    const contatoLink = screen.getByRole('link', { name: /contato/i });
    expect(contatoLink).toBeInTheDocument();
    expect(contatoLink).toHaveAttribute('href', '/contact');
  });
});