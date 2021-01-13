import React, { useState, useCallback, useEffect } from 'react'
import '../assets/picker.scoped.css'
import Spinner from 'react-bootstrap/Spinner'
import { useAuth0 } from '../../react-auth0-spa';
import { hasPermissions } from '../../utils/scopeChecker';
import UserTable from './table/UserTable';
import UserService from '../../api/user';
import ManageUser from './ManageUser/ManageUser';

export default function UserPicker() {
    const { isAuthenticated, user } = useAuth0();

    const [users, setUsers] = useState({ data: [], isFetching: false, error: '' });
    const { getTokenSilently } = useAuth0();

    const initSidebar = { showUserTable: true, showCreateUser: false, data: undefined }
    //const initSidebar = { showUserTable: false, showCreateUser: true, data: undefined }
    const [sidebar, setSidebar] = useState(initSidebar)

    useEffect(() => {
        if (sidebar.data) {
            const newObject = users.data.find(item => item.id === sidebar.data.id);
            setSidebar(prevState => ({ ...prevState, data: newObject }))
        }
    }, [users, sidebar.data])

    const getToken = useCallback(async () => {
        const token = await getTokenSilently();
        return token;
    }, [getTokenSilently]);

    const onEditUser = (userDTO) => {
        //console.log(userDTO)
        console.log(userDTO)
        console.log('test')
        console.log(user.email)
        closeAllSidebars();
        setSidebar(prevState => ({ ...prevState, showUserTable: false, showCreateUser: true, data: userDTO}))
    }
    
    const onDeleteUser = async (userDTO) => {
        let temptoken = await getToken();
        const deleteBody = {
            "token": temptoken,
            "userid": userDTO.userId
        }
        UserService.delete(deleteBody, temptoken)
    }

    useEffect(() => {
        const fetchUsers = async () => {
            setUsers(prevState => ({ ...prevState, isFetching: true, data: [], error: ''}))
            try {
                const { data, error } = await UserService.getAll(await getToken());
                if (data) {
                    console.log(data)
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
                        <div hidden={sidebar.showCreateUser}>
                                  {hasPermissions(["write:user"]) && <span className="d-flex align-items-center add-btn" onClick={addUserHandler}> 
                            Add User
                        <i className="fas fa-plus"></i>
                        </span>}
                        </div>

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
                            getToken={() => getToken()}
                            backToUserTable={() => backToUserTable()}
                            // onEditUser={(row) => onEditUser(row)}
                            // onDeleteUser={(row) => onDeleteUser(row)}
                            userDTO={sidebar.data}
                            onSave={setUsers}
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
