import { describe, it, expect } from 'vitest';
import { validaCNPJ, validaCPF } from '../utils/validators';

describe('Validators', () => {
  describe('validaCNPJ', () => {
    it('should return true for valid CNPJ', () => {
      expect(validaCNPJ('00.000.000/0001-91')).toBe(true); // Banco do Brasil
    });

    it('should return false for invalid CNPJ', () => {
      expect(validaCNPJ('00.000.000/0000-00')).toBe(false);
      expect(validaCNPJ('11.111.111/1111-11')).toBe(false);
      expect(validaCNPJ('invalid')).toBe(false);
    });
  });

  describe('validaCPF', () => {
    it('should return true for valid CPF', () => {
      // Need a valid CPF generator or a known valid CPF for testing
      // Using a known valid CPF (generated)
      expect(validaCPF('52998224725')).toBe(true); 
    });

    it('should return false for invalid CPF', () => {
      expect(validaCPF('000.000.000-00')).toBe(false);
      expect(validaCPF('111.111.111-11')).toBe(false);
      expect(validaCPF('invalid')).toBe(false);
    });
  });
});
