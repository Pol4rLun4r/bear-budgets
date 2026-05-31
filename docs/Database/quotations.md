# quotations

Defini os dados da cotação.

## Campos importantes da tabela

- `id` ID único (`Auto incrementado`)
- `client_id`: id do cliente (`FK`)
- `status`: status da cotação, entre 0 e 1 (0: rascunho, 1: enviado) (`default`: 0) 
- `notes`: notas da cotação (`Opcional`)
- `total_value`: valor total da cotação (`Opcional`)
- `amount`: quantidade de itens na cotação (`Opcional`)

## Regras de negócios

- Só pode ser criada com um `client_id`

## Relações
- `quotations.client_id` -> [clients.id](clients)