import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import {ENDPOINTS, trainTypes} from "../../../../../utils/constants";
import { Typeahead } from "react-bootstrap-typeahead"; // ES2015
import "react-bootstrap-typeahead/css/Typeahead.css";
import fetchHelper from "../../../../../utils/fetchHelper";
import './CreateJourney.scoped.css';

export default function CreateJourney({onHide, train}) {
    const [departure, setDeparture] = useState([]);
    const [destination, setDestination] = useState([]);
    const [activities, setActivities] = useState([]);
    const [lifeStockChecked, setLifeStockChecked] = useState(false);

    const [isFetchingActivities, setFetchingActivities] = useState(false);
    const [activitiesList, setActivitiesList] = useState([]);
    const [activitiesFetchError, setActivitiesFetchError] = useState('');

    useEffect(() => {
        setFetchingActivities(true);
        fetchHelper(ENDPOINTS.TRAINACTIVITYTYPES, 'GET', null, ({data, error}) => {
            if (data) {
                setActivitiesList(data.data);
            } else {
                setActivitiesFetchError(error);
            }
        })
        setFetchingActivities(false);
    }, []);


    const { locations, isFetching, error } = useSelector(state => ({
        locations: state.locationsStore.locations,
        isFetching: state.locationsStore.isFetching,
        error: state.locationsStore.error
    }))

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

    function submitForm() {
        //
    }

    function validateForm() {
return false;
    }

    return (
        <div className="rightbar">
            <div className="top">
                <h4>
                    Add journey
                </h4>
                <span onClick={onHide}>
                    <li className="fa fa-times" />
                </span>
            </div>

            <form onSubmit={submitForm} className="form-wrapper">

                <div className="label-pos">
                    <input value={getDeparture().title} placeholder="Departure" type="text" name="journeyDep"  readOnly/>
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
                    />
                    <label className="ct-label"  htmlFor="basic-typeahead-example">
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
                        isLoading={isFetchingActivities}
                    />
                    <label className="ct-label"  htmlFor="basic-typeahead-example">
                        <li className="fas fa-text-height"></li>
                    </label>
                </div>

                <div className="label-pos">
                    <input type="checkbox" id="lifestock"/>
                        <label htmlFor="lifestock">Check me out</label>
                </div>

                <div className="btn-submit">
                    <button disabled={validateForm()}
                            type="submit">
                        ADD
                    </button>
                </div>
            </form>
        </div>
    );
}