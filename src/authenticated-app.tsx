import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Logo from 'assets/r-archive-menu-logo.jpg'
import LogoutIcon from 'assets/logout-icon.svg'
import UserIcon from 'assets/user-icon.svg'
import { DocumentsScreen } from 'screens/documents'
import { useAuth, useLogout } from 'context/auth-context'
import clsx from 'clsx'
import { UpdateMetaData } from 'screens/update-meta-data'

function AuthenticatedApp() {
  const {
    state: { address },
  } = useAuth()
  const logout = useLogout()
  const [showAddress, setShowAddress] = React.useState(false)

  return (
    <Router>
      <div className="content-container bg-gray-100 rounded shadow-lg">
        <div className="bg-white flex items-center justify-between px-8 py-4">
          <div>
            <Link to="/">
              <img className="w-40" src={Logo} alt="R-Archive logo" />
            </Link>
          </div>
          <div className="flex items-center">
            <p className={clsx('mr-2 text-gray-600', showAddress ? '' : 'invisible')}>Address - {address}</p>
            <UserIcon
              onClick={() => setShowAddress(!showAddress)}
              className="transition duration-500 ease-in-out w-8 h-8 text-gray-600 hover:cursor-pointer transform hover:-translate-y-1 hover:scale-110"
            />
            <LogoutIcon
              onClick={logout}
              className="ml-1 transition duration-500 ease-in-out w-8 h-8 text-gray-600 hover:cursor-pointer transform hover:-translate-y-1 hover:scale-110"
            />
          </div>
        </div>
        <AppRoutes />
      </div>
    </Router>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/dashboard" element={<DocumentsScreen />} />
      <Route path="/update-meta-data" element={<UpdateMetaData />} />
      <Route path="*" element={<DocumentsScreen />} />
    </Routes>
  )
}

export { AuthenticatedApp }
