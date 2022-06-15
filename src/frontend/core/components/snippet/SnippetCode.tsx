import React from "react"
import "./snippet.css"
import { NavLink } from "react-router-dom";
import PATHS from "../../Path";


type Props = {
    content: string,
    isRight: boolean,
    langId: number,
    libraries?: string,
    tlId: number,
}

function copyTextToClipboard(text: string) {
    navigator.clipboard.writeText(text);
}

function SnippetCode({content, isRight, langId, libraries, tlId, } : Props) {
    const snippetContent =
        <div key={tlId}>
        <div>
            <pre className="snippetCode">
                {content}
            </pre>
        </div>
        {libraries &&

                <div>
                    Libraries:
                    <pre className="snippetCode">
                        {libraries}
                    </pre>
                </div>

        }
        </div>

    const alternativesLink =
        <NavLink to={`${PATHS["alternative"].urlPrefix}/${langId}/${tlId}`}>
            <div title="Alternative versions" className="commentButton">
                A
            </div>
        </NavLink>

    return (
        isRight === true
            ?
                (<>
                    <div className="snippetButtons">
                        {alternativesLink}
                        <div className="commentButton" title="Copy code to clipboard" onClick={() => copyTextToClipboard(content)}>C</div>
                    </div>
                    <div className="snippetCodeLibraries">
                        {snippetContent}
                    </div>
                </>       )
            :
                (<>
                    <div className="snippetCodeLibraries">
                        {snippetContent}
                    </div>
                    <div className="snippetButtons snippetButtonsRight">
                        {alternativesLink}
                        <div className="commentButton" title="Copy code to clipboard" onClick={() => copyTextToClipboard(content)}>C</div>
                    </div>
                </>)
    )
}

export default SnippetCode
