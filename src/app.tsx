import * as React from 'react'
import { UnauthenticatedApp } from 'unauthenticated-app'
import { AuthenticatedApp } from 'authenticated-app'
import { useAuth } from 'context/auth-context'

function App() {
  const {
    state: { privateKey },
  } = useAuth()

  return <main className="container mx-auto pt-16">{privateKey ? <AuthenticatedApp /> : <UnauthenticatedApp />}</main>
}

export { App }
