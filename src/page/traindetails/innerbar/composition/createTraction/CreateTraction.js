import React, { useState, useEffect } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead';
import TranctionModeService from '../../../../../api/tractionmodes';
import TractionService from '../../../../../api/tractions';
import TrainCompositionService from '../../../../../api/traincomposition';
import './CreateTraction.scoped.css';
import { succeedAlert } from '../../../../../utils/Alerts';

export default function CreateTraction({ onHide, selectedJourney, setSelectedJourney }) {
    useEffect(() => {
        fetchTractions();
        fetchModes();
    }, [])

    const [modes, setModes] = useState({ modes: [], isFetching: false, error: '' });
    const [tractions, setTractions] = useState({ tractions: [], isFetching: false, error: '' });
    const [form, setForm] = useState({ traction: [], modes: [], hasDriver: false, isSubmitting: false, error: '' })

    const setTractionHandler = traction => {
        setForm(prevState => ({ ...prevState, traction }))
    }

    const setModeHandler = modes => {
        setForm(prevState => ({ ...prevState, modes }))
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

    const fetchModes = async () => {
        setModes(prevState => ({ ...prevState, isFetching: true }))
        const { data, error } = await TranctionModeService.getTractionModes();
        if (data) {
            setModes(prevState => ({ ...prevState, isFetching: false, modes: data }))
        } else {
            setModes(prevState => ({ ...prevState, isFetching: false, error }))
        }
    }

    const validateForm = () => {
        if (form.traction.length && form.modes.length && !form.isSubmitting) {
            return false;
        }
        return true;
    }

    const submitForm = (event) => {
        event.preventDefault();
        setForm(prevState => ({ ...prevState, isSubmitting: true }))
        const trainCompositionId = selectedJourney.trainComposition.id;
        const tractionMode = form.modes[0].links.find(traction => traction.rel === 'self').href;
        const tractionUrl = form.traction[0].links.find(traction => traction.rel === 'self').href;

        const body = {
            driverIndication: form.hasDriver ? 1 : 0,
            position: 1,
            tractionUrl,
            tractionMode
        }

        const saveTraction = async (trainCompositionId, body) => {
            const { data, error } = await TrainCompositionService.saveTraction(trainCompositionId, body);
            if (data) {
                const updatedSelectedJourney = { ...selectedJourney, trainComposition: data }
                setSelectedJourney(updatedSelectedJourney)
                resetForm()
                succeedAlert();
            } else {
                setForm(prevState => ({ ...prevState, error, isSubmitting: false }));
            }
        }
        saveTraction(trainCompositionId, body)

    }

    const resetForm = () => {
        setForm({ traction: [], modes: [], hasDriver: false, isSubmitting: false, error: '' })
    }

    return (
        <div className="rightbar">
            <div className="top">
                <h4>
                    Add Traction
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

                {/* Modes */}
                <div className="label-pos">
                    <Typeahead
                        clearButton
                        className="activites-input"
                        multiple
                        id="basic-typeahead-example"
                        labelKey={option => `${option.code} - ${option.description}`}
                        onChange={(value) => setModeHandler(value)}
                        options={modes.modes}
                        placeholder="Choose modes..."
                        selected={form.modes}
                        filterBy={['code', 'description']}
                        isLoading={modes.isFetching}
                    />
                    <label className="ct-label" htmlFor="basic-typeahead-example">
                        <li className="fas fa-text-height"></li>
                    </label>
                </div>

                <div className="label-pos d-flex align-items-center">
                    <input onChange={(event) => setHasDriverHandler(event.target.checked)} checked={form.hasDriver} className="w-auto" type="checkbox" id="lifestock" />
                    <label className="ml-2 mb-0" htmlFor="lifestock">Lifestock</label>
                </div>

                <div className="btn-submit">
                    <button style={{ cursor: validateForm() ? 'no-drop' : 'pointer' }} disabled={validateForm()}
                        type="submit">
                        ADD
                    </button>
                </div>

                {form.error && <div className="mt-2 text-danger">{form.error}</div>}
                {tractions.error && <div className="mt-2 text-danger">{tractions.error}</div>}
                {modes.error && <div className="mt-2 text-danger">{modes.error}</div>}
            </form>
        </div>
    );
}
