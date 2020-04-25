import React, { useState, useEffect } from 'react'
import './styles.css'
import { useDispatch, useSelector } from 'react-redux';
import { locationsRequest } from '../../../../actions/locations';
import { Typeahead } from "react-bootstrap-typeahead"; // ES2015
import "react-bootstrap-typeahead/css/Typeahead.css";
import { saveTrainRequest } from '../../../../actions/trains';

export default function Rightbar() {
    const trainTypes = [
        { id: "1", name: "Passenger" },
        { id: "2", name: "Freight" },
        { id: "3", name: "Light Engine" },
        { id: "4", name: "Engineering" }
    ]
    const { isFetching, error, locations } = useSelector(state => ({
        isFetching: state.locationsStore.isFechting,
        error: state.locationsStore.error,
        locations: state.locationsStore.locations,
    }))
    const [departure, setDeparture] = useState([]);
    const [departureTime, setDepartureTime] = useState([]);
    const [trainType, setTrainType] = useState([]);
    const [trainNumber, setTrainNumber] = useState([]);
    const dispatch = useDispatch();

    const submitForm = (event) => {
        // const { trainNumber, departure, trainType, departureTime } = this.state;
        // const { saveTrain, onHide } = this.props;
        event.preventDefault();

        let body = {
            transferPoint: departure[0].links[0].href,
            operationalTrainNumber: trainNumber,
            scheduledDateTimeAtTransfer: departureTime,
            scheduledTimeAtHandover: departureTime,
            trainType: trainType[0].id
        };
        dispatch(saveTrainRequest(body))
        // console.log(body)
        // debugger;
        // saveTrain(body);
        // onHide();
    }

    useEffect(() => {
        dispatch(locationsRequest())
    }, [dispatch])

    return (
        <div className="rightbar">

            <div className="top">
                <h4>
                    Create Train
                </h4>
            </div>

            <div className="form-wrapper">
                <form onSubmit={submitForm} className="form">

                    <div className="train-number">
                        <input onChange={(event) => setTrainNumber(event.target.value)} placeholder="Train number.." type="number" pattern="[0-9]{6}" name="trainNumber" maxLength="6" />
                        <label htmlFor="trainNumber">
                            <li className="fa fa-fingerprint"></li>
                        </label>
                    </div>

                    <div className="train-types">
                        <Typeahead
                            clearButton
                            id="basic-typeahead-example"
                            labelKey={option => `${option.name}`}
                            onChange={setTrainType}
                            options={trainTypes}
                            placeholder="Choose a train type..."
                            selected={trainType}
                            filterBy={['name']}
                        />
                        <label htmlFor="basic-typeahead-example">
                            <li className="fas fa-text-height"></li>
                        </label>
                    </div>

                    <div className="departure">
                        <Typeahead
                            clearButton
                            id="basic-typeahead-example"
                            labelKey={option => `${option.code} - ${option.primaryLocationName}`}
                            onChange={setDeparture}
                            options={locations}
                            placeholder="Choose a location..."
                            selected={departure}
                            filterBy={['code', 'primaryLocationName']}
                        />
                        <label htmlFor="basic-typeahead-example">
                            <li className="fas fa-location-arrow"></li>
                        </label>
                    </div>

                    <div className="departure-time">
                        <input type="datetime-local" id="departureTime"
                            onChange={(event) => setDepartureTime(event.target.value)} />
                        <label htmlFor="departureTime">
                            <li className="fas fa-clock"></li>
                        </label>
                    </div>

                    <div className="btn-submit">
                        <button
                            type="submit">
                            Submit
                    </button>
                    </div>


                </form>
            </div>


        </div>
    )
}
