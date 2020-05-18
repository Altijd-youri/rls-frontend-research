import React, { useState } from 'react'

export default function DangeriousGoods() {


    return (
        <div className="d-flex flex-column align-items-center w-100">

            <div className="d-flex justify-content-between align-items-center w-100 mb-1">
                <span>
                    Dangerious goods
                </span>
                <span style={{ cursor: "pointer", color: "blue" }} onClick={() => { }}>
                    <li className="fa fa-plus" />
                </span>
            </div>

            <div className="w-100 mb-5" style={{ border: "1px solid lightgrey" }} />


            <div className="d-flex flex-column w-100">
                <div className="d-flex justify-content-between align-items-center w-100 mb-4">
                    <span style={{ fontSize: "25px", color: 'orange' }}><li className="fa fa-radiation-alt" /></span>
                    <span>10 KG</span>
                    <span
                        style={{ "textOverflow": "ellipsis", "overflow": "hidden", "width": "160px", "whiteSpace": "nowrap" }}>
                        Dangerious gas in fabricDangerious gas in fabric
                    </span>
                    <span style={{ fontSize: "px", color: 'red' }}><li className="far fa-minus-square" /></span>
                </div>

            </div>
        </div>
    )
}
