'use client'
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from 'motion/react'

/* CONTEXTOS */
import { useThemeContext } from "@/context/theme"

/**
 * Página de novo usuário
 */
export default function NewUser() {
    // Router
    const router = useRouter()

    // Pegando o tema da aplicação
    const { theme } = useThemeContext()

    return <main className={`w-screen h-screen flex flex-col items-center justify-center transition-colors overflow-hidden ${theme == 'light' ? 'bg-stone-300' : 'bg-[#10161F]'}`}>
        {
            theme == 'light' ?
                <Image
                    src='/software-blue.svg'
                    alt="Storyset Computer"
                    width={300}
                    height={300}
                />
            :
                <Image
                    src='/software-white.svg'
                    alt="Storyset Computer"
                    width={300}
                    height={300}
                />
        }

        <h1 className={`text-4xl text-center font-bold
            ${theme == 'light' ?
                'text-[#005E9B]'
                :
                'text-white'
            }
        `}>BEM-VINDO AO SCRAPPER!</h1>

        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-center gap-2 mt-4 w-[50%] md:w-fit">
            <Link href={'/register'}>
                <motion.button
                    type="submit"
                    className={`
                        transition-colors
                        text-white
                        p-2
                        rounded-md
                        hover:cursor-pointer
                        flex
                        gap-2
                        items-center
                        justify-center
                        disabled:hover:cursor-auto
                        w-full
                        font-bold

                        ${theme == 'light' ?
                            'bg-[#004E81] hover:bg-[#005E9B] active:bg-[#003558] disabled:bg-blue-400':
                            'bg-sky-400 hover:bg-sky-500 active:bg-sky-600 disabled:bg-sky-200'
                        }
                    `}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: .95 }}
                >
                    REGISTRAR
                </motion.button>
            </Link>
            <Link href={'/login'}>
                <motion.button
                    type="submit"
                    className={`
                        transition-colors
                        text-white
                        p-2
                        rounded-md
                        hover:cursor-pointer
                        flex
                        gap-2
                        items-center
                        justify-center
                        disabled:hover:cursor-auto
                        w-full
                        font-bold

                        ${theme == 'light' ?
                            'bg-[#004E81] hover:bg-[#005E9B] active:bg-[#003558] disabled:bg-blue-400':
                            'bg-sky-400 hover:bg-sky-500 active:bg-sky-600 disabled:bg-sky-200'
                        }
                    `}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: .95 }}
                >
                    LOGIN
                </motion.button>
            </Link>
        </div>
    </main>
}
