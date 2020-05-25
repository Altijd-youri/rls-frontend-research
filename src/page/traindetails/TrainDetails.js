import React, { useState, useEffect } from 'react'
import Innerbar from './innerbar/Innerbar'
import { useParams } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import CreateJourney from "./innerbar/journeys/createjourney/CreateJourney";
import TrainService from '../../api/trains';
import './TrainDetails.scoped.css';
import EditJourney from './innerbar/journeys/editjourney/EditJourney';
import CreateTraction from './innerbar/composition/createTraction/CreateTraction';
import CreateWagon from './innerbar/composition/createWagon/CreateWagon';

export default function TrainDetails() {
    // Fetch train state
    const [train, setTrain] = useState();
    const [fetchingTrain, setFetchingTrain] = useState(false);
    const [fetchingTrainError, setFetchingTrainError] = useState('');

    /* state for create/edit journey  */
    const [showCreateJourney, setShowCreateJourney] = useState(false);
    const [showEditJourney, setShowEditJourney] = useState(false);
    const [selectedJourney, setSelectedJourney] = useState();

    /* State for adding traction/wagon */
    const [showCreateTraction, setShowCreateTraction] = useState(false);
    const [showCreateWagon, setShowCreateWagon] = useState(false);

    const { trainid } = useParams();

    useEffect(() => {
        getTrain(trainid);
    }, [trainid])

    useEffect(() => {
        if (selectedJourney) {
            const newJourney = train.journeySections.find(journey => journey.id === selectedJourney.id);
            if (newJourney !== selectedJourney) {
                setSelectedJourney(prevState => newJourney ?? prevState);
            }
        }
    }, [train, selectedJourney])

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

    const showEditJourneyHandler = () => {
        setShowCreateJourney(false);
        setShowEditJourney(true);
        setShowCreateWagon(false);
        setShowCreateTraction(false);
    }

    const setCreateJourneyHandler = () => {
        setShowCreateJourney(true);
        setShowEditJourney(false);
        setShowCreateWagon(false);
        setShowCreateTraction(false);
    }

    const showCreateTractionHandler = () => {
        setShowCreateWagon(false);
        setShowCreateTraction(true);
        setShowCreateJourney(false);
        setShowEditJourney(false);
    }

    const showCreateWagonHandler = () => {
        setShowCreateWagon(true);
        setShowCreateTraction(false);
        setShowCreateJourney(false);
        setShowEditJourney(false);
    }

    const selectedJourneyHandler = (selectedJourney) => {
        setSelectedJourney(selectedJourney);
        setTrain(prevState => {
            const newJourneySectionsList = prevState.journeySections.filter(item => item.id !== selectedJourney.id)
            newJourneySectionsList.push(selectedJourney);
            newJourneySectionsList.sort((a, b) => a.id - b.id)
            return ({ ...prevState, journeySections: newJourneySectionsList })
        })
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
                    selectedJourney={selectedJourney}
                    setSelectedJourney={setSelectedJourney}
                    setShowCreateJourney={setCreateJourneyHandler}
                    setShowEditJourney={showEditJourneyHandler}
                    setShowCreateTraction={showCreateTractionHandler}
                    setShowCreateWagon={showCreateWagonHandler}
                    setTrain={setTrain}
                    setJourneyAndTrainHandler={selectedJourneyHandler}
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
                    selectedJourney={selectedJourney}
                    onHide={() => setShowEditJourney(false)}
                    setJourneyAndTrainHandler={selectedJourneyHandler}
                />
            }

            {showCreateTraction &&
                <CreateTraction
                    onHide={() => setShowCreateTraction(false)}
                    selectedJourney={selectedJourney}
                    setSelectedJourney={selectedJourneyHandler}
                />
            }

            {showCreateWagon &&
                <CreateWagon
                    onHide={() => setShowCreateWagon(false)}
                    selectedJourney={selectedJourney}
                    setSelectedJourney={selectedJourneyHandler}
                />
            }

        </div>
    )
}