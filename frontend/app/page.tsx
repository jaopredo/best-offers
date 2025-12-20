'use client'
import ErrorStoreManager from "@/alerts/errors";
import SuccessStoreManager from "@/alerts/successes";
import { useAPIContext } from "@/context/api"

export default function Home() {
    const { authService } = useAPIContext()

    function create() {
        ErrorStoreManager.set('lalalalalala')
        SuccessStoreManager.set('lalalalalala')
    }

    return (
        <div>
            <main>
                <button onClick={() => create()}>CRIAR USUÁRIO</button>
            </main>
        </div>
    );
}
