import React, { useEffect } from 'react'
import './styles.css'
import { useDispatch, useSelector } from 'react-redux'
import { trainsRequest } from '../../../../actions/trains'
import TrainBox from './TrainBox'
import CreateTrainBox from './CreateTrainBox'
import TrainTable from './TrainTable'

export default function Innerbar() {
    const { isFetching, error, trains } = useSelector(state => ({
        isFetching: state.trainsStore.isFetching,
        error: state.trainsStore.error,
        trains: state.trainsStore.trains
    }))
    const dispatch = useDispatch()
    const limitedList = trains.slice(1, 3);
    useEffect(() => {
        dispatch(trainsRequest())
    }, [dispatch])

    return (
        <div className="inner">

            <div className="search">
                <input type="text" name="search" placeholder="Search.." />
                <label htmlFor="search">
                    <li className="fa fa-search"></li>
                </label>
            </div>


            {/* <div className="inner-box">
                <div className="content-title">
                    <h4>Recent Trains</h4>
                    <a>
                        View All
                        <i className="fa fa-chevron-right"></i>
                    </a>
                </div>

                <div className="projects">
                    {trains.map((train, index) => {
                        return <TrainBox train={train} key={index} />
                    })}
                    <CreateTrainBox />
                </div>
            </div> */}

            <div className="inner-box">
                <div className="content-title">
                    <h4>
                        All trains
                    </h4>
                    <a href="#">
                        View All
                        <i className="fa fa-chevron-right"></i>
                    </a>
                </div>

                <div className="recents">
                    <TrainTable trains={trains} />
                </div>
            </div>

        </div>
    )
}
