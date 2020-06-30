import React, { useState, useEffect, useCallback } from 'react'
import Innerbar from './innerbar/Innerbar'
import { useParams, useHistory } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import CreateJourney from "./innerbar/journeys/createjourney/CreateJourney";
import TrainService from '../../api/trains';
import './TrainDetails.scoped.css';
import EditJourney from './innerbar/journeys/editjourney/EditJourney';
import CreateTraction from './innerbar/composition/createTraction/CreateTraction';
import CreateWagon from './innerbar/composition/createWagon/CreateWagon';
import EditWagon from './innerbar/composition/editWagon/EditWagon';
import EditTraction from './innerbar/composition/editTraction/EditTraction';
import { useAuth0 } from '../../react-auth0-spa';

export default function TrainDetails() {
    // Fetch train state
    const [train, setTrain] = useState();
    const [fetchingTrain, setFetchingTrain] = useState(false);

    /* state for create/edit journey  */
    const [showCreateJourney, setShowCreateJourney] = useState(false);
    const [showEditJourney, setShowEditJourney] = useState(false);
    const [selectedJourney, setSelectedJourney] = useState();

    /* State for adding traction/wagon */
    const [showCreateTraction, setShowCreateTraction] = useState(false);
    const [showCreateWagon, setShowCreateWagon] = useState(false);

    /* State for editing traction/wagon */
    const initialCompositionManagerState = { data: undefined, showWagonEditor: false, showTractionEditor: false }
    const [compositionManager, setCompositionManager] = useState(initialCompositionManagerState)

    const { trainid } = useParams();
    const history = useHistory();
    const { getTokenSilently } = useAuth0();

    const getToken = useCallback(async () => {
        const token = await getTokenSilently();
        return token;
    }, [getTokenSilently]);

    const getTrain = useCallback(async () => {
        setFetchingTrain(true);
        const { data } = await TrainService.getTrain(trainid, await getToken());
        if (data) {
            setTrain(data);
        } else {
            history.push('/')
        }
        setFetchingTrain(false);
    }, [history, trainid, getToken])

    useEffect(() => {
        getTrain();
    }, [getTrain])

    useEffect(() => {
        if (selectedJourney) {
            const newJourney = train.journeySections.find(journey => journey.id === selectedJourney.id);
            if (newJourney !== selectedJourney) {
                setSelectedJourney(prevState => newJourney ?? prevState);
            }
        }
    }, [train, selectedJourney])

    const closeAllSidebars = () => {
        setCompositionManager(initialCompositionManagerState);
        setShowCreateTraction(false);
        setShowCreateWagon(false);
        setShowCreateJourney(false);
        setShowEditJourney(false);
    }

    const showEditJourneyHandler = () => {
        closeAllSidebars()
        setShowEditJourney(true);

    }

    const setCreateJourneyHandler = () => {
        closeAllSidebars()
        setShowCreateJourney(true);
    }

    const showCreateTractionHandler = () => {
        closeAllSidebars()
        setShowCreateTraction(true);
    }

    const showCreateWagonHandler = () => {
        closeAllSidebars()
        setShowCreateWagon(true);
    }

    const processCompositionManager = (updatedJourneySection) => {
        const newSize = updatedJourneySection.trainComposition.rollingStock.length
        const prevSize = selectedJourney.trainComposition.rollingStock.length

        if (newSize < prevSize) {
            setCompositionManager(initialCompositionManagerState)
        }
    }

    const selectedJourneyHandler = (selectedJourney) => {
        processCompositionManager(selectedJourney)
        setSelectedJourney(selectedJourney);
        setTrain(prevState => {
            const newJourneySectionsList = prevState.journeySections.filter(item => item.id !== selectedJourney.id)
            newJourneySectionsList.push(selectedJourney);
            newJourneySectionsList.sort((a, b) => a.id - b.id)
            return ({ ...prevState, journeySections: newJourneySectionsList })
        })
    }

    const showCompositionEditorHandler = (item) => {
        const { stockType } = item
        closeAllSidebars()
        if (stockType === "traction") {
            return setCompositionManager(prevState => ({ ...prevState, data: item, showTractionEditor: true, showWagonEditor: false }))
        } else if (stockType === "wagon") {
            return setCompositionManager(prevState => ({ ...prevState, data: item, showTractionEditor: false, showWagonEditor: true }))
        }
        setCompositionManager(prevState => ({ ...prevState, data: undefined, showTractionEditor: false, showWagonEditor: false }))
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
                    getToken={() => getToken()}
                    train={train}
                    selectedJourney={selectedJourney}
                    setSelectedJourney={setSelectedJourney}
                    setShowCreateJourney={setCreateJourneyHandler}
                    setShowEditJourney={showEditJourneyHandler}
                    setShowCreateTraction={showCreateTractionHandler}
                    setShowCreateWagon={showCreateWagonHandler}
                    setTrain={setTrain}
                    setJourneyAndTrainHandler={selectedJourneyHandler}
                    showEditMode={showCompositionEditorHandler}
                    fetchTrain={() => getTrain()}
                />
            }

            {showCreateJourney &&
                <CreateJourney
                    getToken={() => getToken()}
                    train={train}
                    onHide={() => setShowCreateJourney(false)}
                    setTrain={setTrain}
                />
            }

            {showEditJourney &&
                <EditJourney
                    getToken={() => getToken()}
                    selectedJourney={selectedJourney}
                    onHide={() => setShowEditJourney(false)}
                    setJourneyAndTrainHandler={selectedJourneyHandler}
                />
            }

            {showCreateTraction &&
                <CreateTraction
                    getToken={() => getToken()}
                    onHide={() => setShowCreateTraction(false)}
                    selectedJourney={selectedJourney}
                    setSelectedJourney={selectedJourneyHandler}
                />
            }

            {showCreateWagon &&
                <CreateWagon
                    getToken={() => getToken()}
                    onHide={() => setShowCreateWagon(false)}
                    selectedJourney={selectedJourney}
                    setSelectedJourney={selectedJourneyHandler}
                />
            }

            {compositionManager.showWagonEditor &&
                <EditWagon
                    getToken={() => getToken()}
                    onHide={() => setCompositionManager(prevState => ({ ...prevState, showWagonEditor: false, data: undefined }))}
                    selectedJourney={selectedJourney}
                    setSelectedJourney={selectedJourneyHandler}
                    data={compositionManager.data}
                />
            }

            {compositionManager.showTractionEditor &&
                <EditTraction
                    getToken={() => getToken()}
                    onHide={() => setCompositionManager(prevState => ({ ...prevState, showTractionEditor: false, data: undefined }))}
                    selectedJourney={selectedJourney}
                    setSelectedJourney={selectedJourneyHandler}
                    data={compositionManager.data}
                />
            }

        </div>
    )
}