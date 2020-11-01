import React from 'react'
import DataTable from "react-data-table-component";
import FilterComponent from './FilterComponent';
import Button from 'react-bootstrap/Button'
import { hasPermissions } from '../../../utils/scopeChecker';

export default function CustomerTable({ customers, onDeleteOwner, onEditOwner }) {

    const columns = [
        {
            name: 'ID',
            selector: 'id',
            sortable: true,
        },
        {
            name: 'Name',
            selector: 'name', //Nog geen waarde voor KvK in database
            sortable: true,
        },
        {
            name: 'KvK',
            selector: 'kvk', //Nog geen waarde voor KvK in database
            sortable: true,
        },
        {
            name: 'IBAN',
            selector: 'iban', //Nog geen waarde voor KvK in database
            sortable: true,
        },
        {
            name: 'CompanyCode',
            selector: 'companyCode', //Nog geen waarde voor KvK in database
            sortable: true,
        }
    ];

    // const getColumns = () => {
    //     return columns
    // }

    const getColumns = () => {
        if (hasPermissions(["write:user" && "delete:rollingstock"])) { // TODO delete:rollingstock moet aangepast worden naar een scope die delete customer toestaat
            const deleteColumn = {
                cell: row => <Button variant="outline-danger" size="sm" onClick={() => onDeleteOwner(row)}>Delete</Button>,
                allowOverflow: true,
                ignoreRowClick: true,
                button: true,
                width: '60px',
            }
            const editColumn = {
                cell: row => <Button variant="outline-secondary" size="sm" onClick={() => onEditOwner(row)}>Edit</Button>,
                allowOverflow: true,
                ignoreRowClick: true,
                button: true,
                width: '56px',
            }
            return [...columns, deleteColumn, editColumn];
        }
        else if (hasPermissions(["write:user"])) {
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

    // TODO ook filtered toepassen op andere dan customer.name, o.a. code
    const filteredCustomers = customers.filter(customer => customer.name && customer.name.toLowerCase().includes(filterText.toLowerCase()))

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
            data={filteredCustomers}
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