import React from 'react'
import {TRAIN_TYPES} from '../../../utils/constants';
import {useHistory} from 'react-router-dom';
import './TrainTable.scoped.css';

export default function TrainTable({trains, onEditTrain}) {
    let history = useHistory();

    if (!trains.length) {
        return (
            <div style={{
                border: "2px dashed #e4e8f6",
                padding: "25px",
                display: "flex",
                alignContent: "center",
                justifyContent: "center"
            }}>No trains found</div>
        )
    }

    return (
        <div className="recents">
            <ul>
                {trains.map((train, index) => {
                    return (
                        <li key={index}>
                        <span style={{cursor: "pointer"}} onClick={() => history.push(`train/${train.id}/details`)}>
                            <i className="fa fa-train"></i>
                            <span>{train.operationalTrainNumber}</span>
                        </span>
                            <div className="train-type" style={{cursor: "pointer"}}
                                 onClick={() => history.push(`train/${train.id}/details`)}>
                                {TRAIN_TYPES[train.trainType].summary}
                            </div>
                            <div className="departure" style={{cursor: "pointer"}}
                                 onClick={() => history.push(`train/${train.id}/details`)}>
                                {train.transferPoint}
                            </div>

                            <div className="departure-time" style={{cursor: "pointer"}}
                                 onClick={() => history.push(`train/${train.id}/details`)}>
                                {new Date(train.scheduledTimeAtHandover).toLocaleString()}
                            </div>
                            <div className="edit">
                                <i onClick={() => onEditTrain(train)} className="fa fa-ellipsis-h"></i>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
