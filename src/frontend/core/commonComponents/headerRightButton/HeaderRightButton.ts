import "./headerRightButton.css"
import { html } from "htm/react"


type Props = {
    title: string,
    button: any,
}

const HeaderRightButton: React.FunctionComponent<Props> = ({title, button, }: Props) => {
    return html`
        <div class="headerRightButton">
            <div><h3>${title}</h3></div>
            <div class="headerRightButtonRight">${button}</div>
        </div>
    `
}

export default HeaderRightButton