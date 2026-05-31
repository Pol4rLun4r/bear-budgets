# item_values

Defini os dados dos valores do item, os mesmos podem ser reutilizados em outros orçamentos para usar como base de valores.

## Campos importantes da tabela

- `id` ID único (`Auto incrementado`)
- `item_reference_id`: id do item de referencia (`FK`)
- `position`: defini a posição do item na lista da cotação (`Obrigatório`)
- `quantity`: quantidade daquele item (`Opcional`)
- `unit_price`: preço unitário do item (`Opcional`)
- `markup`: margem de lucro do item (`Opcional`)
- `purchase_shipping`: frete de compra do item (`Opcional`)
- `ipi`: imposto sobre produtos industrializados (`Opcional`)
- `st`: substituição tributária (`Opcional`)
## Regras de negócios

- Sempre deve ter uma posição
- Só pode ser criado com um `item_reference_id`

## Relações

- `item_values.item_reference_id` -> [item_references.id](item_references)