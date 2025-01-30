const { test, expect } = require("@playwright/test");

//test("Server responds with the text 'Hello world!'", async ({ page }) => {
//const response = await page.goto("/");
// expect(await response.text()).toBe("Hello world!");
//});

test("Server displays the index page correctly for h1", async ({ page }) => {
  await page.goto("http://localhost:7777");
  await expect(page.locator("h1")).toHaveText("Welcome");
});

test("Server displays the index page correctly for h4", async ({ page }) => {
  await page.goto("http://localhost:7777");
  await expect(page.locator("h4")).toHaveText(
    "This is a quiz App that has questions on different topics."
  );
});

test("Navigation bar contains correct links for topics", async ({ page }) => {
  await page.goto("http://localhost:7777");
  const topicsLink = page.locator('nav a:has-text("Topics")').first();
  await expect(topicsLink).toHaveAttribute("href", "/topics");
});

test("Navigation bar contains correct links for quiz", async ({ page }) => {
  await page.goto("http://localhost:7777");
  const quizLink = page.locator('nav a:has-text("Quiz")').nth(1);
  await expect(quizLink).toHaveAttribute("href", "/quiz");
});

test("Register links are present in the correct section", async ({ page }) => {
  await page.goto("http://localhost:7777");
  const registerLink = page.locator('section ul li a:has-text("Register")');
  await expect(registerLink).toHaveAttribute("href", "/auth/register");
});

test("Login links are present in the correct section", async ({ page }) => {
  await page.goto("http://localhost:7777");
  const loginLink = page.locator('section ul li a:has-text("Login")');
  await expect(loginLink).toHaveAttribute("href", "/auth/login");
});

test("index page correctly for h2", async ({ page }) => {
  await page.goto("http://localhost:7777");
  await expect(page.locator("h2")).toHaveText("Statistics");
});

test("Total topics in statistics are displayed correctly on the main page", async ({
  page,
}) => {
  await page.goto("http://localhost:7777");
  const topicsCount = await page.locator('p:has(strong:text("Total Topics:"))');
  await expect(topicsCount).toHaveText("Total Topics: 5");
});

test("Total questions in statistics are displayed correctly on the main page", async ({
  page,
}) => {
  await page.goto("http://localhost:7777");
  const topicsCount = await page.locator(
    'p:has(strong:text("Total Questions:"))'
  );
  await expect(topicsCount).toHaveText("Total Questions: 4");
});

test("Total Answer in statistics are displayed correctly on the main page", async ({
  page,
}) => {
  await page.goto("http://localhost:7777");
  const topicsCount = await page.locator(
    'p:has(strong:text("Total Answers:"))'
  );
  await expect(topicsCount).toHaveText("Total Answers: 25");
});
