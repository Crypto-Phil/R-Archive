import React from 'react'
import LogoIcon from 'assets/r-archive-logo.png'
import { PrivateKeyUpload } from 'components/private-key-upload'
import { LoginForm } from 'components/login-form'
import { JWKInterface } from 'arweave/node/lib/wallet'
import { useAuth, useLogin } from 'context/auth-context'

function UnauthenticatedApp() {
  const {
    state: { privateKey },
  } = useAuth()
  const login = useLogin()

  const handleSubmit = (d: { privateKey: FileList }) => {
    const reader = new FileReader()
    reader.onload = function (event) {
      const privateKey = event?.target?.result
      const jsonPrivateKey: JWKInterface = JSON.parse(`${privateKey}`)
      login(jsonPrivateKey)
    }
    reader.readAsText(d.privateKey[0])
  }

  return (
    <div className="flex items-center flex-col">
      <img src={LogoIcon} alt="r-archive logo" />
      <div className="mt-8">
        {privateKey ? (
          <React.Fragment>
            <h1 className="pt-6 text-3xl font-bold max-w-sm text-center">
              Welcome, at decentralized, permanent R-Archive!
            </h1>
            <h4 className="py-6 text-sm text-center"> Please provide your username and password.</h4>
            <div className="mx-auto flex justify-center mt-4 px-4">
              <LoginForm
                onSubmit={() => {
                  // TODO AUTHENTICATE USER - Use login - password pair for encryption later
                }}
              />
            </div>
          </React.Fragment>
        ) : (
          <div className="text-center">
            <h1 className="pt-6 text-3xl font-semibold"> Welcome to R-Archive! </h1>
            <h4 className="pt-6 text-sm"> Please upload your key file to log in:</h4>
            <PrivateKeyUpload onSubmit={handleSubmit} />
          </div>
        )}
      </div>
    </div>
  )
}

export { UnauthenticatedApp }
