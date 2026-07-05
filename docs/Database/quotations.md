# quotations

Representa uma cotação criada pelo usuário.

A cotação agrupa os itens orçados, seu valor total, observações e o estado atual (rascunho ou enviada).

## Responsabilidades

A tabela é responsável por:

* armazenar os dados principais da cotação;
* representar o ciclo de vida da cotação;
* agrupar os itens pertencentes à cotação;
* servir como entidade principal do processo de orçamento.

## Campos importantes

* `id`

  * Identificador único da cotação.
  * Tipo: Inteiro.
  * Obrigatório.
  * Auto incrementado.

* `status`

  * Estado atual da cotação.
  * Tipo: Inteiro.
  * Obrigatório.
  * Default: `0`.
  * Valores:

    * `0`: Rascunho.
    * `1`: Enviada.

* `notes`

  * Observações da cotação.
  * Tipo: Texto.
  * Opcional.

* `total_value`

  * Valor total da cotação.
  * Tipo: Número real.
  * Opcional.

* `amount`

  * Quantidade de itens da cotação.
  * Tipo: Inteiro.
  * Obrigatório.

## Regras de negócio

* Toda cotação inicia como rascunho.
* Uma cotação enviada não pode voltar para o estado de rascunho.
* Toda cotação deve possuir pelo menos um item.
* O valor total deve representar a soma dos valores de todos os itens da cotação.
* A quantidade de itens deve refletir exatamente o número de itens vinculados à cotação.

## Relações

* Uma cotação possui vários itens.

## Notas sobre os campos

### amount

Deve ser maior que zero.

Uma cotação sem itens não possui utilidade dentro do sistema.

Esse campo deve sempre representar a quantidade real de itens relacionados à cotação.

---

### total_value

Não deve ser informado manualmente.

Seu valor deve ser calculado a partir da soma dos valores de todos os itens da cotação.

## Invariantes

* `amount` deve ser maior ou igual a `1`.
* `status` deve possuir um valor válido.
* Toda cotação deve possuir um identificador único.
