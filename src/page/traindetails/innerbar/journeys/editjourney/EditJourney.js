import React, { useState, useEffect } from 'react';
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import './EditJourney.scoped.css';
import TrainService from '../../../../../api/trains'
import TrainActivitiesService from '../../../../../api/trainactivities';
import LocationsService from '../../../../../api/locations';

import { succeedAlert, errorAlert } from '../../../../../utils/Alerts';

export default function EditJourney({ onHide, selectedJourney, setJourneyAndTrainHandler, getToken }) {

    useEffect(() => {
        setActivities(selectedJourney.activities)

        const fetchLocationByHateoas = async (url, callback) => {
            const { data, error } = await LocationsService.getLocationsByHateoas(url, await getToken());
            if (data) {
                callback(data);
            } else {
                errorAlert(error.message);
            }
        }

        let destination = selectedJourney.links.find(l => l.rel === 'journeySectionDestination')?.href
        destination = destination?.replace("http://", "https://");
        fetchLocationByHateoas(destination.href, (data) => {
            setDestination([data])
        })

        const departure = selectedJourney.links.find(l => l.rel === 'journeySectionOrigin');
        fetchLocationByHateoas(departure.href, (data) => {
            setDeparture([data])
        })

        setLifeStockChecked(selectedJourney.trainComposition.livestockOrPeopleIndicator)

    }, [selectedJourney, getToken])

    // User input
    const [departure, setDeparture] = useState([]);
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
        const fetchActivities = async () => {
            setFetchingActivities(true);
            const { data, error } = await TrainActivitiesService.getActivities(await getToken());
            if (data) {
                setActivitiesList(data);
            } else {
                setFetchingActivitiesError(error);
            }
            setFetchingActivities(false);
        }

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
        fetchActivities();
    }, [getToken]);



    function getDestination() {
        const destinationDetails = destination[0].links.find(item => {
            return item.rel === 'self'
        })
        return destinationDetails;
    };

    function getDeparture() {
        const departureDetails = departure[0].links.find(item => {
            return item.rel === 'self'
        })
        return departureDetails;
    }

    const submitForm = async (event) => {
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
        const api = selectedJourney.links.find(l => l.rel === 'self').href;
        const { data, error } = await TrainService.editJourney(api, body, await getToken());
        if (data) {
            setJourneyAndTrainHandler(data)
            succeedAlert();
        } else {
            setError(error.message);
            errorAlert(error.message)
        }
        setIsSaving(false);
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
                    <Typeahead
                        clearButton
                        id="basic-typeahead-example"
                        labelKey={option => `${option.code} - ${option.primaryLocationName}`}
                        onChange={() => { }}
                        options={locations}
                        placeholder="Departure"
                        selected={departure}
                        filterBy={['code', 'primaryLocationName']}
                        isLoading={fetchingLocations}
                        disabled={true}
                    />
                    <label className="ct-label" htmlFor="basic-typeahead-example">
                        <li className="fas fa-fingerprint"></li>
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
                        EDIT
                    </button>
                </div>

                {error && <div>{error}</div>}
                {fetchingLocationsError && <div>{fetchingLocationsError}</div>}
                {fetchingActivitiesError && <div>{fetchingActivitiesError}</div>}
            </form>
        </div>
    );
}