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
- A versão 5 também armazena as preferências gerais, incluindo a atualização automática, habilitada por padrão.
- As versões anteriores do arquivo são migradas automaticamente, preservando as preferências existentes.
- As preferências de campos obrigatórios permanecem fixas: descrição no formulário de referência; preço unitário, quantidade e markup no formulário de valores.
