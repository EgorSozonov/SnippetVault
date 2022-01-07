import { html } from "htm/react"

export function inputFocusHandler(event: any) {
    event.target.select()
}

export const empty = html`<div></div>`