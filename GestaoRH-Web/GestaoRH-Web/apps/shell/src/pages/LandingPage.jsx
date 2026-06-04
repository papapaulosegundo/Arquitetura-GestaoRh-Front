import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="landing-page">
      <section className="landing-hero">
        <div className="landing-copy">
          <p className="eyebrow">Entrega 1 • Microfrontend</p>
          <h1>Gestao RH distribuido com shell, remotes e BFF-first.</h1>
          <p>
            Esta base transforma o frontend anterior em uma SPA host com Module Federation. Cada dominio
            pode evoluir e ser implantado de forma independente, sem acessar microservices diretamente.
          </p>
          <div className="landing-actions">
            <Link to="/overview" className="primary-link">
              Abrir a shell
            </Link>
            <a href="#arquitetura" className="secondary-link">
              Ver arquitetura
            </a>
          </div>
        </div>

        <div className="landing-highlight">
          <div className="highlight-panel">
            <span>Shell</span>
            <strong>Host React em Vite</strong>
          </div>
          <div className="highlight-panel">
            <span>Remote 1</span>
            <strong>Pessoas</strong>
          </div>
          <div className="highlight-panel">
            <span>Remote 2</span>
            <strong>Documentos</strong>
          </div>
          <div className="highlight-panel">
            <span>Dados</span>
            <strong>BFF ou mocks controlados por ambiente</strong>
          </div>
        </div>
      </section>

      <section id="arquitetura" className="card-grid">
        <article className="surface-card">
          <p className="eyebrow">Professor espera</p>
          <h2>React + Module Federation</h2>
          <p>
            A shell carrega modulos remotos em runtime e cada funcionalidade pode ter ciclo de deploy
            proprio.
          </p>
        </article>

        <article className="surface-card">
          <p className="eyebrow">Consumo de APIs</p>
          <h2>Somente via BFF</h2>
          <p>
            O frontend foi preparado para usar `/aggregated-data`, `/people` e `/documents` do BFF. Nada
            acessa microservices diretamente.
          </p>
        </article>

        <article className="surface-card">
          <p className="eyebrow">Reaproveitamento</p>
          <h2>Base visual do sistema atual</h2>
          <p>
            Mantivemos a ideia do produto de RH, mas agora com separacao por dominio para atender a
            atividade.
          </p>
        </article>
      </section>
    </div>
  )
}
