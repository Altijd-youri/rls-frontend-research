import React, {useState, useEffect, useCallback} from 'react'
import '../../assets/picker_create.scoped.css'
import {succeedAlert, errorAlert} from "../../../utils/Alerts";
import UserService from "../../../api/user";
import {roles} from '../../../utils/constants';
import {Typeahead} from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import LocationsService from "../../../api/locations";
import Select from 'react-select';


export default function ManageCustomersUser({ rolelist, onHide, onSave, userDTO, customerDTO, handleChange, onEditUser, getToken, editUserHandler }) {

    const [isFetching, setFetching] = useState(false);
    const [editMode, setEditMode] = useState(userDTO ? true : false);
    const [title, setTitle] = useState('CREATE');
    // const [companyCode, setCompanyCode] = useState(userDTO ? userDTO.companyCode : '');
    //TODO companyCode moet uit de enviroment gehaald worden.
    // const [companyCode, setCompanyCode] = useState(userDTO.companyCode);

    const [userId, setUserId] = useState(userDTO ? userDTO.userId : '');
    // const [customerId, setCustomerId] = useState(userDTO ? '2' : '3');
    const [customerId, setCustomerId] = useState(userDTO ? userDTO.customerId : (userDTO ? userDTO.customer.id : ''));

    const [customerName, setCustomerName] = useState(userDTO ? userDTO.customer.customername : (userDTO ? userDTO.customer.customername : ''));

    const [firstname, setFirstname] = useState(userDTO ? userDTO.firstname : '');
    const [lastname, setLastname] = useState(userDTO ? userDTO.lastname : '');
    const [email, setEmail] = useState(userDTO ? userDTO.email : '');
    const [role, setRole] = useState(userDTO ? userDTO.role : '');
    
    const [id, setId] = useState(userDTO ? userDTO.customer.id : '');
    console.log(userDTO)
    console.log(customerDTO)
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
    console.log(rolelist)
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

        const body = {
            "userId": userId,
            "customerId": customerId,
            "firstname": firstname,
            "lastname": lastname,
            "email": email,
            "role": role
            //"token": await getToken()
        }

        const updatebody = {
            "userId": userId,
            "firstname": firstname,
            "lastname": lastname,
            "email": email
            //"token": await getToken()
        }
        
        const result = editMode ? await UserService.update(updatebody, getToken()) : await UserService.save(getToken(), body)
        try {
            if (result.data) {
                if (userDTO) {
                    onSave(prevState => {
                        const newList = prevState.data.map((item) => {
                            if (item.id === result.data.id) {
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
                {/* <div className="form-group">
                    <input
                        key={`userId || ${userDTO?.userId}`}
                        defaultValue={userDTO?.userId}
                        id="userId"
                        type="text"
                        name="userId"
                        maxLength="60"
                        className="form-control"
                        onChange={e => setUserId(e.target.value)}
                        required
                    />
                    <label
                        className="form-control-placeholder"
                        htmlFor="userId">
                        userId
                    </label>
                    {form.userId.error && <p>{form.userId.error}</p>}
                </div> */}

                {/* <div className="form-group">
                    <input readOnly
                        key={`customerId || ${userDTO?.customer.id}`}
                        defaultValue={userDTO?.customer.id}
                        id="customerId"
                        type="number"
                        name="customerId"
                        maxLength="40"
                        className="form-control"
                        onChange={e => setCustomerId(e.target.value)}
                        required
                    />
                    <label
                        className="form-control-placeholder"
                        htmlFor="customerId">
                    </label>
                    {form.customerId.error && <p>{form.customerId.error}</p>}
                </div> */}

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
