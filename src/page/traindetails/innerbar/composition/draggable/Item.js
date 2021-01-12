import React from 'react'
import { Draggable } from 'react-beautiful-dnd';
import { Wagon, Traction, Driver } from '../../../../../utils/icons/composition';
import TrainCompositionService from '../../../../../api/traincomposition';
import { succeedAlert, errorAlert, confirmAlert } from '../../../../../utils/Alerts';
import { hasPermissions } from '../../../../../utils/scopeChecker';

export default function Item({ item, index, trainCompositionId, setTrainCompositionHandler, showEditMode, getToken }) {
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
        confirmAlert(async () => {
            try {
                const { error } = await TrainCompositionService.deleteStock(trainCompositionId, item.id, await getToken())
                if (error) throw new Error(error)
                succeedAlert()
                setTrainCompositionHandler(item.id)
            } catch (e) {
                const errorMessage = (e instanceof String) ? e : e.message
                errorAlert(errorMessage)
            }
        })
    }

    const renderDriver = () => {
        const { traction } = item
        if (traction) {
            return item.driverIndication ? Driver() : null
        }
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
        return (<span>{`${Math.round((item.totalWeight ))} T`}</span>)
    }

    return (
        <Draggable key={item.id} draggableId={String(index)} index={index}>
            {(provided, snapshot) => (
                <div
                    onClick={hasPermissions(["delete:rollingstock"]) ? () => showEditMode(item) : () => { }}
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
                        {hasPermissions(["delete:rollingstock"]) && <span style={{ marginLeft: "10px", cursor: "pointer", color: "red" }} onClick={deleteItem}>
                            <li className="far fa-minus-square" />
                        </span>}
                    </div>

                    {/* Body: Icon/Weight */}
                    <div className="d-flex justify-content-between align-items-center">
                        {Icon()}
                        {getWeight()}
                    </div>

                    {/* Footer: hasDriver/Dangerlabel */}
                    <div className="d-flex justify-content-begin align-items-center">
                        {renderDriver()}
                    </div>
                </div>
            )}
        </Draggable>
    )
}
