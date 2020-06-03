import React from 'react'

export const Wagon = (code) => {
    if (code === 'wagon') {
        return (
            <svg width="50px" heigh="50px" viewBox="0 0 20 20">
                <path d="M2 15h4a2 2 0 0 0 4 0h1a2 2 0 0 0 4 0h2v1h1v-3h-1v1h-1v-1H2zm10 0a1 1 0 1 1 1 1 1 1 0 0 1-1-1zm-5 0a1 1 0 1 1 1 1 1 1 0 0 1-1-1z" />
            </svg>
        )
    } else {
        return (<span>No icon found for code: {code}</span>)
    }
}

export const Traction = () => (
    <svg width="50px" heigh="50px" viewBox="0 0 20 20">
        <path d="M10.5 7v-.69l2.8-1.4-4.14-1.38-.32.94 1.86.62-1.2.6V7H5L4 8v6H3v-1H2v3h1v-1h2a2 2 0 0 0 4 0h1a2 2 0 0 0 4 0h4V7zM7 16a1 1 0 1 1 1-1 1 1 0 0 1-1 1zm1-5H5V9l1-1h2zm4 5a1 1 0 1 1 1-1 1 1 0 0 1-1 1z" />
    </svg>
)

export const RidToxic = () => (
    <svg width="25px" heigh="25px" viewBox="0 0 20 20">
        <path d="M14.38 5.31A1.31 1.31 0 0 0 14.2 4a5.43 5.43 0 0 0-8.4 0 1.31 1.31 0 0 0-.18 1.32A4.24 4.24 0 0 1 6 6.67 7.15 7.15 0 0 1 6 8c-.19.8.6 1.63 1.33 2 0 0 .67.43.67.67a2.36 2.36 0 0 0 2 2 2.36 2.36 0 0 0 2-2c0-.24.67-.67.67-.67.73-.37 1.52-1.2 1.33-2a7.15 7.15 0 0 1 0-1.33 4.24 4.24 0 0 1 .38-1.36zM8 8.67a1.34 1.34 0 1 1 1.33-1.34A1.33 1.33 0 0 1 8 8.67zm2.67 2.5c0 .37-.3 0-.67 0s-.67.37-.67 0v-.92a.66.66 0 0 1 .17-.44l.35-.4a.32.32 0 0 1 .3 0l.35.4a.66.66 0 0 1 .17.44zM12 8.67a1.34 1.34 0 1 1 1.33-1.34A1.33 1.33 0 0 1 12 8.67z" />
        <path d="M17 14.72a1 1 0 0 0-1.26.64v.08L11.9 14l3.85-1.44v.08a1 1 0 0 0 1.9-.62 1 1 0 0 0-.52-.59 1 1 0 0 0 .13-.88 1 1 0 0 0-1.9.61.79.79 0 0 0 0 .09l-5.42 2-5.38-2a.37.37 0 0 0 0-.11 1 1 0 0 0-1.9-.61 1 1 0 0 0 .14.88 1 1 0 0 0-.53.59 1 1 0 0 0 1.9.62.64.64 0 0 0 0-.07L8.1 14l-3.8 1.43a1 1 0 1 0-1.39 1.14A1 1 0 0 0 4 18.09a1 1 0 0 0 .64-1.25.37.37 0 0 0 0-.11l5.38-2 5.42 2a.93.93 0 0 0-.09.4 1 1 0 0 0 2 0 1 1 0 0 0-.18-.57 1 1 0 0 0 .52-.59 1 1 0 0 0-.69-1.25z" />
    </svg>
)

export const Driver = () => (
    <svg width="25px" heigh="25px" viewBox="0 0 20 20">
        <path d="M16 8h-3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2l-1 1h1l1-1h1l1 1h1l-1-1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2zm-3.5 6a.5.5 0 1 1 .5-.5.5.5 0 0 1-.5.5zm4 0a.5.5 0 1 1 .5-.5.5.5 0 0 1-.5.5zm.5-2h-5v-2h5z" />
        <circle cx="8" cy="7" r="3" />
        <path d="M10 13.5v-1.77a10.49 10.49 0 0 0-2-.23c-2 0-6 1-6 3V16h9l.31-.31A2.51 2.51 0 0 1 10 13.5z" /></svg>
)