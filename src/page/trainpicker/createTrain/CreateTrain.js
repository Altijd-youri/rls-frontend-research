import React, {useState, useEffect} from 'react'
import './CreateTrain.scoped.css'
import {useDispatch, useSelector} from 'react-redux';
import {locationsRequest} from '../../../actions/locations';
import {Typeahead} from "react-bootstrap-typeahead"; // ES2015
import "react-bootstrap-typeahead/css/Typeahead.css";
import {saveTrainRequest} from '../../../actions/trains';
import {trainTypes} from '../../../utils/constants';
import TrainService from '../../../api/trains'
import {errorAlert, succeedAlert} from "../../../utils/Alerts";

export default function CreateTrain({onHide, setTrains}) {
    const {locations} = useSelector(state => ({
        locations: state.locationsStore.locations,
    }))

    const [departure, setDeparture] = useState([]);
    const [departureTime, setDepartureTime] = useState('');
    const [trainType, setTrainType] = useState([]);
    const [trainNumber, setTrainNumber] = useState('');
    const dispatch = useDispatch();

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
            const {data, error} = await TrainService.saveTrain(body)
            if (data) {
                // Update train list
                setTrains(prevState => ([...prevState, data]))
                // Show success
                succeedAlert()
                // Clear form
                clearForm()
            } else {
                errorAlert(error)
            }
        }

        saveTrain()

    }

    function clearForm() {
        setDeparture([])
        setDepartureTime('')
        setTrainNumber('')
        setTrainType([])
    }

    useEffect(() => {
        dispatch(locationsRequest())
    }, [dispatch])

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
                    <li className="fa fa-times"/>
                </span>
            </div>

            <form onSubmit={submitForm} className="form-wrapper">

                <div className="train-number">
                    <input value={trainNumber} onChange={setTrainNumberHandler} placeholder="Train number.."
                           type="number" pattern="[0-9]{6}" name="trainNumber" maxLength="6" required/>
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
                    />
                    <label className="ct-label" htmlFor="basic-typeahead-example">
                        <li className="fas fa-location-arrow"></li>
                    </label>
                </div>

                <div className="departure-time">
                    <input value={departureTime} type="datetime-local" id="departureTime"
                           onChange={(event) => setDepartureTime(event.target.value)}/>
                    <label className="ct-label" htmlFor="departureTime">
                        <li className="fas fa-clock"></li>
                    </label>
                </div>

                <div className="btn-submit">
                    <button disabled={validateForm()}
                            type="submit">
                        ADD
                    </button>
                </div>
            </form>
        </div>
    )
}
