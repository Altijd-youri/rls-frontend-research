export const PATH = {
    HOME: '/',
    TRAINS: '/trains',
    TRAINDETAILS: '/train/:trainid/details',
}

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
