import { Component, lazy, Suspense, useMemo } from 'react'

function RemoteFallback({ scope }) {
  return (
    <section className="card-grid single">
      <article className="surface-card">
        <p className="eyebrow">Carregando remote</p>
        <h2>{scope}</h2>
        <p>A shell esta buscando o bundle remoto publicado pelo microfrontend.</p>
      </article>
    </section>
  )
}

class RemoteErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    const { error } = this.state
    const { scope, remoteUrl } = this.props

    if (error) {
      return (
        <section className="card-grid single">
          <article className="surface-card">
            <p className="eyebrow">Falha ao carregar remote</p>
            <h2>{scope}</h2>
            <p>O microfrontend remoto nao respondeu como esperado.</p>
            <p>
              Verifique se o remote esta rodando e se a URL <code>{remoteUrl}</code> abre no navegador.
            </p>
            <p>
              Se a porta estiver ocupada, o Vite agora falha no startup em vez de trocar de porta
              silenciosamente.
            </p>
          </article>
        </section>
      )
    }

    return this.props.children
  }
}

export default function RemoteMount({ importRemote, scope, remoteUrl }) {
  const RemoteApp = useMemo(() => lazy(importRemote), [importRemote])

  return (
    <RemoteErrorBoundary scope={scope} remoteUrl={remoteUrl}>
      <Suspense fallback={<RemoteFallback scope={scope} />}>
        <RemoteApp />
      </Suspense>
    </RemoteErrorBoundary>
  )
}
