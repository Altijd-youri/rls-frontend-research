import React, { useState } from 'react'
import '../../assets/picker_create.scoped.css'
import { succeedAlert, errorAlert } from "../../../utils/Alerts";
import TractionService from "../../../api/tractions";

export default function CreateTraction({ onHide, onSave }) {
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
            tractionType: params.get('tractionType'),
            typeName: params.get('typeName'),
            weight: params.get('weight')
        }

        const result = await TractionService.saveTraction(body);
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
                    Create Traction
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
                        pattern="[0-9]{6}"
                        title="Must contain at least one and max 6 numbers"
                        name="brakeWeightG"
                        maxLength="6"
                        className="form-control"
                        required
                    />
                    <label
                        className="form-control-placeholder"
                        htmlFor="brakeWeightG">
                        brakeWeightG
                    </label>
                    {form.brakeWeightG.error && <p>{form.brakeWeightG.error}</p>}
                </div>

                <div className="form-group">
                    <input
                        id="brakeWeightP"
                        type="number"
                        pattern="[0-9]{6}"
                        title="Must contain at least one and max 6 numbers"
                        name="brakeWeightP"
                        maxLength="6"
                        className="form-control"
                        required
                    />
                    <label
                        className="form-control-placeholder"
                        htmlFor="brakeWeightP">
                        brakeWeightP
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
                        code
                    </label>
                    {form.code.error && <p>{form.code.error}</p>}
                </div>

                <div className="form-group">
                    <input
                        id="lengthOverBuffers"
                        type="number"
                        pattern="[0-9]{6}"
                        maxLength="6"
                        title="Must contain at least one and max 6 numbers"
                        name="lengthOverBuffers"
                        className="form-control"
                        required
                    />
                    <label
                        className="form-control-placeholder"
                        htmlFor="lengthOverBuffers">
                        lengthOverBuffers
                    </label>
                    {form.lengthOverBuffers.error && <p>{form.lengthOverBuffers.error}</p>}
                </div>

                <div className="form-group">
                    <input
                        id="locoNumber"
                        type="text"
                        pattern="[a-zA-Z]{5,12}"
                        title="Must contain at least 5 and max 12 characters"
                        name="locoNumber"
                        maxLength="12"
                        className="form-control"
                        required
                    />
                    <label
                        className="form-control-placeholder"
                        htmlFor="locoNumber">
                        locoNumber
                    </label>
                    {form.locoNumber.error && <p>{form.locoNumber.error}</p>}
                </div>

                <div className="form-group">
                    <input
                        id="locoTypeNumber"
                        type="number"
                        pattern="[0-9]{5,12}"
                        title="Must contain at least 5 and max 6 numbers"
                        name="locoTypeNumber"
                        maxLength="12"
                        className="form-control"
                        required
                    />
                    <label
                        className="form-control-placeholder"
                        htmlFor="locoTypeNumber">
                        locoTypeNumber
                    </label>
                    {form.locoTypeNumber.error && <p>{form.locoTypeNumber.error}</p>}
                </div>

                <div className="form-group">
                    <input
                        id="numberOfAxles"
                        type="number"
                        pattern="[0-9]{6}"
                        title="Must contain at least one and max 6 numbers"
                        name="numberOfAxles"
                        maxLength="6"
                        className="form-control"
                        required
                    />
                    <label
                        className="form-control-placeholder"
                        htmlFor="numberOfAxles">
                        numberOfAxles
                    </label>
                    {form.numberOfAxles.error && <p>{form.numberOfAxles.error}</p>}
                </div>

                <div className="form-group">
                    <input
                        id="tractionType"
                        type="text"
                        pattern="[a-zA-Z]{0,12}"
                        title="Must contain at least one and max 12 characters"
                        name="tractionType"
                        maxLength="12"
                        className="form-control"
                        required
                    />
                    <label
                        className="form-control-placeholder"
                        htmlFor="tractionType">
                        tractionType
                    </label>
                    {form.tractionType.error && <p>{form.tractionType.error}</p>}
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
                        typeName
                    </label>
                    {form.typeName.error && <p>{form.typeName.error}</p>}
                </div>

                <div className="form-group">
                    <input
                        id="weight"
                        type="number"
                        pattern="[0-9]{6}"
                        title="Must contain at least one and max 6 numbers"
                        name="weight"
                        maxLength="6"
                        className="form-control"
                        required
                    />
                    <label
                        className="form-control-placeholder"
                        htmlFor="weight">
                        weight
                    </label>
                    {form.weight.error && <p>{form.weight.error}</p>}
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
