import React, { useState, useEffect, useCallback } from 'react'
import './TrainPicker.scoped.css'
import Innerbar from './innerbar/Innerbar'
import CreateTrain from './createTrain/CreateTrain'
import EditTrain from './editTrain/EditTrain'
import Spinner from 'react-bootstrap/Spinner'
import TrainService from '../../api/trains';
import { useAuth0 } from '../../react-auth0-spa';
import { errorAlert, succeedAlert, confirmAlert } from '../../utils/Alerts'
import TractionService from "../../api/tractions";

export default function TrainPicker() {
    const [showCreateTrain, setShowCreateTrain] = useState(false);
    const [showEditTrain, setShowEditTrain] = useState(false);
    const [selectedTrain, setSelectedTrain] = useState();
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [trains, setTrains] = useState([]);
    const { getTokenSilently } = useAuth0();

    const getToken = useCallback(async () => {
        const token = await getTokenSilently();
        return token;
    }, [getTokenSilently]);

    useEffect(() => {
        const fetchTrains = async () => {
            setLoading(true);
            try {
                const { data, error } = await TrainService.getTrains(await getToken());
                if (data) {
                    setTrains(data);
                } else {
                    throw new Error(error)
                }
            } catch (e) {
                setError(e.message)
            }
            setLoading(false);
        }
        fetchTrains();
    }, [getToken])

    function updateTrain(train) {
        let newTrainsList = trains.filter((t) => t.id !== train.id);
        newTrainsList.push(train);
        newTrainsList.sort((a, b) => new Date(b.scheduledDateTimeAtTransfer) - new Date(a.scheduledDateTimeAtTransfer))
        setTrains(newTrainsList);
    }

    function editTrainHandler(train) {
        if (showCreateTrain) setShowCreateTrain(false);
        if (train) {
            setSelectedTrain(train);
            setShowEditTrain(true);
        }
    }

    const onDeleteTrain = (train) => {
        confirmAlert(async () => {
            try {
                const result = await TrainService.deleteTrain(train.id, await getToken());
                if (result.data.response.status === 200) {
                    //TODO refresh pagina bij deleten van een train

                    // let updatedList = trains.data.filter((u) => u.id !== train.id)
                    // setTrains({data: updatedList});
                    succeedAlert();
                } else {
                    errorAlert(result.error.message)
                }
            } catch (e) {
                errorAlert("Failed delete request ", e.message)
            }
        })
    }

    function createTrainHandler() {
        if (showEditTrain) {
            setShowEditTrain(false);
            setSelectedTrain(undefined);
        }
        setShowCreateTrain(!showCreateTrain)
    }

    const sendTcm = (train) => {
        confirmAlert(async () => {
            const result = await TrainService.sendTcm(await getToken(), train.id);
            if (result.data) {
                const updatedList = trains.map(item => {
                    if (item.id === result.data.id) {
                        return result.data;
                    } else {
                        return item;
                    }
                })
                setTrains(updatedList);
                succeedAlert();
            } else {
                errorAlert(result?.message)
                console.log("Failed! ", result.message);
            }
        })
    }

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center w-100" >
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            </div >
        )
    }

    if (error) {
        return (<div className="d-flex justify-content-center align-items-center w-100">
            {error}
        </div>)
    }

    return (
        <div className="content">

            <Innerbar
                isLoading={isLoading}
                onCreateTrain={createTrainHandler}
                onEditTrain={editTrainHandler}
                trains={trains}
                sendTcm={sendTcm}
                onDeleteTrain={(row) => onDeleteTrain(row)}
            />

            {showCreateTrain &&
                <CreateTrain
                    getToken={() => getToken()}
                    onHide={createTrainHandler}
                    setTrains={setTrains}
                />}

            {showEditTrain && selectedTrain &&
                <EditTrain
                    getToken={() => getToken()}
                    isLoading={isLoading}
                    train={selectedTrain}
                    onHide={() => setShowEditTrain(false)}
                    onUpdateTrain={updateTrain}
                />}
        </div>
    )
}
