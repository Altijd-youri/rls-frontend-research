import React, { useState, useEffect } from 'react';
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import './EditJourney.scoped.css';
import TrainService from '../../../../../api/trains'
import TrainActivitiesService from '../../../../../api/trainactivities';
import LocationsService from '../../../../../api/locations';

import { succeedAlert, errorAlert } from '../../../../../utils/Alerts';

export default function EditJourney({ onHide, train, selectedJourney, setTrain }) {

    useEffect(() => {
        setActivities(selectedJourney.activities)

        const destination = selectedJourney.links.find(l => l.rel === 'journeySectionDestination');
        fetchLocationByHateoas(destination.href, (data) => {
            setDestination([data])
        })

        const departure = selectedJourney.links.find(l => l.rel === 'journeySectionOrigin');
        fetchLocationByHateoas(departure.href, (data) => {
            setDeparture(data.primaryLocationName)
        })

        setLifeStockChecked(selectedJourney.trainComposition.livestockOrPeopleIndicator)

    }, [selectedJourney])

    // User input
    const [departure, setDeparture] = useState('');
    const [destination, setDestination] = useState([]);
    const [activities, setActivities] = useState([]);
    const [lifeStockChecked, setLifeStockChecked] = useState(false);

    // Activities handling state
    const [activitiesList, setActivitiesList] = useState([]);
    const [fetchingActivities, setFetchingActivities] = useState(false);
    const [fetchingActivitiesError, setFetchingActivitiesError] = useState('');

    // Locations handling state
    const [locations, setLocations] = useState([]);
    const [fetchingLocations, setFetchingLocations] = useState(false);
    const [fetchingLocationsError, setFetchingLocationsError] = useState('');

    // New Journey fetch state
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchLocations();
        fetchActivities();
    }, []);

    const fetchLocationByHateoas = async (url, callback) => {
        const { data, error } = await LocationsService.getLocationsByHateoas(url);
        if (data) {
            callback(data);
        } else {
            console.log(error);
        }
    }

    const fetchActivities = async () => {
        setFetchingActivities(true);
        const { data, error } = await TrainActivitiesService.getActivities();
        if (data) {
            setActivitiesList(data);
        } else {
            setFetchingActivitiesError(error);
        }
        setFetchingActivities(false);
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

    function getDestination() {
        const destinationDetails = destination[0].links.find(item => {
            return item.rel === 'self'
        })
        return destinationDetails;
    };

    function getDeparture() {
        let departureDetails;
        if (train.journeySections.length === 0) {
            departureDetails = train.links.find(item => {
                return item.rel === 'transferPoint'
            })
        } else {
            const journeys = train.journeySections;
            const lastJourneySection = journeys[journeys.length - 1];
            departureDetails = lastJourneySection.links.find(item => {
                return item.rel === "journeySectionDestination";
            })
        }
        return departureDetails;
    }

    function submitForm(event) {
        event.preventDefault();
        let activitiesIds = [];

        for (let activitie of activities) {
            activitiesIds.push({ "trainActivityTypeUrl": activitie.links.find(l => l.rel === 'self').href });
        }

        let body = {
            journeySectionOriginUrl: getDeparture().href,
            journeySectionDestinationUrl: getDestination().href,
            livestockOrPeopleIndicator: lifeStockChecked ? 1 : 0,
            activities: activitiesIds
        }

        setIsSaving(true);
        const saveJourney = async (trainid, body) => {
            const { data, error } = await TrainService.saveJourney(trainid, body);
            if (data) {
                setTrain(data)
                succeedAlert();
                clearForm();
            } else {
                setError(error);
                errorAlert(error)
            }
            setIsSaving(false);
        }
        saveJourney(train.id, body);
    }

    function clearForm() {
        setDestination([])
        setActivities([])
        setLifeStockChecked(false);
    }

    function validateForm() {
        if (destination.length) {
            return false;
        }
        return true;
    }

    return (
        <div className="rightbar">
            <div className="top">
                <h4>
                    Edit journey
                </h4>
                <span onClick={onHide}>
                    <li className="fa fa-times" />
                </span>
            </div>

            <form onSubmit={submitForm} className="form-wrapper">

                <div className="label-pos">
                    <input value={departure} placeholder="Departure" type="text" name="journeyDep" readOnly />
                    <label className="ct-label" htmlFor="journeyDep">
                        <li className="fa fa-fingerprint"></li>
                    </label>
                </div>


                <div className="label-pos">
                    <Typeahead
                        clearButton
                        id="basic-typeahead-example"
                        labelKey={option => `${option.code} - ${option.primaryLocationName}`}
                        onChange={(value) => setDestination(value)}
                        options={locations}
                        placeholder="Choose a destination..."
                        selected={destination}
                        filterBy={['code', 'primaryLocationName']}
                        required={true}
                        isLoading={fetchingLocations}
                    />
                    <label className="ct-label" htmlFor="basic-typeahead-example">
                        <li className="fas fa-text-height"></li>
                    </label>
                </div>

                <div className="label-pos">
                    <Typeahead
                        clearButton
                        className="activites-input"
                        multiple
                        id="basic-typeahead-example"
                        labelKey={option => `${option.code} - ${option.description}`}
                        onChange={(value) => setActivities(value)}
                        options={activitiesList}
                        placeholder="Choose activities..."
                        selected={activities}
                        filterBy={['code', 'description']}
                        isLoading={fetchingActivities}
                    />
                    <label className="ct-label" htmlFor="basic-typeahead-example">
                        <li className="fas fa-text-height"></li>
                    </label>
                </div>

                <div className="label-pos d-flex align-items-center">
                    <input onChange={(event) => setLifeStockChecked(event.target.checked)} checked={lifeStockChecked} className="w-auto" type="checkbox" id="lifestock" />
                    <label className="ml-2 mb-0" htmlFor="lifestock">Lifestock</label>
                </div>

                <div className="btn-submit">
                    <button style={{ cursor: validateForm() ? 'no-drop' : 'pointer' }} disabled={validateForm() || isSaving}
                        type="submit">
                        ADD
                    </button>
                </div>

                {error && <div>{error}</div>}
                {fetchingLocationsError && <div>{fetchingLocationsError}</div>}
                {fetchingActivitiesError && <div>{fetchingActivitiesError}</div>}
            </form>
        </div>
    );
}