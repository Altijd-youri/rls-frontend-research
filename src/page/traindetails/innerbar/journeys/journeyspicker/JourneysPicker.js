import React, { useState, Fragment, useEffect } from 'react'
import './JourneysPicker.css';
import './JourneysPicker.scss';
import Button from 'react-bootstrap/Button'

export default function JourneysPicker({ train, setShowCreateJourney, setShowEditJourney, selectedJourney, selectedJourneyHandler }) {
    const [trainWithSortedJourneys, setTrainWithSortedJourneys] = useState(train);

    useEffect(() => {
        let listOfJourneys = train?.journeySections;
        listOfJourneys.sort((a, b) => a.id - b.id);
        setTrainWithSortedJourneys(prevState => {
            return { ...prevState, journeySections: listOfJourneys }
        })
    }, [train])

    function getDepartureName(journey) {
        const departure = journey.links.find(link => link.rel === "journeySectionOrigin")
        return departure.title;
    }

    function getDestinationName(journey) {
        const destination = journey.links.find(link => link.rel === "journeySectionDestination")
        return destination.title;
    }

    function createPart(className, incoming, outcoming, text, onClick) {
        let firstLine = text;
        let secondLine;
        if (firstLine.length > 24) {
            secondLine = firstLine.slice(24, 48);
            firstLine = firstLine.slice(0, 24);
        }
        let path = "M0,72";
        if (incoming) {
            path += " L24,36";
        }
        path += " L0,0 L250,0";
        if (outcoming) {
            path += " L274,36";
        }
        path += " L250,72 L0,72 Z";
        return <svg className={className} width="275px" height="72px" viewBox="0 0 275 72" version="1.2"
            xmlns="http://www.w3.org/2000/svg" onClick={onClick}>
            <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <path d={path} id="Combined-Shape" />
            </g>
            <text fill="black" x="40" y={secondLine !== undefined ? '28' : '40'}>{firstLine}
                <tspan x="40" y="52">{secondLine}</tspan></text>
        </svg>
    }

    function renderPart(journey, index) {
        let className = "part2";
        if (selectedJourney && journey.id === selectedJourney.id) {
            className += " selected";
        }
        return <Fragment key={index}>
            {createPart(className, index !== 0, index !== -2, getDepartureName(journey), () => selectedJourneyHandler(journey))}
        </Fragment>
    }

    return (
        <>
            <div className="jp-header d-flex w-100 align-items-center justify-content-between pl-4 pr-4">
                <h5>Journeys</h5>
                {selectedJourney && <Button
                    style={{ marginLeft: "auto", marginRight: "15px" }}
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => setShowEditJourney(true)}
                >
                    EDIT DESTINATION
                </Button>}
                <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => setShowCreateJourney(true)}
                >
                    ADD DESTINATION
                </Button>
            </div>

            <div style={{ overflow: "auto" }} className="partcontainer">
                {trainWithSortedJourneys.journeySections.map((journey, index) => renderPart(journey, index))}
                {/* {trainWithSortedJourneys.journeySections.length > 0 &&
                    createPart("part2 disabled", true, true, getDestinationName(trainWithSortedJourneys.journeySections[trainWithSortedJourneys.journeySections.length - 1]), () => { })
                } */}
                {createPart("part2 create", true, false, getDestinationName(trainWithSortedJourneys.journeySections[trainWithSortedJourneys.journeySections.length - 1]), () => { })}
            </div>
        </>
    )
}
