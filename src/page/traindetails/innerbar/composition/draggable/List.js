import React from 'react'
import { Droppable } from 'react-beautiful-dnd';
import Item from './Item';

export default function List({ data }) {

    const grid = 8;

    const getListStyle = isDraggingOver => ({
        background: isDraggingOver ? 'lightblue' : 'lightgrey',
        display: 'flex',
        padding: grid,
        overflow: 'auto',
    });

    return (
        <Droppable droppableId="droppable" direction="horizontal">
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                    {...provided.droppableProps}
                >
                    {data.map((item, index) => (
                        <Item key={index} item={item} index={index} />
                    ))}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    )
}
