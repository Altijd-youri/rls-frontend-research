import React from 'react'
import DataTable from "react-data-table-component";
import FilterComponent from './FilterComponent';
import Button from 'react-bootstrap/Button'


export default function TractionTable({ tractions, onEditTraction }) {

    const columns = [
        {
            name: 'Number',
            selector: 'locoNumber',
            sortable: true,
        },
        {
            name: 'Type',
            selector: 'typeName',
            sortable: true,
        },
        {
            name: 'Weight',
            selector: 'weight',
            sortable: true,
        },
        {
            cell: row => <Button variant="outline-secondary" size="sm" onClick={() => onEditTraction(row)}>Edit</Button>,
            allowOverflow: true,
            ignoreRowClick: true,
            button: true,
            width: '56px',
        },
    ];

    const [filterText, setFilterText] = React.useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
    const filteredTractions = tractions.filter(traction => traction.typeName && traction.typeName.toLowerCase().includes(filterText.toLowerCase()))

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
            data={filteredTractions}
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