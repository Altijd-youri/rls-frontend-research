import React, { useState, useEffect } from 'react'
import DangerGoodsTypesService from '../../../../../../api/dangergoodstypes'
import Good from './Good';
import Form from './Form';

export default function DangerousGoods({ dangerGoods, add, remove, getToken }) {

    const [dangerGoodsTypes, setDangerGoodsTypes] = useState({ data: [], isFetching: false, error: '' })
    const [form, setForm] = useState({ selectedDangerGoodsType: [], weight: '', showForm: false })

    useEffect(() => {
        const fetchDangerGoodsTypes = async () => {
            setDangerGoodsTypes(prevState => ({ ...prevState, isFetching: true, error: '' }))
            try {
                const { data, error } = await DangerGoodsTypesService.getAll(await getToken());
                if (data) {
                    return setDangerGoodsTypes(prevState => ({ ...prevState, data, isFetching: false }))
                }
                throw new Error(error.message)
            } catch (e) {
                const error = (e instanceof String) ? e : e.message
                return setDangerGoodsTypes(prevState => ({ ...prevState, error, isFetching: false }))
            }
        }
        fetchDangerGoodsTypes()
    }, [getToken])

    const addDangerGoodHandler = () => {
        add({ index: dangerGoods.length, data: form.selectedDangerGoodsType[0], weight: form.weight })
    }

    return (
        <>
            <div className="d-flex flex-column align-items-center w-100 mb-3" style={{ border: "lightgrey 2px solid" }}>
                {!dangerGoodsTypes.error ?
                    <>
                        <div className="d-flex justify-content-between align-items-center w-100 p-2">
                            <span>
                                Dangerous goods
                            </span>
                            <span style={{ cursor: "pointer", color: "blue" }} onClick={() => setForm(prevState => ({ ...prevState, showForm: !prevState.showForm }))}>
                                <li className={!form.showForm ? "fa fa-plus" : "far fa-minus-square"} />
                            </span>
                        </div>

                        <div className="w-100" style={{ border: "1px solid lightgrey" }} />


                        <div className="d-flex flex-column w-100 p-2" style={{ borderBottom: "2px solid bottom" }}>
                            <div className="d-flex flex-column">
                                {dangerGoods?.length ?
                                    dangerGoods.map((item, index) => {
                                        return <Good key={index} dangerGoodType={item} remove={remove} />
                                    })
                                    : <span style={{ fontSize: "13px" }}>Add dangerous goods..</span>
                                }
                            </div>
                        </div>
                    </>
                    : <span style={{ fontSize: "13px" }}>{dangerGoodsTypes.error}</span>
                }

            </div>

            {form.showForm && <Form
                setForm={setForm}
                dangerGoodsTypes={dangerGoodsTypes}
                form={form}
                add={addDangerGoodHandler}
            />}
        </>
    )
}
