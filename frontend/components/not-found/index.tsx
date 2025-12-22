/* COMPONENTES */
import { FaSadTear } from "react-icons/fa"

/* CONTEXTOS */
import { useThemeContext } from '@/context/theme'

/* UTILS */
import { themeSetup } from "@/utils/theme"

export default function NotFound({ children }: { children?: React.ReactNode }) {
	const { theme } = useThemeContext()

	return <div className='flex flex-col items-center justify-center w-full flex-1 gap-2'>
		<FaSadTear className={`
			${themeSetup('text-[#004E81]', 'text-white', theme)}
		`} size={70}/>
		<p className={`
			text-center font-bold
			${themeSetup('text-[#004E81]', 'text-white', theme)}
		`}>Sentimos muito, mas não encontramos o que você está prcurando :(</p>

		{children}
	</div>
}
