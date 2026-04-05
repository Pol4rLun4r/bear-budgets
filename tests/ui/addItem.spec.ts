import { test, expect } from "@playwright/test";

// settings
import settings from "./settings";

import { items } from "./items";

test('access', async ({ page }) => {
    // acessa a página
    await page.goto(settings.pageUrl);

    for (const item of items.slice(0, 6)) {
        // clica no botão de adicionar item
        await page.getByRole('button', { name: 'Adicionar Item' }).click();

        // preenche a descrição do item
        await page.getByRole('textbox', { name: 'Descrição do item' }).click();
        await page.getByRole('textbox', { name: 'Descrição do item' }).fill(item.item_basic_data.description);

        await page.getByRole('textbox', { name: 'Código interno' }).click();
        await page.getByRole('textbox', { name: 'Código interno' }).fill(item.item_basic_data.internal_code);

        await page.getByRole('textbox', { name: 'Código do fabricante' }).click();
        await page.getByRole('textbox', { name: 'Código do fabricante' }).fill(item.item_basic_data.manufacturer_code);

        await page.getByRole('textbox', { name: 'NCM' }).click();
        await page.getByRole('textbox', { name: 'NCM' }).fill(item.item_basic_data.ncm);

        // notas
        await page.getByRole('textbox', { name: '(opcional)' }).click();
        await page.getByRole('textbox', { name: '(opcional)' }).fill(item.notes[0].content);

        await page.getByLabel('type').selectOption(item.notes[0].type);
        await page.getByRole('button', { name: 'adicionar', exact: true }).click();

        await page.getByRole('button', { name: 'Definir valores do item' }).click();

        await page.getByRole('textbox', { name: 'Valor unitário' }).click();
        await page.getByRole('textbox', { name: 'Valor unitário' }).fill(item.values.unit_price.toString());

        await page.getByRole('textbox', { name: 'Quantidade' }).click();
        await page.getByRole('textbox', { name: 'Quantidade' }).fill(item.values.quantity.toString());

        // markup
        await page.getByRole('textbox', { name: 'Markup', exact: true }).click();
        await page.getByRole('textbox', { name: 'Markup', exact: true }).fill(item.values.markup);
        await page.getByRole('textbox', { name: 'Markup', exact: true }).press('Enter');

        await page.getByRole('textbox', { name: 'IPI', exact: true }).click();
        await page.getByRole('textbox', { name: 'IPI', exact: true }).fill(item.values.ipi.toString());

        await page.getByRole('textbox', { name: 'ST', exact: true }).click();
        await page.getByRole('textbox', { name: 'ST', exact: true }).fill(item.values.st.toString());

        await page.getByRole('textbox', { name: 'Frete de compra' }).click();
        await page.getByRole('textbox', { name: 'Frete de compra' }).fill(item.values.purchase_shipping.toString());

        await page.getByRole('button', { name: 'Criar item' }).click();
    }
});