import { test, expect, Page } from "@playwright/test";

test("Basic counter", async ({ page }) => {
  const count = page.getByLabel("count", { exact: true });

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
  const count = page.getByLabel("count", { exact: true });

  await page.goto("/context");
  await page.getByRole("button", { name: "+" }).click();
  await expect(count).toHaveText("1");
  await page.getByRole("button", { name: "Reset" }).click();
  await expect(count).toHaveText("0");
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
  const loadingText = page.getByText("Fetching posts...");
  const firstPostTitle = page.getByTestId("post-0-title");
  await mockPostsResponse(page, [
    { userId: 1, id: 1, title: "Post 1", body: "Body" },
  ]);

  await page.goto("/async");
  await expect(loadingText).toBeVisible();
  await expect(firstPostTitle).toHaveText("Post 1");

  await mockPostsResponse(page, [
    { userId: 2, id: 2, title: "Post 2", body: "Body" },
    { userId: 1, id: 1, title: "Post 1", body: "Body" },
  ]);
  await page.getByRole("button", { name: "Refresh" }).click();
  await expect(loadingText).toBeVisible();
  await expect(firstPostTitle).toHaveText("Post 2");

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

const mockPostsResponse = async (
  page: Page,
  json: {
    userId: number;
    id: number;
    title: string;
    body: string;
  }[],
) => {
  await page.route(
    "https://jsonplaceholder.typicode.com/posts",
    async (route) => {
      await route.fulfill({ json });
    },
  );
};
