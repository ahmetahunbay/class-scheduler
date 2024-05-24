import React from 'react';
import ClassItem from "./ClassItem";
import { useDrop } from 'react-dnd';

const ClassList = ({classes, scheduledClasses, arePrerequisitesMet, onDrop}) => {

    const [{isOver}, drop] = useDrop(() => ({
        accept: 'CLASS',
        drop: (item) => onDrop(item.classItem, null, 'classList'),
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    return (
        <div ref={drop} style={{ backgroundColor: isOver ? 'lightgreen' : 'white', padding: '10px' }}>
            <h2>Classes</h2>
            <div className="class-items" style={{ overflowY: 'scroll' }}>
                {classes.map((classItem) => (
                    <ClassItem
                        key = {classItem.id}
                        classItem = {classItem}
                        isPlanned = {false}
                        prerequisitesMet={arePrerequisitesMet(classItem, scheduledClasses)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ClassList;