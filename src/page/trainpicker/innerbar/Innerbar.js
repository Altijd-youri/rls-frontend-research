import React, {useState, useEffect} from 'react'
import './Inner.scoped.css'
import TrainTable from './TrainTable'
import Pagination from "react-js-pagination";

export default function Innerbar({onCreateTrain, onEditTrain, trains}) {
    const [currentPage, setCurrentPage] = useState(1);
    const [trainsPerPage, setTrainsPerPage] = useState(5);

    const indexOfLastTrain = currentPage * trainsPerPage;
    const indexOfFirstTrain = indexOfLastTrain - trainsPerPage;
    const currentTrains = trains.slice(indexOfFirstTrain, indexOfLastTrain);

    return (
        <div className="inner">

            <div className="d-flex justify-content-between header">
                <input type="text" name="search" placeholder="Search.."/>
                <label htmlFor="search">
                    <li className="fa fa-search"></li>
                </label>

                <span className="d-flex align-items-center" onClick={onCreateTrain}>
                        Add Train
                        <i className="fas fa-plus"></i>
                </span>

            </div>

            <div className="inner-box">
                <div className="content-title">
                    <h4>
                        All trains
                    </h4>
                    {/*  pagination  */}
                    <Pagination
                        activePage={currentPage}
                        itemsCountPerPage={trainsPerPage}
                        totalItemsCount={trains.length}
                        pageRangeDisplayed={3}
                        onChange={setCurrentPage}
                        itemClass="page-item"
                        linkClass="page-link"
                    />

                </div>

                <TrainTable onEditTrain={onEditTrain} trains={currentTrains}/>
            </div>

        </div>
    )
}
