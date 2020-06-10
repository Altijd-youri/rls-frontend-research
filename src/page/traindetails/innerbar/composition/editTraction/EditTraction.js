import React, { useState, useEffect } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead';
import TractionService from '../../../../../api/tractions';
import TrainCompositionService from '../../../../../api/traincomposition';
import '../createTraction/CreateTraction.scoped.css';
import { succeedAlert } from '../../../../../utils/Alerts';
import JourneySectionService from '../../../../../api/journeysections';

export default function EditTraction({ onHide, selectedJourney, setSelectedJourney, data }) {
    useEffect(() => {
        fetchTractions();
    }, [])

    const [tractions, setTractions] = useState({ tractions: [], isFetching: false, error: '' });
    const [form, setForm] = useState({ traction: [], hasDriver: false, isSubmitting: false, error: '' })

    useEffect(() => {
        setForm(prevState => ({
            ...prevState,
            hasDriver: Boolean(data.driverIndication),
            traction: [data.traction],
        }))
    }, [data])

    const setTractionHandler = traction => {
        setForm(prevState => ({ ...prevState, traction }))
    }

    const setHasDriverHandler = hasDriver => {
        setForm(prevState => ({ ...prevState, hasDriver }))
    }

    const fetchTractions = async () => {
        setTractions(prevState => ({ ...prevState, isFetching: true }))
        const { data, error } = await TractionService.getTractions();
        if (data) {
            setTractions(prevState => ({ ...prevState, isFetching: false, tractions: data }))
        } else {
            setTractions(prevState => ({ ...prevState, isFetching: false, error }))
        }
    }

    const validateForm = () => {
        if (form?.traction?.length && !form?.isSubmitting) {
            return false;
        }
        return true;
    }

    const submitForm = async (event) => {
        event.preventDefault();
        setForm(prevState => ({ ...prevState, isSubmitting: true }))

        const trainCompositionId = selectedJourney.trainComposition.id;

        const body = {
            stockType: "traction",
            driverIndication: form.hasDriver,
            stockIdentifier: parseInt(form.traction[0].locoTypeNumber),
        }

        const { error } = await TrainCompositionService.updateStock(trainCompositionId, data.id, body);
        if (error) {
            setForm(prevState => ({ ...prevState, error, isSubmitting: false }));
        } else {
            const { data, error } = await JourneySectionService.getJourneySectionById(selectedJourney.id)
            if (error) {
                setForm(prevState => ({ ...prevState, error, isSubmitting: false }));
            } else {
                setSelectedJourney(data)
                succeedAlert();
                setForm(prevState => ({ ...prevState, isSubmitting: false }));
            }
        }
    }

    return (
        <div className="rightbar">
            <div className="top">
                <h4>
                    Edit Traction
                </h4>
                <span onClick={onHide}>
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
                        UPDATE TRACTION
                    </button>
                </div>

                {form.error && <div className="mt-2 text-danger">{form.error}</div>}
                {tractions.error && <div className="mt-2 text-danger">{tractions.error}</div>}
            </form>
        </div>
    );
}
