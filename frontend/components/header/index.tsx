'use client'
import Link from 'next/link'

/* COMPONENTES */
import ToggleTheme from "../theme/toggle"
import { MdSpaceDashboard } from "react-icons/md"

/* UTILS */
import { themeSetup } from "@/utils/theme"

/* CONTEXTOS */
import { useThemeContext } from "@/context/theme"


export default function Header() {
	const { theme } = useThemeContext()
	
	return <header className={`p-5 flex items-center justify-between ${themeSetup('bg-neutral-100', 'bg-[#152338]', theme)}`}>
	    <h1 className={`text-2xl font-bold
	        ${themeSetup('text-[#004E81]', 'text-white', theme)}
	    `}>SCRAPPER</h1>
	    <div className='flex items-center justify-center gap-2'>
	    	<Link href='/admin' className={`
	    		transition-all p-2 rounded-full bg-sky-600 hover:scale-105 hover:bg-sky-700 text-white
	    	`}>
	    		<MdSpaceDashboard size={20}/>
	    	</Link>
	    	<ToggleTheme/>
		</div>
	</header>
}
