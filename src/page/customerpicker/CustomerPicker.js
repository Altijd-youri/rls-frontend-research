
import React, { useState, useCallback, useEffect } from 'react'
import '../assets/picker.scoped.css'
import Spinner from 'react-bootstrap/Spinner'
import { useAuth0 } from '../../react-auth0-spa';
import { hasPermissions } from '../../utils/scopeChecker';
import CustomerTable from './table/CustomerTable';
import CustomerService from '../../api/customer';
import ManageCustomer from './ManageCustomer/ManageCustomer';

export default function CustomerPicker() {

    const [customers, setCustomers] = useState({ data: [], isFetching: false, error: ''});
    const { getTokenSilently } = useAuth0();

    // const initSidebar = { showCustomerTable: true, data: undefined }
    const initSidebar = { showCustomerTable: true, showCreateCustomer: false, data: undefined }
    const [sidebar, setSidebar] = useState(initSidebar)

    useEffect(() => {
        if (sidebar.data) {
            const newObject = customers.data.find(item => item.id === sidebar.data.id);
            setSidebar(prevState => ({ ...prevState, data: newObject }))
        }
    }, [customers, sidebar.data])

    const getToken = useCallback(async () => {
        const token = await getTokenSilently();
        return token;
    }, [getTokenSilently]);

    const onEditCustomer = (customerDTO) => {
        closeAllSidebars();
        setSidebar(prevState => ({ ...prevState, showCustomerTable: false, showCreateCustomer: true, data: customerDTO}))
    }

    const onDeleteCustomer = async (customerDTO) => {
        let temptoken = await getToken();
        const deleteBody = {
            "token": temptoken,
            "customerid": customerDTO.id
        }
        CustomerService.delete(deleteBody, temptoken)
    }

    useEffect(() => {
        const fetchCustomers = async () => {
            setCustomers(prevState => ({ ...prevState, isFetching: true, data: [], error: ''}))
            try {
                const { data, error } = await CustomerService.getAll(await getToken());
                if (data) {
                    setCustomers(prevState => ({ ...prevState, isFetching: false, data}))
                } else {
                    throw new Error(error)
                }
            } catch (e) {
                setCustomers(prevState => ({ ...prevState, isFetching: false, error: e.message }))
            }
        }
        fetchCustomers();
    }, [getToken])

    const closeAllSidebars = () => {
        setSidebar(initSidebar);
    }

    const addCustomerHandler = () => {
        closeAllSidebars();
        setSidebar(prevState => ({ ...prevState, showCustomerTable: false, showCreateCustomer: true, data: undefined}))
        // setSidebar(prevState => ({ ...prevState, showManageCompany: true, data: undefined }))
    }

    const backToCustomerTable = () => {
        closeAllSidebars();
        setSidebar(prevState => ({ ...prevState, showCustomerTable: true, showCreateCustomer: false, data: undefined}))
    }

    if (customers.isFetching) {
        return (
            <div className="d-flex justify-content-center align-items-center w-100" >
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading customers...</span>
                </Spinner>
            </div >
        )
    }

    if (customers.error) {
        return (<div className="d-flex justify-content-center align-items-center w-100">
            Failed to fetch customers: {customers.error}
        </div>)
    }


    return (
        <div className="content">
            <div className="inner">
                <div className="inner-box">
                    <div className="content-title">
                        <h4>
                                Customers
                        </h4>
                        
                        <div hidden={sidebar.showCreateCustomer}>
                                  {hasPermissions(["write:user"]) && <span className="d-flex align-items-center add-btn" onClick={addCustomerHandler}> 
                            Add Customer
                        <i className="fas fa-plus"></i>
                        </span>}
                        </div>

                        <div hidden={sidebar.showCustomerTable}>
                                  {hasPermissions(["write:user"]) && <span className="d-flex align-items-center add-btn" onClick={backToCustomerTable}> 
                            Close
                        <i className="fas fa-times"></i>
                        </span>}                  
                        </div>

                    </div>

                    {sidebar.showCustomerTable && 
                            <CustomerTable customers={customers.data} 
                            onEditCustomer={(row) => onEditCustomer(row)}
                            onDeleteCustomer={(row) => onDeleteCustomer(row)}
                            customerDTO={sidebar.data}
                        />
                    }
                    {sidebar.showCreateCustomer &&
                        <ManageCustomer 
                            getToken={() => getToken()}
                            onEditCustomer={(row) => onEditCustomer(row)}
                            onDeleteCustomer={(row) => onDeleteCustomer(row)}
                            customerDTO={sidebar.data}
                        />
                    }
                </div>
            </div>
        </div>
    )
}