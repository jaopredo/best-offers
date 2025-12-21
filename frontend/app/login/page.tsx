'use client'
import { useForm, FormProvider } from "react-hook-form"
import { Kumbh_Sans } from 'next/font/google'
import { motion } from 'motion/react'
import { useState } from "react"
import { useRouter } from "next/navigation"

/* CONTEXTOS */
import { useThemeContext } from "@/context/theme"
import { useAPIContext } from "@/context/api"

/* COMPONENETES */
import Input from "@/components/form/input"
import Password from "@/components/form/password"
import ToggleTheme from "@/components/theme/toggle"
import { IoMdPerson } from "react-icons/io"
import { FaLock } from "react-icons/fa"
import { AiOutlineLoading } from "react-icons/ai"
import { FaArrowLeft } from "react-icons/fa6"


/* FONTES */
const kumbh_sans = Kumbh_Sans({
    weight: '600',
    subsets: [ 'latin' ]
})

/* TIPOS */
import type { SubmitHandler } from 'react-hook-form'
import { UserLoginInterface } from "@/types/api/services/auth.service"

/**
 * Página de login
 */
export default function Login() {
    // Router
    const router = useRouter()
    
    // Indica se a resposta do formulário está sendo carregada
    const [ loading, setLoading ] = useState<boolean>(false)

    // Métodos do formulário
    const methods = useForm<UserLoginInterface>()

    // Serviço do usuário para o Login
    const { authService } = useAPIContext()

    // Pegando o tema da aplicação
    const { theme } = useThemeContext()

    // Função para quando enviar a minha 
    const onSubmit: SubmitHandler<UserLoginInterface> = (data) => {
        setLoading(true)  // Indico que eu estou carregando as informações
        authService.login(data).then(resp => {
            // Quando minhas informações carregarem
            setLoading(false) // Digo que não está mais carregando
            if(resp) {
                // Eu armazeno o token no meu localStorage
                localStorage.setItem('token', resp?.data.token)
                // Envio para a página principal
                router.push('/')
            }
        }).catch(() => setLoading(false))
    }

    return <main className={`w-screen h-screen flex items-center justify-center transition-colors overflow-hidden ${theme == 'light' ? 'bg-stone-300' : 'bg-[#10161F]'}`}>
        <section className={`w-[95%] md:w-[60vw] p-10 rounded-md flex items-center justify-center flex-col transition-colors ${theme == 'light' ? 'bg-[#F5F5F5]' : 'bg-[#233E51]'}`}>
            <div className="flex items-center justify-center gap-5 self-start">
                <FaArrowLeft className={`
                    transition-all
                    text-xl
                    hover:cursor-pointer
                    ${theme == 'light' ? 'text-slate-900':'text-white'}
                `} onClick={() => {
                    router.back()
                }}/>
                <ToggleTheme/>
            </div>

            <FormProvider {...methods}>
                <form
                    onSubmit={methods.handleSubmit(onSubmit)}
                    className={"w-full md:w-[80%] mt-10 flex flex-col gap-5 items-center justify-center"}
                >
                    <Input
                        name="email"
                        label="Email"
                        help="Digite o seu email"
                        validation={{
                            required: {
                                value: true,
                                message: "Esse campo é obrigatório"
                            }
                        }}

                        labelClassName={`transition-colors ${kumbh_sans.className} ${theme == 'light' ? 'text-[#004E81]' : 'text-stone-200'}`}
                        insiderClassName={`transition-colors shadow-md/20 rounded-sm flex items-center p-2 gap-2 ${theme == 'light' ? 'bg-[#F0F0F0]' : 'bg-[#112838]'}`}
                        className={`transition-colors outline-none w-full text-md ${theme == 'light' ? 'text-black' : 'text-white'}`}
                        errorClassName={`transition-colors font-bold text-xs mt-2 ${theme == 'light' ? 'text-rose-500' : 'text-red-300'}`}
                        helpClassName={`transition-colors font-semibold text-xs mt-1 ${theme == 'light' ? 'text-gray-600' : 'text-gray-300'}`}

                        beforeicon={<IoMdPerson className={`transition-colors ${theme == 'light' ? 'text-[#004E81]' : 'text-stone-200'}`} size={16}/>}
                    />

                    <Password
                        name="password"
                        label="Senha"
                        help="Digite a sua senha"
                        validation={{
                            required: {
                                value: true,
                                message: "Esse campo é obrigatório"
                            }
                        }}

                        labelClassName={`transition-colors ${kumbh_sans.className} ${theme == 'light' ? 'text-[#004E81]' : 'text-stone-200'}`}
                        insiderClassName={`transition-colors shadow-md/20 rounded-sm flex items-center p-2 gap-2 ${theme == 'light' ? 'bg-[#F0F0F0]' : 'bg-[#112838]'}`}
                        className={`transition-colors outline-none w-full text-md ${theme == 'light' ? 'text-black' : 'text-white'}`}
                        errorClassName={`transition-colors font-bold text-xs mt-2 ${theme == 'light' ? 'text-rose-500' : 'text-red-300'}`}
                        helpClassName={`transition-colors font-semibold text-xs mt-1 ${theme == 'light' ? 'text-gray-600' : 'text-gray-300'}`}

                        beforeicon={<FaLock className={`transition-colors ${theme == 'light' ? 'text-[#004E81]' : 'text-stone-200'}`} size={16}/>}
                        
                        showIconClassName={`transition-colors hover:cursor-pointer text-xl ${theme == 'light' ? 'text-[#004E81]' : 'text-stone-200'}`}
                        hideIconClassName={`transition-colors hover:cursor-pointer text-xl ${theme == 'light' ? 'text-[#004E81]' : 'text-stone-200'}`}
                    />

                    <motion.button
                        type="submit"
                        disabled={loading}
                        className={`
                            transition-colors
                            text-white
                            p-2
                            rounded-md
                            w-[60%]
                            hover:cursor-pointer
                            flex
                            gap-2
                            items-center
                            justify-center
                            disabled:hover:cursor-auto

                            ${kumbh_sans.className}
                            ${theme == 'light' ?
                                'bg-[#004E81] hover:bg-[#005E9B] active:bg-[#003558] disabled:bg-blue-400':
                                'bg-sky-400 hover:bg-sky-500 active:bg-sky-600 disabled:bg-sky-200'
                            }
                        `}
                        whileHover={{ scale: loading ? 1 : 1.05 }} whileTap={{ scale: .95 }}
                    >
                        {loading && <AiOutlineLoading className='animate-spin' />}
                        LOGIN
                    </motion.button>
                </form>
            </FormProvider>
        </section>
    </main>
}
