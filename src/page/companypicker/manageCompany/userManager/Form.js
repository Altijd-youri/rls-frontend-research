import React from 'react'
import './CreateWagon.scoped.css';

export default function Form({ form, setForm, add }) {
    const validate = () => {
        return true;
    }

    const setUserIdHandler = (e) => {
        const input = e.target.value;
        setForm(prevState => ({ ...prevState, userId: input }))
    }

    return (
        <div className="d-flex w-100 flex-column p-2 mb-3" style={{ border: "2px dotted lightgrey" }}>
            <div className="d-flex justify-content-between align-items-center w-100 mb-3">
                <h5 className="mb-0">Add user</h5>
                <span style={{ cursor: "pointer", color: "red" }} onClick={() => setForm(prevState => ({ ...prevState, showForm: false }))}>
                    <li className="far fa-minus-square" />
                </span>
            </div>
            <div className="mb-2 position-relative">
                <input
                    onChange={setUserIdHandler}
                    value={form.userId}
                    placeholder="User ID"
                    type="text"
                    name="userId"
                    required
                />
                <label className="ct-label" htmlFor="userId">
                    <li className="fas fa-user"></li>
                </label>

                <div className="btn-submit mt-3">
                    <button
                        style={{ cursor: !validate() ? 'no-drop' : 'pointer' }}
                        disabled={!validate()}
                        type="button"
                        onClick={add}
                    >
                        ADD
                    </button>
                </div>
            </div>
        </div>
    )
}
