import React, { useState, useEffect } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead';
import TractionService from '../../../../../api/tractions';
import TrainCompositionService from '../../../../../api/traincomposition';
import './CreateTraction.scoped.css';
import { succeedAlert, errorAlert } from '../../../../../utils/Alerts';
import JourneySectionService from '../../../../../api/journeysections';

export default function CreateTraction({ onHide, selectedJourney, setSelectedJourney, getToken }) {
    useEffect(() => {
        // Fetch tractions
        const fetchTractions = async () => {
            setTractions(prevState => ({ ...prevState, isFetching: true }))
            const { data, error } = await TractionService.getTractions(await getToken());
            if (data) {
                setTractions(prevState => ({ ...prevState, isFetching: false, tractions: data }))
            } else {
                setTractions(prevState => ({ ...prevState, isFetching: false, error }))
            }
        }
        fetchTractions()
    }, [getToken])

    const [tractions, setTractions] = useState({ tractions: [], isFetching: false, error: '' });
    const [form, setForm] = useState({ traction: [], hasDriver: false, isSubmitting: false, error: '' })

    const setTractionHandler = traction => {
        setForm(prevState => ({ ...prevState, traction }))
    }

    const setHasDriverHandler = hasDriver => {
        setForm(prevState => ({ ...prevState, hasDriver }))
    }

    const validateForm = () => {
        if (form.traction.length && !form.isSubmitting) {
            return false;
        }
        return true;
    }

    const submitForm = async (event) => {
        event.preventDefault();
        const selectedLocoTypeNumber = form.traction[0].locoTypeNumber
        const containsStock = selectedJourney.trainComposition.rollingStock.some(stock => {
            return stock?.traction?.locoTypeNumber === selectedLocoTypeNumber
        });

        if (containsStock) {
            return setForm(prevState => ({ ...prevState, error: 'Stock exists in current composition' }));
        }

        setForm(prevState => ({ ...prevState, isSubmitting: true, error: '' }))
        const trainCompositionId = selectedJourney.trainComposition.id;

        const body = {
            stockType: "traction",
            driverIndication: form.hasDriver,
            stockIdentifier: parseInt(selectedLocoTypeNumber),
        }

        const { error } = await TrainCompositionService.saveStock(trainCompositionId, body, await getToken());
        if (error) {
            errorAlert(error)
        } else {
            const { data, error } = await JourneySectionService.getJourneySectionById(selectedJourney.id, await getToken())
            if (error) {
                setForm(prevState => ({ ...prevState, error, isSubmitting: false }));
                errorAlert(error)
            } else {
                setSelectedJourney(data)
                setForm(prevState => ({ ...prevState, isSubmitting: false }));
                succeedAlert();
                resetForm();
            }
        }
    }

    const resetForm = () => {
        setForm({ traction: [], hasDriver: false, isSubmitting: false, error: '' })
    }

    return (
        <div className="rightbar">
            <div className="top">
                <h4>
                    Add Traction
                </h4>
                <span style={{ cursor: "pointer" }} onClick={onHide}>
                    <li className="fa fa-times" />
                </span>
            </div>

            <form onSubmit={submitForm} className="form-wrapper">

                {/* Locomotives */}
                <div className="label-pos">
                    <Typeahead
                        clearButton
                        id="basic-typeahead-example"
                        labelKey={option => `${option.locoNumber} - ${option.typeName}`}
                        onChange={(value) => setTractionHandler(value)}
                        options={tractions.tractions}
                        placeholder="Choose a Traction..."
                        selected={form.traction}
                        filterBy={['locoNumber', 'typeName']}
                        isLoading={tractions.isFetching}
                    />
                    <label className="ct-label" htmlFor="basic-typeahead-example">
                        <li className="fas fa-text-height"></li>
                    </label>
                </div>

                <div className="label-pos d-flex align-items-center">
                    <input onChange={(event) => setHasDriverHandler(event.target.checked)} checked={form.hasDriver} className="w-auto" type="checkbox" id="lifestock" />
                    <label className="ml-2 mb-0" htmlFor="lifestock">Driver</label>
                </div>

                <div className="btn-submit">
                    <button style={{ cursor: validateForm() ? 'no-drop' : 'pointer' }} disabled={validateForm()}
                        type="submit">
                        ADD
                    </button>
                </div>

                {form.error && <div className="mt-2 text-danger">{form.error}</div>}
                {tractions.error && <div className="mt-2 text-danger">{tractions.error}</div>}
            </form>
        </div>
    );
}
