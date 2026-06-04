import { Navigate, Route, Routes } from 'react-router-dom'
import ShellLayout from './layout/ShellLayout'
import RemoteMount from './layout/RemoteMount'
import LandingPage from './pages/LandingPage'
import OverviewPage from './pages/OverviewPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<ShellLayout />}>
        <Route path="/overview" element={<OverviewPage />} />
        <Route
          path="/people/*"
          element={<RemoteMount scope="Pessoas" importRemote={() => import('mfePeople/PeopleApp')} />}
        />
        <Route
          path="/documents/*"
          element={<RemoteMount scope="Documentos" importRemote={() => import('mfeDocuments/DocumentsApp')} />}
        />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
