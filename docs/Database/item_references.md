# item_references

Defini os dados base do item, dados de referencia, tornando o item reutilizável para montar outros orçamentos, sem a necessidade de definir os mesmos dados novamente.

## Campos importantes da tabela

- `id` ID único (`Auto incrementado`)
- `description`: descrição do item (`Obrigatório`)
- `internal_code`: código interno do item (referente a empresa) (`Opcional`)
- `manufacturer_code`: código do fabricante (referente ao fabricante) (`Opcional`)
- `ncm`: código fiscal (Nomenclatura Comum do Mercosul) (`Opcional`)
- `notes`: anotações sobre o item (`Opcional`)

## Regras de negócios

-  Sempre deve ter uma descrição
- Nunca deve ser deletado se associado a alguma [cotação](quotations)

## Relações
item_references não usa nenhuma `FK`