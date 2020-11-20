import React, { useState, useEffect, useCallback } from 'react'
import '../../assets/picker_create.scoped.css'
import { succeedAlert, errorAlert } from "../../../utils/Alerts";
import CustomerService from "../../../api/customer";

export default function ManageCustomer({ onHide, onSave, customerDTO, getToken, handleChange, backToCustomerTable }) {
    const [isFetching, setFetching] = useState(false);
    // State gebruikt voor de form om onderscheid te maken tussen het creëren van een nieuwe customer of het aanpassen van een bestaande
    const [editMode, setEditMode] = useState(customerDTO ? true : false);
    // Set de text van de submit button van de form
    const [title, setTitle] = useState('CREATE');
    // States voor handelen van data van customer
    const [id, setId] = useState(customerDTO ? customerDTO.id : '');
    const [customername, setCustomername] = useState(customerDTO ? customerDTO.customername : '');
    const [companyCode, setCompanyCode] = useState(customerDTO ? customerDTO.companyCode : '');
    const [iban, setIban] = useState(customerDTO ? customerDTO.iban : '');

    const initErrorForm = { customer: { error: '' } }
    const [errorForm, setErrorForm] = useState(initErrorForm);

    console.log(customerDTO)

    const initForm = {
        id: {
            error: ''
        },
        customername: {
            error: ''
        },
        companyCode: {
            error: ''
        },
        iban: {
            error: ''
        }
    }
    const [form, setForm] = useState(initForm)

    // useEffect(() => {
    //     if(customerDTO) {
    //         setId(customerDTO.id)
    //         setCustomername(customerDTO.name)
    //         setCompanyCode(customerDTO.companyCode)
    //         setIban(customerDTO.iban)
    //     }
    // })

    useEffect(() => {
        if (customerDTO) {
            setEditMode(true);
            console.log("true")
        } else {
            setEditMode(false);
            console.log("false")
        }
    }, [customerDTO])

    useEffect(() => {
        if (customerDTO) {
            setTitle("EDIT");
        } else {
            setTitle("CREATE");
        }
    }, [customerDTO])

    const submitForm = async (event) => {
        event.preventDefault();
        setFetching(true);
        setForm(initForm);


        const form = event.Target;
        const body = {
            "id": "",
            "customername": customername,
            "companyCode": companyCode,
            "iban": iban
        }

        const updateBody = {
            "id": id,
            "customername": customername,
            "companyCode": companyCode,
            "iban": iban
        }
        
        console.log(body)
        console.log(updateBody)
        const result = editMode ? await CustomerService.update(updateBody, await getToken()) : await CustomerService.save(await getToken(), body);
        try {
            if (result.data) {
                if (customerDTO) {
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
            } else {
                console.log(result.error.message)
                throw new Error(result.error.message);
            }
        } catch (e) {
            errorAlert(e);
        }
        
        backToCustomerTable();
        setFetching(false);
    }

    return (
        <div className="content-title">
            <form onSubmit={submitForm} className="form-wrapper">
                {/* <div className="form-group">
                    <input
                        key={`id || ${customerDTO?.id}`}
                        defaultValue={customerDTO?.id}
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
                        htmlFor="id">
                        id
                    </label>
                    {form.id.error && <p>{form.id.error}</p>}
                </div> */}

                <div className="form-group">
                    <input
                        key={`customername || ${customerDTO?.customername}`}
                        defaultValue={customerDTO?.customername}
                        id="customername"
                        type="text"
                        name="customername"
                        maxLength="60"
                        className="form-control"
                        onChange={e => setCustomername(e.target.value)}
                        required
                    />
                    <label
                        className="form-control-placeholder"
                        htmlFor="name">
                        customername
                    </label>
                    {form.customername.error && <p>{form.customername.error}</p>}
                </div>

                <div className="form-group">
                    <input
                        key={`companyCode || ${customerDTO?.companyCode}`}
                        defaultValue={customerDTO?.companyCode}
                        id="companyCode"
                        type="text"
                        name="companyCode"
                        maxLength="60"
                        className="form-control"
                        onChange={e => setCompanyCode(e.target.value)}
                        required
                    />
                    <label
                        className="form-control-placeholder"
                        htmlFor="companyCode">
                        companyCode
                    </label>
                    {form.companyCode.error && <p>{form.companyCode.error}</p>}
                </div>

                <div className="form-group">
                    <input
                        key={`iban || ${customerDTO?.iban}`}
                        defaultValue={customerDTO?.iban}
                        id="iban"
                        type="text"
                        name="iban"
                        maxLength="60"
                        className="form-control"
                        onChange={e => setIban(e.target.value)}
                        required
                    />
                    <label
                        className="form-control-placeholder"
                        htmlFor="companyCode">
                        iban
                    </label>
                    {form.iban.error && <p>{form.iban.error}</p>}
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