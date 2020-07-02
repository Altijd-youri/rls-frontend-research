import React from 'react'
import DataTable from "react-data-table-component";
import FilterComponent from './FilterComponent';
import Button from 'react-bootstrap/Button'
import { hasPermissions } from '../../../utils/scopeChecker';

export default function CompanyTable({ owners, onEditOwner }) {

    const columns = [
        {
            name: 'id',
            selector: 'id',
            sortable: true,
        },
        {
            name: 'name',
            selector: 'name',
            sortable: true,
        },
        {
            name: 'number of users',
            selector: 'userCount',
            sortable: true,
        }
    ];

    const getColumns = () => {
        if (hasPermissions(["write:user"])) {
            const editColumn = {
                cell: row => <Button variant="outline-secondary" size="sm" onClick={() => onEditOwner(row)}>Edit</Button>,
                allowOverflow: true,
                ignoreRowClick: true,
                button: true,
                width: '56px',
            }
            return [...columns, editColumn];
        } else {
            return columns;
        }
    }

    const [filterText, setFilterText] = React.useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
    const filteredCompanies = owners.filter(owner => owner.name && owner.name.toLowerCase().includes(filterText.toLowerCase()))

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
            data={filteredCompanies}
            pagination
            paginationResetDefaultPage={resetPaginationToggle}
            subHeader
            subHeaderComponent={subHeaderComponentMemo}
            subHeaderAlign="right"
            persistTableHead
            highlightOnHover
            noHeader={true}
            pointerOnHover={true}
        />
    );
}
