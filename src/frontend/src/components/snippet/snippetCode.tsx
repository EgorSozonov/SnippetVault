import './snippet.css'


type Props = {
    content: string,
    isRight: boolean,
}

function SnippetCode({content, isRight, } : Props) {
    const snippetContent = (<pre className="snippetCode">
            {content}
        </pre>)
    return (
        isRight 
            ? (<div className="snippetContentContainer">
                    <div className="snippetButtons">
                        <div className="commentButton" title="Alternative versions">A</div>
                        <div className="commentButton" title="Copy text">C</div>
                    </div>
                    {snippetContent}
                </div>
            )
            : (<div className="snippetContentContainer">
                    {snippetContent}
                    <div className="snippetButtons snippetButtonsRight">
                        <div className="commentButton" title="Alternative versions">A</div>
                        <div className="commentButton" title="Copy text">C</div>
                    </div>
                </div>
            )
    )
}

export default SnippetCode