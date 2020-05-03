import React, { useState, useEffect } from 'react'
import Innerbar from './innerbar/Innerbar'
import { useParams } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import CreateJourney from "./innerbar/journeys/createjourney/CreateJourney";
import TrainService from '../../api/trains';
import './TrainDetails.scoped.css';
import EditJourney from './innerbar/journeys/editjourney/EditJourney';

export default function TrainDetails() {
    // Fetch train state
    const [train, setTrain] = useState();
    const [fetchingTrain, setFetchingTrain] = useState(false);
    const [fetchingTrainError, setFetchingTrainError] = useState('');

    /* state for create/edit journey  */
    const [showCreateJourney, setShowCreateJourney] = useState(false);
    const [showEditJourney, setShowEditJourney] = useState(false);
    const [selectedJourney, setSelectedJourney] = useState();

    const { trainid } = useParams();

    useEffect(() => {
        getTrain(trainid);
    }, [trainid])

    const getTrain = async (trainid) => {
        setFetchingTrain(true);
        const { data, error } = await TrainService.getTrain(trainid);
        if (data) {
            setTrain(data);
        } else {
            setFetchingTrainError(error);
        }
        setFetchingTrain(false);
    }

    function showEditJourneyHandler(selectedJourney) {
        if (selectedJourney) {
            console.log("TrainDetails: ", selectedJourney)
            setSelectedJourney(selectedJourney);
            setShowEditJourney(true);
        }
    }

    if (fetchingTrainError) {
        return (<div className="d-flex justify-content-center align-items-center w-100">
            {fetchingTrainError}
        </div>)
    }

    if (fetchingTrain) {
        return (
            <div className="d-flex justify-content-center align-items-center w-100" >
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            </div >
        )
    }

    return (
        <div className="content overflow-auto">
            {!fetchingTrain && train &&
                <Innerbar
                    train={train}
                    setShowCreateJourney={setShowCreateJourney}
                    setShowEditJourney={showEditJourneyHandler}
                />
            }

            {showCreateJourney &&
                <CreateJourney
                    train={train}
                    onHide={() => setShowCreateJourney(false)}
                    setTrain={setTrain}
                />
            }

            {showEditJourney &&
                <EditJourney
                    train={train}
                    selectedJourney={selectedJourney}
                    onHide={() => setShowEditJourney(false)}
                    setTrain={setTrain}
                />
            }

        </div>
    )
}