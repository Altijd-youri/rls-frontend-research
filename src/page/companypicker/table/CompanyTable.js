import React from 'react'
import DataTable from "react-data-table-component";
import FilterComponent from './FilterComponent';
import Button from 'react-bootstrap/Button'
import { hasPermissions } from '../../../utils/scopeChecker';


export default function CompanyTable({ companies, onEditCompany, getToken, CompanyService }) {

    const columns = [
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
            selector: 'countryIso', // Deze waarde wordt nog niet gereturned
            sortable: true,
        }
    ];

    
    const getColumns = () => {
        return columns;
    }

    const [filterText, setFilterText] = React.useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);

    /**
     * Onderstaande filteredCompanies. Eerste filter op naam, tweede op code, derde werkt zowel op naam als code. Kan uitgebreid worden naar andere variabelen.
     */
    const filteredCompanies = companies.filter(company => 
        (company.code && company.code.toLowerCase().includes(filterText.toLowerCase())) || 
        (company.name && company.name.toLowerCase().includes(filterText.toLowerCase())) )

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
