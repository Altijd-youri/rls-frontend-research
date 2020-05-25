import React from 'react'
import { Draggable } from 'react-beautiful-dnd';
import { Wagon, Traction } from '../../../../../utils/icons/composition';
import TrainCompositionService from '../../../../../api/traincomposition';
import { succeedAlert, errorAlert, confirmAlert } from '../../../../../utils/Alerts';

export default function Item({ item, index, trainCompositionId, setTrainCompositionHandler }) {
    const grid = 8;
    const getItemStyle = (isDragging, draggableStyle) => ({
        userSelect: 'none',
        paddingLeft: grid * 2,
        paddingRight: grid * 2,
        margin: `0 ${grid}px 0 0`,
        background: isDragging ? 'lightgreen' : 'white',
        height: "100px",
        ...draggableStyle,
    });

    const deleteItem = () => {
        const { traction, wagon } = item

        confirmAlert(async () => {
            try {
                if (traction) {
                    const { data, error } = await TrainCompositionService.deleteTraction(trainCompositionId, item.id)
                    if (error) throw new Error(error)
                    succeedAlert()
                    setTrainCompositionHandler(data)
                } else if (wagon) {
                    const { data, error } = await TrainCompositionService.deleteWagon(trainCompositionId, item.id)
                    if (error) throw new Error(error)
                    succeedAlert()
                    setTrainCompositionHandler(data)
                }
            } catch (e) {
                const errorMessage = (e instanceof String) ? e : e.message
                errorAlert(errorMessage)
            }
        })
    }

    const Icon = () => {
        const { wagon } = item
        return wagon ? Wagon(wagon.code) : Traction()
    }

    const getIdentifier = () => {
        const { wagon, traction } = item
        return wagon ? wagon.numberFreight : traction.locoNumber
    }

    const getWeight = () => {
        const { wagon, traction } = item
        const weight = Boolean(wagon) ? wagon.weightEmpty : traction.weight
        return (<span>{`${weight} T`}</span>)
    }

    return (
        <Draggable key={item.id} draggableId={String(index)} index={index}>
            {(provided, snapshot) => (
                <div
                    className="d-flex flex-column"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                    )}
                >
                    {/* Header: Identifier */}
                    <div className="d-flex">
                        <span>{getIdentifier()}</span>
                        <span style={{ marginLeft: "10px", cursor: "pointer", color: "red" }} onClick={deleteItem}>
                            <li className="far fa-minus-square" />
                        </span>
                    </div>

                    {/* Body: Icon/Weight */}
                    <div className="d-flex justify-content-between align-items-center">
                        {Icon()}
                        {getWeight()}
                    </div>

                    {/* Footer: hasDriver/Dangerlabel */}
                    <div className="d-flex justify-content-begin align-items-center">
                        <span>Driver {item?.driverIndication ? "present" : "absent"}</span>
                    </div>
                </div>
            )}
        </Draggable>
    )
}
