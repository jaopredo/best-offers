import type { DefaultProps, OmitedProps } from "./wrapper"
import { ReactElement } from 'react'

type IconRenderer = (props: {
  onClick: () => void
}) => ReactElement

export interface PasswordProps extends Omit<DefaultProps, 'aftericon'>, OmitedProps<HTMLInputElement> {
	stateshowicon?: IconRenderer,
	statehideicon?: IconRenderer,

    showIconClassName?: string,
    hideIconClassName?: string
}