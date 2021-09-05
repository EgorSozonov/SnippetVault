import "./headerRightButton.css"


type Props = {
    title: string,
    button: any,
}

const HeaderRightButton: React.FunctionComponent<Props> = ({title, button, }: Props) => {


    return (
        <div className="headerRightButton">
            <div><h3>{title}</h3></div>
            <div className="headerRightButtonRight">{button}</div>
        </div>
    )
}


export default HeaderRightButton