import React, { useState, useCallback, useEffect } from 'react'
import '../assets/picker.scoped.css'
import Spinner from 'react-bootstrap/Spinner'
import { useAuth0 } from '../../react-auth0-spa';
import { hasPermissions } from '../../utils/scopeChecker';
import {roles} from '../../utils/constants';
import UserTable from './table/UserTable';
import UserService from '../../api/user';
import ManageUser from './ManageUser/ManageUser';
import { confirmAlert, errorAlert, succeedAlert } from '../../utils/Alerts';

export default function UserPicker() {
    const { isAuthenticated, user } = useAuth0();

    const [users, setUsers] = useState({ data: [], isFetching: false, error: '' });
    const { getTokenSilently } = useAuth0();

    const initSidebar = { showUserTable: true, showCreateUser: false, data: undefined }
    //const initSidebar = { showUserTable: false, showCreateUser: true, data: undefined }
    const [sidebar, setSidebar] = useState(initSidebar)
    const [rolelist, setRolelist] = useState(roles)

    useEffect(() => {
        if (sidebar.data) {
            const newObject = users.data.find(item => item.userId === sidebar.data.userId);
            setSidebar(prevState => ({ ...prevState, data: newObject }))
        }
    }, [users, sidebar.data])

    const getToken = useCallback(async () => {
        const token = await getTokenSilently();
        return token;
    }, [getTokenSilently]);

    const generateRolelist = () => {
        console.log("roleslist")
        console.log(user['https://any-namespace/roles'][0])
        // console.log(roles.value(user['https://any-namespace/roles']))
        // console.log()
        console.log(roles)
        console.log(roles.find((r) => r.name == (user['https://any-namespace/roles'][0])))
        let filteredRoles = roles.filter((r) => (r.value >= (roles.find((r) => r.name == (user['https://any-namespace/roles'][0])).value)))
        setRolelist(filteredRoles)
        console.log(filteredRoles)
    }

    const onEditUser = (userDTO) => {
        closeAllSidebars();
        generateRolelist();
        setSidebar(prevState => ({ ...prevState, showUserTable: false, showCreateUser: true, data: userDTO}))
    }
    
    const editUserHandler = () => {
        closeAllSidebars();
        setSidebar(prevState => ({ ...prevState, showUserTable: true, showCreateUser: false, data: undefined}))
    }

    const onDeleteUser = async (userDTO) => {
        confirmAlert(async () => {
            console.log(userDTO)
            const deleteBody = {
                "token": await getToken(),
                "userid": userDTO.userId
            }
            try {
                const result = await UserService.delete(deleteBody, await getToken());
                if (result.status == 202) {
                    let updatedList = users.data.filter((u) => u.userId !== userDTO.userId)
                    setUsers({data: updatedList});
                    succeedAlert();
                } else {
                    errorAlert(result.error.message)
                }
            } catch (e) {
                errorAlert("Failed delete request ", e.message)
            }
        })
    }


    // TODO getall voor welke role? getByCustomerId 
    useEffect(() => {
        const fetchUsers = async () => {
            setUsers(prevState => ({ ...prevState, isFetching: true, data: [], error: ''}))
            try {
                // const { data, error } = await UserService.getAllByCustomerId(userDTO.customer.id, await getToken());
                const { data, error } = await UserService.getAll(await getToken());
                if (data) {
                    setUsers(prevState => ({ ...prevState, isFetching: false, data}))
                } else {
                    throw new Error(error)
                }
            } catch (e) {
                setUsers(prevState => ({ ...prevState, isFetching: false, error: e.message }))
            }
        }
        fetchUsers();
    }, [getToken])


    const closeAllSidebars = () => {
        setSidebar(initSidebar);
    }

    const addUserHandler = () => {
        closeAllSidebars();
        setSidebar(prevState => ({ ...prevState, showUserTable: false, showCreateUser: true, data: undefined}))
        // setSidebar(prevState => ({ ...prevState, showManageCompany: true, data: undefined }))
    }

    const backToUserTable = () => {
        closeAllSidebars();
        setSidebar(prevState => ({ ...prevState, showUserTable: true, showCreateUser: false, data: undefined}))
    }

    if (users.isFetching) {
        return (
            <div className="d-flex justify-content-center align-items-center w-100" >
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading users...</span>
                </Spinner>
            </div >
        )
    }

    if (users.error) {
        return (<div className="d-flex justify-content-center align-items-center w-100">
            Failed to fetch users: {users.error}
        </div>)
    }

    return (
        <div className="content">
            <div className="inner">
                <div className="inner-box">
                    <div className="content-title">
                        <h4>
                            Users
                        </h4>
                        {/* <div hidden={sidebar.showCreateUser}>
                                  {hasPermissions(["write:user"]) && <span className="d-flex align-items-center add-btn" onClick={addUserHandler}> 
                            Add User
                        <i className="fas fa-plus"></i>
                        </span>}
                        </div> */}

                        <div hidden={sidebar.showUserTable}>
                                  {hasPermissions(["write:user"]) && <span className="d-flex align-items-center add-btn" onClick={backToUserTable}> 
                            Close
                        <i className="fas fa-times"></i>
                        </span>}                  
                        </div>

                    </div>

                    {sidebar.showUserTable && 
                            <UserTable users={users.data} 
                            onEditUser={(row) => onEditUser(row)}
                            onDeleteUser={(row) => onDeleteUser(row)}
                            userDTO={sidebar.data}
                            user={user.email}
                        />
                    }
                    {sidebar.showCreateUser &&
                        <ManageUser 
                            rolelist={rolelist}
                            getToken={() => getToken()}
                            backToUserTable={() => backToUserTable()}
                            editUserHandler={() => editUserHandler()}
                            onSave={setUsers}
                            userDTO={sidebar.data}
                        />
                    }
                </div>
            </div>

            {/* {sidebar.showManageCompany &&
                <ManageCompany
                    getToken={() => getToken()}
                    onHide={closeAllSidebars}
                    onSave={setOwners}
                    ownerDTO={sidebar.data}
                />} */}
        </div>
    )
}
