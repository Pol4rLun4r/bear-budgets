# clients

Defini os dados do cliente. 

## Campos importantes da tabela

- `id` ID único (`Auto incrementado`)
- `name`: nome/apelido do cliente (`Obrigatório`)
- `document`: documento do cliente (`Obrigatório`)
- `notes`: notas sobre o cliente (`Opcional`)
- `type_client`: tipo do cliente, pode ser internacional ou nacional (`default`: nacional)

## Regras de negócios

-  Sempre deve ter um documento
- Sempre deve ter um nome/apelido
- Nunca deve ser deletado se associado a alguma [cotação](quotations)

## Relações

cliente não usa nenhuma `FK`