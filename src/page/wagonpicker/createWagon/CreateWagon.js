import React, { useState } from 'react'
import '../../assets/picker_create.scoped.css'
import { succeedAlert, errorAlert } from "../../../utils/Alerts";
import WagonService from "../../../api/wagon";

export default function CreateWagon({ onHide, onSave }) {
    const [isFetching, setFetching] = useState(false);

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

        const result = await WagonService.saveWagon(body);
        try {
            if (result.data) {
                onSave(prevState => ({ ...prevState, data: [...prevState.data, result.data] }))
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
                    Create Wagon
                </h4>
                <span onClick={onHide}>
                    <li className="fa fa-times" />
                </span>
            </div>

            <form onSubmit={submitForm} className="form-wrapper">
                <div className="form-group">
                    <input
                        id="brakeWeightG"
                        type="number"
                        pattern="^[1-9][0-9]{0,2}$"
                        title="Must contain at least one and max 3 numbers"
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
                        id="brakeWeightP"
                        type="number"
                        pattern="^[1-9][0-9]{0,2}$"
                        title="Validation: "
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
                        id="code"
                        type="text"
                        pattern="[a-zA-Z]{0,12}"
                        title="Must contain at least one and max 12 characters"
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
                        id="lengthOverBuffers"
                        type="number"
                        pattern="^[1-9][0-9]{0,5}$"
                        maxLength="6"
                        title="Must contain at least one and max 6 numbers"
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
                        id="maxSpeed"
                        type="number"
                        pattern="^[1-9][0-9]{0,5}$"
                        title="Must contain at least one and max 6 numbers"
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
                        id="numberFreight"
                        type="text"
                        pattern="[a-zA-Z]{12}"
                        title="Must contain 12 characters"
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
                        id="numberOfAxles"
                        type="number"
                        pattern="^[1-9][0-9]{0,2}$"
                        title="Must contain at least one and max 3 numbers"
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
                        id="typeName"
                        type="text"
                        pattern="[a-zA-Z]{0,12}"
                        title="Must contain at least one and max 12 characters"
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
                        id="weightEmpty"
                        type="number"
                        pattern="^[1-9][0-9]{0,5}$"
                        title="Must contain at least one and max 6 numbers"
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
                            : "ADD"
                        }
                    </button>
                </div>

            </form>
        </div>
    )
}
