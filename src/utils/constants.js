export const PATH = {
    HOME: '/',
    TRAINS: '/trains',
    TRAINDETAILS: '/train/:trainid/details',
    TRACTIONS: '/tractions',
    WAGONS: '/wagons',
}

export const trainTypes = [
    { id: "1", name: "Passenger" },
    { id: "2", name: "Freight" },
    { id: "3", name: "Light Engine" },
    { id: "4", name: "Engineering" }
]

export const ENDPOINTS = {
    TRAINS: `${process.env.REACT_APP_ENDPOINT}/api/v1/trains`,
    LOCATIONS: `${process.env.REACT_APP_ENDPOINT}/api/v1/locations`,
    TRACTIONS: `${process.env.REACT_APP_ENDPOINT}/api/v1/tractions`,
    JOURNEYSECTIONS: `${process.env.REACT_APP_ENDPOINT}/api/v1/journeysections`,
    TRAINACTIVITYTYPES: `${process.env.REACT_APP_ENDPOINT}/api/v1/trainactivitytypes`,
    DANGERLABELS: `${process.env.REACT_APP_ENDPOINT}/api/v1/dangerlabels`,
    WAGONS: `${process.env.REACT_APP_ENDPOINT}/api/v1/wagons`,
    TRACTIONMODES: `${process.env.REACT_APP_ENDPOINT}/api/v1/tractionmodes`,
    TRAINCOMPOSITIONS: `${process.env.REACT_APP_ENDPOINT}/api/v1/traincompositions`,
    DANGERGOODSTYPES: `${process.env.REACT_APP_ENDPOINT}/api/v1/dangergoodstypes`,
}

export const TRAIN_TYPES = [
    {
        "summary": "Other train type",
        "description": "0 Other Train types that are not covered with the four codes given above can be codified as \"other\" in the messages Passenger with Freight - military trains, the Overnight Express; Royalty, Head of States"
    },
    {
        "summary": "Passenger train",
        "description": "Passenger train Commercial train with passenger coaches or trainsets Empty run of Train with passenger coaches or trainsets Including Crew train (for Train Crew Members)"
    },
    {
        "summary": "Freight train",
        "description": "Freight train Train with freight wagons"
    },
    {
        "summary": "Light engine",
        "description": "Light engine (locomotive train) One or more engines without any carriages"
    },
    {
        "summary": "Engineering train",
        "description": "Engineering train Train for measurement, maintenance, instructions, homologation, etc"
    },
];

// * Identifies the type of a locomotive: First digit:
export const POWER_SUPPLY = [
    { key: 0, value: "Not specified" },
    { key: 1, value: "External electric power supply for traction (catenary and pantograph, third rail or other such as maglev" },
    { key: 2, value: "On-board traction power supply for traction without external electrical or other power supply available" },
    { key: 3, value: "Hybrid traction (both on-board or electric traction available" },
]

// * Second digit(definitions in chapter 2.2.2 of the LOC and PAS TSI 1302 / 2014):
export const TRACTION_UNIT = [
    { key: 0, value: "Not specified" },
    { key: 1, value: "Locomotive or power unit" },
    { key: 2, value: "Trainset or multiple unit or railcar" },
    { key: 3, value: "Shunter" },
    { key: 4, value: "On track machine or infrastructure inspection vehicle" },
]