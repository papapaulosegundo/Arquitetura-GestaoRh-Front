# GestaoRH Microfrontend

Frontend da atividade de arquitetura evoluido para o modelo de microfrontend em React com Module Federation.

## Arquitetura

- `apps/shell`: SPA host responsavel por layout, navegacao e visao agregada.
- `apps/mfe-people`: microfrontend remoto do dominio de pessoas.
- `apps/mfe-documents`: microfrontend remoto do dominio de documentos.
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

Quando o BFF estiver pronto:

```bash
VITE_USE_MOCKS=false
VITE_BFF_BASE_URL=http://localhost:8080
```

## Entrega

- Shell pronta para consumir `GET /aggregated-data`
- Remotes preparados para consumir endpoints do BFF
- Nenhum microfrontend acessa microservices diretamente

## Alunos

Ver arquivo `GRUPO.md`.
