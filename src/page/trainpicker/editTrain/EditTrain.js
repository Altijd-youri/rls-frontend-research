import React, { useState, useEffect } from 'react'
import './EditTrain.scoped.css'
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { trainTypes } from '../../../utils/constants';
import '../createTrain/Typeahead.css';
import DatePicker from "react-datepicker";
import Spinner from 'react-bootstrap/Spinner';
import { errorAlert, succeedAlert } from '../../../utils/Alerts';
import LocationsService from '../../../api/locations'
import TrainService from '../../../api/trains'

export default function EditTrain({ onHide, train, onUpdateTrain, getToken }) {
    const [isSaving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [departure, setDeparture] = useState([]);
    const [departureTime, setDepartureTime] = useState(new Date());
    const [trainType, setTrainType] = useState([]);
    const [trainNumber, setTrainNumber] = useState([]);

    const [locations, setLocations] = useState([]);
    const [fetchingLocations, setFetchingLocations] = useState(false);
    const [fetchingLocationsError, setFetchingLocationsError] = useState('');

    useEffect(() => {
        const fetchLocations = async () => {
            setFetchingLocations(true);
            const { data, error } = await LocationsService.getLocations(await getToken());
            if (data) {
                setLocations(data)
            } else {
                setFetchingLocationsError(error);
            }
            setFetchingLocations(false);
        }

        fetchLocations();
    }, [getToken])

    useEffect(() => {
        setTrainNumber(train.operationalTrainNumber);
        const departureDatetime = new Date(train.scheduledTimeAtHandover)
        setDepartureTime(departureDatetime)
        const trainType = trainTypes.find((x) => {
            return x.id === String(train.trainType);
        })
        setTrainType([trainType])
    }, [train])

    useEffect(() => {
        if (locations.length) {
            setDeparture([locations.find((location) => location.primaryLocationName === train.transferPoint)]);
        }
    }, [train, locations])

    const submitForm = async (event) => {
        event.preventDefault();
        let body = {
            transferPoint: departure[0].links[0].href,
            operationalTrainNumber: trainNumber,
            scheduledDateTimeAtTransfer: departureTime,
            scheduledTimeAtHandover: departureTime,
            trainType: trainType[0].id
        };

        setSaving(true);
        const { data, error } = await TrainService.editTrain(train.id, body, await getToken());
        if (data) {
            onUpdateTrain(data);
            succeedAlert()
        } else {
            setError(error);
            errorAlert(error);
        }
        setSaving(false);
    }

    function validateForm() {
        const validTrainType = trainType.length;
        const validDeparture = departure.length;
        if (trainNumber && validTrainType && validDeparture && departureTime) {
            return false;
        }
        return true;
    }

    return (
        <div className="rightbar">
            <div className="top">
                <h4>
                    Edit Train
                </h4>
                <span onClick={onHide}>
                    <li className="fa fa-times" />
                </span>
            </div>

            <form onSubmit={submitForm} className="form-wrapper">

                <div className="train-number">
                    <input value={trainNumber} onChange={(event) => setTrainNumber(event.target.value)} placeholder="Train number.." type="number" pattern="[0-9]{6}" name="trainNumber" maxLength="6" required />
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
                        isLoading={fetchingLocations}
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
                    <DatePicker
                        className="form-input"
                        selected={departureTime}
                        onChange={date => setDepartureTime(date)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        timeCaption="time"
                        dateFormat="d MMMM, yyyy h:mm aa"
                    />
                </div>

                {isSaving ?
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                    :
                    <div className="btn-submit">
                        <button style={{ cursor: validateForm() ? 'no-drop' : 'pointer' }} disabled={validateForm()}
                            type="submit">
                            SAVE
                    </button>
                    </div>
                }

                {error && <div>{error}</div>}
                {fetchingLocationsError && <div>{fetchingLocationsError}</div>}


            </form>
        </div>
    )
}
