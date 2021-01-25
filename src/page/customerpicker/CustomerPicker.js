import React, {useState, useCallback, useEffect} from 'react'
import '../assets/picker.scoped.css'
import Spinner from 'react-bootstrap/Spinner'
import {useAuth0} from '../../react-auth0-spa';
import {hasPermissions} from '../../utils/scopeChecker';
import CustomerTable from './table/CustomerTable';
import CustomerService from '../../api/customer';
import {roles} from '../../utils/constants';
import UserService from '../../api/user';
import ManageCustomer from './ManageCustomer/ManageCustomer';
import {confirmAlert, errorAlert, succeedAlert} from '../../utils/Alerts';
import ManageCustomersUser from './ManageCustomer/ManageCustomersUser';
import UserList from './ManageCustomer/UserList';

export default function CustomerPicker() {
    const {isAuthenticated, user} = useAuth0();

    const [customers, setCustomers] = useState({data: [], isFetching: false, error: ''});

    const [users, setUsers] = useState({data: [], isFetching: false, error: ''});
    const {getTokenSilently} = useAuth0();

    const initSidebar = {
        showUserList: false,
        showCustomerTable: true,
        showCreateCustomer: false,
        showCreateUser: false,
        data: undefined,
        data2: undefined
    }
    const [sidebar, setSidebar] = useState(initSidebar)
    const [rolelist, setRolelist] = useState(roles)

    useEffect(() => {
        if (sidebar.data) {
            const newObject = customers.data.find(item => item.id === sidebar.data.id);
            setSidebar(prevState => ({...prevState, data: newObject}))
        }
    }, [customers, sidebar.data])


    const getToken = useCallback(async () => {
        const token = await getTokenSilently();
        return token;
    }, [getTokenSilently]);

    const fetchUsers = async (customerDTO) => {
        setUsers(prevState => ({...prevState, isFetching: true, data: [], error: ''}))
        try {
            const {data, error} = await UserService.getAllByCustomerId(customerDTO.id, await getToken());
            if (data) {
                setUsers(prevState => ({...prevState, isFetching: false, data}))
            } else {
                throw new Error(error)
            }
        } catch (e) {
            setUsers(prevState => ({...prevState, isFetching: false, error: e.message}))
        }
    }

    const onEditCustomer = (customerDTO, userDTO) => {
        closeAllSidebars();
        fetchUsers(customerDTO);
        setSidebar(prevState => ({
            ...prevState,
            showUserList: true,
            showCustomerTable: false,
            showCreateCustomer: true,
            showCreateUser: false,
            data: customerDTO,
            data2: userDTO
        }))
    }

    const generateRolelist = () => {
        let filteredRoles = roles.filter((r) => (r.value >= (roles.find((r) => r.name == (user['https://any-namespace/roles'][0])).value)))
        setRolelist(filteredRoles)
    }

    const onEditUser = (userDTO) => {
        generateRolelist();
        closeAllSidebars();
        setSidebar(prevState => ({
            ...prevState,
            showUserList: false,
            showCustomerTable: false,
            showCreateCustomer: false,
            showCreateUser: true,
            data2: userDTO
        }))
    }

    const editUserHandler = () => {
        closeAllSidebars();
        setSidebar(prevState => ({
            ...prevState,
            showUserList: true,
            showCustomerTable: false,
            showCreateCustomer: true,
            showCreateUser: false,
            data: undefined
        }))
    }

    const addUserHandler = (customerDTO) => {
        generateRolelist();
        closeAllSidebars();
        setSidebar(prevState => ({
            ...prevState,
            showUserList: false,
            showCustomerTable: false,
            showCreateCustomer: false,
            showCreateUser: true,
            data: customerDTO
        }))
    }

    const onDeleteUser = async (userDTO) => {
        confirmAlert(async () => {
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

    const onDeleteCustomer = async (customerDTO) => {
        confirmAlert(async () => {
            const deleteBody = {
                "token": await getToken(),
                "customerid": customerDTO.id
            }
            try {
                const result = await CustomerService.delete(deleteBody, await getToken());
                if (result.status == 202) {
                    let updatedList = customers.data.filter((c) => c.id !== customerDTO.id)
                    setCustomers({data: updatedList});
                    succeedAlert();
                } else {
                    errorAlert(result.error.message)
                }
            } catch (e) {
                errorAlert("Failed delete request ", e.message)
            }
        })
    }

    useEffect(() => {
        const fetchCustomers = async () => {
            setCustomers(prevState => ({...prevState, isFetching: true, data: [], error: ''}))
            try {
                const {data, error} = await CustomerService.getAll(await getToken());
                if (data) {
                    setCustomers(prevState => ({...prevState, isFetching: false, data}))
                } else {
                    throw new Error(error)
                }
            } catch (e) {
                setCustomers(prevState => ({...prevState, isFetching: false, error: e.message}))
            }
        }
        fetchCustomers();
    }, [getToken])

    const closeAllSidebars = () => {
        setSidebar(initSidebar);
    }

    const addCustomerHandler = () => {
        closeAllSidebars();
        setSidebar(prevState => ({
            ...prevState,
            showUserList: false,
            showCustomerTable: false,
            showCreateCustomer: true,
            showCreateUser: false,
            data: undefined
        }))
    }

    const backToCustomerTable = () => {
        closeAllSidebars();
        setSidebar(prevState => ({
            ...prevState,
            showUserList: false,
            showCustomerTable: true,
            showCreateCustomer: false,
            showCreateUser: false,
            data: undefined
        }))
    }

    const backToEditCustomer = (customerDTO) => {
        closeAllSidebars();
        setSidebar(prevState => ({ 
            ...prevState, 
            showUserList: true, 
            showCustomerTable: false, 
            showCreateCustomer: true, 
            showCreateUser: false, 
            data: undefined
        }))
    }

    const addSuperUserHandler = (customerDTO) => {
        closeAllSidebars();
        setSidebar(prevState => ({
            ...prevState,
            showUserList: false,
            showCustomerTable: false,
            showCreateCustomer: false,
            showCreateUser: true,
            data: customerDTO
        }))
    }

    if (customers.isFetching) {
        return (
            <div className="d-flex justify-content-center align-items-center w-100">
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading customers...</span>
                </Spinner>
            </div>
        )
    }

    if (customers.error) {
        return (<div className="d-flex justify-content-center align-items-center w-100">
            Failed to fetch customers: {customers.error}
        </div>)
    }


    /** Pagina die word gereturned*/
    return (
        <div className="content">
            <div className="inner">
                <div className="inner-box">
                    <div className="content-title">
                        <h4>
                            Customers
                        </h4>
                        <div hidden={sidebar.showCreateCustomer || sidebar.showCreateUser}>
                            {hasPermissions(["write:company"]) &&
                            <span className="d-flex align-items-center add-btn" onClick={addCustomerHandler}>
                            Add Customer
                        <i className="fas fa-plus"></i>
                        </span>}
                        </div>

                        <div hidden={sidebar.showCustomerTable}>
                            {hasPermissions(["write:company"]) &&
                            <span className="d-flex align-items-center add-btn" onClick={(sidebar.showCreateCustomer ? backToCustomerTable : backToEditCustomer)}>
                            Close
                        <i className="fas fa-times"></i>
                        </span>}
                        </div>

                    </div>

                    {sidebar.showCustomerTable &&
                    <CustomerTable 
                        customers={customers.data}
                        onEditCustomer={(row) => onEditCustomer(row)}
                        onDeleteCustomer={(row) => onDeleteCustomer(row)}
                        customerDTO={sidebar.data}
                    />
                    }
                    {sidebar.showCreateCustomer &&
                    <ManageCustomer
                        getToken={() => getToken()}
                        backToEditCustomer={(customerDTO) => backToEditCustomer(customerDTO)}
                        backToCustomerTable={() => backToCustomerTable()}
                        addSuperUserHandler={(customerDTO) => addSuperUserHandler(customerDTO)}
                        customerDTO={sidebar.data}
                        onSave={setCustomers}
                    />
                    }
                    {sidebar.showUserList &&
                    <UserList
                        onEditUser={(row) => onEditUser(row)}
                        onDeleteUser={(row) => onDeleteUser(row)}
                        addUserHandler={(customerDTO) => addUserHandler(customerDTO)}
                        customerDTO={sidebar.data}
                        userDTO={sidebar.data2}
                        getToken={() => getToken()}
                        users={users.data}
                        user={user.email}
                    />
                    }
                    {sidebar.showCreateUser &&
                    <ManageCustomersUser
                        rolelist={rolelist}
                        getToken={() => getToken()}
                        editUserHandler={() => editUserHandler()}
                        onSave={setUsers}
                        customerDTO={sidebar.data}
                        userDTO={sidebar.data2}
                    />
                    }
                </div>
            </div>
        </div>
    )
}