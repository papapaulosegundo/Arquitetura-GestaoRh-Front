# Contexto Atual do Frontend Microfrontend

Este arquivo descreve somente o estado atual do repositório `Arquitetura-GestaoRh-Front`.

## Estrutura atual

```text
Arquitetura-GestaoRh-Front
|- apps
|  |- shell
|  |- mfe-people
|  `- mfe-documents
|- packages
|  `- shared
|- .env
|- .env.example
|- package.json
|- README.md
`- ContextoMICROFRONTEND.md
```

## Arquitetura implementada

- `apps/shell`: host principal da aplicação
- `apps/mfe-people`: microfrontend remoto de pessoas
- `apps/mfe-documents`: microfrontend remoto de documentos
- `packages/shared`: serviços HTTP, mocks e estilos compartilhados

O frontend consome somente o BFF. Não há chamada direta do frontend para microserviços.

## Rotas da aplicação

Rotas da shell:

- `/`
- `/overview`
- `/people/*`
- `/documents/*`
- `/settings`

## Funcionalidades implementadas

### Shell

Implementado em `apps/shell`:

- landing page
- layout principal
- roteamento com `react-router-dom`
- carregamento de remotes com Module Federation
- tela agregada em `/overview`
- tratamento de erro para falha de carregamento de remote

### MFE People

Implementado em `apps/mfe-people/src/bootstrap.jsx`:

- listagem de colaboradores
- detalhe de colaborador
- formulário de criação
- formulário de edição
- exclusão

Serviço usado:

- `packages/shared/src/services/peopleService.js`

Endpoints consumidos:

- `GET /people`
- `GET /people/{id}`
- `POST /people`
- `PUT /people/{id}`
- `DELETE /people/{id}`

### MFE Documents

Implementado em `apps/mfe-documents/src/bootstrap.jsx`:

- listagem de documentos
- detalhe de documento
- formulário de criação
- formulário de edição
- exclusão

Serviço usado:

- `packages/shared/src/services/documentsService.js`

Endpoints consumidos:

- `GET /documents`
- `GET /documents/{id}`
- `POST /documents`
- `PUT /documents/{id}`
- `DELETE /documents/{id}`

### Tela agregada

Implementada em `apps/shell/src/pages/OverviewPage.jsx`.

Endpoint consumido:

- `GET /aggregated-data`

## Configuração HTTP atual

Arquivo principal:

- `packages/shared/src/services/httpClient.js`

Comportamento atual:

- usa `VITE_BFF_BASE_URL` como base do BFF
- remove barra final da base automaticamente
- aplica prefixo opcional via `VITE_BFF_API_PREFIX`
- quando `VITE_USE_MOCKS=true`, usa fallback local dos serviços

Exemplo com rotas públicas sem prefixo:

```env
VITE_BFF_BASE_URL=http://localhost:8080
VITE_BFF_API_PREFIX=
```

Exemplo com rotas públicas sob `/api`:

```env
VITE_BFF_BASE_URL=http://localhost:8080
VITE_BFF_API_PREFIX=api
```

## Configuração atual dos remotes

Os remotes configurados na shell apontam para `preview`, não para `vite dev`.

URLs atuais:

- `VITE_REMOTE_PEOPLE_URL=http://localhost:4183/assets/remoteEntry.js`
- `VITE_REMOTE_DOCUMENTS_URL=http://localhost:4184/assets/remoteEntry.js`

Arquivos relevantes:

- `apps/shell/vite.config.js`
- `apps/shell/src/App.jsx`
- `apps/shell/src/layout/RemoteMount.jsx`
- `.env`
- `.env.example`

Motivo:

- no fluxo anterior a shell buscava `remoteEntry.js` em `4173/4174`
- nesses endereços o Vite estava devolvendo `index.html`, não o módulo federado
- por isso os remotes foram realinhados para o fluxo `build + preview`

## Scripts atuais da raiz

Definidos em `package.json`:

```bash
npm run dev:shell
npm run dev:people
npm run dev:documents
npm run build
npm run preview:shell
```

Comportamento atual:

- `npm run dev:shell`: sobe a shell em modo dev
- `npm run dev:people`: faz build do `mfe-people` e sobe preview
- `npm run dev:documents`: faz build do `mfe-documents` e sobe preview
- `npm run build`: build de todos os workspaces

## Portas atuais

- shell dev: `5173`
- shell preview: `4175`
- `mfe-people` dev: `4173`
- `mfe-people` preview: `4183`
- `mfe-documents` dev: `4174`
- `mfe-documents` preview: `4184`

Os `vite.config.js` dos três apps usam `strictPort: true`.

## Variáveis de ambiente atuais

Conteúdo esperado no `.env` para o fluxo atual:

```env
VITE_USE_MOCKS=false
VITE_BFF_BASE_URL=http://localhost:8080
VITE_BFF_API_PREFIX=
VITE_REMOTE_PEOPLE_URL=http://localhost:4183/assets/remoteEntry.js
VITE_REMOTE_DOCUMENTS_URL=http://localhost:4184/assets/remoteEntry.js
VITE_APP_ENV=local
```

## O que precisa existir para o frontend rodar 100%

### Infra local do frontend

Precisa estar no ar:

- shell em `http://localhost:5173`
- `mfe-people` preview em `http://localhost:4183/assets/remoteEntry.js`
- `mfe-documents` preview em `http://localhost:4184/assets/remoteEntry.js`

### Backend esperado pelo frontend

O BFF precisa responder em `http://localhost:8080` na base configurada no `.env`.

Se `VITE_BFF_API_PREFIX=`:

- `GET /aggregated-data`
- `GET /people`
- `GET /people/{id}`
- `POST /people`
- `PUT /people/{id}`
- `DELETE /people/{id}`
- `GET /documents`
- `GET /documents/{id}`
- `POST /documents`
- `PUT /documents/{id}`
- `DELETE /documents/{id}`

Se `VITE_BFF_API_PREFIX=api`, os mesmos endpoints precisam existir sob `/api`.

## O que ainda falta para considerar 100%

- confirmar no ambiente real que os remotes em `4183` e `4184` estão entregando `remoteEntry.js` válido
- confirmar que o BFF expõe todas as rotas de `people` e `documents` usadas pelo frontend
- confirmar que o contrato de `aggregated-data` devolve `summary`, `people`, `documents` e `insights` no formato esperado pela tela `/overview`
- validar o build local fora do sandbox do Codex, porque neste ambiente o `vite build` falhou por permissão de leitura do sandbox e não por erro de código do projeto

## Arquivos principais para retomada

- `package.json`
- `.env`
- `.env.example`
- `README.md`
- `apps/shell/src/App.jsx`
- `apps/shell/src/layout/RemoteMount.jsx`
- `apps/shell/src/pages/OverviewPage.jsx`
- `apps/shell/vite.config.js`
- `apps/mfe-people/src/bootstrap.jsx`
- `apps/mfe-people/vite.config.js`
- `apps/mfe-documents/src/bootstrap.jsx`
- `apps/mfe-documents/vite.config.js`
- `packages/shared/src/services/httpClient.js`
- `packages/shared/src/services/dashboardService.js`
- `packages/shared/src/services/peopleService.js`
- `packages/shared/src/services/documentsService.js`
