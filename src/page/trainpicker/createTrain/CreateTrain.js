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
    const initForm = { trainNumber: '', trainType: [], departure: [], departureTime: new Date(), isSubmitting: false, error: '' };
    const [form, setForm] = useState(initForm)
    const [locations, setLocation] = useState({ locations: [], isFetching: false, error: '' })

    useEffect(() => {
        fetchLocations();
    }, [])

    const submitForm = (event) => {
        event.preventDefault();
        setForm(prevState => ({ ...prevState, isSubmitting: true }));

        let body = {
            transferPoint: form.departure[0].links[0].href,
            operationalTrainNumber: form.trainNumber,
            scheduledDateTimeAtTransfer: form.departureTime,
            scheduledTimeAtHandover: form.departureTime,
            trainType: form.trainType[0].id
        };

        const saveTrain = async () => {
            const { data, error } = await TrainService.saveTrain(body)
            if (data) {
                setTrains(prevState => ([...prevState, data]))
                succeedAlert()
                setForm(initForm);
            } else {
                errorAlert(error)
                setForm(prevState => ({ ...prevState, isSubmitting: false, error }))
            }
        }
        saveTrain()
    }

    const fetchLocations = async () => {
        setLocation(prevState => ({ ...prevState, isFetching: true }))
        const { data, error } = await LocationsService.getLocations();
        if (data) {
            setLocation(prevState => ({ ...prevState, isFetching: false, locations: data }))
        } else {
            setLocation(prevState => ({ ...prevState, isFetching: false, error }))
        }
    }

    function validateForm() {
        const validTrainType = form.trainType.length;
        const validDeparture = form.departure.length;
        if (form.trainNumber && validTrainType && validDeparture && form.departureTime && !form.isSubmitting) {
            return false;
        }
        return true;
    }

    function setTrainNumberHandler({ target }) {
        setForm(prevState => ({ ...prevState, trainNumber: target.value }))
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
                    <input value={form.trainNumber} onChange={setTrainNumberHandler} placeholder="Train number.."
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
                        onChange={value => setForm(prevState => ({ ...prevState, trainType: value }))}
                        options={trainTypes}
                        placeholder="Choose a train type..."
                        selected={form.trainType}
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
                        onChange={value => setForm(prevState => ({ ...prevState, departure: value }))}
                        options={locations.locations}
                        placeholder="Choose a departure..."
                        selected={form.departure}
                        filterBy={['code', 'primaryLocationName']}
                        isLoading={locations.isFetching}
                    />
                    <label className="ct-label" htmlFor="basic-typeahead-example">
                        <li className="fas fa-location-arrow"></li>
                    </label>
                </div>

                <div className="departure-time">
                    <DatePicker
                        className="form-input"
                        selected={form.departureTime}
                        onChange={date => setForm(prevState => ({ ...prevState, departureTime: date }))}
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

                {locations.error && <div>{locations.error}</div>}
                {form.error && <div>{form.error}</div>}
            </form>
        </div>
    )
}
