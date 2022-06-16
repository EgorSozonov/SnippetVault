import { FunctionComponent, useContext, useEffect, useRef, useState } from "react"
import { NavLink } from "react-router-dom"
import EditableList from "../../commonComponents/editableList/EditableList"
import PATHS from "../../Path"
import NewProposals from "./NewProposal"
import { observer } from "mobx-react-lite"
import { storeContext } from "../../App"
import MainState from "../../mobX/AllState"
import { Editability } from "../../commonComponents/editableList/utils/Editability"
import AdminLogin from "./AdminLogin"
import { LanguageCUDTO, TaskCUDTO, TaskGroupCUDTO,  } from "../../types/dto/AuxDTO"
import AdminChangePw from "./AdminChangePw"
import { useCookies } from "react-cookie"
import React from "react"


const ListTasks = (props: any) => EditableList<TaskCUDTO>(props)
const ListTaskGroups = (props: any) => EditableList<TaskGroupCUDTO>(props)
const ListLanguages = (props: any) => EditableList<LanguageCUDTO>(props)

const editabilityTaskGroup: Editability<TaskGroupCUDTO>[] = [
    {
        field: "name",
        fieldType: "string",
    },
    {
        field: "code",
        fieldType: "string",
    },
    {
        field: "isDeleted",
        fieldType: "bool",
    },
]

const editabilityLanguage: Editability<LanguageCUDTO>[] = [
    {
        field: "name",
        fieldType: "string",
    },
    {
        field: "code",
        fieldType: "string",
    },
    {
        field: "sortingOrder",
        fieldType: "int",
    },
    {
        field: "isDeleted",
        fieldType: "bool",
    },
]

const Admin: FunctionComponent = observer(({}: any) => {
    const state = useContext<MainState>(storeContext)
    const [cookie, setCookie] = useCookies(["account"])

    const editabilityTask: Editability<TaskCUDTO>[] = [
        {
            field: "name",
            fieldType: "string",
        },
        {
            field: "isDeleted",
            fieldType: "bool",
        },
        {
            field: "description",
            fieldType: "string",
        },
        {
            field: "taskGroup",
            fieldType: "choice",
            choices: state.admin.taskGroups.map(x => { return { id: x.existingId, name: x.name, } }),
        },
    ]

    const cuTaskCallback = async (newValue: TaskCUDTO) => {
        const mbUserId = state.user.userIdGet()
        if (mbUserId === null) return

        state.admin.taskCU(newValue, mbUserId)
    }
    const cuTaskGroupCallback = async (newValue: TaskGroupCUDTO) => {
        const mbUserId = state.user.userIdGet()
        if (mbUserId === null) return
        state.admin.taskGroupCU(newValue, mbUserId)
    }
    const cuLanguageCallback = async (newValue: LanguageCUDTO) => {
        const mbUserId = state.user.userIdGet()
        if (mbUserId === null) return
        state.admin.languageCU(newValue, mbUserId)
    }

    useEffect(() => {
        state.admin.tasksGet()
        state.admin.taskGroupsGet()
        state.admin.languagesGet()
        state.admin.proposalsGet()

        state.admin.statsGet()
        state.user.trySignInFromLS()
    }, [state.user.acc])

    const [changeAdminPwMode, setChangeAdminPwMode] = useState(false)
    const changeAdminPwHandler = () => {
        setChangeAdminPwMode(true)
    }

    const closeChangeAdminPwHandler = () => {
        setChangeAdminPwMode(false)
    }

    return (
        <div className="adminContainer">
            {state.user.isAdmin.get() === false
                ? <AdminLogin />

                : (changeAdminPwMode === false
                    ? (<>
                        <div className="adminHeaderPanel">
                            {state.admin.stats !== null &&
                                <div>
                                    <div>Total proposals: {state.admin.stats.proposalCount}</div>
                                    <div>Of those proposals, approved primary snippets: {state.admin.stats.primaryCount}</div>
                                    <div>Approved alternatives: {state.admin.stats.alternativeCount}</div>
                                    <div>Active users count: {state.admin.stats.userCount}</div>
                                </div>
                            }
                            <div>
                                <NavLink to={PATHS["snippet"].url}>
                                    <div className="adminHeaderButton">Back to snippets</div>
                                </NavLink>
                            </div>
                            <div className="adminHeaderButton" onClick={state.user.signOut}>(sign out)</div>
                            <div className="adminHeaderButton" onClick={changeAdminPwHandler}>Change password</div>
                        </div>
                        <NewProposals />
                        <ListTasks values={state.admin.tasks} editabilities={editabilityTask} title="Tasks"
                            cuCallback={cuTaskCallback} />
                        <ListTaskGroups values={state.admin.taskGroups} editabilities={editabilityTaskGroup} title="Task groups"
                            cuCallback={cuTaskGroupCallback} />
                        <ListLanguages values={state.admin.languages} editabilities={editabilityLanguage} title="Languages"
                            cuCallback={cuLanguageCallback} />
                        </>)
                    : <AdminChangePw closeChangeAdminPwHandler={closeChangeAdminPwHandler} />
                    )
            }
        </div>
    )
})

export default Admin
