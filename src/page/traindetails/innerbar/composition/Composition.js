import React from 'react'
import Button from 'react-bootstrap/Button'

export default function Composition({ selectedJourney }) {


    return (
        <>
            <div className="jp-header d-flex w-100 align-items-center justify-content-between pl-4 pr-4">
                <h5>Composition</h5>
                <Button
                    className="ml-auto mr-2"
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => { }}>
                    ADD WAGON
                </Button>
                <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => { }}>
                    ADD TRACTION
                </Button>
            </div>

            <div style={{ overflow: "auto" }}>

            </div>
        </>
    )
}
