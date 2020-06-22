import React, { useState, useEffect } from 'react'
import '../assets/picker.scoped.css'
import Spinner from 'react-bootstrap/Spinner'
import WagonService from '../../api/wagon';
import WagonTable from './table/WagonTable';
import ManageWagon from './manageWagon/ManageWagon';
export default function WagonPicker() {
    const [wagons, setWagons] = useState({ data: [], isFetching: false, error: '' });

    const initSidebar = { showEditWagon: false, showCreateWagon: false, data: undefined }
    const [sidebar, setSidebar] = useState(initSidebar)

    useEffect(() => {
        fetchWagons();
    }, [])

    const fetchWagons = async () => {
        setWagons(prevState => ({ ...prevState, isFetching: true, data: [], error: '' }))
        try {
            const { data, error } = await WagonService.getWagons();
            if (data) {
                setWagons(prevState => ({ ...prevState, isFetching: false, data }))
            } else {
                throw new Error(error)
            }
        } catch (e) {
            setWagons(prevState => ({ ...prevState, isFetching: false, error: e.message }))
        }
    }

    const closeAllSidebars = () => {
        setSidebar(initSidebar);
    }

    const editWagonHandler = (wagon) => {
        closeAllSidebars();
        if (wagon) {
            setSidebar(prevState => ({ ...prevState, data: wagon, showCreateWagon: true }))
        }
    }

    const createWagonHandler = () => {
        closeAllSidebars();
        setSidebar(prevState => ({ ...prevState, showCreateWagon: true }))
    }

    if (wagons.isFetching) {
        return (
            <div className="d-flex justify-content-center align-items-center w-100" >
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading wagons...</span>
                </Spinner>
            </div >
        )
    }

    if (wagons.error) {
        return (<div className="d-flex justify-content-center align-items-center w-100">
            Failed to fetch wagons: {wagons.error}
        </div>)
    }

    return (
        <div className="content">
            <div className="inner">
                <div className="inner-box">
                    <div className="content-title">
                        <h4>
                            All wagons
                    </h4>
                        <span className="d-flex align-items-center add-btn" onClick={createWagonHandler}>
                            Add Wagon
                        <i className="fas fa-plus"></i>
                        </span>
                    </div>
                    <WagonTable onEditWagon={editWagonHandler} wagons={wagons.data} />
                </div>
            </div>

            {sidebar.showCreateWagon &&
                <ManageWagon
                    onHide={closeAllSidebars}
                    onSave={setWagons}
                    wagonDTO={sidebar.data}
                />}

            {/* {sidebar.showEditTraction &&
                <EditTraction
                    traction={sidebar.data}
                    onHide={closeAllSidebars}
                    onSave={setWagons}
                />} */}
        </div>
    )
}
