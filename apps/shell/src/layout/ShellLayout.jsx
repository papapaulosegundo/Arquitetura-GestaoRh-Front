import { NavLink, Outlet, useLocation } from 'react-router-dom'

const navItems = [
  { to: '/overview', label: 'Visão Geral', description: 'Painel administrativo integrado' },
  { to: '/people', label: 'Colaboradores', description: 'Gestão de cadastro e setores' },
  { to: '/documents', label: 'Documentos', description: 'Contratos e assinaturas digitais' },
  { to: '/settings', label: 'Configurações', description: 'Parâmetros e conexões' },
]

const pageMeta = {
  '/overview': {
    title: 'Visão Geral',
    subtitle: 'Acompanhamento integrado de colaboradores e fluxos de documentos.',
  },
  '/people': {
    title: 'Gestão de Colaboradores',
    subtitle: 'Registro operacional de funcionários, cargos e setores da empresa.',
  },
  '/documents': {
    title: 'Contratos e Documentos',
    subtitle: 'Controle de validade, envios e status de assinaturas.',
  },
  '/settings': {
    title: 'Configurações do Sistema',
    subtitle: 'Parametrização de variáveis globais e conexões com microserviços.',
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
            <strong>GestãoRH</strong>
            <span>Portal Corporativo</span>
          </div>
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

        <div className="shell-sidebar-profile">
          <div className="shell-profile-avatar">AD</div>
          <div className="shell-profile-info">
            <strong>Administrador</strong>
            <span>Gestor do Sistema</span>
          </div>
        </div>
      </aside>

      <div className="shell-content">
        <header className="shell-topbar">
          <div>
            <p className="eyebrow">GestãoRH Console</p>
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
