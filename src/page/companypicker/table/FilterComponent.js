import React from 'react';
import '../../assets/FilterComponent.scoped.css'

export default function FilterComponent({ filterText, onFilter }) {


        return (
                <div className="d-flex justify-content-start header position-relative">
                        <input type="text" name="search" placeholder="Filter by code.." value={filterText} onChange={onFilter} />
                        <label htmlFor="search">
                                <li className="fa fa-search"></li>
                        </label>
                </div>
        )
};