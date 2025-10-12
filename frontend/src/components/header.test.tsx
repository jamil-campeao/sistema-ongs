// frontend/src/components/header.test.tsx

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "./header";
import { useUser } from "@/context/userContext";
import { useOng } from "@/context/ongContext";
import { useRouter, usePathname } from "next/navigation";

// --- Mocks (sem alterações) ---
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
}));

vi.mock("@/context/userContext", () => ({
  useUser: vi.fn(),
}));

vi.mock("@/context/ongContext", () => ({
  useOng: vi.fn(),
}));

vi.mock("next/link", () => {
  return {
    default: ({
      href,
      children,
    }: {
      href: string;
      children: React.ReactNode;
    }) => {
      return <a href={href}>{children}</a>;
    },
  };
});

describe("Componente Header", () => {
  let mockRouterPush: vi.Mock;
  let mockUsePathname: vi.Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRouterPush = vi.fn();
    mockUsePathname = vi.fn().mockReturnValue("/feed");
    (useRouter as vi.Mock).mockReturnValue({ push: mockRouterPush });
    (usePathname as vi.Mock).mockImplementation(mockUsePathname);
  });

  it("deve renderizar os links de navegação principais", () => {
    (useUser as vi.Mock).mockReturnValue({ user: null });
    (useOng as vi.Mock).mockReturnValue({ ong: null });
    render(<Header />);
    expect(screen.getByRole("link", { name: /início/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /ong's/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /projetos/i })).toBeInTheDocument();
  });

  it("deve mostrar o perfil do usuário quando um usuário está logado", () => {
    const mockUser = {
      id: 1,
      name: "João Silva",
      role: "VOLUNTARY",
      profileImage: "user.jpg",
    };
    (useUser as vi.Mock).mockReturnValue({ user: mockUser });
    (useOng as vi.Mock).mockReturnValue({ ong: null });
    render(<Header />);

    // *** CORREÇÃO AQUI ***
    // Tornamos a query mais específica para encontrar o link principal do perfil.
    const profileLink = screen.getByRole("link", { name: /Perfil ▼/i });
    expect(profileLink).toBeInTheDocument();
    expect(profileLink).toHaveAttribute("href", "/profile/user");

    // A busca pela imagem pode continuar a mesma, pois é única.
    const profileImage = screen.getByAltText("User");
    expect(profileImage).toHaveAttribute("src", "user.jpg");

    expect(
      screen.queryByText(/painel de colaboradores/i)
    ).not.toBeInTheDocument();
  });

  it("deve mostrar o perfil da ONG e links adicionais quando uma ONG está logada", () => {
    const mockOng = {
      id: 2,
      nameONG: "Super ONG",
      role: "ONG",
      profileImage: "ong.png",
    };
    (useUser as vi.Mock).mockReturnValue({ user: null });
    (useOng as vi.Mock).mockReturnValue({ ong: mockOng });
    render(<Header />);

    // *** CORREÇÃO AQUI ***
    // Usamos a mesma query específica aqui também.
    const profileLink = screen.getByRole("link", { name: /Perfil ▼/i });
    expect(profileLink).toHaveAttribute("href", "/profile/ong");

    const profileImage = screen.getByAltText("User");
    expect(profileImage).toHaveAttribute("src", "ong.png");

    const painelColaboradoresLink = screen.getByRole("link", {
      name: /painel de colaboradores/i,
    });
    expect(painelColaboradoresLink).toBeInTheDocument();
    expect(painelColaboradoresLink).toHaveAttribute(
      "href",
      "/manage-collaborators"
    );

    const painelProjetosLink = screen.getByRole("link", {
      name: /painel de projetos da ong/i,
    });
    expect(painelProjetosLink).toBeInTheDocument();
    expect(painelProjetosLink).toHaveAttribute("href", "/manage-projects/ong");
  });

  it("deve redirecionar para a página de busca ao pressionar Enter no campo de busca", async () => {
    (useUser as vi.Mock).mockReturnValue({ user: null });
    (useOng as vi.Mock).mockReturnValue({ ong: null });
    render(<Header />);
    const searchInput = screen.getByPlaceholderText(/buscar ong's e projetos/i);
    await userEvent.type(searchInput, "ajuda comunitária");
    expect(searchInput).toHaveValue("ajuda comunitária");
    await userEvent.keyboard("{enter}");
    expect(mockRouterPush).toHaveBeenCalledWith(
      "/search?q=ajuda%20comunit%C3%A1ria"
    );
    expect(searchInput).toHaveValue("");
  });
});
