import { Navigate, Route, Routes } from 'react-router-dom'
import ShellLayout from './layout/ShellLayout'
import RemoteMount from './layout/RemoteMount'
import LandingPage from './pages/LandingPage'
import OverviewPage from './pages/OverviewPage'
import SettingsPage from './pages/SettingsPage'

const peopleRemoteUrl = import.meta.env.VITE_REMOTE_PEOPLE_URL ?? 'http://localhost:4183/assets/remoteEntry.js'
const documentsRemoteUrl = import.meta.env.VITE_REMOTE_DOCUMENTS_URL ?? 'http://localhost:4184/assets/remoteEntry.js'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<ShellLayout />}>
        <Route path="/overview" element={<OverviewPage />} />
        <Route
          path="/people/*"
          element={
            <RemoteMount
              scope="Pessoas"
              remoteUrl={peopleRemoteUrl}
              importRemote={() => import('mfePeople/PeopleApp')}
            />
          }
        />
        <Route
          path="/documents/*"
          element={
            <RemoteMount
              scope="Documentos"
              remoteUrl={documentsRemoteUrl}
              importRemote={() => import('mfeDocuments/DocumentsApp')}
            />
          }
        />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
