import React, { useState, useEffect, useCallback } from 'react'
import { DragDropContext } from 'react-beautiful-dnd';
import List from './List';

export default function DnD({ selectedJourney, setTrainCompositionHandler }) {
    const [items, setItems] = useState([]);

    useEffect(() => {
        let compositionList = []
        selectedJourney.trainComposition.tractions.map(traction => {
            return compositionList.push(traction);
        });
        selectedJourney.trainComposition.wagons.map(wagon => {
            return compositionList.push(wagon);
        });
        setItems(compositionList)
    }, [selectedJourney, selectedJourney.trainComposition, setItems])

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    const onDragEnd = useCallback((result) => {
        const { traction } = items[result.source.index];
        const destinationIsPositionOfWagon = items[result.destination.index];

        if (!result.destination || traction || destinationIsPositionOfWagon.traction) {
            return;
        }

        const newList = reorder(
            items,
            result.source.index,
            result.destination.index
        );

        setItems(newList)
    }, [items])


    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <List
                data={items}
                trainCompositionId={selectedJourney?.trainComposition?.id}
                setTrainCompositionHandler={setTrainCompositionHandler}
            />
        </DragDropContext>
    )
}
