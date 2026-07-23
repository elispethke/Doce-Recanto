import { z } from "zod";

const baseFields = {
  name: z.string().trim().min(2, "Informe o nome do motorista"),
  phone: z.string().trim().min(8, "Informe um telefone válido"),
  photoUrl: z.string().trim().url("Informe uma URL de imagem válida").optional().or(z.literal("")),
  status: z.enum(["disponivel", "ocupado", "offline", "desligado"]),
};

export const driverEditSchema = z.object(baseFields);
export type DriverEditSchema = z.infer<typeof driverEditSchema>;

// Criação exige e-mail/senha: viram a conta de autenticação do motorista,
// usada futuramente para logar no app do motorista.
export const driverCreateSchema = z.object({
  ...baseFields,
  email: z.string().trim().email("Informe um e-mail válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});
export type DriverCreateSchema = z.infer<typeof driverCreateSchema>;
