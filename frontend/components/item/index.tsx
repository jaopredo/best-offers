import Link from "next/link"

/* TIPOS */
import { Item } from "@/types/api/services/item.service"

/* COMPONENTS */
import { CiShoppingBasket } from "react-icons/ci";

/* CONTEXTOS */
import { useThemeContext } from "@/context/theme"

/* UTILS */
import { themeSetup } from "@/utils/theme"


export default function ItemCard({
	id,
	name,
    price,
    seller,
    url,
    font,
    category,
}: Item) {
	const { theme } = useThemeContext()


	function truncateString(str: string, maxLength: number = 24) {
		if (str.length <= maxLength) return str

		return str.slice(0, maxLength) + '...'
	}


	return <li className={`
		flex flex-col items-center
	`}>
		<Link href={`/items/${id}`}>
			<div className={`
				rounded-lg md:p-15 group
				${themeSetup('bg-neutral-300', 'bg-[#0b101f]', theme)}
			`}>
				<CiShoppingBasket size={100}  className={`
					group-hover:scale-105 transition-all
					${themeSetup('text-neutral-500', 'text-white', theme)}
				`}/>

				<p className={`opacity-0 group-hover:opacity-100 transition-all ${themeSetup('text-neutral-500', 'text-white', theme)}`}>Ver detalhes</p>
			</div>
		</Link>
		<div>
			<ul>
				<li className={`font-bold text-lg ${themeSetup('text-[#004E81]', 'text-sky-600', theme)}`}>{truncateString(name)}</li>
				<li className={`font-bold text-xl ${themeSetup('text-gray-800', 'text-white', theme)}`}>R${price}</li>
				{ seller && <li className={`font-bold text-sm ${themeSetup('text-gray-600', 'text-sky-800', theme)}`}>{truncateString(seller, 15)}</li> }
				<li className={`font-bold hover:underline ${themeSetup('text-[#004E81]', 'text-sky-600', theme)}`}><Link href={url} target="_blank" rel="noopener noreferrer">Visitar</Link></li>
			</ul>
		</div>
	</li>
}
