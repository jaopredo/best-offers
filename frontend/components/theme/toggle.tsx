'use client'
import { useEffect, useState } from "react"
import { useThemeContext } from "@/context/theme"
import { motion } from 'motion/react'

/* COMPONENETES */
import { IoSunny } from "react-icons/io5"
import { AiFillMoon } from "react-icons/ai"

/**
 * Componente de Toggle para alteração do tema pelo usuário
 */
export default function ToggleTheme({ className }: { className?: string }) {
    const { theme, setTheme } = useThemeContext()
    const [ isOn, setIsOn ] = useState<boolean>( theme == 'light' )

    useEffect(() => {
        if (isOn) { setTheme('light') } else { setTheme('dark') }
    }, [ isOn ])

    return <button
        className={`w-11 h-6 p-1 rounded-2xl transition-colors ${
            theme == 'light' ?  'bg-yellow-200':
                                'bg-cyan-800'
        } flex items-center ${className || ''}`}

        style={{
            justifyContent: 'flex-' + (isOn ? 'start' : 'end')
        }}

        onClick={() => setIsOn(!isOn)}
    >
        <motion.div
            layout
            transition={{
                type: "spring",
                visualDuration: 0.2,
                bounce: 0.2,
            }}
            className={`flex items-center justify-center w-5 h-5 rounded-4xl transition-colors ${
                theme == 'light' ?  'bg-amber-400':
                                    'bg-cyan-500'
        }`}>
            { theme == 'light' && <IoSunny className="text-white"/> }
            { theme == 'dark' && <AiFillMoon className="text-white"/> }
        </motion.div>
    </button>
}
