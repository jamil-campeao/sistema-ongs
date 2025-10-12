import { vi } from 'vitest';

vi.mock('./src/db/client.js', () => {
  const prisma = {
    ongs: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(), 
    },
    users: {
      findUnique: vi.fn(),
      create: vi.fn(),   
      delete: vi.fn(),   
    },
    contribution: {
      create: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
  };
  return { default: prisma };
});