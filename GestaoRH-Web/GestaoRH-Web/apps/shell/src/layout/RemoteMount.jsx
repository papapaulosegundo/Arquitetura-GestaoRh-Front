import { lazy, Suspense, useMemo } from 'react'

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

export default function RemoteMount({ importRemote, scope }) {
  const RemoteApp = useMemo(() => lazy(importRemote), [importRemote])

  return (
    <Suspense fallback={<RemoteFallback scope={scope} />}>
      <RemoteApp />
    </Suspense>
  )
}
