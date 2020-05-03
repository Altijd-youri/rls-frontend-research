import React from 'react'
import './Inner.scoped.css'
import TrainTable from './TrainTable'

export default function Innerbar({ onCreateTrain, onEditTrain, trains }) {

    return (
        <div className="inner">

            <div className="d-flex justify-content-between header">
                <input type="text" name="search" placeholder="Search.." />
                <label htmlFor="search">
                    <li className="fa fa-search"></li>
                </label>

                <span className="d-flex align-items-center" onClick={onCreateTrain}>
                    Add Train
                        <i className="fas fa-plus"></i>
                </span>

            </div>

            <div className="inner-box">
                <div className="content-title">
                    <h4>
                        All trains
                    </h4>
                </div>
                <TrainTable onEditTrain={onEditTrain} trains={trains} />
            </div>

        </div>
    )
}
