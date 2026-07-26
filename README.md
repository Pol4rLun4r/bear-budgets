# Bear Budgets

O **Bear Budgets** é um aplicativo desktop, open source e 100% offline para criar e consultar cotações. Ele foi pensado para manter um histórico organizado de produtos, preços e informações de referência, facilitando a reutilização desses dados em novos orçamentos.

Todos os dados permanecem armazenados localmente na máquina do usuário.

## Funcionalidades

### Cotações

- Criar cotações com um ou mais itens;
- Salvar observações, valor total e quantidade de itens;
- Manter novas cotações como rascunho;
- Visualizar um resumo de todas as cotações;
- Consultar uma cotação completa, incluindo itens, valores e links de referência.

### Itens

- Criar itens de referência durante a criação de uma cotação;
- Reutilizar itens cadastrados em novas cotações;
- Buscar itens pela descrição;
- Reordenar os itens enquanto a cotação é criada;
- Consultar os conjuntos de valores e links de referência de cada item.

### Dados registrados por item

Cada item separa informações permanentes das informações que variam entre cotações.

**Referência do item:**

- Descrição;
- Código interno;
- Código do fabricante;
- NCM;
- Observações;
- Links de referência, como datasheets, catálogos, páginas de fabricantes ou lojas.

**Valores do item:**

- Quantidade;
- Valor unitário;
- Markup;
- IPI;
- ST;
- Frete de compra;
- Embarque;
- Valor extra.

## Características

- Um usuário por instalação;
- Funcionamento 100% offline;
- Dados armazenados em SQLite;
- Tema claro e escuro;
- Sem dependência de internet.

## Stack

- React;
- Electron;
- SQLite;
- TypeScript;
- Vite.

## Documentação

- [Visão do projeto](docs/Project.md)
- [Arquitetura](docs/Architecture.md)
- [Banco de dados e regras](docs/Database/@Database.md)
- [Services e regras de negócio](docs/ServicesAndRules/@Services.md)
- [Decisões de arquitetura](docs/Decisions/@Decisions.md)

## Funcionalidades planejadas

- Editar cotações, itens de referência e valores;
- Buscar cotações;
- Definir ou alterar o status de uma cotação;
- Reutilizar valores já registrados;
- Criar cotações sem valores;
- Consolidar vários orçamentos em uma única cotação.