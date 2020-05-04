import React, { useState, useEffect } from 'react'
import "react-datepicker/dist/react-datepicker.css";
import './CreateTrain.scoped.css'
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { trainTypes } from '../../../utils/constants';
import TrainService from '../../../api/trains'
import { errorAlert, succeedAlert } from "../../../utils/Alerts";
import DatePicker from "react-datepicker";
import LocationsService from '../../../api/locations'

export default function CreateTrain({ onHide, setTrains }) {
    const [departure, setDeparture] = useState([]);
    const [departureTime, setDepartureTime] = useState(new Date());
    const [trainType, setTrainType] = useState([]);
    const [trainNumber, setTrainNumber] = useState('');
    const [error, setError] = useState('');

    const [locations, setLocations] = useState([]);
    const [fetchingLocations, setFetchingLocations] = useState(false);
    const [fetchingLocationsError, setFetchingLocationsError] = useState('');

    useEffect(() => {
        fetchLocations();
    }, [])

    const submitForm = (event) => {
        event.preventDefault();

        let body = {
            transferPoint: departure[0].links[0].href,
            operationalTrainNumber: trainNumber,
            scheduledDateTimeAtTransfer: departureTime,
            scheduledTimeAtHandover: departureTime,
            trainType: trainType[0].id
        };

        const saveTrain = async () => {
            const { data, error } = await TrainService.saveTrain(body)
            if (data) {
                setTrains(prevState => ([...prevState, data]))
                succeedAlert()
                clearForm()
            } else {
                errorAlert(error)
                setError(error);
            }
        }
        saveTrain()
    }

    function clearForm() {
        setDeparture([])
        setDepartureTime(new Date())
        setTrainNumber('')
        setTrainType([])
    }



    const fetchLocations = async () => {
        setFetchingLocations(true);
        const { data, error } = await LocationsService.getLocations();
        if (data) {
            setLocations(data)
        } else {
            setFetchingLocationsError(error);
        }
        setFetchingLocations(false);
    }

    function validateForm() {
        const validTrainType = trainType.length;
        const validDeparture = departure.length;
        if (trainNumber && validTrainType && validDeparture && departureTime) {
            return false;
        }
        return true;
    }

    function setTrainNumberHandler(event) {
        setTrainNumber(event.target.value)
    }

    return (
        <div className="rightbar">
            <div className="top">
                <h4>
                    Create Train
                </h4>
                <span onClick={onHide}>
                    <li className="fa fa-times" />
                </span>
            </div>

            <form onSubmit={submitForm} className="form-wrapper">

                <div className="train-number">
                    <input value={trainNumber} onChange={setTrainNumberHandler} placeholder="Train number.."
                        type="number" pattern="[0-9]{6}" name="trainNumber" maxLength="6" required />
                    <label className="ct-label" htmlFor="trainNumber">
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
                        required={true}
                    />
                    <label className="ct-label" htmlFor="basic-typeahead-example">
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
                        isLoading={fetchingLocations}
                    />
                    <label className="ct-label" htmlFor="basic-typeahead-example">
                        <li className="fas fa-location-arrow"></li>
                    </label>
                </div>

                <div className="departure-time">
                    <DatePicker
                        className="form-input"
                        selected={departureTime}
                        onChange={date => setDepartureTime(date)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        timeCaption="time"
                        dateFormat="MMMM d, yyyy h:mm aa"
                    />
                </div>



                <div className="btn-submit">
                    <button style={{ cursor: validateForm() ? 'no-drop' : 'pointer' }} disabled={validateForm()}
                        type="submit">
                        ADD
                    </button>
                </div>

                {error && <div>{error}</div>}
                {fetchingLocationsError && <div>{fetchingLocationsError}</div>}
            </form>
        </div>
    )
}
