import React from 'react';
import {useDrop} from 'react-dnd';
import ClassItem from "./ClassItem";

const Semester = ({semester, onDrop, arePrerequisitesMetForSemester, semesters }) => {
    const [{isOver}, drop] = useDrop(() => ({
        accept: 'CLASS',
        drop: (item) => onDrop(item.classItem, semester, 'semester'),
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    return (
        <div
            ref={drop}
            style={{
                border: '1px solid black',
                padding: '16px',
                margin: '8px',
                backgroundColor: isOver ? 'lightgreen' : 'white',
                width: '200px',
                minHeight: '100px',
            }}
        >
            <h3>{semester.name}</h3>
            {semester.classes.map((classItem) => (
                <ClassItem
                    key={classItem.id}
                    classItem={classItem}
                    isPlanned={() => true}
                    prerequisitesMet={arePrerequisitesMetForSemester(classItem, semester, semesters)}
                />
            ))}
        </div>
        );
};

export default Semester;