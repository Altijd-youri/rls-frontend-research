import React, { useState, useEffect } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead';
import WagonService from '../../../../../api/wagon';
import TrainCompositionService from '../../../../../api/traincomposition';
import './CreateWagon.scoped.css';
import { succeedAlert, errorAlert } from '../../../../../utils/Alerts';
import DangerousGoods from './DangerousGoods/DangerousGoods';
import JourneySectionService from '../../../../../api/journeysections';

export default function CreateWagon({ onHide, selectedJourney, setSelectedJourney, getToken }) {
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

    const [wagons, setWagons] = useState({ wagons: [], isFetching: false, error: '' });
    const [form, setForm] = useState({ wagon: [], loadWeight: "0", breakType: 'P', dangerGoods: [], isSubmitting: false, error: '' })

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

    const setBreakTypeHandler = breakType => {
        setForm(prevState => ({ ...prevState, breakType }))
    }

    const validateForm = () => {
        if (form.wagon.length && form.loadWeight && !form.isSubmitting) {
            return false;
        }
        return true;
    }

    const submitForm = async (event) => {
        event.preventDefault();

        const numberFreight = form.wagon[0].numberFreight
        const containsStock = selectedJourney.trainComposition.rollingStock.some(stock => {
            return stock?.wagon?.numberFreight === numberFreight
        });

        if (containsStock) {
            return setForm(prevState => ({ ...prevState, error: 'Stock exists in current composition' }));
        }

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
            brakeType: form.breakType,
            totalLoadWeight: form.loadWeight,
            stockIdentifier: numberFreight,
            dangerGoodsInWagonPostDtos
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
                resetForm()
            }
        }
    }

    const resetForm = () => {
        setForm({ wagon: [], loadWeight: '0', breakType: 'P', dangerGoods: [], isSubmitting: false, error: '' })
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
                        placeholder="Load weight (in tonnes)"
                        type="number"
                        name="loadweight"
                        min="0"
                        max="999999"
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

                <DangerousGoods
                    getToken={() => getToken()}
                    dangerGoods={form.dangerGoods}
                    add={addDangerGoodHandler}
                    remove={removeDangerGoodHandler}
                />

                <div className="btn-submit">
                    <button style={{ cursor: validateForm() ? 'no-drop' : 'pointer' }} disabled={validateForm()}
                        type="submit">
                        SAVE WAGON
                    </button>
                </div>

                {form.error && <div className="mt-2 text-danger">{form.error}</div>}
                {wagons.error && <div className="mt-2 text-danger">{wagons.error}</div>}
            </form>
        </div>
    );
}
