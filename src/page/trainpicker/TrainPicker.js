import React from 'react'
import './styles.css'
import Innerbar from './content/innerbar/Innerbar'
import Rightbar from './content/rightbar/Rightbar'

export default function TrainPicker() {


    return (
        <div className="content">
            <Innerbar />
            <Rightbar />
        </div>
    )
}
