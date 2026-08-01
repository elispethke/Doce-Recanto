import { test, expect } from "@playwright/test";
import { createAuthUser, makeAdmin } from "./fixtures/firebase-admin";

function uniqueEmail(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
}

test.describe("Login do admin", () => {
  test("mostra erros de validação para campos vazios", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page.getByText("Informe seu e-mail")).toBeVisible();
    await expect(page.getByText("Informe sua senha")).toBeVisible();
  });

  test("mostra 'E-mail ou senha incorretos' para credenciais que não existem", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByPlaceholder("voce@doceencanto.com").fill(uniqueEmail("inexistente"));
    await page.getByPlaceholder("••••••••").fill("senha-errada");
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page.getByText("E-mail ou senha incorretos.")).toBeVisible();
  });

  test("nega acesso a conta válida sem documento em admins/{uid}", async ({ page }) => {
    const email = uniqueEmail("nao-admin");
    await createAuthUser(email, "senha-correta");

    await page.goto("/admin/login");
    await page.getByPlaceholder("voce@doceencanto.com").fill(email);
    await page.getByPlaceholder("••••••••").fill("senha-correta");
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(
      page.getByText("Acesso negado. Essa conta não está autorizada a acessar o painel.")
    ).toBeVisible({ timeout: 10_000 });
    await expect(page).toHaveURL(/\/admin\/login$/);
  });

  test("faz login com sucesso e redireciona para /admin/dashboard", async ({ page }) => {
    const email = uniqueEmail("admin");
    const user = await createAuthUser(email, "senha-correta");
    await makeAdmin(user.uid, email);

    await page.goto("/admin/login");
    await page.getByPlaceholder("voce@doceencanto.com").fill(email);
    await page.getByPlaceholder("••••••••").fill("senha-correta");
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page).toHaveURL(/\/admin\/dashboard$/, { timeout: 10_000 });
  });
});
