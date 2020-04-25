import React from 'react'
import { TRAIN_TYPES } from '../../../../utils/constants';

export default function TrainTable({ trains }) {

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
        <ul>
            {trains.map((train, index) => {
                return (
                    <li key={index}>
                        <a style={{ cursor: "pointer" }}>
                            <i className="fa fa-train"></i>
                            <span>{train.operationalTrainNumber}</span>
                        </a>
                        <div className="train-type">
                            {TRAIN_TYPES[train.trainType].summary}
                        </div>
                        <div className="departure">
                            {train.transferPoint}
                        </div>

                        <div className="departure-time">
                            {new Date(train.scheduledTimeAtHandover).toLocaleString()}
                        </div>
                        <div className="more">
                            <i className="fa fa-ellipsis-h"></i>
                        </div>
                    </li>
                )
            })}
        </ul>
    )
}
