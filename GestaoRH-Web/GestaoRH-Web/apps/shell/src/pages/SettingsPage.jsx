export default function SettingsPage() {
  return (
    <section className="card-grid">
      <article className="surface-card">
        <p className="eyebrow">Arquitetura adotada</p>
        <h2>Shell + remotes por dominio</h2>
        <p>
          `shell` concentra navegacao, autenticacao futura e layout global. `mfe-people` e
          `mfe-documents` carregam em runtime pela federacao de modulos.
        </p>
      </article>

      <article className="surface-card">
        <p className="eyebrow">Proxima etapa</p>
        <h2>Conectar ao BFF</h2>
        <p>
          Os services compartilhados ja apontam para recursos do BFF. Quando seus endpoints existirem,
          remova o mock definindo `VITE_USE_MOCKS=false` e configure `VITE_BFF_BASE_URL`.
        </p>
      </article>

      <article className="surface-card">
        <p className="eyebrow">Entrega academica</p>
        <h2>O que ja fica atendido</h2>
        <p>
          SPA em React, abordagem de microfrontend, duas funcionalidades separadas por dominio e consumo
          centralizado via camada pronta para o BFF.
        </p>
      </article>
    </section>
  )
}
