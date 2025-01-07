import { test, expect, Page } from "@playwright/test";

test("Basic counter", async ({ page }) => {
  const count = page.getByLabel("count");

  await page.goto("/");
  await page.getByRole("button", { name: "+" }).click();
  await expect(count).toHaveText("1");
  await page.getByRole("link", { name: "To do app" }).click();
  await page.getByRole("link", { name: "Basic counter" }).click();
  await expect(count).toHaveText("1");
  await page.getByRole("button", { name: "-" }).click();
  await expect(count).toHaveText("0");
});

test("Counter + context", async ({ page }) => {
  const count1 = page.getByLabel("count").first();
  const count2 = page.getByLabel("count").nth(1);

  await page.goto("/context");
  await expect(count1).toHaveText("0");
  await expect(count2).toHaveText("10");
  await page.getByRole("button", { name: "+" }).first().click();
  await expect(count1).toHaveText("1");
  await page.getByRole("button", { name: "Reset" }).first().click();
  await expect(count1).toHaveText("0");
});

test("Counter + persistent state", async ({ page }) => {
  const count = page.getByLabel("count");

  await page.goto("/persistent");
  await page.getByRole("button", { name: "+" }).click();
  await expect(count).toHaveText("1");
  await page.reload();
  await expect(count).toHaveText("1");
});

test("To do app", async ({ page }) => {
  const todo = page.getByTestId("todo-0");

  await page.goto("/todo");
  await page.getByLabel("Add a new todo").fill("Buy milk");
  await page.getByRole("button", { name: "Add" }).click();
  await expect(todo).toHaveText("Buy milk");
  await todo.click();
  await expect(todo).toHaveCSS("text-decoration", /line-through/);
});

test("Async actions", async ({ page }) => {
  const loadingText = page.getByTestId("loading");
  const firstUser = page.getByTestId("user-0-name");
  await mockUsersResponse(page, [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      username: "johndoe",
    },
  ]);

  await page.goto("/async");
  await expect(loadingText).toBeVisible();
  await expect(firstUser).toHaveText("John Doe");

  await mockUsersResponse(page, [
    {
      id: 2,
      name: "Jane Doe",
      email: "jane.doe@example.com",
      username: "janedoe",
    },
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      username: "johndoe",
    },
  ]);
  await page.getByRole("button", { name: "Refresh" }).click();
  await expect(loadingText).toBeVisible();
  await expect(firstUser).toHaveText("Jane Doe");

  await page.getByRole("link", { name: "To do app" }).click();
  await page.getByRole("link", { name: "Async" }).click();
  await expect(loadingText).not.toBeVisible();
});

test("Shared store", async ({ page }) => {
  const counterRenderCount = page.getByTestId("counterRenderCount");
  const todoRenderCount = page.getByTestId("todoRenderCount");
  const increaseButton = page.getByRole("button", { name: "+" });
  const todoInput = page.getByLabel("Add a new todo");
  const addTodoButton = page.getByRole("button", { name: "Add" });

  await page.goto("/shared");
  await expect(counterRenderCount).toHaveText("Render count: 1");
  await expect(todoRenderCount).toHaveText("Render count: 1");

  await increaseButton.click();
  await expect(counterRenderCount).toHaveText("Render count: 2");
  await expect(todoRenderCount).toHaveText("Render count: 1");

  await todoInput.fill("foo");
  await addTodoButton.click();
  await expect(counterRenderCount).toHaveText("Render count: 2");
  await expect(todoRenderCount).toHaveText("Render count: 3");
});

const mockUsersResponse = async (
  page: Page,
  json: {
    id: number;
    name: string;
    username: string;
    email: string;
  }[],
) => {
  await page.route(
    "https://jsonplaceholder.typicode.com/users",
    async (route) => {
      await route.fulfill({ json });
    },
  );
};
