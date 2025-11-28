import { z } from 'zod';

export const createOngSchema = z.object({
  nameONG: z.string().min(1, "Nome da ONG é obrigatório"),
  socialName: z.string().optional(),
  cnpj: z.string().min(14, "CNPJ inválido").max(18, "CNPJ inválido"),
  foundationDate: z.string().or(z.date()),
  area: z.string().min(1, "Área de atuação é obrigatória"),
  goals: z.string().min(1, "Objetivos são obrigatórios"),
  cep: z.string().min(8, "CEP inválido"),
  street: z.string().min(1, "Rua é obrigatória"),
  number: z.string().optional(),
  complement: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  cellphone: z.string().optional(),
  emailONG: z.string().email("Email inválido"),
  socialMedia: z.string().optional(),
  nameLegalGuardian: z.string().min(1, "Nome do responsável é obrigatório"),
  cpfLegalGuardian: z.string().optional(),
  rgLegalGuardian: z.string().optional(),
  cellphoneLegalGuardian: z.string().optional(),
  description: z.string().optional(),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export const updateOngSchema = createOngSchema.partial().omit({ password: true, emailONG: true, cnpj: true });
