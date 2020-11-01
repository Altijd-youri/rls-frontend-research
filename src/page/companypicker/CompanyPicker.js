import React, { useState, useCallback, useEffect } from 'react'
import '../assets/picker.scoped.css'
import Spinner from 'react-bootstrap/Spinner'
import { useAuth0 } from '../../react-auth0-spa';
import { hasPermissions } from '../../utils/scopeChecker';
import CompanyTable from './table/CompanyTable';
import ManageCompany from './manageCompany/ManageCompany';
import CompanyService from '../../api/company';

export default function CompanyPicker() {

    const [owners, setOwners] = useState({ data: [], isFetching: false, error: '' });
    const { getTokenSilently } = useAuth0();

    const initSidebar = { showManageCompany: false, data: undefined }
    const [sidebar, setSidebar] = useState(initSidebar)

    useEffect(() => {
        if (sidebar.data) {
            const newObject = owners.data.find(item => item.id === sidebar.data.id);
            setSidebar(prevState => ({ ...prevState, data: newObject }))
        }
    }, [owners, sidebar.data])

    const getToken = useCallback(async () => {
        const token = await getTokenSilently();
        return token;
    }, [getTokenSilently]);

    useEffect(() => {
        const fetchOwners = async () => {
            setOwners(prevState => ({ ...prevState, isFetching: true, data: [], error: '' }))
            try {
                const { data, error } = await CompanyService.getAll(await getToken());
                // const { data, error } = await OwnerService.getAll(await getToken());
                if (data) {
                    setOwners(prevState => ({ ...prevState, isFetching: false, data }))
                } else {
                    throw new Error(error)
                }
            } catch (e) {
                setOwners(prevState => ({ ...prevState, isFetching: false, error: e.message }))
            }
        }
        fetchOwners();
    }, [getToken])

    const closeAllSidebars = () => {
        setSidebar(initSidebar);
    }

    const addCompanyHandler = () => {
        closeAllSidebars();
        setSidebar(prevState => ({ ...prevState, showManageCompany: true, data: undefined }))
    }

    const editOwnerHandler = (owner) => {
        closeAllSidebars();
        setSidebar(prevState => ({ ...prevState, showManageCompany: true, data: owner }))
    }

    const deleteOwnerHandler = async (owner) => {
            try {
                const { error } = await CompanyService.deleteCompany(owner.companyCode ,await getToken());
                if (error) throw new Error(error)
            } catch (e) {
                console.log("Failed delete request")
            }


    }

    if (owners.isFetching) {
        return (
            <div className="d-flex justify-content-center align-items-center w-100" >
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading companies...</span>
                </Spinner>
            </div >
        )
    }

    if (owners.error) {
        return (<div className="d-flex justify-content-center align-items-center w-100">
            Failed to fetch companies: {owners.error}
        </div>)
    }

    return (
        <div className="content">
            <div className="inner">
                <div className="inner-box">
                    <div className="content-title">
                        <h4>
                            Companies
                    </h4>
                    {/* TODO addCompanyHandler moet naar create company page leiden */}
                        {hasPermissions(["write:user"]) && <span className="d-flex align-items-center add-btn" onClick={addCompanyHandler}> 
                            Add Company
                        <i className="fas fa-plus"></i>
                        </span>}
                    </div>
                    <CompanyTable onEditOwner={editOwnerHandler} owners={owners.data} 
                    onDeleteOwner={deleteOwnerHandler} owners={owners.data} />
                </div>
            </div>

            {sidebar.showManageCompany &&
                <ManageCompany
                    getToken={() => getToken()}
                    onHide={closeAllSidebars}
                    onSave={setOwners}
                    ownerDTO={sidebar.data}
                />}
        </div>
    )
}
