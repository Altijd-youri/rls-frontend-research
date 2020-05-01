import React from 'react'
import { TRAIN_TYPES } from '../../../utils/constants'
import './Innerbar.scoped.css';
import JourneysPicker from "./journeys/journeyspicker/JourneysPicker";

export default function Innerbar({ train, locations, setShowCreateJourney }) {

    function setJourney(journey) {

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

            <div style={{marginBottom: "30px"}} className="td-journeyspicker">
                <JourneysPicker
                    train={train}
                    locations={locations}
                    setShowCreateJourney={setShowCreateJourney}
                />
            </div>
        </div >
    )
}
