import React, { useState, useEffect, useCallback } from 'react'
import '../../assets/picker_create.scoped.css'
import { succeedAlert, errorAlert } from "../../../utils/Alerts";
import CustomerService from "../../../api/customer";
import UserService from '../../../api/user';
import DataTable from 'react-data-table-component';
import FilterComponent from './FilterComponent';
import Button from 'react-bootstrap/Button'
import { hasPermissions } from '../../../utils/scopeChecker';

export default function UserList({ user, users, onHide, onSave, customerDTO, userDTO, getToken, onDeleteUser, onEditUser, addUserHandler }) {
    const [isFetching, setFetching] = useState(false);
    // State gebruikt voor de form om onderscheid te maken tussen het creëren van een nieuwe customer of het aanpassen van een bestaande
    const [editMode, setEditMode] = useState(userDTO ? true : false);


    const columns = [
        {
            name: 'Firstname',
            selector: 'firstname',
            sortable: true,
        },
        {
            name: 'Lastname',
            selector: 'lastname',
            sortable: true,
        },
        {
            name: 'Email',
            selector: 'email',
            sortable: true,
        }
    ];

    const getColumns = () => {
        if (hasPermissions(["write:user" && "update:user"])) { 
            const deleteColumn = {
                cell: row => <Button variant="outline-danger" size="sm" style={{visibility: (row.email == user) ? 'hidden' : 'visible'}} size="sm" onClick={() => onDeleteUser(row)}>Delete</Button>,
                allowOverflow: true,
                ignoreRowClick: true,
                button: true,
                width: '70px',
            }
            const editColumn = {
                cell: row => <Button variant="outline-secondary" size="sm" style={{visibility: (row.email == user) ? 'hidden' : 'visible'}} size="sm" onClick={() => onEditUser(row)}>Edit</Button>,
                allowOverflow: true,
                ignoreRowClick: true,
                button: true,
                width: '56px',
            }
            return [...columns, deleteColumn, editColumn];
        }
        else if (hasPermissions(["write:user"])) {
            const editColumn = {
                cell: row => <Button variant="outline-secondary" size="sm" style={{visibility: (row.email == user) ? 'hidden' : 'visible'}} size="sm" onClick={() => onEditUser(row)}>Edit</Button>,
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
        <div>
            <DataTable
                columns={getColumns()}
                defaultSortField='scheduledTimeAtHandover'
                // data={users}
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


            <div className="btn-submit">
                <button className="btn btn-primary" onClick={() => addUserHandler(customerDTO)} disabled={isFetching}>
                    {isFetching
                        ? (<><span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                            <span className="sr-only">Loading...</span></>)
                        : `${'ADD USER'}`
                    }
                </button>

            </div>
        </div>
    )

}