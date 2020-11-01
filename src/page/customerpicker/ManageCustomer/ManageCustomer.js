import React, { useState, useEffect, useCallback } from 'react'
import '../../assets/picker_create.scoped.css'
import { succeedAlert, errorAlert } from "../../../utils/Alerts";
import CustomerService from "../../../api/customer";

export default function ManageCustomer({ onHide, onSave, customerDTO, getToken, handleChange }) {
    const [isFetching, setFetching] = useState(false);
    const [editMode, setEditMode] = useState(customerDTO ? true : false);
    const [title, setTitle] = useState('CREATE');
    const [id, setId] = useState('');
    const [customername, setCustomername] = useState('');
    const [companyCode, setCompanyCode] = useState('');

    const initForm = {
        id: {
            error: ''
        },
        customername: {
            error: ''
        },
        companyCode: {
            error: ''
        }
    }
    const [form, setForm] = useState(initForm)

    useEffect(() => {
        if (customerDTO) {
            setEditMode(true);
        } else {
            setEditMode(false);
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
            "id": id,
            "customername": customername,
            "companyCode": companyCode
        }

        const result = await CustomerService.save(getToken(), body)
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
            } else if (result?.error?.errors) {
                result.error.errors.forEach(element => {
                    const { field, message } = element;
                    setForm(prevState => {
                        let updateFieldName = form[field]
                        updateFieldName.error = message;
                        return { ...prevState, field: updateFieldName }
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

}