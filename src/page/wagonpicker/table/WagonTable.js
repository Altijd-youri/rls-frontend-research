import React from 'react'
import DataTable from "react-data-table-component";
import FilterComponent from './FilterComponent';
import Button from 'react-bootstrap/Button'

export default function WagonTable({ wagons, onEditWagon }) {

    const columns = [
        {
            name: 'numberFreight',
            selector: 'numberFreight',
            sortable: true,
        },
        {
            name: 'code',
            selector: 'code',
            sortable: true,
        },
        {
            name: 'weightEmpty',
            selector: 'weightEmpty',
            sortable: true,
        },
        {
            cell: row => <Button variant="outline-secondary" size="sm" onClick={() => onEditWagon(row)}>Edit</Button>,
            allowOverflow: true,
            ignoreRowClick: true,
            button: true,
            width: '56px',
        },
    ];

    const [filterText, setFilterText] = React.useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
    const filteredWagon = wagons.filter(wagon => wagon.code && wagon.code.toLowerCase().includes(filterText.toLowerCase()))

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
            columns={columns}
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
