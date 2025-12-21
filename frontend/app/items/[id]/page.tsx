'use client'
import { use, useEffect, useState } from 'react'

/* CONTEXTOS */
import { useThemeContext } from "@/context/theme"
import { useAPIContext } from "@/context/api"

/* TIPOS */
import { Item } from "@/types/api/services/item.service"

/* UTILS */
import { themeSetup } from "@/utils/theme"

export default function Item({ params }: { params: Promise<{id: number}> }) {
	const { id } = use(params)

	/* State do item */
	const [ item, setItem ] = useState<Item>()

	/* Contextos */
    const { theme } = useThemeContext()
    const { itemService } = useAPIContext()

    /* Pegando o item */
    useEffect(() => {
    	itemService.get(id).then(resp=>console.log(resp))
    }, [])

	return <main className={`relative flex gap-5 flex-col items-stretch justify-center flex-1 p-5 flex-col ${themeSetup('bg-neutral-200', 'bg-[#10161F]', theme)}`}>
		{id}
	</main>
}
