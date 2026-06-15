import { isMockMode } from '@gestao-rh/shared'

export default function SettingsPage() {
  const bffUrl = import.meta.env.VITE_BFF_BASE_URL ?? 'http://localhost:8080'

  return (
    <section className="card-grid">
      <article className="surface-card" style={{ gridColumn: 'span 2' }}>
        <h2>Configurações do Ambiente</h2>
        <p style={{ marginBottom: '20px' }}>
          Visualize o status das conexões do front-end com o ecossistema de microserviços e BFF da plataforma.
        </p>

        <div className="stack-lg" style={{ gap: '16px' }}>
          <div className="feedback-card" style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <strong>URL Base do BFF:</strong>
              <code style={{ background: '#ffffff', padding: '2px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                {bffUrl}
              </code>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>Modo de Simulação (Mocks):</strong>
              <span className={`status-pill small ${isMockMode ? 'warn' : ''}`}>
                {isMockMode ? 'Simulação Ativa' : 'Integração Direta'}
              </span>
            </div>
          </div>
        </div>
      </article>

      <article className="surface-card">
        <h2>Downstream Relacional (SQL)</h2>
        <p style={{ marginBottom: '14px', fontSize: '0.85rem' }}>
          Responsável pelo domínio de Pessoas e Organizações, hospedado no Azure SQL Database.
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status de Comunicação</span>
          <span className="status-pill small">Operacional</span>
        </div>
      </article>

      <article className="surface-card">
        <h2>Downstream NoSQL (MongoDB)</h2>
        <p style={{ marginBottom: '14px', fontSize: '0.85rem' }}>
          Responsável pelo armazenamento de contratos estruturados e metadados no MongoDB Atlas.
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status de Comunicação</span>
          <span className="status-pill small">Operacional</span>
        </div>
      </article>

      <article className="surface-card">
        <h2>Provedor de Funções (Serveless)</h2>
        <p style={{ marginBottom: '14px', fontSize: '0.85rem' }}>
          Fornece alertas inteligentes baseados em regras de negócio no Azure Functions.
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status de Comunicação</span>
          <span className="status-pill small">Operacional</span>
        </div>
      </article>
    </section>
  )
}
