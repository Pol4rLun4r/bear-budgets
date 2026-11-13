# searchDescription

Pesquisa itens de referência pela descrição e pelos códigos.

Este serviço retorna os itens que correspondem a qualquer valor informado. Chamadas antigas podem continuar enviando apenas uma string.

## Objetivo

Permitir a localização de itens de referência utilizando parte ou toda a descrição cadastrada.

Este serviço deve ser utilizado em funcionalidades de pesquisa, seleção ou reutilização de itens.

## Dependências

O serviço utiliza:

- [[item_references]]
    

## Entrada

### Payload

```ts
type SearchItemReferenceQuery =
    | SearchItemDescription
    | {
        description?: string;
        internal_code?: string;
        manufacturer_code?: string;
    };
```

Uma string pesquisa pela descrição e, para preservar o comportamento existente, também pelos códigos interno e do fabricante. O objeto permite pesquisar cada valor separadamente; os campos não vazios são combinados e resultados duplicados são removidos.

## Saída

Em caso de sucesso:

```ts
success(ItemReference[])
```

Os códigos correspondentes têm prioridade sobre resultados encontrados pela descrição. Correspondências exatas de código vêm antes das parciais.

Em caso de erro:

```ts
failure(message)
```

## Regras utilizadas

- `searchDescription`
    

## Fluxo

1. Receber o termo de pesquisa.
    
2. Aplicar a regra [searchDescription](ServicesAndRules/rules/item/searchDescription).
    
3. Consultar descrição e códigos não vazios usando o índice de texto completo e a busca de códigos.
    
4. Retornar os itens encontrados.
    

## Garantias

Quando o serviço retorna sucesso:

- o termo de pesquisa foi validado;
    
- os valores informados foram normalizados;
    
- a pesquisa considerou cada campo informado;
- os itens retornados correspondem à descrição ou a um dos códigos pesquisados.
    

## Erros conhecidos

| Código                     | Quando ocorre                                    |
| -------------------------- | ------------------------------------------------ |
| `DESCRIPTION_NOT_STRING`   | O termo informado não é uma string.              |
| `DESCRIPTION_NOT_INFORMED` | Nenhuma descrição foi informada para a pesquisa. |