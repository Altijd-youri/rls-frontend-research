import React, { useState, useCallback, useEffect } from 'react'
import '../assets/picker.scoped.css'
import Spinner from 'react-bootstrap/Spinner'
import { useAuth0 } from '../../react-auth0-spa';
import { hasPermissions } from '../../utils/scopeChecker';
import CompanyTable from './table/CompanyTable';
import ManageCompany from './manageCompany/ManageCompany';
import CompanyService from '../../api/company';

export default function CompanyPicker() {

    const [companies, setCompanies] = useState({ data: [], isFetching: false, error: '' });
    const { getTokenSilently } = useAuth0();

    const initSidebar = { showCompanyTable: true, showManageCompany: false, data: undefined }
    const [sidebar, setSidebar] = useState(initSidebar)

    useEffect(() => {
        if (sidebar.data) {
            const newObject = companies.data.find(item => item.id === sidebar.data.id);
            setSidebar(prevState => ({ ...prevState, data: newObject }))
        }
    }, [companies, sidebar.data])

    const getToken = useCallback(async () => {
        const token = await getTokenSilently();
        return token;
    }, [getTokenSilently]);

    /** Fetch list of companies and set in companies data */
    useEffect(() => {
        const fetchCompanies = async () => {
            setCompanies(prevState => ({ ...prevState, isFetching: true, data: [], error: '' }))
            try {
                const { data, error } = await CompanyService.getAll(await getToken());
                if (data) {
                    setCompanies(prevState => ({ ...prevState, isFetching: false, data}))
                } else {
                    throw new Error(error)
                }
            } catch (e) {
                setCompanies(prevState => ({ ...prevState, isFetching: false, error: e.message }))
            }
        }
        fetchCompanies();
    }, [getToken])

    if (companies.isFetching) {
        return (
            <div className="d-flex justify-content-center align-items-center w-100" >
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading companies...</span>
                </Spinner>
            </div >
        )
    }

    if (companies.error) {
        return (<div className="d-flex justify-content-center align-items-center w-100">
            Failed to fetch companies: {companies.error}
        </div>)
    }

    function handleChange(e) {
        console.log(e)
    }


    return (
        <div className="content">
            <div className="inner">
                <div className="inner-box">
                    <div className="content-title">
                        <h4>
                            Companies
                        </h4>
                    </div>

                    
                    {sidebar.showCompanyTable && 
                        <CompanyTable companies={companies.data} />
                    }
                    {sidebar.showCreateCompany &&
                        <ManageCompany 
                            getToken={() => getToken()}
                            handleChange={() => handleChange()}
                            CompanyService={CompanyService}
                        />
                    }
                </div>
            </div>
        </div>
    )
}
