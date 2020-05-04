import React from 'react'
import Button from 'react-bootstrap/Button'
import Statistics from './statistics/Statistics'

export default function Composition({ train, selectedJourney, setShowCreateTraction, setShowCreateWagon }) {


    return (
        <>
            <div className="jp-header d-flex w-100 align-items-center justify-content-between pl-4 pr-4">
                <h5>Composition</h5>
                {selectedJourney && <><Button
                    className="ml-auto mr-2"
                    variant="outline-secondary"
                    size="sm"
                    onClick={setShowCreateTraction}>
                    ADD TRACTION
                </Button>
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => { }}>
                        ADD WAGON
                </Button></>}
            </div>

            <div style={{ overflow: "auto" }}>
                <Statistics selectedJourney={selectedJourney} />
            </div>
        </>
    )
}
