import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="landing-page">
      <div className="landing-card">
        <section className="landing-copy">
          <p className="eyebrow">Portal Administrativo</p>
          <h1>GestãoRH Inteligente</h1>
          <p>
            Plataforma centralizada para gestão de pessoas, contratos digitais e monitoramento de fluxos de trabalho. 
            Desenvolvido sob uma arquitetura de microfrontends moderna, garantindo escalabilidade, segurança e alta disponibilidade.
          </p>
          <div className="landing-actions">
            <Link to="/overview" className="landing-primary-btn">
              Entrar no Sistema
            </Link>
          </div>
        </section>

        <section className="landing-features">
          <article className="landing-feat-item">
            <div className="landing-feat-icon">📊</div>
            <div className="landing-feat-text">
              <strong>Visão Geral Centralizada</strong>
              <p>Métricas integradas e logs de eventos do sistema agregados em tempo real.</p>
            </div>
          </article>

          <article className="landing-feat-item">
            <div className="landing-feat-icon">👥</div>
            <div className="landing-feat-text">
              <strong>Gestão de Colaboradores</strong>
              <p>Controle operacional de setores, funções e cadastros via Azure SQL.</p>
            </div>
          </article>

          <article className="landing-feat-item">
            <div className="landing-feat-icon">📄</div>
            <div className="landing-feat-text">
              <strong>Gestão de Documentos</strong>
              <p>Controle de contratos, assinaturas pendentes e anexos via MongoDB Atlas.</p>
            </div>
          </article>
        </section>
      </div>
    </div>
  )
}
