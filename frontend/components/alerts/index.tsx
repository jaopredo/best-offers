'use client'
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"

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

    return <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex flex-col gap-2 w-[90%] md:w-[30vw]">
        <AnimatePresence>
            {errors.size != 0 && <motion.div className={`rounded-sm p-2 flex flex-col gap-3 text-sm ${
                theme == 'light' ?
                    'bg-rose-200 text-rose-900' :
                    'bg-rose-950/80 border-[0.1px] border-r-0 border-red-900/95 text-rose-300'
            }`}
                initial={{
                    translateY: '0%',
                    opacity: 0
                }}
                animate={{
                    translateY: '-10%',
                    opacity: 1
                }}
                exit={{
                    opacity: 0,
                    translateY: '0%'
                }}
            >
                <div className="flex items-center gap-4">
                    <IoIosCloseCircle className="text-xl text-rose-500" />
                    <p className="font-bold w-[90%]">Você teve {errors.size} erro(s) na aplicação</p>
                </div>
                <ul className="list-disc w-[90%] flex flex-col">
                    {[...errors.entries()].map(([key, msg]) => (
                        <li key={key} className={`ml-15 ${theme == 'light' && 'text-rose-700'}`}>{msg}</li>
                    ))}
                </ul>
            </motion.div>}
        </AnimatePresence>
        
        <AnimatePresence>
            {successes.size != 0 && <motion.div className={`rounded-sm p-2 flex flex-col gap-3 text-sm ${
                theme == 'light' ?
                    'bg-emerald-200 text-emerald-900' :
                    'bg-emerald-950/80 border-[0.1px] border-r-0 border-emerald-900/95 text-emerald-300'
            }`}
                initial={{
                    translateY: '0%',
                    opacity: 0
                }}
                animate={{
                    translateY: '-10%',
                    opacity: 1
                }}
                exit={{
                    opacity: 0,
                    translateY: '0%'
                }}
            >
                <div className="flex items-center gap-4">
                    <IoIosCloseCircle className="text-xl text-emerald-500" />
                    <p className="font-bold w-[90%]">{successes.size} operação(ões) bem sucedida(s)</p>
                </div>
                <ul className="list-disc w-[90%] flex flex-col">
                    {[...successes.entries()].map(([key, msg]) => (
                        <li key={key} className={`ml-15 ${theme == 'light' && 'text-emerald-700'}`}>{msg}</li>
                    ))}
                </ul>
            </motion.div>}
        </AnimatePresence>
    </div>
}