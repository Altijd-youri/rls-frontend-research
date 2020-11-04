import React, { useState, useEffect, useCallback } from 'react'
import '../../assets/picker_create.scoped.css'
import { succeedAlert, errorAlert } from "../../../utils/Alerts";
import OwnerService from "../../../api/owner";
import CompanyService from "../../../api/company";
import { Typeahead } from 'react-bootstrap-typeahead';
import UserManager from './userManager/UserManager';

export default function ManageCompany({ onHide, onSave, companyDTO, getToken }) {
    const [isFetching, setFetching] = useState(false);
    const [title, setTitle] = useState('CREATE');
    const [companies, setCompanies] = useState({ data: [], isFetching: false, error: '' });
    const [selectedCompany, setSelectedCompany] = useState([]);
    // const initForm = { company: { error: '' } }
    // const [form, setForm] = useState(initForm);
    const [users, setUsers] = useState([]);
    const [editMode, setEditMode] = useState(companyDTO ? true : false);
    const [id, setId] = useState('');
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [countryIso, setCountryIso] = useState('');
    

    const initForm = {
        id: {
            error: ''
        },
        code: {
            error: ''
        },
        name: {
            error: ''
        },
        countryIso: {
            error: ''
        }
    }
    const [form, setForm] = useState(initForm)

    useEffect(() => {
        if (companyDTO) {
            setEditMode(true);
        } else {
            setEditMode(false);
            setUsers([])
            setSelectedCompany([])
        }
    }, [companyDTO])

    useEffect(() => {
        const fetchCompanies = async () => {
            setCompanies(prevState => ({ ...prevState, isFetching: true, data: [], error: '' }))
            try {
                const { data, error } = await CompanyService.getAll(await getToken());
                if (data) {
                    setCompanies(prevState => ({ ...prevState, isFetching: false, data }))
                } else {
                    throw new Error(error)
                }
            } catch (e) {
                setCompanies(prevState => ({ ...prevState, isFetching: false, error: e.message }))
            }
        }
        fetchCompanies();
    }, [getToken])

    const getCompanyById = useCallback((id) => {
        return companies.data.filter(item => item.id === id)
    }, [companies.data]);

    useEffect(() => {
        if (companyDTO) {
            const company = getCompanyById(companyDTO.id);
            setSelectedCompany(company);
            setUsers(companyDTO.auth0Ids);
        }
    }, [companyDTO, getCompanyById])

    useEffect(() => {
        if (companyDTO) {
            setTitle("EDIT");
        } else {
            setTitle("CREATE");
        }
    }, [companyDTO])

    // const addUserHandler = (user) => {
    //     setUsers([...users, user])
    // }

    // const removeUserHandler = (user) => {
    //     const filteredList = users.filter(item => item !== user)
    //     setUsers(filteredList)
    // }

    const submitForm = async (event) => {
        event.preventDefault();
        setFetching(true);

        const body = {
            "auth0Ids": users,
            "companyCode": selectedCompany[0].code
        }
        const result = editMode ? await OwnerService.update(companyDTO.id, await getToken(), body) : await OwnerService.save(await getToken(), body);

        try {
            if (result.data) {
                if (companyDTO) {
                    onSave(prevState => {
                        const newList = prevState.data.map((item) => {
                            if (item.id === result.data.id) {
                                return result.data;
                            } else {
                                return item;
                            }
                        })
                        return ({ ...prevState, data: newList })
                    })
                } else {
                    onSave(prevState => ({ ...prevState, data: [...prevState.data, result.data] }))
                }
                succeedAlert()
            } else if (result?.error?.errors) {
                result.error.errors.forEach(element => {
                    const { field, message } = element;
                    setForm(prevState => {
                        let updatedFieldName = form[field]
                        updatedFieldName.error = message;
                        return { ...prevState, field: updatedFieldName }
                    })
                });
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
                    <input
                        key={`id || ${companyDTO?.id}`}
                        defaultValue={companyDTO?.id}
                        id="id"
                        type="number"
                        name="id"
                        maxLength="4"
                        className="form-control"
                        onChange={e => setId(e.target.value)}
                        required
                    />
                    <label
                        className="form-control-placeholder"
                        htmlFor="companyCode">
                        id
                    </label>
                    {form.id.error && <p>{form.id.error}</p>}
                </div>

                <div className="form-group">
                    <input
                        key={`code || ${companyDTO?.code}`}
                        defaultValue={companyDTO?.code}
                        id="code"
                        type="text"
                        name="code"
                        maxLength="60"
                        className="form-control"
                        onChange={e => setCode(e.target.value)}
                        required
                    />
                    <label
                        className="form-control-placeholder"
                        htmlFor="code">
                        code
                    </label>
                    {form.code.error && <p>{form.code.error}</p>}
                </div>

                <div className="form-group">
                    <input
                        key={`name || ${companyDTO?.name}`}
                        defaultValue={companyDTO?.name}
                        id="name"
                        type="text"
                        name="name"
                        maxLength="60"
                        className="form-control"
                        onChange={e => setName(e.target.value)}
                        required
                    />
                    <label
                        className="form-control-placeholder"
                        htmlFor="name">
                        name
                    </label>
                    {form.name.error && <p>{form.name.error}</p>}
                </div>

                <div className="form-group">
                    <input
                        key={`countryIso || ${companyDTO?.countryIso}`}
                        defaultValue={companyDTO?.countryIso}
                        id="countryIso"
                        type="countryIso"
                        maxLength="60"
                        name="countryIso"
                        className="form-control"
                        onChange={e => setCountryIso(e.target.value)}
                        required
                    />
                    <label
                        className="form-control-placeholder"
                        htmlFor="countryIso">
                        countryIso
                    </label>
                    {form.countryIso.error && <p>{form.countryIso.error}</p>}
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

        // <div className="rightbar">
        //     <div className="top">
        //         <h4>
        //             {title} COMPANY
        //         </h4>
        //         <span onClick={onHide}>
        //             <li className="fa fa-times" />
        //         </span>
        //     </div>

        //     <div className="form-wrapper">
        //         <div className="form-group">
        //             <Typeahead
        //                 clearButton
        //                 id="basic-typeahead-example"
        //                 labelKey={option => `${option.code} ${option.name}`}
        //                 onChange={value => setSelectedCompany(value)}
        //                 options={companies.data}
        //                 placeholder="Choose a company..."
        //                 selected={selectedCompany}
        //                 filterBy={['code']}
        //                 required={true}
        //             />
        //             {form.company.error && <p>{form.company.error}</p>}
        //         </div>

        //         <UserManager
        //             getToken={() => getToken()}
        //             users={users}
        //             add={addUserHandler}
        //             remove={removeUserHandler}
        //         />

        //         <div className="btn-submit">
        //             <button className="btn btn-primary" type="button" onClick={submitForm} disabled={isFetching}>
        //                 {isFetching
        //                     ? (<><span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
        //                         <span className="sr-only">Loading...</span></>)
        //                     : `${title}`
        //                 }
        //             </button>
        //         </div>
        //     </div>
        // </div>
    )
}
