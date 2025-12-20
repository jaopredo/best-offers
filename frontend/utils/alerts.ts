import AlertStoreInterface from "@/types/alerts"

export function alertSetup(message: string|string[], alertManager: AlertStoreInterface) {
    if (Array.isArray(message)) {
        for (let msg of message) {
            alertManager.set(msg)
        }
    } else {
        alertManager.set(message)
    }
}
