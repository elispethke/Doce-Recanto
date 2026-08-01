import { test, expect } from "@playwright/test";
import { createAuthUser } from "./fixtures/firebase-admin";

function uniqueEmail(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
}

test.describe("Login do cliente", () => {
  test("mostra erros de validação para campos vazios", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page.getByText("Informe seu e-mail")).toBeVisible();
    await expect(page.getByText("Informe sua senha")).toBeVisible();
  });

  test("mostra erro para e-mail em formato inválido", async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder("voce@email.com").fill("nao-e-um-email");
    await page.getByPlaceholder("••••••••").fill("123456");
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page.getByText("Informe um e-mail válido")).toBeVisible();
  });

  test("mostra erro para senha curta", async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder("voce@email.com").fill(uniqueEmail("teste"));
    await page.getByPlaceholder("••••••••").fill("123");
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page.getByText("A senha deve ter pelo menos 6 caracteres")).toBeVisible();
  });

  test("mostra 'E-mail ou senha incorretos' para credenciais que não existem", async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder("voce@email.com").fill(uniqueEmail("inexistente"));
    await page.getByPlaceholder("••••••••").fill("senha-errada");
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page.getByText("E-mail ou senha incorretos.")).toBeVisible();
  });

  test("mostra 'E-mail ou senha incorretos' para senha errada de conta existente", async ({ page }) => {
    const email = uniqueEmail("real");
    await createAuthUser(email, "senha-correta");

    await page.goto("/login");
    await page.getByPlaceholder("voce@email.com").fill(email);
    await page.getByPlaceholder("••••••••").fill("senha-totalmente-errada");
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page.getByText("E-mail ou senha incorretos.")).toBeVisible();
  });

  test("faz login com sucesso e redireciona para /conta", async ({ page }) => {
    const email = uniqueEmail("sucesso");
    await createAuthUser(email, "senha-correta");

    await page.goto("/login");
    await page.getByPlaceholder("voce@email.com").fill(email);
    await page.getByPlaceholder("••••••••").fill("senha-correta");
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page).toHaveURL(/\/conta$/, { timeout: 10_000 });
  });
});
