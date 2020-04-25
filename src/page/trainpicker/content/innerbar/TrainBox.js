import React from 'react'

export default function TrainBox() {
    return (
        <div className="box active">
            <span className="box-top">
                <i className="fa fa-folder"></i>
            </span>

            <span className="box-title">
                <span className="train-type">
                    Train X
                            </span>
                <span className="departure-time">
                    01-01-2020 14:00
                            </span>
            </span>

            <span className="box-bar">
                <span style={{ width: "70%" }} title="70%"></span>
            </span>
        </div>
    )
}
