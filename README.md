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
VITE_BFF_API_PREFIX=
VITE_REMOTE_PEOPLE_URL=http://localhost:4183/assets/remoteEntry.js
VITE_REMOTE_DOCUMENTS_URL=http://localhost:4184/assets/remoteEntry.js
```

Se o BFF expuser as rotas publicas com prefixo, por exemplo `/api/people` e `/api/documents`, basta ajustar:

```bash
VITE_BFF_API_PREFIX=api
```

Para evitar erro de Module Federation, os remotes tambem precisam estar acessiveis nessas URLs. Neste projeto, a shell consome os remotes publicados em `preview`, nao no `vite dev`, porque o `remoteEntry.js` precisa existir de verdade. As portas agora usam `strictPort`, entao se `4183` ou `4184` estiverem ocupadas o Vite falha ao subir em vez de trocar para outra porta sem avisar.

No estado atual da arquitetura:

- `GET /aggregated-data` deve vir do BFF
- `people` deve vir do BFF conectado ao microservico Azure SQL
- `documents` deve vir do BFF conectado ao microservico MongoDB
- a Azure Function pode aparecer no frontend via `aggregated-data`, mas na `main` do BFF ela continua mockada por configuracao padrao
- o frontend nao acessa o microservico diretamente

## Validacao para o video

Para demonstrar o fluxo completo no frontend, o ambiente esperado e:

- BFF em `http://localhost:8080`
- shell em `http://localhost:5173`
- `mfe-people` em `http://localhost:4183/assets/remoteEntry.js`
- `mfe-documents` em `http://localhost:4184/assets/remoteEntry.js`
- microservico `People` em `http://localhost:5096`
- microservico `Documents` em `http://localhost:5102`

Fluxos que o frontend ja cobre:

- `/overview`: chama `GET /aggregated-data`
- `/people`: CRUD completo via BFF
- `/documents`: CRUD completo via BFF

Observacao importante para a apresentacao:

- o frontend prova o fluxo `frontend -> BFF -> people/documents`
- a parte de Azure Function depende do BFF estar configurado com `UseFunctionMocks=false` se a ideia for mostrar integracao real em runtime
- se o BFF estiver com `UseFunctionMocks=true`, o frontend continua funcionando, mas os insights da overview nao estao vindo da Function real

## Entrega

- Shell pronta para consumir `GET /aggregated-data`
- `mfe-documents` preparado para consumir `GET`, `POST`, `PUT` e `DELETE` via BFF
- Remotes preparados para consumir endpoints do BFF
- Nenhum microfrontend acessa microservices diretamente

## Alunos

- Paulo César Muchalski
- Paulo Vitor
- Giulia Casteluci
- Juliano
- Gabriela Otte
