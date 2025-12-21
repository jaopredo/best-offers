'use client'

/* COMPONENTES */
import ToggleTheme from "../theme/toggle"

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
	    <ToggleTheme/>
	</header>
}
