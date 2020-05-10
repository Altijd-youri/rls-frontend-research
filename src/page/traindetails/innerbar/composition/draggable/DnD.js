import React, { useState, useEffect } from 'react'
import { DragDropContext } from 'react-beautiful-dnd';
import List from './List';

export default function DnD({ selectedJourney }) {
    const [items, setItems] = useState([]);
    const getItems = count =>
        Array.from({ length: count }, (v, k) => k).map(k => ({
            id: `item-${k}`,
            content: `item ${k}`,
        }));

    useEffect(() => {
        setItems(getItems(6))
    }, [])

    useEffect(() => {
        let compositionList = []
        selectedJourney.trainComposition.wagons.map(wagon => {
            return compositionList.push(wagon);
        });
        selectedJourney.trainComposition.tractions.map(traction => {
            return compositionList.push(traction);
        });
        setItems(compositionList)
    }, [selectedJourney, selectedJourney.trainComposition, setItems])

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    const onDragEnd = (result) => {
        console.log(result)
        const { wagon } = items[result.source.index];
        const destinationIsPositionOfWagon = items[result.destination.index];

        if (!result.destination || wagon || destinationIsPositionOfWagon.wagon) {
            return;
        }

        const newList = reorder(
            items,
            result.source.index,
            result.destination.index
        );

        setItems(newList)
    }
    // 
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <List data={items} />
        </DragDropContext>
    )
}
