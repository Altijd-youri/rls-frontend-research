import React from 'react'
import './Inner.scoped.css'
import TrainTable from './table/TrainTable'
import { hasPermissions } from '../../../utils/scopeChecker'

export default function Innerbar({ onCreateTrain, onEditTrain, trains }) {

    return (
        <div className="inner">
            <div className="inner-box">
                <div className="content-title">
                    <h4>
                        All trains
                    </h4>
                    {hasPermissions(["write:train"]) &&
                        <span className="d-flex align-items-center" onClick={onCreateTrain}>
                            Add Train
                        <i className="fas fa-plus"></i>
                        </span>}
                </div>
                <TrainTable onEditTrain={onEditTrain} trains={trains} />
            </div>
        </div>
    )
}
