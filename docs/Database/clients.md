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
- Ao criar um novo cliente no banco de dados, deve ser apenas o nome limpo, sem números e símbolos, apenas letras e tudo em `lowerCase`
- Ao criar um novo cliente no banco de dados, se o documento informado já existir no banco, não criar um novo cliente, apenas retornar o cliente já existente baseado no documento
- Ao criar um novo cliente no banco de dados, se for informado o `id` do cliente e este id for existente no banco, não criar um novo cliente, apenas retornar o cliente já existente baseado no `id`
- Ao criar um novo cliente no banco de dados, deve ser um CNPJ ou CPF válido
- Ao criar um novo cliente no banco de dados, se `type_client` for diferente das opções informadas, não criar cliente
## Relações

cliente não usa nenhuma `FK`