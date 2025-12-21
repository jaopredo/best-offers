/* COMPONENTES */
import Header from '@/components/header'

export default function PublicRoutesLayout({ children }: { children: React.ReactNode }){
	return <>
		<Header/>
		{children}
	</>
}
