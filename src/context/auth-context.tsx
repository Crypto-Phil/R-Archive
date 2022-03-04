import { JWKInterface } from 'arweave/node/lib/wallet'
import React from 'react'
import { useArweave } from 'context/arweave'

type Action =
  | { type: 'addPrivateKey'; payload: JWKInterface }
  | { type: 'addAddress'; payload: string }
  | { type: 'logout' }
  | { type: 'addDrive'; payload: { driveId: string; driveKey: Buffer } }
type Dispatch = (action: Action) => void
type State = { privateKey: JWKInterface; address: string; drive?: { [id: string]: Buffer } }

const AuthContext = React.createContext<{ state: State; dispatch: Dispatch } | undefined>(undefined)

function authReducer(state: State, action: Action) {
  switch (action.type) {
    case 'addPrivateKey': {
      return {
        ...state,
        privateKey: action.payload,
      }
    }
    case 'addAddress': {
      return {
        ...state,
        address: action.payload,
      }
    }
    case 'logout': {
      return {
        address: '',
        privateKey: '' as unknown as JWKInterface,
      }
    }
    case 'addDrive': {
      return {
        ...state,
        drive: {
          ...state.drive,
          [action.payload.driveId]: action.payload.driveKey,
        },
      }
    }
    default: {
      const x: never = action
      return x
    }
  }
}

function useAuth() {
  const context = React.useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

function useLogin() {
  const { dispatch } = useAuth()
  const [arweave] = useArweave()

  return (jsonPrivateKey: JWKInterface) => {
    dispatch({ type: 'addPrivateKey', payload: jsonPrivateKey as JWKInterface })
    window.sessionStorage.setItem('archiveKey', JSON.stringify(jsonPrivateKey))
    arweave.wallets.jwkToAddress(jsonPrivateKey).then(address => {
      window.sessionStorage.setItem('archiveAddress', address)
      dispatch({ type: 'addAddress', payload: address })
    })
  }
}

function useLogout() {
  const { dispatch } = useAuth()

  return () => {
    window.sessionStorage.setItem('archiveKey', '')
    dispatch({ type: 'logout' })
  }
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(authReducer, {
    privateKey: '' as unknown as JWKInterface,
    address: '',
  })

  const value = { state, dispatch }

  React.useEffect(() => {
    const privateKey = window.sessionStorage.getItem('archiveKey')
    const address = window.sessionStorage.getItem('archiveAddress')
    if (privateKey && address) {
      dispatch({ type: 'addPrivateKey', payload: JSON.parse(privateKey) as JWKInterface })
      dispatch({ type: 'addAddress', payload: address })
    }
  }, [dispatch])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthContext, useAuth, authReducer, AuthProvider, useLogin, useLogout }
