import { useAuth } from 'context/auth-context'
import { deriveDriveKey as cryptoDeriveDriveKey } from 'utils/crypto'

function useDriveKey() {
  const { state, dispatch } = useAuth()

  return async (password: string, driveId: string) => {
    if (state.drive && state.drive[driveId]) {
      return state.drive[driveId]
    }
    const driveKey = await cryptoDeriveDriveKey(password, driveId, JSON.stringify(state.privateKey))
    dispatch({ type: 'addDrive', payload: { driveId, driveKey } })

    return driveKey
  }
}

export { useDriveKey }
