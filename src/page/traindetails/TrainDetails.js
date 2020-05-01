import React, { useState, useEffect } from 'react'
import Innerbar from './innerbar/Innerbar'
import { useParams } from 'react-router-dom';
import fetchHelper from '../../utils/fetchHelper';
import { ENDPOINTS } from '../../utils/constants';
import Spinner from 'react-bootstrap/Spinner';
import { useSelector, useDispatch } from 'react-redux';
import {locationsRequest} from "../../actions/locations";
import CreateTrain from "../trainpicker/createTrain/CreateTrain";
import CreateJourney from "./innerbar/journeys/createjourney/CreateJourney";
import './TrainDetails.scoped.css';

export default function TrainDetails() {
    const [train, setTrain] = useState();
    const dispatch = useDispatch();
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState('');

    /* state for create/edit journey  */
    const [showCreateJourney, setShowCreateJourney] = useState(false);
    const [showEditJourney, setShowEditJourney] = useState(false);
    const [selectedJourney, setSelectedJourney] = useState();

    const { trainid } = useParams();
    const { locations } = useSelector(state => ({
        locations: state.locationsStore.locations,
    }))

    function setTrainHandler(train) {
        setTrain(train);
    }

    useEffect(() => {
        setLoading(true);
        fetchHelper(`${ENDPOINTS.TRAINS}/${trainid}`, 'GET', null, ({ data, error }) => {
            if (data) {
                setTrain(data.data);
            } else {
                setError(error);
            }
        })
        dispatch(locationsRequest())
        setLoading(false);
    }, [trainid])

    if (error) {
        return (<div className="d-flex justify-content-center align-items-center w-100">
            {error}
        </div>)
    }

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center w-100" >
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            </div >
        )
    }

    return (
        <div className="content overflow-auto">
            {!isLoading && train &&
                <Innerbar
                    locations={locations}
                    train={train}
                    setShowCreateJourney={setShowCreateJourney}
                />
            }

            {showCreateJourney &&
                <CreateJourney
                    train={train}
                    locations={locations}
                    onHide={() => setShowCreateJourney(false)}
                />
            }

        </div>
    )
}