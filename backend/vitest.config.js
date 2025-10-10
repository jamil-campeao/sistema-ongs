// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Isso disponibiliza as APIs globais (describe, it, etc.) sem precisar importar
    globals: true,
    // Define o ambiente de teste como 'node', que é ideal para backend
    environment: 'node',
    setupFiles: ['./setup-tests.js'],
  },
});