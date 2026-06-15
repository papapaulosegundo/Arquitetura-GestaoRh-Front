import { isMockMode } from '@gestao-rh/shared'

export default function SettingsPage() {
  const bffUrl = import.meta.env.VITE_BFF_BASE_URL ?? 'http://localhost:8080'
  const apiPrefix = import.meta.env.VITE_BFF_API_PREFIX ?? ''
  const peopleRemoteUrl = import.meta.env.VITE_REMOTE_PEOPLE_URL ?? 'http://localhost:4183/assets/remoteEntry.js'
  const documentsRemoteUrl = import.meta.env.VITE_REMOTE_DOCUMENTS_URL ?? 'http://localhost:4184/assets/remoteEntry.js'

  return (
    <section className="card-grid">
      <article className="surface-card" style={{ gridColumn: 'span 2' }}>
        <h2>Configuracoes do Ambiente</h2>
        <p style={{ marginBottom: '20px' }}>
          Esta tela mostra a configuracao atual do frontend para a demonstracao da arquitetura.
        </p>

        <div className="stack-lg" style={{ gap: '16px' }}>
          <div className="feedback-card" style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <strong>URL Base do BFF:</strong>
              <code style={{ background: '#ffffff', padding: '2px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                {bffUrl}
              </code>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <strong>Prefixo publico da API:</strong>
              <code style={{ background: '#ffffff', padding: '2px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                {apiPrefix || '(sem prefixo)'}
              </code>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>Modo de Mocks no Front:</strong>
              <span className={`status-pill small ${isMockMode ? 'warn' : ''}`}>
                {isMockMode ? 'Ativo' : 'Desligado'}
              </span>
            </div>
          </div>

          <div className="feedback-card" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <strong>Remote People:</strong>
              <code style={{ background: '#ffffff', padding: '2px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                {peopleRemoteUrl}
              </code>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>Remote Documents:</strong>
              <code style={{ background: '#ffffff', padding: '2px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                {documentsRemoteUrl}
              </code>
            </div>
          </div>

          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            O frontend nao executa health checks reais nesta tela. A validacao do fluxo deve ser feita
            pelas paginas `/overview`, `/people`, `/documents` e pela aba `Network` do navegador.
          </p>
        </div>
      </article>

      <article className="surface-card">
        <h2>Downstream Relacional</h2>
        <p style={{ marginBottom: '14px', fontSize: '0.85rem' }}>
          Dominio de pessoas consumido pelo frontend apenas via BFF.
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Rota publica esperada</span>
          <span className="status-pill small">/people</span>
        </div>
      </article>

      <article className="surface-card">
        <h2>Downstream NoSQL</h2>
        <p style={{ marginBottom: '14px', fontSize: '0.85rem' }}>
          Dominio de documentos consumido pelo frontend apenas via BFF.
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Rota publica esperada</span>
          <span className="status-pill small">/documents</span>
        </div>
      </article>

      <article className="surface-card">
        <h2>Function e Agregacao</h2>
        <p style={{ marginBottom: '14px', fontSize: '0.85rem' }}>
          Os insights da visao geral chegam ao frontend pelo endpoint agregado do BFF.
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Rota publica esperada</span>
          <span className="status-pill small">/aggregated-data</span>
        </div>
        <p style={{ marginTop: '14px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Se o BFF estiver com `UseFunctionMocks=true`, a shell continua funcionando, mas os insights nao
          estarao vindo da Azure Function real.
        </p>
      </article>
    </section>
  )
}
