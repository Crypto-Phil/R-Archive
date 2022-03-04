import React, { Fragment, useState, useContext } from 'react'
import { Dialog, Transition } from '@headlessui/react'

type ModalContextType = [boolean, React.Dispatch<React.SetStateAction<boolean>>]

const ModalContext = React.createContext<ModalContextType>(null as unknown as ModalContextType)

interface CallBack<Params extends unknown[]> {
  (...args: Params): void
}
const callAll =
  <Params extends unknown[]>(...fns: Array<CallBack<Params> | undefined>) =>
  (...args: Params) =>
    fns.forEach(fn => typeof fn === 'function' && fn(...args))

function ModalDismissButton({ children: child }: { children: React.ReactNode }) {
  const [, setOpen] = useContext(ModalContext)

  if (React.isValidElement(child)) {
    return React.cloneElement(child, { onClick: callAll(() => setOpen(false), child.props.onClick) })
  }

  return <Fragment>{child}</Fragment>
}

function ModalOpenButton({ children: child, onClick }: { children: React.ReactNode; onClick?: CallBack<unknown[]> }) {
  const [, setOpen] = useContext(ModalContext)

  if (React.isValidElement(child)) {
    return React.cloneElement(child, {
      onClick: callAll(() => setOpen(true), child.props.onClick, onClick),
    })
  }

  return <Fragment>{child}</Fragment>
}

interface ModalProps {
  children?: React.ReactNode
  title?: string
}

function Modal(props: ModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  return <ModalContext.Provider value={[isOpen, setIsOpen]} {...props} />
}

function ModalContentsBase({ children }: ModalProps) {
  const [isOpen, setIsOpen] = useContext(ModalContext)

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={setIsOpen}>
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white px-8 py:10 sm:py-10">{children}</div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

function ModalContents({ title, children }: ModalProps) {
  return (
    <ModalContentsBase>
      <div className="flex justify-end">
        <ModalDismissButton>
          <button>
            <span aria-hidden>X</span>
          </button>
        </ModalDismissButton>
      </div>
      <Dialog.Title as="h3" className="text-2xl leading-6 font-semibold pb-4 text-gray-900">
        {title}
      </Dialog.Title>
      {children}
    </ModalContentsBase>
  )
}

export { Modal, ModalContentsBase, ModalContents, ModalOpenButton, ModalDismissButton }
