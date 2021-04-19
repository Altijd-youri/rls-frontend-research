import React from 'react'
import { TRAIN_TYPES } from '../../../utils/constants'
import './Innerbar.scoped.css';
import JourneysPicker from "./journeys/journeyspicker/JourneysPicker";
// import Composition from './composition/Composition';

export default function Innerbar({
    train, setShowCreateJourney, setShowEditJourney,
    selectedJourney, setSelectedJourney,
    setShowCreateTraction, setShowCreateWagon,
    setTrain, setJourneyAndTrainHandler, showEditMode, fetchTrain, getToken 
}) {


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
                    setShowEditJourney={setShowEditJourney}
                    selectedJourney={selectedJourney}
                    selectedJourneyHandler={setSelectedJourney}
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
            </div>

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
