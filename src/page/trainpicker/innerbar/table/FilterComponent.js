import React from 'react';
import './FilterComponent.scoped.css'

export default function FilterComponent({ filterText, onFilter, onClear }) {


        return (
                <div className="d-flex justify-content-start header position-relative">
                        <input type="text" name="search" placeholder="Filter by departure.." value={filterText} onChange={onFilter} />
                        <label htmlFor="search">
                                <li className="fa fa-search"></li>
                        </label>
                </div>
        )
};