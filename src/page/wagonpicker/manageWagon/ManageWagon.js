import React, { useState, useEffect } from 'react'
import '../../assets/picker_create.scoped.css'
import { succeedAlert, errorAlert } from "../../../utils/Alerts";
import WagonService from "../../../api/wagon";

export default function ManageWagon({ onHide, onSave, wagonDTO }) {
    const [isFetching, setFetching] = useState(false);
    const [editMode] = useState(wagonDTO ? true : false)
    const [title, setTitle] = useState('CREATE');

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
        maxSpeed: {
            error: ''
        },
        numberFreight: {
            error: ''
        },
        numberOfAxles: {
            error: ''
        },
        typeName: {
            error: ''
        },
        weightEmpty: {
            error: ''
        }
    }
    const [form, setForm] = useState(initForm);

    useEffect(() => {
        if (wagonDTO) {
            setTitle("EDIT");
        } else {
            setTitle("CREATE");
        }
    }, [wagonDTO])

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
            maxSpeed: params.get('maxSpeed'),
            numberFreight: params.get('numberFreight'),
            numberOfAxles: params.get('numberOfAxles'),
            typeName: params.get('typeName'),
            weightEmpty: params.get('weightEmpty')
        }

        const result = editMode ? await WagonService.editWagon(wagonDTO.id, body) : await WagonService.saveWagon(body)
        try {
            if (result.data) {
                if (editMode) {
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
                    {title} WAGON
                </h4>
                <span onClick={onHide}>
                    <li className="fa fa-times" />
                </span>
            </div>

            <form onSubmit={submitForm} className="form-wrapper">
                <div className="form-group">
                    <input
                        key={`brakeWeightG || ${wagonDTO?.brakeWeightG}`}
                        defaultValue={wagonDTO?.brakeWeightG}
                        id="brakeWeightG"
                        type="number"
                        name="brakeWeightG"
                        maxLength="3"
                        className="form-control"
                        required
                    />
                    <label
                        className="form-control-placeholder"
                        htmlFor="brakeWeightG">
                        Brake Weight G (in tons)
                    </label>
                    {form.brakeWeightG.error && <p>{form.brakeWeightG.error}</p>}
                </div>

                <div className="form-group">
                    <input
                        key={`brakeWeightP || ${wagonDTO?.brakeWeightP}`}
                        defaultValue={wagonDTO?.brakeWeightP}
                        id="brakeWeightP"
                        type="number"
                        name="brakeWeightP"
                        maxLength="3"
                        className="form-control"
                        required
                    />
                    <label
                        className="form-control-placeholder"
                        htmlFor="brakeWeightP">
                        Brake Weight P (in tons)
                    </label>
                    {form.brakeWeightP.error && <p>{form.brakeWeightP.error}</p>}
                </div>

                <div className="form-group">
                    <input
                        key={`code || ${wagonDTO?.code}`}
                        defaultValue={wagonDTO?.code}
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
                        key={`lengthOverBuffers || ${wagonDTO?.lengthOverBuffers}`}
                        defaultValue={wagonDTO?.lengthOverBuffers}
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
                        key={`maxSpeed || ${wagonDTO?.maxSpeed}`}
                        defaultValue={wagonDTO?.maxSpeed}
                        id="maxSpeed"
                        type="number"
                        name="maxSpeed"
                        maxLength="6"
                        className="form-control"
                        required
                    />
                    <label
                        className="form-control-placeholder"
                        htmlFor="maxSpeed">
                        Max Speed (in km/h)
                    </label>
                    {form.maxSpeed.error && <p>{form.maxSpeed.error}</p>}
                </div>

                <div className="form-group">
                    <input
                        key={`numberFreight || ${wagonDTO?.numberFreight}`}
                        defaultValue={wagonDTO?.numberFreight}
                        id="numberFreight"
                        type="text"
                        name="numberFreight"
                        maxLength="12"
                        className="form-control"
                        required
                    />
                    <label
                        className="form-control-placeholder"
                        htmlFor="numberFreight">
                        Number Freight
                    </label>
                    {form.numberFreight.error && <p>{form.numberFreight.error}</p>}
                </div>

                <div className="form-group">
                    <input
                        key={`wagonNumberOfAxles || ${wagonDTO?.wagonNumberOfAxles}`}
                        defaultValue={wagonDTO?.wagonNumberOfAxles}
                        id="numberOfAxles"
                        type="number"
                        name="numberOfAxles"
                        maxLength="3"
                        className="form-control"
                        required
                    />
                    <label
                        className="form-control-placeholder"
                        htmlFor="numberOfAxles">
                        Number Of Axles
                    </label>
                    {form.numberOfAxles.error && <p>{form.numberOfAxles.error}</p>}
                </div>

                <div className="form-group">
                    <input
                        key={`typeName || ${wagonDTO?.typeName}`}
                        defaultValue={wagonDTO?.typeName}
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
                        key={`weightEmpty || ${wagonDTO?.weightEmpty}`}
                        defaultValue={wagonDTO?.weightEmpty}
                        id="weightEmpty"
                        type="number"
                        name="weightEmpty"
                        maxLength="6"
                        className="form-control"
                        required
                    />
                    <label
                        className="form-control-placeholder"
                        htmlFor="weightEmpty">
                        Weight Empty (in tons)
                    </label>
                    {form.weightEmpty.error && <p>{form.weightEmpty.error}</p>}
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
