# Architecture

Frontend:  
- React  
  
Backend:  
- Electron, responsável pela comunicação com a interface via IPC e pela persistência das preferências do aplicativo em JSON.
  
Banco:  
- SQLite

Preferências do aplicativo:
- `bear-budgets-settings.json`, armazenado na mesma pasta do banco de dados.
- O arquivo armazena as preferências de interface, incluindo o modo simples padrão e os campos opcionais visíveis nos formulários de referência e de valores dos itens.
- As preferências de campos obrigatórios permanecem fixas: descrição no formulário de referência; preço unitário, quantidade e markup no formulário de valores. A versão 2 do arquivo migra automaticamente as preferências de campos da versão 1.
