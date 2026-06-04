# GestaoRH Microfrontend

Frontend da atividade de arquitetura evoluido para o modelo de microfrontend em React com Module Federation.

## Arquitetura

- `apps/shell`: SPA host responsavel por layout, navegacao e visao agregada.
- `apps/mfe-people`: microfrontend remoto do dominio de pessoas.
- `apps/mfe-documents`: microfrontend remoto do dominio de documentos, agora preparado para operar via BFF com o microservico Mongo.
- `packages/shared`: client compartilhado preparado para consumir o BFF.

## Tecnologias

- React 18
- Vite
- Module Federation com `@originjs/vite-plugin-federation`
- React Router
- Axios

## Como rodar

Instale as dependencias na raiz do projeto:

```bash
npm install
```

Em terminais separados:

```bash
npm run dev:people
npm run dev:documents
npm run dev:shell
```

Se quiser usar mocks locais:

```bash
VITE_USE_MOCKS=true
```

Para o fluxo atual com o BFF:

```bash
VITE_USE_MOCKS=false
VITE_BFF_BASE_URL=http://localhost:8080
```

No estado atual da arquitetura:

- `GET /aggregated-data` deve vir do BFF
- `people` ainda pode estar mockado no BFF
- `documents` deve vir do BFF conectado ao microservico 1 em MongoDB
- o frontend nao acessa o microservico diretamente

## Entrega

- Shell pronta para consumir `GET /aggregated-data`
- `mfe-documents` preparado para consumir `GET`, `POST`, `PUT` e `DELETE` via BFF
- Remotes preparados para consumir endpoints do BFF
- Nenhum microfrontend acessa microservices diretamente

## Alunos

Ver arquivo `GRUPO.md`.
