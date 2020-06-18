import React from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import '../CreateWagon.scoped.css';

export default function Form({ setForm, dangerGoodsTypes, form, add }) {

    const setWeightHandler = (e) => {
        const weight = e.target.value;
        setForm(prevState => ({ ...prevState, weight }))
    }

    const validate = () => {
        return form.selectedDangerGoodsType.length && form.weight
    }

    return (
        <div className="d-flex w-100 flex-column p-2 mb-3" style={{ border: "2px dotted lightgrey" }}>
            <div className="d-flex justify-content-between align-items-center w-100">
                <h5 className="mb-0">Add dangerous good</h5>
                <span style={{ cursor: "pointer", color: "red" }} onClick={() => setForm(prevState => ({ ...prevState, showForm: false }))}>
                    <li className="far fa-minus-square" />
                </span>
            </div>
            <div className="mb-3 mt-2 position-relative">
                <Typeahead
                    clearButton
                    id="basic-typeahead-example"
                    labelKey={option => `${option.unNumber} - ${option.hazardIdentificationNumber}`}
                    onChange={(value) => setForm(prevState => ({ ...prevState, selectedDangerGoodsType: value }))}
                    options={dangerGoodsTypes.data}
                    placeholder="Select a danger good type..."
                    selected={form.selectedDangerGoodsType}
                    filterBy={['unNumber', 'hazardIdentificationNumber']}
                    isLoading={dangerGoodsTypes.isFetching}
                />
                <label className="ct-label" htmlFor="basic-typeahead-example">
                    <li className="fa fa-radiation-alt"></li>
                </label>
            </div>
            <div className="mb-2 position-relative">
                <input
                    value={form.weight}
                    onChange={setWeightHandler}
                    placeholder="Load weight (in kilos)"
                    type="number"
                    name="loadweight"
                />
                <label className="ct-label" htmlFor="loadweight">
                    <li className="fas fa-weight-hanging"></li>
                </label>

                <div className="btn-submit mt-3">
                    <button
                        style={{ cursor: !validate() ? 'no-drop' : 'pointer' }}
                        disabled={!validate()}
                        type="button"
                        onClick={add}>
                        ADD
                    </button>
                </div>
            </div>
        </div>
    )
}
