import React from 'react'

export default function Statistics({ selectedJourney }) {

    const calculateBrakeWeight = () => {
        return parseInt(selectedJourney.trainComposition.brakeWeight / selectedJourney.trainComposition.weight * 100, 10);
    }

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
                                <td>{calculateBrakeWeight()}%</td>
                                <th>Dangerous goods</th>
                                <td>{selectedJourney.trainComposition.containsDangerousGoods === true ? 'Yes' : 'No'}</td>
                            </tr>
                            <tr>
                                <th>Train weight</th>
                                <td>{selectedJourney.trainComposition.weight / 1000} tonnes</td>
                                <th>Max. speed</th>
                                <td>{selectedJourney.trainComposition.maxSpeed} km/h</td>
                                <th>Exceptional gauging</th>
                                <td>{selectedJourney.trainComposition.gaugedExceptional === true ? 'Yes' : 'No'}</td>
                            </tr>
                            <tr>
                                <th>Train length</th>
                                <td>{selectedJourney.trainComposition.length / 100} meters</td>
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
