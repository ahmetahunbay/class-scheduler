import React, {useState} from 'react';
import ClassItem from "./ClassItem";
import { useDrop } from 'react-dnd';

const ClassList = ({classes, scheduledClasses, arePrerequisitesMet, onDrop, prerequisiteStringify}) => {
    const [selectedClass, setSelectedClass] = useState(null);

    const handleClassClick = (classItem) => {
        if (selectedClass && selectedClass.id === classItem.id) {
            setSelectedClass(null); // Deselect if clicked again
        } else {
            setSelectedClass(classItem); // Select the class
        }
    };

    const isSelected = (classItem) => {
        return selectedClass && selectedClass.id === classItem.id;
    };

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
                        onClick={handleClassClick}
                        isSelected={isSelected(classItem)}
                        prerequisiteStringify={prerequisiteStringify(classItem, scheduledClasses, false)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ClassList;