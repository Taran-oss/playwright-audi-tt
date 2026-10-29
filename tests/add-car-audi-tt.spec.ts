import { test, expect } from '@playwright/test';

test('guest can add Audi TT to Garage', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Guest log in' }).click();
  await expect(page).toHaveURL(/panel\/garage/);
  await expect(page.getByRole('heading', { name: 'Garage' })).toBeVisible();

  const cars = page.getByRole('list').getByRole('listitem');
  await expect(
    page.getByText('You don’t have any cars in your garage').or(cars.first())
  ).toBeVisible();
  const initialCount = await cars.count();

  await page.getByRole('button', { name: 'Add car' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('heading', { name: 'Add a car' })).toBeVisible();

  await dialog.getByLabel('Brand').selectOption('Audi');
  await dialog.getByLabel('Model').selectOption('TT');
  await dialog.getByRole('spinbutton', { name: 'Mileage' }).fill('12000');
  const addButton = dialog.getByRole('button', { name: 'Add' });
  await expect(addButton).toBeEnabled();
  await addButton.click();

  await expect(dialog).toBeHidden();
  await expect(page.getByRole('alert')).toHaveCount(0);

  const audiCard = cars.filter({ hasText: 'Audi TT' });
  await expect(audiCard).toBeVisible();
  await expect(audiCard.getByRole('spinbutton')).toHaveValue('12000');
  await expect(cars).toHaveCount(initialCount + 1);
});
