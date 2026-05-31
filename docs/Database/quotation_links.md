# quotation_links

Cria uma conexão entre [cotação](quotations), [item de referencia](item_references) e [valores do item](item_values) .

## Campos importantes da tabela

- `id` ID único (`Auto incrementado`)
- `quotation_id`: id da cotação (`FK`)
- `item_reference_id`: id do item de referencia (`FK`)
- `item_values_id`: id dos valores do item (`FK`)

## Regras de negócios

- Nunca deve ser deletado se associado a alguma [cotação](quotations), [item de referencia](item_references) ou [valores do item](item_values) 

## Relações

- `quotation_links.quotation_id` -> [clients.id](clients)
- `quotation_links.item_reference_id` -> [item_references.id](item_references)
- `quotation_links.item_values_id` -> [item_values.id](item_values)