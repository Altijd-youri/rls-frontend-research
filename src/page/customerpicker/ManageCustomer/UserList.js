import React, { useState, useEffect, useCallback } from 'react'
import '../../assets/picker_create.scoped.css'
import { succeedAlert, errorAlert } from "../../../utils/Alerts";
import CustomerService from "../../../api/customer";
import UserService from '../../../api/user';
import DataTable from 'react-data-table-component';
import FilterComponent from './FilterComponent';
import Button from 'react-bootstrap/Button'
import { hasPermissions } from '../../../utils/scopeChecker';

export default function UserList({ onHide, onSave, customerDTO, userDTO, getToken, onDeleteUser, onEditUser }) {
    const [users, setUsers] = useState({ data: [], isFetching: false, error: '' });
    const [isFetching, setFetching] = useState(false);
    // State gebruikt voor de form om onderscheid te maken tussen het creëren van een nieuwe customer of het aanpassen van een bestaande
    const [editMode, setEditMode] = useState(customerDTO ? true : false);
        // Set de text van de submit button van de form
    // const [title, setTitle] = useState('ADD USER');

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

    // const getUsersByCustomer = (customerDTO) => {
    //     const fetchUsers = async () => {
    //         console.log('trying1')
    //         setUsers(prevState => ({ ...prevState, isFetching: true, data: [], error: ''}))
    //         try {
    //             console.log('trying2')
    //             // const { data, error } = await UserService.getAll(await getToken());
    //             const { data, error } = await UserService.getAllByCustomerId(customerDTO.id, await getToken());
    //             console.log('trying3')
    //             if (data) {
    //                 console.log('trying4')
    //                 console.log(data)
    //                 console.log('trying5')
    //                 setUsers(prevState => ({ ...prevState, isFetching: false, data}))
    //                 console.log('trying6')
    //             } else {
    //                 console.log('trying7')
    //                 throw new Error(error)
    //             }
    //         } catch (e) {
    //             console.log('trying8')
    //             setUsers(prevState => ({ ...prevState, isFetching: false, error: e.message }))
    //         }
    //     }
    //     fetchUsers();
    // }

    useEffect(() => {
        const fetchUsers = async () => {
            console.log(users)
            setUsers(prevState => ({ ...prevState, isFetching: true, data: [], error: ''}))
            try {
                // const { data, error } = await UserService.getAll(await getToken());
                const { data, error } = await UserService.getAllByCustomerId(customerDTO.id, await getToken());
                console.log(data)
                if (data) {
                    console.log(data)
                    setUsers(prevState => ({ ...prevState, isFetching: false, data}))
                    console.log(users)
                    console.log(data)
                } else {
                    throw new Error(error)
                }
            } catch (e) {
                setUsers(prevState => ({ ...prevState, isFetching: false, error: e.message }))
            }
        }
        fetchUsers();
    }, [getToken])


    const getColumns = () => {
        if (hasPermissions(["write:user" && "delete:rollingstock"])) { // TODO delete:rollingstock moet aangepast worden naar een scope die delete customer toestaat
            const deleteColumn = {
                cell: row => <Button variant="outline-danger" size="sm" onClick={() => onDeleteUser(row)}>Delete</Button>,
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
        else if (hasPermissions(["write:user"])) {
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

    // const filteredUsers = users.filter(user => 
    //     (user.lastname && user.lastname.toLowerCase().includes(filterText.toLowerCase())) || 
    //     (user.firstname && user.firstname.toLowerCase().includes(filterText.toLowerCase())) || 
    //     (user.email && user.email.toLowerCase().includes(filterText.toLowerCase())) )

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

    const addUser = () => {

    }
    return (
        <div>
            <DataTable
                columns={getColumns()}
                defaultSortField='scheduledTimeAtHandover'
                data={users}
                // data={filteredUsers}
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
                <button className="btn btn-primary" onClick={addUser} disabled={isFetching}>
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