import React, { useState, useEffect } from 'react'
import './TrainPicker.scoped.css'
import Innerbar from './innerbar/Innerbar'
import CreateTrain from './createTrain/CreateTrain'
import EditTrain from './editTrain/EditTrain'
import Spinner from 'react-bootstrap/Spinner'
import TrainService from '../../api/trains';

export default function TrainPicker() {
    const [showCreateTrain, setShowCreateTrain] = useState(false);
    const [showEditTrain, setShowEditTrain] = useState(false);
    const [selectedTrain, setSelectedTrain] = useState();
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [trains, setTrains] = useState([]);

    useEffect(() => {
        const fetchTrains = async () => {
            setLoading(true);
            const { data, error } = await TrainService.getTrains();
            data ? setTrains(data) : setError(error);
            setLoading(false);
        }
        fetchTrains();
    }, [])

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

    function createTrainHandler() {
        if (showEditTrain) {
            setShowEditTrain(false);
            setSelectedTrain(undefined);
        }
        setShowCreateTrain(!showCreateTrain)
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
            />

            {showCreateTrain &&
                <CreateTrain
                    onHide={createTrainHandler}
                    setTrains={setTrains}
                />}

            {showEditTrain && selectedTrain &&
                <EditTrain
                    isLoading={isLoading}
                    train={selectedTrain}
                    onHide={() => setShowEditTrain(false)}
                    onUpdateTrain={updateTrain}
                />}
        </div>
    )
}