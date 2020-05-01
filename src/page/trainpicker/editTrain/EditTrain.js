import React, { useState, useEffect } from 'react'
import './EditTrain.scoped.css'
import { useDispatch, useSelector } from 'react-redux';
import { locationsRequest } from '../../../actions/locations';
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { trainTypes, ENDPOINTS } from '../../../utils/constants';
import fetchHelper from '../../../utils/fetchHelper';
import '../createTrain/Typeahead.css';

export default function EditTrain({ onHide, train, onUpdateTrain }) {
    const { locations } = useSelector(state => ({
        locations: state.locationsStore.locations,
    }))

    const [isSaving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [departure, setDeparture] = useState([]);
    const [departureTime, setDepartureTime] = useState([]);
    const [trainType, setTrainType] = useState([]);
    const [trainNumber, setTrainNumber] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        setTrainNumber(train.operationalTrainNumber);
        const departureDatetime = new Date(train.scheduledTimeAtHandover).toISOString().slice(0, -8);
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

    const submitForm = (event) => {
        event.preventDefault();
        let body = {
            transferPoint: departure[0].links[0].href,
            operationalTrainNumber: trainNumber,
            scheduledDateTimeAtTransfer: departureTime,
            scheduledTimeAtHandover: departureTime,
            trainType: trainType[0].id
        };

        setSaving(true);
        fetchHelper(`${ENDPOINTS.TRAINS}/${train.id}`, 'PUT', body, ({ data, error }) => {
            if (data) {
                onUpdateTrain(data.data);
            } else {
                setError(error)
            }
        })
        setSaving(false);
    }

    useEffect(() => {
        dispatch(locationsRequest())
    }, [dispatch])

    function validateForm() {
        const validTrainNumber = trainNumber.length;
        const validTrainType = trainType.length;
        const validDeparture = departure.length;
        const validDepartureDate = departureTime.length
        if (validTrainNumber && validTrainType && validDeparture && validDepartureDate) {
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
                        required={true}
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
                    <input type="datetime-local" id="departureTime" value={departureTime}
                        onChange={(event) => setDepartureTime(event.target.value)} />
                    <label htmlFor="departureTime">
                        <li className="fas fa-clock"></li>
                    </label>
                </div>

                <div className="btn-submit">
                    <button disabled={validateForm()}
                        type="submit">
                        SAVE
                    </button>
                </div>
            </form>
        </div>
    )
}
