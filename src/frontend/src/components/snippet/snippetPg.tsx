import React from 'react'
import { useSelector } from 'react-redux';
import HoverSelect from '../../commonComponents/hoverSelect/hoverSelect';
import Toggler from '../../commonComponents/toggler/toggler';
import { SVState } from '../../redux/state';
import Snippet from '../../types/snippet';
import Header from './header'
import TextInput from "./textInput"
import './snippet.css'
import SnippetCode from './snippetCode';


const mockSnippets: Snippet[] = [
    {
        leftCode: "str3 = str1.replace(str2, \"bcjk\");", leftId: 1,
        rightCode: "str3 = str1.replacingOccurrences(of: str2, with: \"bcjk\")", rightId: 2, 
        taskId: 1, taskName: "Replace substring", 
    },
    {
        leftCode: "DirectoryInfo dirInfo = new DirectoryInfo(thePath);\n"
            + "fInfos = dirInfo.GetFileSystemInfos(\"*.CSV\");\n"
            + "foreach (FileSystemInfo it in fInfos) {\n"
            + "    if (it is FileInfo) {\n"
            + "        fNames[i, 0] = it.Name;\n"
            + "        fNames[i, 1] = dirInfo.FullName;\n"
            + "        fDates[i, 0] = it.LastWriteTime;\n"
            + "    }\n"
            + "}", leftId: 1,
        rightCode: "str3 = str1.replacingOccurrences(of: str2, with: \"bcjk\")", rightId: 2, 
        taskId: 2, taskName: "Get last modified times", 
    },
    {
        leftCode: "str3 = str1.replace(str2, \"bcjk\");", leftId: 1,
        rightCode: "str3 = str1.replacingOccurrences(of: str2, with: \"bcjk\")", rightId: 2, 
        taskId: 3, taskName: "Index of first occurrence of substring", 
    },
    {
        leftCode: "int index = str.LastIndexOf(\"bz\");", leftId: 1,
        rightCode: "", rightId: 2, 
        taskId: 4, taskName: "Index of last occurrence of substring", 
    },
    {
        leftCode: "DirectoryInfo dirInfo = new DirectoryInfo(thePath);\n"
            + "fInfos = dirInfo.GetFileSystemInfos(\"*.CSV\");\n"
            + "foreach (FileSystemInfo it in fInfos) {\n"
            + "    if (it is FileInfo) {\n"
            + "        fNames[i, 0] = it.Name;\n"
            + "        fNames[i, 1] = dirInfo.FullName;\n"
            + "        fDates[i, 0] = it.LastWriteTime;\n"
            + "    }\n"
            + "}", leftId: 1,
        rightCode: "str3 = str1.replacingOccurrences(of: str2, with: \"bcjk\")", rightId: 2, 
        taskId: 5, taskName: "Get last modified times", 
    },
    {
        leftCode: "DirectoryInfo dirInfo = new DirectoryInfo(thePath);\n"
            + "fInfos = dirInfo.GetFileSystemInfos(\"*.CSV\");\n"
            + "foreach (FileSystemInfo it in fInfos) {\n"
            + "if (it is FileInfo) {\n"
            + "fNames[i, 0] = it.Name;\n"
            + "fNames[i, 1] = dirInfo.FullName;\n"
            + "fDates[i, 0] = it.LastWriteTime;\n"
            + "}\n"
            + "}", leftId: 1,
        rightCode: "str3 = str1.replacingOccurrences(of: str2, with: \"bcjk\")", rightId: 2, 
        taskId: 6, taskName: "Get last modified times", 
    },
    {
        leftCode: "DirectoryInfo dirInfo = new DirectoryInfo(thePath);\n"
            + "fInfos = dirInfo.GetFileSystemInfos(\"*.CSV\");\n"
            + "foreach (FileSystemInfo it in fInfos) {\n"
            + "if (it is FileInfo) {\n"
            + "fNames[i, 0] = it.Name;\n"
            + "fNames[i, 1] = dirInfo.FullName;\n"
            + "fDates[i, 0] = it.LastWriteTime;\n"
            + "}\n"
            + "}", leftId: 1,
        rightCode: "str3 = str1.replacingOccurrences(of: str2, with: \"bcjk\")", rightId: 2, 
        taskId: 7, taskName: "Get last modified times", 
    },
    {
        leftCode: "DirectoryInfo dirInfo = new DirectoryInfo(thePath);\n"
            + "fInfos = dirInfo.GetFileSystemInfos(\"*.CSV\");\n"
            + "foreach (FileSystemInfo it in fInfos) {\n"
            + "if (it is FileInfo) {\n"
            + "fNames[i, 0] = it.Name;\n"
            + "fNames[i, 1] = dirInfo.FullName;\n"
            + "fDates[i, 0] = it.LastWriteTime;\n"
            + "}\n"
            + "}", leftId: 1,
        rightCode: "str3 = str1.replacingOccurrences(of: str2, with: \"bcjk\")", rightId: 2, 
        taskId: 8, taskName: "Get last modified times", 
    },
    {
        leftCode: "DirectoryInfo dirInfo = new DirectoryInfo(thePath);\n"
            + "fInfos = dirInfo.GetFileSystemInfos(\"*.CSV\");\n"
            + "foreach (FileSystemInfo it in fInfos) {\n"
            + "if (it is FileInfo) {\n"
            + "fNames[i, 0] = it.Name;\n"
            + "fNames[i, 1] = dirInfo.FullName;\n"
            + "fDates[i, 0] = it.LastWriteTime;\n"
            + "}\n"
            + "}", leftId: 1,
        rightCode: "str3 = str1.replacingOccurrences(of: str2, with: \"bcjk\")", rightId: 2, 
        taskId: 9, taskName: "Get last modified times",
    },
]

function SnippetPg() {
    const lang1 = useSelector((state: SVState) => state.language1)
    const lang2 = useSelector((state: SVState) => state.language2)
    const taskGroup = useSelector((state: SVState) => state.taskGroup)
    return (<div className="snippetsBody">
        <Header></Header>
        <main className="snippetsContainer">
            <div className="snippetsHeader">
                <div className="snippetLeftHeader">{lang1}</div>
                    <div className="taskForHeader">{taskGroup}</div>
                    <div className="snippetRightHeader">{lang2}</div>
            </div>
            {mockSnippets.map((snippet: Snippet, idx: number ) => {
                const evenClass = (idx%2 === 0 ? " evenRow" : "")
                return (<div className="snippetRow" key={idx}>
                    <div className={"snippetContent leftSide" + evenClass}>
                        {snippet.leftCode.length > 0 
                            ? <SnippetCode content={snippet.leftCode} isRight={false}></SnippetCode>
                            : <TextInput numberProposals={4}></TextInput>}
                    </div>
                    <div className={"taskContainer" + evenClass}>
                        {snippet.taskName}
                    </div>
                    <div className={"snippetContent rightSide" + evenClass}>
                        {snippet.rightCode.length > 0 
                            ? <SnippetCode content={snippet.rightCode} isRight={true}></SnippetCode>
                            : <TextInput numberProposals={4}></TextInput>}
                    </div>
                </div>)
            })}
            <div style={{marginBottom: "20px;", backgroundColor: "#303030",  }}>&nbsp;</div>
        </main>
    </div>)
}

export default SnippetPg