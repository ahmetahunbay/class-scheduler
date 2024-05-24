import React from 'react';
import {useDrag} from 'react-dnd';

const ClassItem = ({ classItem, isPlanned, prerequisitesMet }) => {
    const [{isDragging}, drag] = useDrag(
        () => ({
            type: 'CLASS',
            item: {classItem},
            canDrag: true,
            collect: (monitor) => ({
                isDragging: !!monitor.isDragging(),
            }),
        }),
    );

    return (
        <div
            ref={ drag }
            style={{
                opacity: isDragging ? 0.9 : 1,
                border: '1px solid black',
                padding: '8px',
                margin: '4px',
                backgroundColor: prerequisitesMet ? 'white'  : ( isPlanned ? 'lightcoral' : 'lightgrey'),
                cursor:  'move',
            }}
        >
            {classItem.name}
        </div>

    );
};

export default ClassItem;