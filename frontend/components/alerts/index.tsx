'use client'
import { useState, useEffect } from "react"
import { motion } from "motion/react"

import ErrorStoreManager from "@/alerts/errors"
import SuccessStoreManager from "@/alerts/successes"

/* COMPONENTES */
import { IoIosCloseCircle } from "react-icons/io"

/* TEMAS */
import { useThemeContext } from "@/context/theme"


export default function Alerts() {
    // State de erros e sucessos
    const [errors, setErrors] = useState<Map<number, string>>(new Map())
    const [successes, setSuccesses] = useState<Map<number, string>>(new Map())

    // Tema atual
    const { theme } = useThemeContext()

    useEffect(() => {
        // No meu effect eu crio uma função update que, sempre que ela
        // é executada, significa que meus erros foram atualizados, então
        // eu vou atualizar o meu estado de erros com ela
        const update = () => {
            setErrors(new Map(ErrorStoreManager.data))
        }

        const revoke = ErrorStoreManager.onChange(update)
        return () => {
            // Se meu componenete desmonsta, eu vou eliminar os meus listeners atuais
            revoke()
        }
    }, [])

    useEffect(() => {
        const update = () => {
            setSuccesses(new Map(SuccessStoreManager.data))
        }

        const revoke = SuccessStoreManager.onChange(update)
        return () => {
            // Se meu componenete desmonsta, eu vou eliminar os meus listeners atuais
            revoke()
        }
    }, [])

    return <>
        <motion.div className={`fixed top-15 right-0 w-[30vw] rounded-sm p-2 flex flex-col gap-3 text-sm ${
            theme == 'light' ?
                'bg-rose-200 rounded-tr-none rounded-br-none text-rose-900' :
                'bg-rose-950/80 border-[0.1px] border-r-0 rounded-tr-none rounded-br-none border-red-900/95 text-rose-300'
        }`}
            initial={{
                translateX: '100%'
            }}
            animate={{
                translateX: errors.size != 0 ? '10%' : '100%'
            }}
        >
            <div className="flex items-center gap-4">
                <IoIosCloseCircle className="text-xl text-rose-500" />
                <p className="font-bold w-[90%]">Você teve {errors.size} erro(s) na aplicação</p>
            </div>
            {errors.size != 0 && <ul className="list-disc w-[90%] flex flex-col">
                {[...errors.entries()].map(([key, msg]) => (
                    <li key={key} className={`ml-15 ${theme == 'light' && 'text-rose-700'}`}>{msg}</li>
                ))}
            </ul> }
        </motion.div>

        <motion.div className={`fixed top-40 right-0 w-[30vw] rounded-sm p-2 flex flex-col gap-3 text-sm ${
            theme == 'light' ?
                'bg-emerald-200 rounded-tr-none rounded-br-none text-emerald-900' :
                'bg-emerald-950/80 border-[0.1px] border-r-0 rounded-tr-none rounded-br-none border-emerald-900/95 text-emerald-300'
        }`}
            initial={{
                translateX: '100%'
            }}
            animate={{
                translateX: successes.size != 0 ? '10%' : '100%'
            }}
        >
            <div className="flex items-center gap-4">
                <IoIosCloseCircle className="text-xl text-emerald-500" />
                <p className="font-bold w-[90%]">{successes.size} operação(ões) bem sucedida(s)</p>
            </div>
            {successes.size != 0 && <ul className="list-disc w-[90%] flex flex-col">
                {[...successes.entries()].map(([key, msg]) => (
                    <li key={key} className={`ml-15 ${theme == 'light' && 'text-emerald-700'}`}>{msg}</li>
                ))}
            </ul> }
        </motion.div>
    </>
}