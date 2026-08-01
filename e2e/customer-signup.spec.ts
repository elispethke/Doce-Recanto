import { test, expect } from "@playwright/test";
import { createAuthUser } from "./fixtures/firebase-admin";

function uniqueEmail(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
}

async function fillSignupForm(
  page: import("@playwright/test").Page,
  data: { name: string; email: string; phone: string; password: string; confirmPassword: string }
) {
  await page.locator("#name").fill(data.name);
  await page.locator("#email").fill(data.email);
  await page.locator("#phone").fill(data.phone);
  await page.locator("#password").fill(data.password);
  await page.locator("#confirmPassword").fill(data.confirmPassword);
}

const validData = () => ({
  name: "Maria Silva",
  email: uniqueEmail("cadastro"),
  phone: "(11) 91234-5678",
  password: "senha123",
  confirmPassword: "senha123",
});

test.describe("Cadastro do cliente", () => {
  test("mostra erros de validação para todos os campos vazios", async ({ page }) => {
    await page.goto("/cadastro");
    await page.getByRole("button", { name: "Criar conta" }).click();

    await expect(page.getByText("Informe seu nome")).toBeVisible();
    await expect(page.getByText("Informe seu e-mail")).toBeVisible();
    await expect(page.getByText("Informe seu telefone")).toBeVisible();
    await expect(page.getByText("Informe uma senha")).toBeVisible();
    await expect(page.getByText("Confirme sua senha")).toBeVisible();
  });

  test("exige nome e sobrenome", async ({ page }) => {
    await page.goto("/cadastro");
    await fillSignupForm(page, { ...validData(), name: "Maria" });
    await page.getByRole("button", { name: "Criar conta" }).click();

    await expect(page.getByText("Informe nome e sobrenome")).toBeVisible();
  });

  test("rejeita e-mail em formato inválido", async ({ page }) => {
    await page.goto("/cadastro");
    await fillSignupForm(page, { ...validData(), email: "email-invalido" });
    await page.getByRole("button", { name: "Criar conta" }).click();

    await expect(page.getByText("Informe um e-mail válido")).toBeVisible();
  });

  test("rejeita telefone em formato inválido", async ({ page }) => {
    await page.goto("/cadastro");
    await fillSignupForm(page, { ...validData(), phone: "123" });
    await page.getByRole("button", { name: "Criar conta" }).click();

    await expect(page.getByText("Telefone inválido. Ex: (11) 91234-5678")).toBeVisible();
  });

  test("rejeita senha curta", async ({ page }) => {
    await page.goto("/cadastro");
    await fillSignupForm(page, { ...validData(), password: "123", confirmPassword: "123" });
    await page.getByRole("button", { name: "Criar conta" }).click();

    await expect(page.getByText("A senha deve ter pelo menos 6 caracteres")).toBeVisible();
  });

  test("rejeita senhas que não coincidem", async ({ page }) => {
    await page.goto("/cadastro");
    await fillSignupForm(page, { ...validData(), password: "senha123", confirmPassword: "outrasenha" });
    await page.getByRole("button", { name: "Criar conta" }).click();

    await expect(page.getByText("As senhas não coincidem")).toBeVisible();
  });

  test("cria conta com sucesso e redireciona para /conta", async ({ page }) => {
    await page.goto("/cadastro");
    await fillSignupForm(page, validData());
    await page.getByRole("button", { name: "Criar conta" }).click();

    await expect(page).toHaveURL(/\/conta$/, { timeout: 10_000 });
  });

  test("rejeita e-mail já cadastrado", async ({ page }) => {
    const email = uniqueEmail("duplicado");
    await createAuthUser(email, "senha123");

    await page.goto("/cadastro");
    await fillSignupForm(page, { ...validData(), email });
    await page.getByRole("button", { name: "Criar conta" }).click();

    await expect(page.getByText("Já existe uma conta com esse e-mail.")).toBeVisible();
  });
});
