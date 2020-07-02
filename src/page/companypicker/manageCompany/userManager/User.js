import React from 'react'

export default function User({ userId, remove }) {
    return (
        <div className="d-flex pb-2 pt-2 justify-content-between align-items-center w-100">
            <span style={{ fontSize: "15px", color: 'green' }}><li className="fa fa-user" /></span>
            <span style={{ fontSize: "12px" }}>{userId}</span>
            <span onClick={() => remove(userId)} style={{ cursor: "pointer", fontSize: "px", color: 'red' }}><li className="far fa-minus-square" /></span>
        </div>
    )
}