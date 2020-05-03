import React from 'react';
import styled from 'styled-components';

const TextField = styled.input`
        height: 32px;
        width: 200px;
        border-radius: 3px;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        border: 1px solid #e5e5e5;
        padding: 0 32px 0 16px;

        &:hover {
          cursor: pointer;
        }
        `;

const ClearButton = styled.button`
        border: 1px solid lightgrey;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        height: 34px;
        width: 32px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        `;

export default function FilterComponent({ filterText, onFilter, onClear }) {

    return (
        <div className="d-flex justify-content-start">
            <TextField id="search" type="text" placeholder="Filter By Departure" value={filterText} onChange={onFilter} />
            <ClearButton type="button" onClick={onClear}>X</ClearButton>
        </div>)
};