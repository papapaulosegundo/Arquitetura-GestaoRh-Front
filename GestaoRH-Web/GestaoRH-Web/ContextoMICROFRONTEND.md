# Contexto da Etapa 1 - Microfrontend

Este arquivo registra o contexto completo do que foi feito no item 1 da atividade para nao perder continuidade nas proximas conversas.

## Objetivo desta etapa

Transformar o frontend base em React que estava no repositorio em uma estrutura de microfrontend alinhada com a atividade da disciplina.

A meta desta etapa foi atender especificamente o item:

`1. Microfrontend`

Requisitos principais considerados:

- Interface do usuario em SPA
- React como tecnologia principal
- Arquitetura de microfrontend
- Frontend preparado para consumir somente o BFF
- Nao acessar microservices diretamente

## Leitura da atividade e expectativa do professor

Antes da implementacao foi analisado:

- O enunciado da atividade enviado na conversa
- O arquivo do professor `ARQUITETURA_CLOUD_6-MICROFRONTEND.pptx`

Conclusao dessa analise:

- O professor espera explicitamente uso de `React + Module Federation`
- Nao bastava apenas separar pastas por dominio
- Era importante existir uma `shell/host` e pelo menos dois microfrontends ou duas funcionalidades separadas
- O frontend precisava ficar preparado para integracao futura com BFF

## Decisao arquitetural adotada

Em vez de manter o frontend anterior como SPA monolitica, o projeto foi reorganizado para o seguinte modelo:

- `shell`: aplicacao host principal
- `mfe-people`: microfrontend remoto do dominio de pessoas
- `mfe-documents`: microfrontend remoto do dominio de documentos
- `shared`: pacote compartilhado com tema, mocks e client para o BFF

Essa decisao foi tomada para:

- reaproveitar o tema e o contexto do sistema de RH ja existente
- deixar a evolucao para BFF mais simples
- evitar retrabalho quando chegar a etapa de backend

## O que foi alterado no projeto

O projeto original foi convertido em workspace com multiplas apps.

### Nova estrutura principal

```text
GestaoRH-Web/GestaoRH-Web
├── apps
│   ├── shell
│   ├── mfe-people
│   └── mfe-documents
├── packages
│   └── shared
├── README.md
├── GRUPO.md
├── .env.example
└── CONTEXTO_ETAPA_1_MICROFRONTEND.md
```

### Arquivos principais adicionados

#### Shell

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

#### Remote de pessoas

- `apps/mfe-people/package.json`
- `apps/mfe-people/vite.config.js`
- `apps/mfe-people/index.html`
- `apps/mfe-people/src/main.jsx`
- `apps/mfe-people/src/bootstrap.jsx`

#### Remote de documentos

- `apps/mfe-documents/package.json`
- `apps/mfe-documents/vite.config.js`
- `apps/mfe-documents/index.html`
- `apps/mfe-documents/src/main.jsx`
- `apps/mfe-documents/src/bootstrap.jsx`

#### Shared

- `packages/shared/package.json`
- `packages/shared/src/index.js`
- `packages/shared/src/services/httpClient.js`
- `packages/shared/src/services/mockData.js`
- `packages/shared/src/services/dashboardService.js`
- `packages/shared/src/services/peopleService.js`
- `packages/shared/src/services/documentsService.js`
- `packages/shared/src/styles/theme.css`

#### Documentacao e apoio

- `README.md` atualizado para a nova arquitetura
- `GRUPO.md` criado como placeholder para nomes dos alunos
- `.env.example` criado com variaveis para mocks e BFF
- `.gitignore` atualizado para ignorar `apps/*/dist/`
- `package.json` da raiz refeito para workspace

## O que cada parte faz

### 1. Shell

A shell e a SPA principal do sistema.

Responsabilidades da shell:

- fornecer layout principal
- centralizar navegacao
- carregar remotes em runtime usando Module Federation
- exibir a pagina agregada da aplicacao
- ser o ponto futuro de autenticacao global
- ser o ponto de entrada do frontend

Rotas principais da shell:

- `/`
  - landing page explicando a arquitetura
- `/overview`
  - tela agregada pronta para consumir `GET /aggregated-data`
- `/people/*`
  - carrega o remote `mfe-people`
- `/documents/*`
  - carrega o remote `mfe-documents`
- `/settings`
  - resumo arquitetural da entrega

### 2. Microfrontend `mfe-people`

Esse remote representa o dominio de pessoas.

Funcionalidades criadas:

- listagem de colaboradores
- tela de detalhe de colaborador

Objetivo:

- demonstrar um microfrontend independente
- deixar a feature pronta para consumir o BFF de pessoas

### 3. Microfrontend `mfe-documents`

Esse remote representa o dominio de documentos.

Funcionalidades criadas:

- listagem de documentos
- tela de detalhe de documento

Objetivo:

- demonstrar um segundo microfrontend independente
- deixar a feature pronta para consumir o BFF de documentos

### 4. Pacote `shared`

O pacote compartilhado concentra:

- tema visual comum
- servicos HTTP
- mocks de dados
- contrato de consumo do BFF

Isso evita acoplamento direto entre os remotes e garante consistencia.

## Como ficou a integracao com BFF

