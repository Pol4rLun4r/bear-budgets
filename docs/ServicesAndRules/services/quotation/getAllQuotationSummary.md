# getAllQuotationSummary

Obtém os resumos das cotações cadastradas ou pesquisa por ID e anotações.

Este serviço retorna apenas os dados principais de cada cotação. Os itens pertencentes à cotação não são carregados. Quando recebe um texto de pesquisa, retorna todas as cotações cujo ID exibido ou anotação contêm o texto.

## Objetivo

Permitir a listagem e pesquisa de cotações de forma rápida e eficiente.

Este serviço deve ser utilizado sempre que apenas informações resumidas da cotação forem necessárias, como listagens, pesquisas ou tabelas.

## Dependências

O serviço utiliza:

- `quotations`

## Entrada

O serviço recebe um texto de pesquisa opcional.

```ts
query?: string
```

Sem texto ou com uma string vazia, retorna as 50 cotações mais recentes. Com texto, pesquisa tanto o ID normal e o ID formatado com seis dígitos quanto o conteúdo das anotações, sem limitar a quantidade de resultados.

## Saída

Em caso de sucesso:

```ts
success(Quotation[])
```

Cada objeto retornado representa um resumo de uma cotação.

Os itens associados à cotação não fazem parte do retorno.

Em caso de erro:

```ts
failure(message)
```

## Fluxo

1. Validar o tipo do parâmetro recebido.
2. Sem filtro, buscar as 50 cotações mais recentes; com filtro, buscar todas as correspondências de ID e anotação.
    
3. Retornar apenas os dados resumidos de cada cotação.

## Garantias

Quando o serviço retorna sucesso:

- sem filtro, as 50 cotações mais recentes são consultadas; com filtro, todos os resultados correspondentes são retornados;
    
- nenhum item pertencente às cotações é carregado;
    
- todos os registros retornados representam apenas informações resumidas.
