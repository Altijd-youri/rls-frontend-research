import React from 'react'

export default function Good({ dangerGoodType, remove }) {
    return (
        <div className="d-flex justify-content-between align-items-center w-100">
            <span style={{ fontSize: "25px", color: 'orange' }}><li className="fa fa-radiation-alt" /></span>
            <span>{dangerGoodType.weight} KG</span>
            <span
                style={{ "textOverflow": "ellipsis", "overflow": "hidden", "width": "160px", "whiteSpace": "nowrap" }}>
                {dangerGoodType.data.unNumber}
            </span>
            <span onClick={() => remove(dangerGoodType.index)} style={{ cursor: "pointer", fontSize: "px", color: 'red' }}><li className="far fa-minus-square" /></span>
        </div>
    )
}
