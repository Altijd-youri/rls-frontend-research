import React, {useState, useEffect, useCallback} from 'react'
import '../assets/picker.scoped.css'
import Spinner from 'react-bootstrap/Spinner'
import WagonService from '../../api/wagon';
import WagonTable from './table/WagonTable';
import ManageWagon from './manageWagon/ManageWagon';
import {useAuth0} from '../../react-auth0-spa';
import {hasPermissions} from '../../utils/scopeChecker';
import {confirmAlert, errorAlert, succeedAlert} from "../../utils/Alerts";
import UserService from "../../api/user";
import EditTrain from "../trainpicker/editTrain/EditTrain";
import CustomerTable from "../customerpicker/table/CustomerTable";
import ManageTraction from "../tractionpicker/manageTraction/ManageTraction";
import wagon from "../../api/wagon";

export default function WagonPicker() {
    const [wagons, setWagons] = useState({data: [], isFetching: false, error: ''});
    const {getTokenSilently} = useAuth0();

    const initSidebar = {
        showEditWagon: false,
        showCreateWagon: false,
        showWagonTable: true,
        data: undefined
    }
    const [sidebar, setSidebar] = useState(initSidebar)

    const getToken = useCallback(async () => {
        const token = await getTokenSilently();
        return token;
    }, [getTokenSilently]);

    useEffect(() => {
        const fetchWagons = async () => {
            setWagons(prevState => ({...prevState, isFetching: true, data: [], error: ''}))
            try {
                const {data, error} = await WagonService.getWagons(await getToken());
                if (data) {
                    setWagons(prevState => ({...prevState, isFetching: false, data}))
                } else {
                    throw new Error(error)
                }
            } catch (e) {
                setWagons(prevState => ({...prevState, isFetching: false, error: e.message}))
            }
        }
        fetchWagons();
    }, [getToken])

    const closeAllSidebars = () => {
        setSidebar(initSidebar);
    }

    const editWagonHandler = (wagon) => {
        closeAllSidebars();
        if (wagon) {
            setSidebar(prevState => ({...prevState, data: wagon, showCreateWagon: true}))
        }
    }

    const onDeleteWagon = (wagon) => {
        confirmAlert(async () => {
            try {
                const result = await WagonService.deleteWagon(wagon.id, await getToken());

                if (result.data.response.status === 200) {
                    let updatedList = wagons.data.filter((u) => u.id !== wagon.id)
                    setWagons({data: updatedList});
                    succeedAlert();
                } else {
                    errorAlert(result.error.message)
                }
            } catch (e) {
                errorAlert("Failed delete request ", e.message)
            }
        })
    }

    const createWagonHandler = () => {
        closeAllSidebars();
        setSidebar(prevState => ({...prevState, showCreateWagon: true}))
    }

    if (wagons.isFetching) {
        return (
            <div className="d-flex justify-content-center align-items-center w-100">
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading wagons...</span>
                </Spinner>
            </div>
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
                        {hasPermissions(["write:wagon"]) &&
                        <span className="d-flex align-items-center add-btn" onClick={createWagonHandler}>
                            Add Wagon
                        <i className="fas fa-plus"></i>
                        </span>}
                    </div>
                    <WagonTable onEditWagon={editWagonHandler} onDeleteWagon={(row) => onDeleteWagon(row)} wagons={wagons.data} />
                </div>
            </div>
                {sidebar.showCreateWagon &&
                <ManageWagon
                    getToken={() => getToken()}
                    onHide={closeAllSidebars}
                    onSave={setWagons}
                    wagonDTO={sidebar.data}
                />}
                {sidebar.showEditWagon &&
                <WagonTable>
                    getToken={() => getToken()}
                    onHide={closeAllSidebars}
                    wagons = {wagons.data}
                </WagonTable>}
</div>
)
}
