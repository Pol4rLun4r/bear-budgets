# createQuotation

Cria uma nova cotação.

Este serviço é responsável por validar os dados recebidos, aplicar as regras de negócio e persistir uma nova cotação no sistema.

## Objetivo

Criar uma cotação em estado de rascunho contendo pelo menos um item válido.

As regras relacionadas à entidade podem ser encontradas em [Database/quotations](Database/quotations).
## Dependências

O serviço utiliza:

- `quotations`
    
- `quotation_links`
    
- `item_references`
    
- `item_values`
    

## Entrada

### Payload

```ts
payload: CreateQuotationPayload
```

O payload deve conter todas as informações necessárias para criação da cotação.

## Saída

Em caso de sucesso:

```ts
success(Quotation)
```

Em caso de erro:

```ts
failure(ErrorCode)
```

## Regras de negócio

Além das regras definidas em [Database/quotations](Database/quotations), este serviço deve garantir que:

- toda cotação seja criada como rascunho;
    
- exista pelo menos um item válido;
    
- cada item possua um `item_reference`;
    
- cada item possua um `item_values`;
    
- o valor total seja calculado automaticamente;
    
- a quantidade de itens represente exatamente os itens associados à cotação.
    

## Fluxo

1. Validar o payload recebido.
    
2. Aplicar as regras de negócio da cotação.
    
3. Validar todos os itens.
    
4. Criar a cotação.
    
5. Associar todos os itens à cotação.
    
6. Calcular o valor total.
    
7. Atualizar os campos derivados.
    
8. Retornar a cotação criada.
    

## Erros conhecidos

|Código|Quando ocorre|
|---|---|
|`INVALID_PAYLOAD`|O payload é inválido.|
|`QUOTATION_WITHOUT_ITEMS`|Nenhum item foi informado.|
|`INVALID_ITEM_REFERENCE`|O item de referência não existe.|
|`INVALID_ITEM_VALUES`|A configuração do item é inválida.|

## Observações

Este serviço nunca deve receber o campo `status` informado pelo usuário.

O estado inicial da cotação é sempre `Rascunho`.

## Garantias

Após executar este serviço com sucesso:

- a cotação existe no banco;
- o status é Rascunho;
- existe ao menos um item associado;
- o valor total está atualizado;
- a quantidade de itens corresponde aos itens associados.