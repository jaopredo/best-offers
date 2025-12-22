import AlertStoreInterface, { Listener } from "@/types/alerts/"

class ErrorStore implements AlertStoreInterface {
    data = new Map<number, string>()
    listeners = new Set<Listener>()

    set(message: string) {
        // Eu sempre assinalo um id pra mensagem
        // que é a quantidade de elementos anterior
        // a sua entrada
        const id = this.data.size
        this.data.set(id, message)
        setTimeout(() => {
            this.delete(id)
        }, 5000)
        this.emit()
    }

    delete(id: number) {
        this.data.delete(id)
        this.emit()
    }

    get(id: number) {
        return this.data.get(id)
    }

    onChange(listener: Listener) {
        this.listeners.add(listener)  // Adiciono o listener dentro do meu conjunto
        return () => this.listeners.delete(listener)  // Retorno uma função que deleta meu listener
    }

    private emit() {
        // Ativo todos os meus listeners
        for (const listener of this.listeners) listener()
    }
}

const ErrorStoreManager = new ErrorStore

export default ErrorStoreManager
