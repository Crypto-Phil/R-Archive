import 'tailwindcss/tailwind.css'
import 'css/tailwind.css'
import * as React from 'react'
import ReactDOM from 'react-dom'
import { App } from 'app'
import { ArweaveProvider } from 'context/arweave'

import { QueryClientProvider, QueryClient } from 'react-query'
import { AuthProvider } from 'context/auth-context'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

const queryKeys = {
  arweave: 'arweave',
}

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <ArweaveProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ArweaveProvider>
  </QueryClientProvider>,
  document.getElementById('App'),
)

export { queryKeys, queryClient }
