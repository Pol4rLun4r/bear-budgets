# create

Valida e normaliza os dados necessários para criar uma cotação.

Esta regra garante que os dados mínimos de uma cotação estejam válidos antes de sua persistência.

## Objetivo

Preparar uma cotação para criação, aplicando validações e normalizações básicas.

A regra não cria registros no banco de dados. Sua responsabilidade é apenas validar e preparar os dados.

As regras da entidade podem ser consultadas em [quotation](Database/quotations).

## Entrada

### Payload

```ts
{
    notes?: string;
    status?: QuotationStatus;
    amount: number;
    total_value: number;
    itemsCount: number;
}
```

O campo `itemsCount` representa a quantidade de itens enviados no payload (`items.length`). O service é responsável por informá-lo à regra.

O campo `status` é opcional. Quando não informado, a regra usa rascunho (`0`).

## Saída

Em caso de sucesso:

```ts
success(Quotation)
```

Em caso de erro:

```ts
failure(ErrorCode)
```

## Validações

A regra executa as seguintes validações:

1. A quantidade de itens (`amount`) deve ser informada.
    
2. O valor total (`total_value`) deve ser informado.

3. O `amount` informado deve ser igual ao `itemsCount` (número de itens enviados no payload).

4. Quando informado, o status deve ser um dos valores válidos: `0`, `1`, `2` ou `3`.

A primeira validação que falhar interrompe a execução da regra.

## Normalizações

Antes de retornar sucesso, a regra realiza as seguintes normalizações:

### notes

- Remove espaços em branco do início e do fim do texto.
    
- Caso o resultado seja uma string vazia, o campo é removido (`undefined`).
    

---

### status

- Assume o valor `0` (`Rascunho`) quando não informado.
- Preserva o status escolhido quando ele é válido.

## Garantias

Quando a regra retorna sucesso:

- a cotação possui uma quantidade de itens válida;
    
- a cotação possui um valor total informado;

- o `amount` corresponde ao número de itens enviados no payload;
    
- o campo `status` possui um valor válido, assumindo `0` (Rascunho) quando não informado;
    
- o campo `notes`, quando existente, não contém espaços em branco desnecessários;
    
- o campo `notes` nunca contém uma string vazia.
    

## Códigos de erro

| Código                     | Descrição                                                              |
| -------------------------- | ---------------------------------------------------------------------- |
| `AMOUNT_NOT_INFORMED`      | A quantidade de itens da cotação não foi informada.                    |
| `TOTAL_VALUE_NOT_INFORMED` | O valor total da cotação não foi informado.                            |
| `AMOUNT_MISMATCH`          | O `amount` informado não corresponde ao número de itens enviados.      |
| `INVALID_STATUS`           | O status informado não corresponde a uma das opções válidas.           |
