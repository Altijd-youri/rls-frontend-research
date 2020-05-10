import React, { useState, useEffect } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead';
import WagonService from '../../../../../api/wagon';
import TrainCompositionService from '../../../../../api/traincomposition';
import './CreateWagon.scoped.css';
import { succeedAlert } from '../../../../../utils/Alerts';

export default function CreateWagon({ onHide, selectedJourney, setSelectedJourney }) {
    useEffect(() => {
        fetchWagons();
    }, [])

    const [wagons, setWagons] = useState({ wagons: [], isFetching: false, error: '' });
    const [form, setForm] = useState({ wagon: [], loadWeight: 0, breakType: 'P', isSubmitting: false, error: '' })

    const setWagonHandler = wagon => {
        setForm(prevState => ({ ...prevState, wagon }))
    }

    const setLoadWeightHandler = loadWeight => {
        setForm(prevState => ({ ...prevState, loadWeight }))
    }

    const setBreakTypeHandler = breakType => {
        setForm(prevState => ({ ...prevState, breakType }))
    }

    const fetchWagons = async () => {
        setWagons(prevState => ({ ...prevState, isFetching: true }))
        const { data, error } = await WagonService.getWagons();
        if (data) {
            setWagons(prevState => ({ ...prevState, isFetching: false, wagons: data }))
        } else {
            setWagons(prevState => ({ ...prevState, isFetching: false, error }))
        }
    }

    const validateForm = () => {
        if (form.wagon.length && form.loadWeight.length && !form.isSubmitting) {
            return false;
        }
        return true;
    }

    const submitForm = (event) => {
        event.preventDefault();
        setForm(prevState => ({ ...prevState, isSubmitting: true }))

        const trainCompositionId = selectedJourney.trainComposition.id;
        const wagonUrl = form.wagon[0].links.find(link => link.rel === 'self').href;
        const body = {
            brakeType: form.breakType,
            brakeWeight: 1,
            breakTypeUrl: "string",
            position: 0,
            totalLoadWeight: form.loadWeight,
            wagonMaxSpeed: 0,
            wagonUrl
        }

        const saveWagon = async (trainCompositionId, body) => {
            const { data, error } = await TrainCompositionService.saveWagon(trainCompositionId, body);
            if (data) {
                const updatedSelectedJourney = { ...selectedJourney, trainComposition: data }
                setSelectedJourney(updatedSelectedJourney)
                resetForm()
                succeedAlert();
            } else {
                setForm(prevState => ({ ...prevState, error, isSubmitting: false }));
            }
        }
        saveWagon(trainCompositionId, body)

    }

    const resetForm = () => {
        setForm({ wagon: [], loadWeight: '', breakType: 'P', isSubmitting: false, error: '' })
    }

    return (
        <div className="rightbar">
            <div className="top">
                <h4>
                    Add Wagon
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
                        labelKey={option => `${option.numberFreight} - ${option.code}`}
                        onChange={(value) => setWagonHandler(value)}
                        options={wagons.wagons}
                        placeholder="Choose a Wagon..."
                        selected={form.wagon}
                        filterBy={['numberFreight', 'code']}
                        isLoading={wagons.isFetching}
                    />
                    <label className="ct-label" htmlFor="basic-typeahead-example">
                        <li className="fas fa-text-height"></li>
                    </label>
                </div>

                <div className="label-pos">
                    <input
                        value={form.loadWeight}
                        onChange={(event) => setLoadWeightHandler(event.target.value)}
                        placeholder="Load weight"
                        type="number"
                        name="loadweight"
                    />
                    <label className="ct-label" htmlFor="loadweight">
                        <li className="fas fa-weight-hanging"></li>
                    </label>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                    <label>Break type</label><br />
                    <div className="form-check form-check-inline" style={{ width: "40px" }}>
                        <input className="form-check-input" type="radio" name="inlineRadioOptions" onChange={() => setBreakTypeHandler('G')} checked={form.breakType === 'G'} />
                        <label className="form-check-label">G</label>
                    </div>
                    <div className="form-check form-check-inline" style={{ width: "40px" }}>
                        <input className="form-check-input" type="radio" name="inlineRadioOptions" onChange={() => setBreakTypeHandler('P')} checked={form.breakType === 'P'} />
                        <label className="form-check-label" >P</label>
                    </div>
                </div>

                <div className="btn-submit">
                    <button style={{ cursor: validateForm() ? 'no-drop' : 'pointer' }} disabled={validateForm()}
                        type="submit">
                        ADD
                    </button>
                </div>

                {form.error && <div className="mt-2 text-danger">{form.error}</div>}
                {wagons.error && <div className="mt-2 text-danger">{wagons.error}</div>}
            </form>
        </div>
    );
}
