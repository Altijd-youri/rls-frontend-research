import React from 'react'

export default function Statistics({ selectedJourney }) {

    return (
        <>
            {selectedJourney?.trainComposition ?
                <div className="table-responsive col-12">
                    <table className="table table-borderless">
                        <tbody>
                            <tr>
                                <th>Number of vehicles</th>
                                <td>{selectedJourney.trainComposition.numberOfVehicles} vehicles</td>
                                <th>Brake percentage</th>
                                <td>{selectedJourney.trainComposition.brakeWeight}%</td>
                                <th>Dangerous goods</th>
                                <td>{selectedJourney.trainComposition.dangerousGoodsIndicator === 1 ? 'Yes' : 'No'}</td>
                            </tr>
                            <tr>
                                <th>Train weight</th>
                                <td>{selectedJourney.trainComposition.trainWeight / 1000} tonnes</td>
                                <th>Max. speed</th>
                                <td>{selectedJourney.trainComposition.trainMaxSpeed} km/h</td>
                                <th>Exceptional gauging</th>
                                <td>{selectedJourney.trainComposition.exceptionalGaugingIndicator === 1 ? 'Yes' : 'No'}</td>
                            </tr>
                            <tr>
                                <th>Train length</th>
                                <td>{selectedJourney.trainComposition.trainLength / 100} meters</td>
                                <th>Max. axle weight</th>
                                <td>{selectedJourney.trainComposition.maxAxleWeight} tonnes</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                : <div className="d-flex justify-content-center align-items-center mt-5 mb-5">Please select a journey</div>}
        </>
    )
}
