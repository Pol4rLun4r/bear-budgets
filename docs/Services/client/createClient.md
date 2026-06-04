# createClient

`service` para criar um novo cliente

## Regras
Para criar um novo cliente, deve seguir as regas de [clients](Database/clients).

Durante a aplicação das regras, terão dois casos especiais:
1. se o cliente já existir baseado no `id`, informe o seguinte código: 
`CLIENT_EXISTS_BY_ID`
2. se o cliente já existir baseado no `document`, informe o seguinte código:
`CLIENT_EXISTS_BY_DOCUMENT`

> Veja [Exemplo de rules](Services/examples/rules-example), **exemplo numero 4**, para entender o porque desses códigos.
## Entrada de dados esperados pelo `service` (`payload`)

Os dados esperados são do type `Client` encontrado em `/types/quotation.d.ts`
**O payload deve ter este formato**: `payload: Client`
## Retorno esperado pelo `service`

Retorna `success(Client)` em caso de sucesso ou `failure(message)` em caso de erro.

O type em caso de sucesso seria `Client` encontrado em `/types/quotation.d.ts`.

## Fluxo do `service`

1. Buscar cliente existente por `id`, se `id` for informado.
2. Buscar cliente existente por `document` limpo.
3. Enviar dados e resultados encontrados para `rules`.
4. Se a regra falhar, retornar erro.
5. Se já existir cliente por `id`/`document`, retornar esse cliente.
6. Se não existir, criar cliente no repository.
7. Retornar cliente criado.

Se durante o fluxo, os dados  do cliente de `id` e `document` forem diferentes, priorize `id`.