O frontend foi preparado para nao falar com microservices diretamente.

Endpoints esperados futuramente:

- `GET /aggregated-data`
- `GET /people`
- `GET /people/:id`
- `GET /documents`
- `GET /documents/:id`

Hoje, enquanto o BFF ainda nao existe, o frontend roda com mocks locais.

Variaveis configuradas:

```env
VITE_USE_MOCKS=true
VITE_BFF_BASE_URL=http://localhost:8080
```

Quando o BFF estiver pronto, a ideia e usar:

```env
VITE_USE_MOCKS=false
VITE_BFF_BASE_URL=http://localhost:8080
```

## Como o Module Federation foi aplicado

Foi usado:

- `@originjs/vite-plugin-federation`

Configuracao conceitual:

- a `shell` declara os remotes
- `mfe-people` expõe `./PeopleApp`
- `mfe-documents` expõe `./DocumentsApp`

Isso permite:

- deploy independente por frontend
- separacao por dominio
- carga dinamica em runtime

## Reaproveitamento da base anterior

A base anterior tinha varias telas e uma identidade visual de sistema de RH.

Nesta etapa:

- o conceito visual e de dominio foi mantido
- a arquitetura foi mudada de monolito frontend para microfrontend
- nao foi feita migracao completa de todas as telas antigas
- foram escolhidos dois dominios claros para a demonstracao:
  - pessoas
  - documentos

Essa foi uma escolha intencional para entregar um microfrontend coerente e alinhado com a atividade, sem carregar toda a complexidade da base antiga logo na primeira etapa.

## Validacao realizada

Foi executado:

- `npm install`
- `npm run build`

Resultado:

- o build completo funcionou
- `shell`, `mfe-people` e `mfe-documents` compilaram com sucesso

Observacao importante:

- dentro da sandbox houve limitacao por causa do caminho no OneDrive
- fora da sandbox o build validou normalmente

## Scripts principais

Na raiz do projeto:

```bash
npm run dev:people
npm run dev:documents
npm run dev:shell
```

Build:

```bash
npm run build
```

## O que esta atendido do item 1

O item 1 ficou atendido da seguinte forma:

- SPA em React: sim
- arquitetura de microfrontend: sim
- uso de Module Federation: sim
- pelo menos duas funcionalidades: sim
- frontend preparado para consumir somente BFF: sim
- sem acesso direto a microservices: sim

## O que ainda nao foi feito

Esses pontos ficaram para proximas etapas:

- criar o BFF real em Node.js
- implementar os endpoints reais usados pelo frontend
- integrar autenticacao real
- subir deploy independente de shell e remotes
- publicar frontend
- conectar API Gateway
- integrar microservices reais e Azure Function

## Instrucoes para proximas mensagens

Para nao perder contexto nas proximas conversas, considerar sempre estas premissas:

1. Este repositorio agora deve ser tratado como um projeto de microfrontend, nao mais como SPA monolitica tradicional.
2. A arquitetura escolhida deve ser preservada:
   - `apps/shell`
   - `apps/mfe-people`
   - `apps/mfe-documents`
   - `packages/shared`
3. O frontend deve consumir somente BFF.
4. Nao devemos voltar a ligar o frontend diretamente em microservices.
5. Se novas funcionalidades forem adicionadas, preferir encaixar por dominio:
   - ou dentro de um remote existente
   - ou criando novo remote, se fizer sentido arquiteturalmente
6. Sempre manter compatibilidade com `Module Federation`.
7. Enquanto o BFF nao existir, usar mocks do pacote `shared`.
8. Quando o BFF estiver pronto, substituir mocks por chamadas reais sem quebrar a estrutura da shell e dos remotes.
9. O foco academico importa:
   - precisamos continuar alinhados ao que o professor espera
   - especialmente `React + Module Federation + separacao por dominio + consumo via BFF`
10. Antes de uma refatoracao grande, conferir se ela aproxima ou afasta da entrega da disciplina.

## Sugestao de continuidade

Quando retomarmos, a sequencia mais natural e:

1. definir o contrato do BFF com base no frontend criado
2. implementar o BFF em Node.js
3. conectar a shell em `GET /aggregated-data`
4. conectar os remotes em `/people` e `/documents`
5. depois seguir para microservices, databases e function

## Arquivos mais importantes para retomar rapido

Se no futuro precisarmos retomar rapido, olhar primeiro estes arquivos:

- `package.json`
- `apps/shell/src/App.jsx`
- `apps/shell/vite.config.js`
- `apps/mfe-people/src/bootstrap.jsx`
- `apps/mfe-documents/src/bootstrap.jsx`
- `packages/shared/src/services/httpClient.js`
- `packages/shared/src/services/dashboardService.js`
- `packages/shared/src/services/peopleService.js`
- `packages/shared/src/services/documentsService.js`
- `README.md`
- `CONTEXTO_ETAPA_1_MICROFRONTEND.md`

## Observacao final

Se alguma etapa futura exigir mudar essa arquitetura, a mudanca deve ser justificada com base no que a disciplina pede. Ate segunda ordem, a linha correta e continuar evoluindo essa estrutura de microfrontend em cima da shell e dos remotes ja criados.
