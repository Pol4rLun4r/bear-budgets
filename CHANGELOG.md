# [2.0.0](https://github.com/Pol4rLun4r/bear-budgets/compare/v1.0.0...v2.0.0) (2026-07-27)


### Documentation

* **project:** revamp README and prepare v2.0 release ([8a9b9ba](https://github.com/Pol4rLun4r/bear-budgets/commit/8a9b9ba132b5372ea4f707d45983978ef536d4f6))


### Features

* **budgets:** improve budget listing and edit workflow ([ed60f05](https://github.com/Pol4rLun4r/bear-budgets/commit/ed60f05b413ac17e285903e605b986e658cae9d9))
* **item-form:** support ST percentage mode and simplify quotation flow ([491cabc](https://github.com/Pol4rLun4r/bear-budgets/commit/491cabc7a57e8d63a61ecabe8add2d9473efdac1))
* **item:** add description search service and validation rules ([3200726](https://github.com/Pol4rLun4r/bear-budgets/commit/32007268954e3684a8ebd79cdef45db92afaf3ae))
* **item:** add item reference search service ([1410199](https://github.com/Pol4rLun4r/bear-budgets/commit/1410199bbf6c90b8096d84f85e24fcc5c15d48dd))
* **item:** add reference links retrieval service ([fffd4a9](https://github.com/Pol4rLun4r/bear-budgets/commit/fffd4a9d195a78bf1171422d59fb04b55c259157))
* **item:** add service to retrieve all values by reference ([bdfad5a](https://github.com/Pol4rLun4r/bear-budgets/commit/bdfad5a11cf6baf50670f2209acc71b955117045))
* **item:** expose reference values and link repository ([7df7fe3](https://github.com/Pol4rLun4r/bear-budgets/commit/7df7fe34fe80c8762ac244ff602f4aa6800aecc8))
* **quotation:** add complete quotation retrieval service ([82cf4f2](https://github.com/Pol4rLun4r/bear-budgets/commit/82cf4f27ed20744c3d2f4f96ecb3f15516341dc8))
* **quotation:** add summary retrieval service ([8ce7d91](https://github.com/Pol4rLun4r/bear-budgets/commit/8ce7d91ce03f73324462e3db753b7e8943f2e514))
* **ui:** improve copy behavior for formatted values ([0cea698](https://github.com/Pol4rLun4r/bear-budgets/commit/0cea6986059b13fc4a5e0b6ee80d169835e931a7))


### BREAKING CHANGES

* **project:** customer data has been removed from quotations
Databases prior to version 2.0 no longer work

# 1.0.0 (2026-05-30)


### Features

- Criação de orçamento
    - Definir dados básico do cliente, como nome, documento e anotações
    - Anotar informações sobre aquele orçamento
    - Criar um item de referencia com: 
        > Links de referencia, Notas, NCM, Descrição, Código interno e Código de fabricante
    - Definir os valores daquele item:
        > Quantidade, Valor unit, Markup, IPI, ST, Frete de compra, Embarque e Valor extra
    - Editar item durante a criação do orçamento
    - Usar um item já "cadastrado" durante a adição de um item ao orçamento
    - Reordenar ordem dos itens
    - Puxar dados de um cliente já cadastrado, baseado no documento
- Visualizar todos os orçamentos criados
- Visualizar/Buscar todos os items "cadastrados" e seus valores
- Alterar entre tema claro e escuro
