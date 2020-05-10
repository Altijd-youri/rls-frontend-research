import React from 'react'
import './Inner.scoped.css'
import TrainTable from './table/TrainTable'

export default function Innerbar({ onCreateTrain, onEditTrain, trains }) {

    return (
        <div className="inner">
            <div className="inner-box">
                <div className="content-title">
                    <h4>
                        All trains
                    </h4>
                    <span className="d-flex align-items-center" onClick={onCreateTrain}>
                        Add Train
                        <i className="fas fa-plus"></i>
                    </span>
                </div>
                <TrainTable onEditTrain={onEditTrain} trains={trains} />
            </div>

        </div>
    )
}
