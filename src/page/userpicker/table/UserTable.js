import React from 'react'
import DataTable from "react-data-table-component";
import FilterComponent from './FilterComponent';
import Button from 'react-bootstrap/Button'
import { hasPermissions } from '../../../utils/scopeChecker';

export default function CompanyTable({ users, onDeleteUser, onEditUser, getToken, user }) {

    const columns = [
        {
            name: 'Firstname',
            selector: 'firstname',
            sortable: true,
        },
        {
            name: 'Lastname',
            selector: 'lastname', //Nog geen waarde voor KvK in database
            sortable: true,
        },
        {
            name: 'Email',
            selector: 'email', //Nog geen waarde voor KvK in database
            sortable: true,
        }
    ];

    // const getColumns = () => {
    //     return columns;
    // }

    const getColumns = () => {
        if (hasPermissions(["delete:user" && "update:user"])) { // TODO delete:rollingstock moet aangepast worden naar een scope die delete customer toestaat
            const deleteColumn = {
                cell: row => <Button variant="outline-danger" style={{visibility: (row.email == user) ? 'hidden' : 'visible'}} size="sm" onClick={() => onDeleteUser(row)}>Delete</Button>,
                // cell: row => <Button variant="outline-danger"  size="sm" onClick={() => onDeleteUser(row)}>Delete</Button>,
                allowOverflow: true,
                ignoreRowClick: true,
                button: true,
                width: '60px',
            }
            const editColumn = {
                cell: row => <Button variant="outline-secondary" size="sm" onClick={() => onEditUser(row)}>Edit</Button>,
                allowOverflow: true,
                ignoreRowClick: true,
                button: true,
                width: '56px',
            }
            return [...columns, deleteColumn, editColumn];
        }
        else if (hasPermissions(["update:user"])) {
            const editColumn = {
                cell: row => <Button variant="outline-secondary" size="sm" onClick={() => onEditUser(row)}>Edit</Button>,
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

    const filteredUsers = users.filter(user => 
        (user.lastname && user.lastname.toLowerCase().includes(filterText.toLowerCase())) || 
        (user.firstname && user.firstname.toLowerCase().includes(filterText.toLowerCase())) || 
        (user.email && user.email.toLowerCase().includes(filterText.toLowerCase())) )

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
            data={filteredUsers}
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