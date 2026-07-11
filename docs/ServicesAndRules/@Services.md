# Services

Definições e explicações de como deve funcionar os services, regras, dados esperados dados enviados e afins.

## Como services deve funcionar

A principio, services dentro do electron deve ser apenas um orquestrador, chamando funções em ordem e organizando o resultado para ser enviado.

### Regras dentro do service e  onde devem ficar

Todas as regras dentro de `service`, devem ser tratadas em um arquivo separado, no caso `rules`, leia [Exemplo de rules](rules-example.md), para entender mais como organizar.
### Entrada padrão do `service`

Como cada service trata os dados de forma diferente, a entrada padrão será definida dentro do próprio `service` especifico, onde será normalmente algum `type`.

### Saída padrão do `service`

```ts
success(data)
failure(message)
```

- `success`: pega qualquer dado tratado por `rules` ou consultas finais no bando de dados.
- `failure`: trata qualquer erro esperado, ou erros lançados pelo `try catch` dentro de `service`

## Como o código do `service`
Exemplo de como escrever o [service](services-example.md)

## Definição de cada `service`

### quotation
services que envolve as cotações.

- [createQuotation](createQuotation.md) -> `service` para `criar` uma nova cotação
- [getAllQuotationSummary](getAllQuotationSummary.md) -> `service` para `pegar` todas as cotações, sem os dados dos itens
