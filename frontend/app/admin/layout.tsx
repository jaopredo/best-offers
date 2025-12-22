'use client'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

/* CONTEXTOS */
import { useThemeContext } from "@/context/theme"

/* UTILS */
import { themeSetup } from "@/utils/theme"

/* COMPONENTES */
import ToggleTheme from "@/components/theme/toggle"
import { FaHome, FaBriefcase } from "react-icons/fa"
import { MdCategory } from "react-icons/md"
import { CgWebsite } from "react-icons/cg"
import { BsFillBugFill } from "react-icons/bs"
import { GiBroom } from "react-icons/gi"
import { TiDocumentText } from "react-icons/ti"
import { IoMdClose } from "react-icons/io"
import { FiMenu } from "react-icons/fi"


export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [ showMenu, setShowMenu ] = useState<boolean>(false)

  const { theme } = useThemeContext()
  const pathname = usePathname() // ex: "/admin/category"
  const page = pathname.split('/').filter(Boolean).pop()

  function styleSelector(enabled: string, disabled: string, value: string) {
    return page == value ? enabled : disabled
  }

  const options = [
    {
      icon: <FaHome
        className={`
          ${styleSelector(
            themeSetup('text-sky-600', 'text-white', theme),
            themeSetup('text-[#99a1af] group-hover:text-sky-600', 'text-[#99a1af] group-hover:text-white', theme),
            'admin'
          )}
        `}
      />,
      label: 'Home',
      route: 'admin'
    },
    {
      icon: <MdCategory
        className={`
          ${styleSelector(
            themeSetup('text-sky-600', 'text-white', theme),
            themeSetup('text-[#99a1af] group-hover:text-sky-600', 'text-[#99a1af] group-hover:text-white', theme),
            'categories'
          )}
        `}
      />,
      label: 'Categorias',
      route: 'categories'
    },
    {
      icon: <CgWebsite
        className={`
          ${styleSelector(
            themeSetup('text-sky-600', 'text-white', theme),
            themeSetup('text-[#99a1af] group-hover:text-sky-600', 'text-[#99a1af] group-hover:text-white', theme),
            'fonts'
          )}
        `}
      />,
      label: 'Fontes',
      route: 'fonts'
    },
    {
      icon: <BsFillBugFill
        className={`
          ${styleSelector(
            themeSetup('text-sky-600', 'text-white', theme),
            themeSetup('text-[#99a1af] group-hover:text-sky-600', 'text-[#99a1af] group-hover:text-white', theme),
            'adapters'
          )}
        `}
      />,
      label: 'Adaptadores',
      route: 'adapters'
    },
    {
      icon: <GiBroom
        className={`
          ${styleSelector(
            themeSetup('text-sky-600', 'text-white', theme),
            themeSetup('text-[#99a1af] group-hover:text-sky-600', 'text-[#99a1af] group-hover:text-white', theme),
            'scrapping'
          )}
        `}
      />,
      label: 'Scrapping',
      route: 'scrapping'
    },
    {
      icon: <FaBriefcase
        className={`
          ${styleSelector(
            themeSetup('text-sky-600', 'text-white', theme),
            themeSetup('text-[#99a1af] group-hover:text-sky-600', 'text-[#99a1af] group-hover:text-white', theme),
            'jobs'
          )}
        `}
      />,
      label: 'Trabalhos',
      route: 'jobs'
    },
    {
      icon: <TiDocumentText
        className={`
          ${styleSelector(
            themeSetup('text-sky-600', 'text-white', theme),
            themeSetup('text-[#99a1af] group-hover:text-sky-600', 'text-[#99a1af] group-hover:text-white', theme),
            'items'
          )}
        `}
      />,
      label: 'Itens',
      route: 'items'
    },
  ]

  return <div className='w-full min-h-screen flex items-stretch'>
    <button className={`
      md:hidden text-white fixed left-5 bottom-5 transition-all
      bg-[#030714] p-2 rounded-full active:scale-95
    `} onClick={() => setShowMenu(true)}>
      <FiMenu size={25}/>
    </button>
    <aside className={`
      border-r-1 p-2 absolute w-[80%] h-full transition-all
      ${showMenu ? '-translate-x-0' : '-translate-x-[110%]'}
      md:w-1/4 md:relative md:translate-0 md:h-auto
      ${themeSetup('bg-white border-[#e5e7eb]', 'bg-[#0e1624] border-[#262e3a]', theme)}
    `}>
      <button onClick={() => setShowMenu(false)} className={`
        md:hidden text-white absolute right-0 translate-x-[110%]
      `}>
        <IoMdClose size={25}/>
      </button>

      <ToggleTheme/>

      <menu className='flex flex-col items-stretch w-full h-full gap-2 p-2 md:mt-8'>
        {options.map((opt, idx) => <li key={idx} className={`
          rounded-md group
          ${styleSelector(
            themeSetup('text-sky-600 bg-sky-600/10', 'bg-[#1a222f] text-white', theme),
            themeSetup('hover:text-sky-600 hover:bg-sky-600/10 text-gray-700', 'hover:text-white hover:bg-[#1a222f] text-[#99a1af]', theme),
            opt.route
          )}
        `}>
          <Link className='flex items-center gap-2 text-lg p-2 hover:cursor-pointer' href={'/admin/' + (opt.route == 'admin' ? '' : opt.route)}>
            {opt.icon}
            {opt.label}
          </Link>
        </li>)}
      </menu>
    </aside>
    <main className={`w-full p-5
      ${themeSetup('bg-white', 'bg-[#101828]', theme)}
    `}>
      {children}
    </main>
  </div>
}