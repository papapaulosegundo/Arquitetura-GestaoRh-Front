# Contexto da Etapa 1 - Microfrontend

Este arquivo registra o contexto da primeira grande atualizacao do frontend para nao perder continuidade nas proximas conversas.

## Objetivo desta etapa

Transformar o frontend base em React em uma estrutura de microfrontend alinhada com a atividade da disciplina.

Escopo atendido:

- SPA em React
- arquitetura de microfrontend
- uso de Module Federation
- pelo menos duas funcionalidades separadas
- frontend preparado para consumir somente o BFF

## O que foi analisado antes da implementacao

Foram considerados:

- o enunciado da atividade
- o material do professor sobre microfrontend

Conclusao:

- o professor espera `React + Module Federation`
- nao bastava apenas organizar pastas por dominio
- era importante existir uma `shell/host` e microfrontends remotos

## Arquitetura adotada

O projeto foi reorganizado neste modelo:

- `apps/shell`: SPA host principal
- `apps/mfe-people`: remote do dominio de pessoas
- `apps/mfe-documents`: remote do dominio de documentos
- `packages/shared`: client, mocks e tema compartilhado

## Estrutura atual do repositorio

```text
Arquitetura-GestaoRh-Front
|- apps
|  |- shell
|  |- mfe-people
|  `- mfe-documents
|- packages
|  `- shared
|- README.md
|- GRUPO.md
|- .env.example
`- ContextoMICROFRONTEND.md
```

## O que foi criado

### Shell

- `apps/shell/package.json`
- `apps/shell/vite.config.js`
- `apps/shell/index.html`
- `apps/shell/src/main.jsx`
- `apps/shell/src/App.jsx`
- `apps/shell/src/layout/ShellLayout.jsx`
- `apps/shell/src/layout/RemoteMount.jsx`
- `apps/shell/src/pages/LandingPage.jsx`
- `apps/shell/src/pages/OverviewPage.jsx`
- `apps/shell/src/pages/SettingsPage.jsx`
- `apps/shell/src/shell.css`

### Microfrontend de pessoas

- `apps/mfe-people/package.json`
- `apps/mfe-people/vite.config.js`
- `apps/mfe-people/index.html`
- `apps/mfe-people/src/main.jsx`
- `apps/mfe-people/src/bootstrap.jsx`

### Microfrontend de documentos

- `apps/mfe-documents/package.json`
- `apps/mfe-documents/vite.config.js`
- `apps/mfe-documents/index.html`
- `apps/mfe-documents/src/main.jsx`
- `apps/mfe-documents/src/bootstrap.jsx`

### Pacote compartilhado

- `packages/shared/package.json`
- `packages/shared/src/index.js`
- `packages/shared/src/services/httpClient.js`
- `packages/shared/src/services/mockData.js`
- `packages/shared/src/services/dashboardService.js`
- `packages/shared/src/services/peopleService.js`
- `packages/shared/src/services/documentsService.js`
- `packages/shared/src/styles/theme.css`

### Arquivos de apoio

- `README.md`
- `GRUPO.md`
- `.env.example`
- `.gitignore`

## Responsabilidade de cada parte

### Shell

Responsavel por:

- layout principal
- roteamento
- carregamento dos remotes em runtime
- visao agregada da aplicacao

Rotas principais:

- `/`
- `/overview`
- `/people/*`
- `/documents/*`
- `/settings`

### MFE People

Responsavel por:

- listagem de colaboradores
- detalhe de colaborador

### MFE Documents

Responsavel por:

- listagem de documentos
- detalhe de documento

### Shared

Responsavel por:

- client HTTP
- configuracao para BFF
- mocks locais
- tema compartilhado

## Integracao com BFF

O frontend foi preparado para falar somente com o BFF.

Contratos previstos:

- `GET /aggregated-data`
- `GET /people`
- `GET /people/:id`
- `GET /documents`
- `GET /documents/:id`

Enquanto o BFF nao existe, os dados usam mocks locais.

## Variaveis de ambiente

Arquivo de exemplo:

```env
VITE_USE_MOCKS=true
VITE_BFF_BASE_URL=http://localhost:8080
```

Regras:

- `.env`, `.env.local` e `.env.*` ficam ignorados
- `.env.example` fica versionado

## Reaproveitamento da base anterior

Foi mantido:

- o contexto de RH
- a ideia de dominios de negocio

Foi removido da estrutura final:

- o frontend monolitico antigo
- o `.git` aninhado do modelo base
- arquivos legados que nao eram mais usados

## Validacao realizada

Foi executado:

- `npm install`
- `npm run build`

Resultado:

- build validado para `shell`, `mfe-people` e `mfe-documents`

## Scripts principais

```bash
npm run dev:people
npm run dev:documents
npm run dev:shell
npm run build
```

## O que esta atendido do item 1

- SPA em React
- arquitetura de microfrontend
- Module Federation
- duas funcionalidades separadas por dominio
- frontend preparado para consumir BFF
- sem acesso direto a microservices

## O que ainda falta nas proximas etapas

- criar o BFF real em Node.js
- implementar os endpoints reais
- integrar autenticacao real
- publicar shell e remotes
- conectar API Gateway
- integrar microservices e Azure Function

## Instrucoes para proximas mensagens

Considerar sempre:

1. Este repositorio agora e um projeto de microfrontend na raiz.
2. A arquitetura atual deve ser preservada:
   - `apps/shell`
   - `apps/mfe-people`
   - `apps/mfe-documents`
   - `packages/shared`
3. O frontend deve consumir somente o BFF.
4. Nao devemos religar o frontend diretamente em microservices.
5. Enquanto o BFF nao existir, usar mocks do pacote `shared`.
6. Novas features devem entrar por dominio.
7. Sempre manter compatibilidade com `Module Federation`.
8. Refatoracoes grandes devem continuar alinhadas ao que a disciplina pede.

## Arquivos-chave para retomada

- `package.json`
- `README.md`
- `apps/shell/src/App.jsx`
- `apps/shell/vite.config.js`
- `apps/mfe-people/src/bootstrap.jsx`
- `apps/mfe-documents/src/bootstrap.jsx`
- `packages/shared/src/services/httpClient.js`
- `packages/shared/src/services/dashboardService.js`
- `packages/shared/src/services/peopleService.js`
- `packages/shared/src/services/documentsService.js`
- `ContextoMICROFRONTEND.md`
