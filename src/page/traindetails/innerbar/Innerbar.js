import React, { useState } from 'react'
import { TRAIN_TYPES } from '../../../utils/constants'
import './Innerbar.scoped.css';
import JourneysPicker from "./journeys/journeyspicker/JourneysPicker";
import CreateTraction from './composition/createTraction/CreateTraction';
// import Composition from './composition/Composition';

export default function Innerbar({
    train, setShowCreateJourney, setShowEditJourney,
    selectedJourney, setSelectedJourney,
    setShowCreateWagon,
    setTrain, setJourneyAndTrainHandler, showEditMode, fetchTrain, getToken 
}) {

    const [showCreateTraction, setShowCreateTraction] = useState(false);
    const [journey, setJourney] = useState();

    function createTractionHandler(journey) {
        setShowCreateTraction(true);
        setJourney(journey);
    }

    return (
        <div className="d-flex flex-column" style={{ flex: 1, overflow: "auto", padding: "32px 40px" }}>

            <div className="td-wrapper">
                <label><li className="fas fa-train"></li></label>
                <span>Train</span>
                <span>{train.operationalTrainNumber}</span>
                <span>{TRAIN_TYPES[train.trainType].summary}</span>
                <span>{new Date(train.scheduledTimeAtHandover).toLocaleString()}</span>
            </div>

            <div style={{ marginBottom: "30px" }} className="td-journeyspicker">
                <JourneysPicker
                    train={train}
                    setShowCreateJourney={setShowCreateJourney}
                    createTractionHandler={createTractionHandler}
                    setShowEditJourney={setShowEditJourney}
                    selectedJourney={selectedJourney}
                    selectedJourneyHandler={setSelectedJourney}
                    getToken={getToken}
                    train={train}
                    selectedJourney={selectedJourney}
                    setShowCreateWagon={setShowCreateWagon}
                    setTrain={setTrain}
                    setJourneyAndTrainHandler={setJourneyAndTrainHandler}
                    showEditMode={showEditMode}
                    fetchTrain={fetchTrain}
                />
            </div>
            {showCreateTraction && <CreateTraction
                    getToken={() => getToken()}
                    onHide={() => setShowCreateTraction(false)}
                    selectedJourney={journey}
                    setSelectedJourney={setJourney}
                    
                />}
            {/* <div style={{ marginBottom: "30px" }} className="td-journeyspicker">
                <Composition
                    getToken={getToken}
                    train={train}
                    selectedJourney={selectedJourney}
                    setShowCreateTraction={setShowCreateTraction}
                    setShowCreateWagon={setShowCreateWagon}
                    setTrain={setTrain}
                    setJourneyAndTrainHandler={setJourneyAndTrainHandler}
                    showEditMode={showEditMode}
                    fetchTrain={fetchTrain}
                />
            </div> */}

        </div >
    )
}
