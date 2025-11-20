import * as React from "react"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000 // Effectively infinite until dismissed or replaced

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

const toastStore = {
  toasts: [],
  addToast: (toast) => {
    toastStore.toasts = [...toastStore.toasts, { id: genId(), ...toast }]
    if (toastStore.toasts.length > TOAST_LIMIT) {
      toastStore.toasts = toastStore.toasts.slice(toastStore.toasts.length - TOAST_LIMIT)
    }
    toastStore.listeners.forEach((listener) => listener(toastStore.toasts))
  },
  removeToast: (id) => {
    toastStore.toasts = toastStore.toasts.filter((toast) => toast.id !== id)
    toastStore.listeners.forEach((listener) => listener(toastStore.toasts))
  },
  updateToast: (id, update) => {
    toastStore.toasts = toastStore.toasts.map((toast) =>
      toast.id === id ? { ...toast, ...update } : toast
    )
    toastStore.listeners.forEach((listener) => listener(toastStore.toasts))
  },
  listeners: new Set(),
  subscribe: (listener) => {
    toastStore.listeners.add(listener)
    return () => toastStore.listeners.delete(listener)
  },
  getState: () => toastStore.toasts,
}

function useToast() {
  const [toasts, setToasts] = React.useState(toastStore.getState())

  React.useEffect(() => {
    return toastStore.subscribe(setToasts)
  }, [])

  function toast({ ...props }) {
    const id = genId()
    const dismiss = () => toastStore.removeToast(id)

    toastStore.addToast({
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) {
          dismiss()
        }
      },
    })

    return {
      id: id,
      dismiss,
      update: (props) => toastStore.updateToast(id, props),
    }
  }

  return {
    toasts,
    toast,
  }
}

export { useToast, toastStore }