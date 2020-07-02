import React, { useState, useEffect } from 'react'
import User from './User';
import Form from './Form';

export default function UserManager({ users, setUsers, add, remove, getToken }) {

    const [form, setForm] = useState({ userId: '', showForm: false })

    useEffect(() => {
        if (users) {
            setForm(prevState => ({ ...prevState, users }))
        }
    }, [users])

    const addUserHandler = () => {
        add(form.userId)
    }

    const removeUserHandler = (userId) => {
        remove(userId)
    }

    return (
        <>
            <div className="d-flex flex-column align-items-center w-100 mb-3" style={{ border: "lightgrey 2px solid" }}>
                <>
                    <div className="d-flex justify-content-between align-items-center w-100 p-2">
                        <span>
                            Users
                            </span>
                        <span style={{ cursor: "pointer", color: "blue" }} onClick={() => setForm(prevState => ({ ...prevState, showForm: !prevState.showForm }))}>
                            <li className={!form.showForm ? "fa fa-plus" : "far fa-minus-square"} />
                        </span>
                    </div>

                    <div className="w-100" style={{ border: "1px solid lightgrey" }} />


                    <div className="d-flex flex-column w-100 p-2" style={{ borderBottom: "2px solid bottom" }}>
                        <div className="d-flex flex-column">
                            {form.users?.length ?
                                users.map((item, index) => {
                                    return <User key={index} userId={item} remove={removeUserHandler} />
                                })
                                : <span style={{ fontSize: "13px" }}>Add user..</span>
                            }
                        </div>
                    </div>
                </>

            </div>

            {form.showForm && <Form
                form={form}
                setForm={setForm}
                add={addUserHandler}
            />}
        </>
    )
}
