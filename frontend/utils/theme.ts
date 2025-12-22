
export function themeSetup(lightStyle: string, darkStyle: string, theme: 'light'|'dark') {
	return theme == 'light' ? lightStyle : darkStyle
}
