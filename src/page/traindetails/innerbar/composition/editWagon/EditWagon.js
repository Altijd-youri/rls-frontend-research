import React, { useState, useEffect } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead';
import WagonService from '../../../../../api/wagon';
import TrainCompositionService from '../../../../../api/traincomposition';
import '../createWagon/CreateWagon.scoped.css';
import { succeedAlert, errorAlert } from '../../../../../utils/Alerts';
import DangerousGoods from '../createWagon/DangerousGoods/DangerousGoods';
import JourneySectionService from '../../../../../api/journeysections';

export default function EditWagon({ onHide, selectedJourney, setSelectedJourney, data, getToken }) {
    useEffect(() => {
        const fetchWagons = async () => {
            setWagons(prevState => ({ ...prevState, isFetching: true }))
            const { data, error } = await WagonService.getWagons(await getToken());
            if (data) {
                setWagons(prevState => ({ ...prevState, isFetching: false, wagons: data }))
            } else {
                setWagons(prevState => ({ ...prevState, isFetching: false, error }))
            }
        }
        fetchWagons();
    }, [getToken])

    useEffect(() => {
        if (data) {
            setForm(prevState => ({
                ...prevState,
                wagon: [data.wagon],
                loadWeight: data.totalLoadWeight,
                brakeType: data.brakeType,
                dangerGoods: data.dangerGoods.map((item, index) => ({ data: item.dangerGoodsType, index, weight: item.dangerousGoodsWeight }))
            }))
        }
    }, [data])

    const [wagons, setWagons] = useState({ wagons: [], isFetching: false, error: '' });
    const [form, setForm] = useState({ wagon: [], loadWeight: "0", brakeType: 'P', dangerGoods: [], isSubmitting: false, error: '' })

    const addDangerGoodHandler = (dangerGood) => {
        setForm(prevState => ({ ...prevState, dangerGoods: [...prevState.dangerGoods, dangerGood] }))
    }

    const removeDangerGoodHandler = (dangerGoodIndex) => {
        const filteredList = form.dangerGoods.filter(item => item.index !== dangerGoodIndex)
        setForm(prevState => ({ ...prevState, dangerGoods: filteredList }))
    }

    const setWagonHandler = wagon => {
        setForm(prevState => ({ ...prevState, wagon }))
    }

    const setLoadWeightHandler = loadWeight => {
        setForm(prevState => ({ ...prevState, loadWeight }))
    }

    const setBrakeTypeHandler = brakeType => {
        setForm(prevState => ({ ...prevState, brakeType }))
    }

    const validateForm = () => {
        if (form.wagon.length && !form.isSubmitting) {
            return false;
        }
        return true;
    }

    const submitForm = async (event) => {
        event.preventDefault();
        setForm(prevState => ({ ...prevState, isSubmitting: true }))

        const trainCompositionId = selectedJourney.trainComposition.id;

        const dangerGoodsInWagonPostDtos = form.dangerGoods.map(item => {
            return {
                dangerGoodsTypeUrl: item.data.links.find(link => link.rel === 'self').href,
                dangerousGoodsWeight: item.weight
            }
        })

        const body = {
            stockType: "wagon",
            stockIdentifier: parseInt(form.wagon[0].numberFreight),
            dangerGoodsInWagonPostDtos,
            brakeType: form.brakeType,
            totalLoadWeight: form.loadWeight === '' ? 0 : form.loadWeight
        }

        const { error } = await TrainCompositionService.updateStock(trainCompositionId, data.id, body, await getToken());
        if (error) {
            setForm(prevState => ({ ...prevState, error, isSubmitting: false }));
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
            }
        }
    }

    return (
        <div className="rightbar">
            <div className="top">
                <h4>
                    Edit Wagon
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
                        min="0"
                    />
                    <label className="ct-label" htmlFor="loadweight">
                        <li className="fas fa-weight-hanging"></li>
                    </label>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                    <label>Brake type</label><br />
                    <div className="form-check form-check-inline" style={{ width: "40px" }}>
                        <input className="form-check-input" type="radio" name="inlineRadioOptions" onChange={() => setBrakeTypeHandler('G')} checked={form.brakeType === 'G'} />
                        <label className="form-check-label">G</label>
                    </div>
                    <div className="form-check form-check-inline" style={{ width: "40px" }}>
                        <input className="form-check-input" type="radio" name="inlineRadioOptions" onChange={() => setBrakeTypeHandler('P')} checked={form.brakeType === 'P'} />
                        <label className="form-check-label" >P</label>
                    </div>
                </div>

                <DangerousGoods
                    getToken={getToken}
                    dangerGoods={form.dangerGoods}
                    add={addDangerGoodHandler}
                    remove={removeDangerGoodHandler}
                />

                <div className="btn-submit">
                    <button style={{ cursor: validateForm() ? 'no-drop' : 'pointer' }} disabled={validateForm()}
                        type="submit">
                        UPDATE WAGON
                    </button>
                </div>

                {form.error && <div className="mt-2 text-danger">{form.error}</div>}
                {wagons.error && <div className="mt-2 text-danger">{wagons.error}</div>}
            </form>
        </div>
    );
}
