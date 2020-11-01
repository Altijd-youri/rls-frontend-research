import React from 'react'
import DataTable from "react-data-table-component";
import FilterComponent from './FilterComponent';
import Button from 'react-bootstrap/Button'
import { hasPermissions } from '../../../utils/scopeChecker';

export default function CompanyTable({ owners, onDeleteOwner, onEditOwner }) {

    const columns = [
        {
            name: 'Id',
            selector: 'id',
            sortable: true,
        },
        {
            name: 'Code',
            selector: 'code', //Nog geen waarde voor KvK in database
            sortable: true,
        },
        {
            name: 'Name',
            selector: 'name', //Nog geen waarde voor IBAN in database
            sortable: true,
        },
        {
            name: 'Country',
            selector: 'country_iso', // Deze waarde wordt nog niet gereturned
            sortable: true,
        }
    ];

    
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
    /**
     * Onderstaande filteredCompanies. Eerste filter op naam, tweede op code, derde werkt zowel op naam als code. Kan uitgebreid worden naar andere variabelen.
     */
    //const filteredCompanies = owners.filter(owner => owner.name && owner.name.toLowerCase().includes(filterText.toLowerCase()))
    //const filteredCompanies = owners.filter(owner => owner.code && owner.code.toLowerCase().includes(filterText.toLowerCase()))
    const filteredCompanies = owners.filter(owner => ((owner.code && owner.code.toLowerCase().includes(filterText.toLowerCase())) || (owner.name && owner.name.toLowerCase().includes(filterText.toLowerCase()))))

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
