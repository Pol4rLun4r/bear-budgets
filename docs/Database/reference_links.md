# reference_links

Defini um link de referencia para um item.

## Campos importantes da tabela

- `id` ID único (`Auto incrementado`)
- `item_reference_id`: id do item de referencia (`FK`)
- `content`: link de referencia (um link de internet, seja de datasheet, lojas ou outras coisas) (`Obrigatório`)

## Regras de negócios

- Só pode ser criado com um `item_reference_id`
- O conteúdo só poder ser um link (http/https)

## Relações

- `reference_links.item_reference_id` -> [item_references.id](item_references)