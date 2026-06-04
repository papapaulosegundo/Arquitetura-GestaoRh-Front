import { NavLink, Outlet, useLocation } from 'react-router-dom'

const navItems = [
  { to: '/overview', label: 'Visao geral', description: 'Endpoint agregado do BFF' },
  { to: '/people', label: 'Pessoas', description: 'Microfrontend remoto 1' },
  { to: '/documents', label: 'Documentos', description: 'Microfrontend remoto 2' },
  { to: '/settings', label: 'Arquitetura', description: 'Guia da entrega' },
]

const pageMeta = {
  '/overview': {
    title: 'Shell de RH',
    subtitle: 'SPA host que orquestra os microfrontends e centraliza o acesso ao BFF.',
  },
  '/people': {
    title: 'Dominio Pessoas',
    subtitle: 'Remote independente preparado para consumir o BFF de funcionarios.',
  },
  '/documents': {
    title: 'Dominio Documentos',
    subtitle: 'Remote independente preparado para consumir o BFF de documentos.',
  },
  '/settings': {
    title: 'Guia da Arquitetura',
    subtitle: 'Checklist da atividade e orientacoes para execucao local.',
  },
}

export default function ShellLayout() {
  const location = useLocation()
  const currentPage =
    Object.entries(pageMeta).find(([path]) => location.pathname.startsWith(path))?.[1] ?? pageMeta['/overview']

  return (
    <div className="shell-layout">
      <aside className="shell-sidebar">
        <div className="shell-brand">
          <div className="shell-brand-mark">RH</div>
          <div>
            <strong>GestaoRH MFE</strong>
            <span>Shell + Module Federation</span>
          </div>
        </div>

        <div className="shell-panel">
          <p className="eyebrow">Fluxo da entrega</p>
          <h2>Frontend desacoplado do backend</h2>
          <p>
            A shell fala somente com endpoints do BFF e carrega duas funcionalidades de negocio como
            microfrontends independentes.
          </p>
        </div>

        <nav className="shell-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `shell-nav-item${isActive ? ' active' : ''}`}
            >
              <strong>{item.label}</strong>
              <span>{item.description}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="shell-content">
        <header className="shell-topbar">
          <div>
            <p className="eyebrow">Microfrontend em React</p>
            <h1>{currentPage.title}</h1>
          </div>
          <p>{currentPage.subtitle}</p>
        </header>

        <main className="shell-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
