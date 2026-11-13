# searchDescription

Valida e normaliza os valores utilizados para pesquisar itens pela descrição ou pelos códigos.

Esta regra garante que o termo informado seja válido antes da realização da pesquisa.

## Objetivo

Preparar os valores de pesquisa utilizados para localizar itens por descrição, código interno ou código do fabricante.

A regra não realiza consultas ao banco de dados. Sua responsabilidade é apenas validar e normalizar o termo informado.

As regras da entidade podem ser consultadas em [[item_references]].

## Entrada

### Payload

```ts
SearchItemReferenceQuery
```

## Saída

Em caso de sucesso:

```ts
success(SearchItemReferenceQuery)
```

Em caso de erro:

```ts
failure(ErrorCode)
```

## Validações

A regra executa as seguintes validações:

1. A entrada deve ser uma `string` ou um objeto com valores textuais para descrição e/ou códigos.
    
2. Pelo menos um dos valores informados não pode ser vazio.
    

A primeira validação que falhar interrompe a execução da regra.

## Normalizações

Antes de retornar sucesso, a regra realiza as seguintes normalizações:

### Campos de pesquisa

- Remove espaços em branco do início e do fim de cada campo.
    

## Garantias

Quando a regra retorna sucesso:

- pelo menos um valor pesquisável foi informado;
- os valores não possuem espaços em branco desnecessários no início ou no fim.
    

## Códigos de erro

| Código                     | Descrição                                        |
| -------------------------- | ------------------------------------------------ |
| `DESCRIPTION_NOT_STRING`   | O termo informado não é uma string.              |
| `DESCRIPTION_NOT_INFORMED` | Nenhuma descrição foi informada para a pesquisa. |