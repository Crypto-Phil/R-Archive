import React from 'react'
import Arweave from 'arweave'

async function bootstrapArweave() {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const timeout = +process.env.ARWEAVE_TIMEOUT!
  const arweave = Arweave.init({
    host: process.env.ARWEAVE_HOST,
    port: process.env.ARWEAVE_PORT,
    protocol: process.env.ARWEAVE_PROTOCOL,
    timeout: timeout || 20_000,
  })

  return arweave
}

type ArweaveContextType = [Arweave, React.Dispatch<React.SetStateAction<Arweave>>]

const ArweaveContext = React.createContext(null as unknown as ArweaveContextType)

interface ArweaveProviderProps {
  children?: React.ReactNode
}

function ArweaveProvider(props: ArweaveProviderProps) {
  const [arweave, setArweave] = React.useState(null as unknown as Arweave)

  React.useEffect(() => {
    bootstrapArweave().then(result => {
      setArweave(result)
    })
  }, [setArweave])

  if (arweave === null) {
    // TODO Full page Loader screen
    return null
  }

  return <ArweaveContext.Provider value={[arweave, setArweave]} {...props} />
}

function useArweave() {
  const context = React.useContext(ArweaveContext)
  if (!context) {
    throw new Error('useArweave must be used within ArweaveContextProvider')
  }

  return context
}

export { ArweaveProvider, useArweave }
