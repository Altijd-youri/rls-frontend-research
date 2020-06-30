import React, { useState, useEffect, useCallback } from 'react'
import { DragDropContext } from 'react-beautiful-dnd';
import List from './List';
import TrainCompositionService from '../../../../../api/traincomposition'
import { errorAlert, succeedAlert } from '../../../../../utils/Alerts';
import { hasPermissions } from '../../../../../utils/scopeChecker';

export default function DnD({ selectedJourney, setTrainCompositionHandler, showEditMode, fetchTrain, getToken }) {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const list = selectedJourney.trainComposition.rollingStock.sort((a, b) => a.position - b.position)
        setItems(list)
    }, [selectedJourney, selectedJourney.trainComposition.rollingStock, setItems])


    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

    const onDragEnd = useCallback(async (result) => {
        if (!hasPermissions(["write:rollingstock"])) {
            return;
        }
        const destinationPosition = result?.destination?.index
        const currentPosition = result?.source?.index
        const draggedStock = items[currentPosition]

        if (destinationPosition === undefined || draggedStock === undefined) {
            return
        }

        if (destinationPosition === currentPosition) {
            return
        }

        const body = {
            position: destinationPosition
        }

        const moveStock = async (stockId, body) => {
            const { error } = await TrainCompositionService.moveStock(selectedJourney.trainComposition.id, stockId, body, await getToken())
            if (error) {
                fetchTrain();
                errorAlert(error)
            } else {
                succeedAlert()
                const newList = reorder(
                    items,
                    result.source.index,
                    result.destination.index
                );
                setItems(newList)
            }
        }
        moveStock(draggedStock.id, body)
    }, [items, selectedJourney.trainComposition.id, fetchTrain, getToken])


    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <List
                getToken={getToken}
                showEditMode={showEditMode}
                data={items}
                trainCompositionId={selectedJourney?.trainComposition?.id}
                setTrainCompositionHandler={setTrainCompositionHandler}
            />
        </DragDropContext>
    )
}
