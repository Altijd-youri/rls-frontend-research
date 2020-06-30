import React, { useState, useEffect, useCallback } from 'react'
import '../assets/picker.scoped.css'
import Spinner from 'react-bootstrap/Spinner'
import TractionService from '../../api/tractions';
import TractionTable from './table/TractionTable';
import ManageTraction from './manageTraction/ManageTraction';
import { useAuth0 } from '../../react-auth0-spa';
import { hasPermissions } from '../../utils/scopeChecker';

export default function TrainPicker() {
    const [tractions, setTractions] = useState({ data: [], isFetching: false, error: '' });
    const { getTokenSilently } = useAuth0();

    const initSidebar = { showManageTraction: false, data: undefined }
    const [sidebar, setSidebar] = useState(initSidebar)

    const getToken = useCallback(async () => {
        const token = await getTokenSilently();
        return token;
    }, [getTokenSilently]);

    useEffect(() => {
        const fetchTractions = async () => {
            setTractions(prevState => ({ ...prevState, isFetching: true, data: [], error: '' }))
            try {
                const { data, error } = await TractionService.getTractions(await getToken());
                if (data) {
                    setTractions(prevState => ({ ...prevState, isFetching: false, data }))
                } else {
                    throw new Error(error)
                }
            } catch (e) {
                setTractions(prevState => ({ ...prevState, isFetching: false, error: e.message }))
            }
        }
        fetchTractions();
    }, [getToken])

    const closeAllSidebars = () => {
        setSidebar(initSidebar);
    }

    const editTractionHandler = (traction) => {
        closeAllSidebars();
        if (traction) {
            setSidebar(prevState => ({ ...prevState, data: traction, showManageTraction: true }))
        }
    }

    const createTractionHandler = () => {
        closeAllSidebars();
        setSidebar(prevState => ({ ...prevState, showManageTraction: true }))
    }

    if (tractions.isFetching) {
        return (
            <div className="d-flex justify-content-center align-items-center w-100" >
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading tractions...</span>
                </Spinner>
            </div >
        )
    }

    if (tractions.error) {
        return (<div className="d-flex justify-content-center align-items-center w-100">
            Failed to fetch tractions: {tractions.error}
        </div>)
    }

    return (
        <div className="content">
            <div className="inner">
                <div className="inner-box">
                    <div className="content-title">
                        <h4>
                            All tractions
                        </h4>
                        {hasPermissions(["write:traction"]) && <span className="d-flex align-items-center add-btn" onClick={createTractionHandler}>
                            Add traction
                        <i className="fas fa-plus"></i>
                        </span>}
                    </div>
                    <TractionTable onEditTraction={editTractionHandler} tractions={tractions.data} />
                </div>
            </div>

            {sidebar.showManageTraction &&
                <ManageTraction
                    getToken={() => getToken()}
                    onHide={closeAllSidebars}
                    onSave={setTractions}
                    tractionDTO={sidebar.data}
                />}
        </div>
    )
}
