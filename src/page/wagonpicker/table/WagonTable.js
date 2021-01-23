import React from 'react'
import DataTable from "react-data-table-component";
import FilterComponent from './FilterComponent';
import Button from 'react-bootstrap/Button'
import { hasPermissions } from '../../../utils/scopeChecker';

export default function WagonTable({ wagons, onEditWagon, onDeleteWagon }) {

    const columns = [
        {
            name: 'Number',
            selector: 'numberFreight',
            sortable: true,
        },
        {
            name: 'Code',
            selector: 'code',
            sortable: true,
        },
        {
            name: 'Empty Weight (tonnes)',
            selector: 'weightEmpty',
            sortable: true,
        }
    ];

    const getColumns = () => {
        if (hasPermissions(["write:wagon"])) {
            const deleteColumn = {
                cell: row => <Button variant="outline-danger" size="sm" onClick={() => onDeleteWagon(row)}>Delete</Button>,
                allowOverflow: true,
                ignoreRowClick: true,
                button: true,
                width: '60px',
            }

            const editColumn = {
                cell: row => <Button variant="outline-secondary" size="sm" onClick={() => onEditWagon(row)}>Edit</Button>,
                allowOverflow: true,
                ignoreRowClick: true,
                button: true,
                width: '56px',
            }
            return [...columns,deleteColumn, editColumn];
        } else {
            return columns;
        }
    }

    const [filterText, setFilterText] = React.useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
    const filteredWagon = wagons.filter(wagon => wagon.numberFreight && wagon.numberFreight.toLowerCase().includes(filterText.toLowerCase()))

    const subHeaderComponentMemo = React.useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText('');
            }
        };

        return (
            <FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />);
    }, [filterText, resetPaginationToggle]);

    return (
        <DataTable
            columns={getColumns()}
            defaultSortField='scheduledTimeAtHandover'
            data={filteredWagon}
            pagination
            paginationResetDefaultPage={resetPaginationToggle}
            subHeader
            subHeaderComponent={subHeaderComponentMemo}
            subHeaderAlign="right"
            persistTableHead
            highlightOnHover
            noHeader={true}
            pointerOnHover={true}
        // onRowClicked={(row) => history.push(`train/${row.id}/details`)}
        />
    );
}
