# Bear Quotes

> **Status: Alpha** — Aplicação em desenvolvimento ativo. Funcionalidades e APIs podem mudar.

Aplicativo desktop para criação e gestão de orçamentos (cotações), com busca de clientes, cadastro e fluxo guiado por etapas.

## Stack

- **Desktop:** [Tauri 2](https://tauri.app/) + [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite 7](https://vitejs.dev/)
- **UI:** [Mantine 8](https://mantine.dev/), [Framer Motion](https://www.framer.com/motion/), [Tabler Icons](https://tabler.io/icons)
- **Estado:** [Redux Toolkit](https://redux-toolkit.js.org/) + [React Redux](https://react-redux.js.org/)
- **Backend:** [Express 5](https://expressjs.com/) (API REST na porta 4000)
- **Banco:** [better-sqlite3](https://github.com/JoshuaWise/better-sqlite3) com [migrations](https://github.com/BlackGlory/better-sqlite3-migrations)
- **Testes:** [Vitest](https://vitest.dev/) no core

## O que existe hoje (Alpha)

### Interface

- **Sidebar** colapsável com abas de navegação e opções (alternar tema claro/escuro, Settings).
- **Tema:** dark por padrão, suporte a light/dark com Mantine.
- **Fluxo “Criar orçamento”** em slides e steps:
  1. **Buscar cliente** — busca por documento ou nome (com debounce).
  2. **Criar ou usar cliente** — se não existir, formulário para cadastro (nome, documento, tipo nacional/internacional, notas); validação de CPF/CNPJ.
  3. **Iniciar orçamento** — status (rascunho / aprovado / omie) e notas.
  4. **Definir itens** — passo presente na stepper, conteúdo ainda placeholder.
  5. **Ajustes finais** — tela de conclusão, conteúdo ainda placeholder.
- **Notificações** (Mantine Notifications) disponíveis na app.

### Backend (core)

- **API REST** em Express:
  - `POST /clients/search` — busca clientes por documento ou nome.
  - `POST /clients/` — cria cliente (ou retorna existente por documento).
  - `GET /clients/get?client_id=` — obtém cliente por ID.
  - `POST /quotations/` — cria cotação para um cliente (com status e notas).
- **Banco SQLite** com migrations; schema com `quotations`, `quotation_versions` (versões imutáveis) e `clients`.
- **Regras de domínio** no core (ex.: validação de documento, tipo do cliente, existência de cliente na cotação).
- **Testes** no core via `npm run test-core` (Vitest).

### Limitações conhecidas (Alpha)

- Servidor backend precisa ser iniciado separadamente (por exemplo `core/server.ts` na porta 4000).
- URL da API está fixa em `http://localhost:4000` em `src/services/url.ts`.
- Passos “Definir itens” e “Ajustes finais” ainda não implementados.
- Outras abas da sidebar (além de “Criar orçamento”) mostram conteúdo placeholder.

## Como rodar

1. **Instalar dependências**
   ```bash
   npm install
   ```

2. **Subir o backend** (em um terminal)
   - Garantir que o servidor Express do `core` está rodando na porta 4000 (ex.: `core/server.ts` ou script equivalente).

3. **Rodar o app desktop**
   ```bash
   npm run tauri dev
   ```
   Ou apenas o frontend:
   ```bash
   npm run dev
   ```

4. **Testes do core**
   ```bash
   npm run test-core
   ```

## Estrutura resumida

- `src/` — frontend React (componentes, Redux, serviços de API, estilos).
- `src-tauri/` — app Tauri (Rust).
- `core/` — backend em Node: `app.ts`, `server.ts`, `db/`, `domain/`, `services/`, `controller/`, `routes/`, `repositories/`.
- `types/` — tipos compartilhados (ex.: `quotation`, `client`).

## IDE recomendada

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
