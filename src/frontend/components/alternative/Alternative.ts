import "./Alternative.css"
import { html } from "htm/react"
import { useParams } from "react-router";
import { FunctionComponent, useContext, useEffect } from "react"
import MainState from "../../mobX/MainState"
import { StoreContext } from "../../App"
import IClient from "../../interfaces/IClient"
import { fetchFromClient } from "../../utils/Client"
import AlternativeDTO from "../../../common/dto/AlternativeDTO"
import Toggler from "../../commonComponents/toggler/Toggler"
import { observer } from "mobx-react-lite"
import { fmtDt } from "../../utils/DateFormat"

type Props = {
    alternative: AlternativeDTO,
}

const Alternative: FunctionComponent<Props> = observer(({alternative}: Props) => {

    
    return html`
                 
        <div class="alternativeItem">
            <div class="alternativeItemHeader">
                <span>
                    Date of upload: ${fmtDt(alternative.tsUpload)}
                </span>
                <span>
                    Votes: ${alternative.score}
                </span>
            </div>
            <div class="alternativeItemCode">
                ${alternative.snippetCode}
            </div>
            <div class="alternativeItemFooter">
                <span>
                    [V]ote
                </span>
                <span>
                    [C]omments
                </span>    
            </div>
            <div class="alternativeItemComments">
                <div class="alternativeItemCommentsComment">
                    <div>author date</div>
                    <div>comment 1</div>
                </div>
                <div class="alternativeItemCommentsComment">
                    <div>author date</div>                
                    <div>comment 2</div>
                </div>
                <div class="alternativeItemCommentsComment">
                    <div>author date</div>
                    <div>comment 3</div>
                </div>                                                
            </div>
        </div>        
    `
})

export default Alternative