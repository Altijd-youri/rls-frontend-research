import React, {useState, useEffect, useCallback} from 'react'
import '../../assets/picker_create.scoped.css'
import {succeedAlert, errorAlert} from "../../../utils/Alerts";
import UserService from "../../../api/user";
import CustomerService from "../../../api/customer"
import {roles} from '../../../utils/constants';
import {Typeahead} from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import LocationsService from "../../../api/locations";
import Select from 'react-select';


export default function ManageCustomersUser({ rolelist, onHide, onSave, userDTO, customerDTO, handleChange, onEditUser, getToken, editUserHandler }) {

    const [isFetching, setFetching] = useState(false);
    const [editMode, setEditMode] = useState(userDTO ? true : false);
    const [title, setTitle] = useState('CREATE');

    const [userId, setUserId] = useState(userDTO ? userDTO.userId : '');
    const [customerId, setCustomerId] = useState(userDTO ? userDTO.customer.customerId : (customerDTO ? customerDTO.id : ''));
    const [customerName, setCustomerName] = useState(userDTO ? userDTO.customer.customername : (customerDTO ? customerDTO.customername : ''));

    const [firstname, setFirstname] = useState(userDTO ? userDTO.firstname : '');
    const [lastname, setLastname] = useState(userDTO ? userDTO.lastname : '');
    const [email, setEmail] = useState(userDTO ? userDTO.email : '');
    const [role, setRole] = useState(userDTO ? userDTO.role : '');
    
    const [id, setId] = useState(customerDTO ? customerDTO.id : '');
    const initForm = {
        userId: {
            error: ''
        },
        customerId: {
            error: ''
        },
        customerName: {
            error: ''
        },
        firstname: {
            error: ''
        },
        lastname: {
            error: ''
        },
        email: {
            error: ''
        },
        role: {
            error: ''
        }
    }
    const [form, setForm] = useState(initForm)
    useEffect(() => {
        if (userDTO) {
            setEditMode(true);
        } else {
            setEditMode(false);
        }
    }, [userDTO])


    useEffect(() => {
        if (userDTO) {
            setTitle("EDIT");
        } else {
            setTitle("CREATE");
        }
    }, [userDTO])

    const submitForm = async (event) => {
        event.preventDefault();
        setFetching(true);
        setForm(initForm);

        const form = event.Target;
        console.log(userDTO)
        const body = {
            "userId": userId,
            "customerId": userDTO.customer.id,
            "firstname": firstname,
            "lastname": lastname,
            "email": email,
            "role": role
        }
        
        /**
         * ternary functie op basis can editmode bepalen of het een update of create actie is
         */
        const result = editMode ? await UserService.update(await getToken(), body) : await CustomerService.saveUser(await getToken(), body)
        try {
            if (result.data) {
                if (userDTO) {
                    onSave(prevState => {
                        const newList = prevState.data.map((item) => {
                            if (item.userId === result.data.userId) {
                                return result.data;
                            } else {
                                return item;
                            }
                        })
                        return ({...prevState, data: newList})
                    })
                } else {
                    onSave(prevState => ({...prevState, data: [...prevState.data, result.data]}))
                }
                succeedAlert()
                setFetching(false);
                editUserHandler();
            } else {
                throw new Error(result.message);
            }
        } catch (e) {
            errorAlert(e);
        }
        setFetching(false);
    }

    return (
        <div className="content-title">
            <form onSubmit={submitForm} className="form-wrapper">

                <div className="form-group">
                    <input readOnly
                        key={`customerId || ${userDTO?.customer.name}`}
                        defaultValue={userDTO?.customer.name}
                        id="customerName"
                        type="text"
                        name="customerName"
                        maxLength="40"
                        className="form-control"
                        onChange={e => setCustomerName(e.target.value)}
                        required
                    />
                    <label
                        className="form-control-placeholder"
                        htmlFor="customerName">
                            Customername
                    </label>
                    {form.customerName.error && <p>{form.customerName.error}</p>}
                </div>

                <div className="form-group">
                    <input
                        key={`firstname || ${userDTO?.firstname}`}
                        defaultValue={userDTO?.firstname}
                        id="firstname"
                        type="text"
                        name="firstname"
                        maxLength="60"
                        className="form-control"
                        onChange={e => setFirstname(e.target.value)}
                        required
                    />
                    <label
                        className="form-control-placeholder"
                        htmlFor="firstname">
                            Firstname
                    </label>
                    {form.firstname.error && <p>{form.firstname.error}</p>}
                </div>

                <div className="form-group">
                    <input
                        key={`lastname || ${userDTO?.lastname}`}
                        defaultValue={userDTO?.lastname}
                        id="lastname"
                        type="text"
                        name="lastname"
                        maxLength="60"
                        className="form-control"
                        onChange={e => setLastname(e.target.value)}
                        required
                    />
                    <label
                        className="form-control-placeholder"
                        htmlFor="lastname">
                            Lastname
                    </label>
                    {form.lastname.error && <p>{form.lastname.error}</p>}
                </div>

                <div className="form-group">
                    <input
                        key={`email || ${userDTO?.email}`}
                        defaultValue={userDTO?.email}
                        id="email"
                        type="email"
                        maxLength="60"
                        name="email"
                        className="form-control"
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <label
                        className="form-control-placeholder"
                        htmlFor="email">
                            Email
                    </label>
                    {form.email.error && <p>{form.email.error}</p>}
                </div>

                <div className="form-group">

                    <Select
                        id="role"
                        options={rolelist}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.name}
                        onChange={e => setRole(e.name)}
                    />

                    <label
                        className="form-control-placeholder"
                        htmlFor="role">
                    </label>
                    {form.role.error && <p>{form.role.error}</p>}
                </div>

                <div className="btn-submit">
                    <button className="btn btn-primary" type="submit" disabled={isFetching}>
                        {isFetching
                            ? (<><span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                                <span className="sr-only">Loading...</span></>)
                            : `${title}`
                        }
                    </button>
                </div>

            </form>

        </div>
    )
}
