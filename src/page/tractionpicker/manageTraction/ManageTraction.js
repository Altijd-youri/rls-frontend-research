import React, { useState, useEffect } from 'react'
import '../../assets/picker_create.scoped.css'
import { succeedAlert, errorAlert } from "../../../utils/Alerts";
import TractionService from "../../../api/tractions";
import { POWER_SUPPLY, TRACTION_UNIT } from '../../../utils/constants';

export default function ManageTraction({ onHide, onSave, tractionDTO, getToken }) {
    const [isFetching, setFetching] = useState(false);
    const [powerSupply, setPowerSupply] = useState(0);
    const [tractionUnit, setTractionUnit] = useState(0);
    const [title, setTitle] = useState('CREATE');

    useEffect(() => {
        if (tractionDTO) {
            setTitle("EDIT");
            const code = tractionDTO.tractionType?.code;
            if (code) {
                const charArray = Array.from(code);
                if (charArray.length === 2) {
                    setPowerSupply(POWER_SUPPLY[charArray[0]].key)
                    setTractionUnit(TRACTION_UNIT[charArray[1]].key)
                }
            }
        } else {
            setTitle("CREATE");
            setPowerSupply(0);
            setTractionUnit(0);
        }
    }, [tractionDTO])

    const initForm = {
        brakeWeightG: {
            error: ''
        },
        brakeWeightP: {
            error: ''
        },
        code: {
            error: ''
        },
        lengthOverBuffers: {
            error: ''
        },
        locoNumber: {
            error: ''
        },
        locoTypeNumber: {
            error: ''
        },
        numberOfAxles: {
            error: ''
        },
        tractionType: {
            error: ''
        },
        typeName: {
            error: ''
        },
        weight: {
            error: ''
        }
    }
    const [form, setForm] = useState(initForm);

    const submitForm = async (event) => {
        event.preventDefault();
        setFetching(true);
        setForm(initForm);

        const params = new FormData(event.target);

        const body = {
            brakeWeightG: params.get('brakeWeightG'),
            brakeWeightP: params.get('brakeWeightP'),
            code: params.get('code'),
            lengthOverBuffers: params.get('lengthOverBuffers'),
            locoNumber: params.get('locoNumber'),
            locoTypeNumber: params.get('locoTypeNumber'),
            numberOfAxles: params.get('numberOfAxles'),
            typeName: params.get('typeName'),
            weight: params.get('weight'),
            tractionType: `${powerSupply}${tractionUnit}`
        }

        const result = tractionDTO ? await TractionService.editTraction(tractionDTO.id, body, await getToken()) : await TractionService.saveTraction(body, await getToken());
        try {
            if (result.data) {
                if (tractionDTO) {
                    onSave(prevState => {
                        const newList = prevState.data.map((item) => {
                            if (item.id === result.data.id) {
                                return result.data;
                            } else {
                                return item;
                            }
                        })
                        return ({ ...prevState, data: newList })
                    })
                } else {
                    onSave(prevState => ({ ...prevState, data: [...prevState.data, result.data] }))
                }
                succeedAlert()
            } else if (result?.error?.errors) {
                result.error.errors.forEach(element => {
                    const { field, message } = element;
                    setForm(prevState => {
                        let updatedFieldName = form[field]
                        updatedFieldName.error = message;
                        return { ...prevState, field: updatedFieldName }
                    })
                });
            } else {
                throw new Error(result.message);
            }
        } catch (e) {
            errorAlert(e);
        }
        setFetching(false);
    }

    return (
        <div className="rightbar">
            <div className="top">
                <h4>
                    {title} TRACTION
                </h4>
                <span onClick={onHide}>
                    <li className="fa fa-times" />
                </span>
            </div>

            <form onSubmit={submitForm} className="form-wrapper">
                <div className="form-group">
                    <input
                        key={`brakeWeightG || ${tractionDTO?.brakeWeightG}`}
                        defaultValue={tractionDTO?.brakeWeightG}
                        id="brakeWeightG"
                        type="number"
                        name="brakeWeightG"
                        maxLength="6"
                        className="form-control"
                        required
                    />
                    <label
                        className="form-control-placeholder"
                        htmlFor="brakeWeightG">
                        Brake Weight G (in tonnes)
                    </label>
                    {form.brakeWeightG.error && <p>{form.brakeWeightG.error}</p>}
                </div>

                <div className="form-group">
                    <input
                        key={`brakeWeightP || ${tractionDTO?.brakeWeightP}`}
                        defaultValue={tractionDTO?.brakeWeightP}
                        id="brakeWeightP"
                        type="number"
                        name="brakeWeightP"
                        maxLength="6"
                        className="form-control"
                        required
                    />
                    <label
                        className="form-control-placeholder"
                        htmlFor="brakeWeightP">
                        Brake Weight P (in tonnes)
                    </label>
                    {form.brakeWeightP.error && <p>{form.brakeWeightP.error}</p>}
                </div>

                <div className="form-group">
                    <input
                        key={`code || ${tractionDTO?.code}`}
                        defaultValue={tractionDTO?.code}
                        id="code"
                        type="text"
                        name="code"
                        maxLength="12"
                        className="form-control"
                        required
                    />
                    <label
                        className="form-control-placeholder"
                        htmlFor="code">
                        Code
                    </label>
                    {form.code.error && <p>{form.code.error}</p>}
                </div>

                <div className="form-group">
                    <input
                        key={`lengthOverBuffers || ${tractionDTO?.lengthOverBuffers}`}
                        defaultValue={tractionDTO?.lengthOverBuffers}
                        id="lengthOverBuffers"
                        type="number"
                        maxLength="6"
                        name="lengthOverBuffers"
                        className="form-control"
                        required
                    />
                    <label
                        className="form-control-placeholder"
                        htmlFor="lengthOverBuffers">
                        Length Over Buffers (in meters)
                    </label>
                    {form.lengthOverBuffers.error && <p>{form.lengthOverBuffers.error}</p>}
                </div>

                <div className="form-group">
                    <input
                        key={`locoNumber || ${tractionDTO?.locoNumber}`}
                        defaultValue={tractionDTO?.locoNumber}
                        id="locoNumber"
                        type="text"
                        name="locoNumber"
                        maxLength="12"
                        className="form-control"
                        required
                    />
                    <label
                        className="form-control-placeholder"
                        htmlFor="locoNumber">
                        loco Number
                    </label>
                    {form.locoNumber.error && <p>{form.locoNumber.error}</p>}
                </div>

                <div className="form-group">
                    <input
                        key={`locoTypeNumber || ${tractionDTO?.locoTypeNumber}`}
                        defaultValue={tractionDTO?.locoTypeNumber}
                        id="locoTypeNumber"
                        type="number"
                        name="locoTypeNumber"
                        maxLength="12"
                        className="form-control"
                        required
                    />
                    <label
                        className="form-control-placeholder"
                        htmlFor="locoTypeNumber">
                        loco Type Number
                    </label>
                    {form.locoTypeNumber.error && <p>{form.locoTypeNumber.error}</p>}
                </div>

                <div className="form-group">
                    <input
                        key={`numberOfAxles || ${tractionDTO?.numberOfAxles}`}
                        defaultValue={tractionDTO?.numberOfAxles}
                        id="numberOfAxles"
                        type="number"
                        name="numberOfAxles"
                        maxLength="6"
                        className="form-control"
                        required
                    />
                    <label
                        className="form-control-placeholder"
                        htmlFor="numberOfAxles">
                        Number of Axles
                    </label>
                    {form.numberOfAxles.error && <p>{form.numberOfAxles.error}</p>}
                </div>

                <div className="form-group">
                    <select
                        onChange={({ target }) => setPowerSupply(target.value)}
                        value={powerSupply}
                        name="powerSupply"
                        className="form-control"
                        id="powerSupply">
                        {
                            POWER_SUPPLY.map((item, index) => {
                                return (
                                    <option key={index} value={item.key}>{item.value}</option>
                                )
                            })
                        }
                    </select>
                    <label
                        className="form-control-placeholder"
                        htmlFor="powerSupply">
                        Power Supply
                    </label>
                </div>

                <div className="form-group">
                    <select
                        onChange={({ target }) => setTractionUnit(target.value)}
                        value={tractionUnit}
                        name="tractionUnit"
                        className="form-control"
                        id="tractionUnit">
                        {
                            TRACTION_UNIT.map((item, index) => {
                                return (
                                    <option key={index} value={item.key}>{item.value}</option>
                                )
                            })
                        }
                    </select>
                    <label
                        className="form-control-placeholder"
                        htmlFor="tractionUnit">
                        Traction Unit
                    </label>
                </div>

                <div className="form-group">
                    <input
                        key={`typeName || ${tractionDTO?.typeName}`}
                        defaultValue={tractionDTO?.typeName}
                        id="typeName"
                        type="text"
                        name="typeName"
                        maxLength="12"
                        className="form-control"
                        required
                    />
                    <label
                        className="form-control-placeholder"
                        htmlFor="typeName">
                        Type Name
                    </label>
                    {form.typeName.error && <p>{form.typeName.error}</p>}
                </div>

                <div className="form-group">
                    <input
                        key={`weight || ${tractionDTO?.weight}`}
                        defaultValue={tractionDTO?.weight}
                        id="weight"
                        type="number"
                        name="weight"
                        maxLength="6"
                        className="form-control"
                        required
                    />
                    <label
                        className="form-control-placeholder"
                        htmlFor="weight">
                        Weight (in tonnes)
                    </label>
                    {form.weight.error && <p>{form.weight.error}</p>}
                </div>

                <div className="btn-submit">
                    <button className="btn btn-primary" type="submit" disabled={isFetching}>
                        {isFetching
                            ? (<><span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                                <span className="sr-only">Loading...</span></>)
                            : `${title}`
                        }
                    </button>
                </div>

            </form>
        </div>
    )
}
