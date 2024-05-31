import React from 'react';
import {useDrag} from 'react-dnd';

const ClassItem = ({ classItem, isPlanned, prerequisitesMet, onClick, isSelected }) => {
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

    const getPreReqText = () => {

    };

    return (
        <div style={{position: 'relative'}}>
            <div
                ref={ drag }
                onClick={() => onClick(classItem)}
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
            {isSelected && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '0',
                    border: '1px solid black',
                    backgroundColor: 'white',
                    padding: '8px',
                    marginTop: '4px',
                    zIndex: 1,
                }}>
                    <p><strong>Name:</strong> {classItem.name}</p>
                    <p><strong>Description:</strong> {classItem.description}</p>
                    <p><strong>Credits:</strong> {classItem.credits}</p>
                </div>
            )}
        </div>
    );
};

export default ClassItem;