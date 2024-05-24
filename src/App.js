import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ClassList from "./ClassList";
import Semester from "./Semester";
import ClassValidator from './ClassValidator';

const App = () => {
  const initialClasses = [
    { id: 1, name: "Math", prerequisites: []},
    { id: 2, name: "Science", prerequisites: [1] },
    { id: 3, name: "History", prerequisites: [] },
  ];
  const initialSemesters = [
    { id: 1, name: 'Fall 2024', classes: [] },
    { id: 2, name: 'Spring 2025', classes: [] },
    { id: 3, name: 'Fall 2025', classes: [] },
  ];

  const [classes, setClasses] = useState(initialClasses);
  const [semesters, setSemesters] = useState(initialSemesters);

  const handleDrop = (classItem, target, type) => {
    if (type === "classList") {
      setClasses(prevClasses => {
        if (!prevClasses.some(item => item.id === classItem.id)) {
          return [...prevClasses, classItem];
        }
        return prevClasses;
      });
      setSemesters(prevSemesters =>
        prevSemesters.map(semester =>
          ({ ...semester, classes: semester.classes.filter(item => item.id !== classItem.id)})
        )
      );
    } else {
      setSemesters(prevSemesters =>
        prevSemesters.map(sem => 
          sem.id === target.id
            ? (!sem.classes.some(item => item.id === classItem.id)
                ? { ...sem, classes: [...sem.classes, classItem] }
                : {...sem})
            : { ...sem, classes: sem.classes.filter(item => item.id !== classItem.id)}
        )
      );
      setClasses(prevClasses => prevClasses.filter(item => item.id !== classItem.id));
    }
  };

  const handleClear = () => {
    setClasses(initialClasses);
    setSemesters(initialSemesters);
  };

  const getScheduledClasses = () => {
    return semesters.flatMap((semester) => semester.classes);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app-container">
        <button onClick={handleClear}>Clear</button>
        <div className="class-list-container">
          <ClassList
            classes={classes}
            scheduledClasses={getScheduledClasses()}
            arePrerequisitesMet={ClassValidator.arePrerequisitesMet}
            onDrop={handleDrop}
          />
        </div>
        <div className="semesters-container">
          {semesters.map(semester => (
            <Semester
              key={semester.id}
              semester={semester}
              onDrop={handleDrop}
              arePrerequisitesMetForSemester={ClassValidator.arePrerequisitesMetForSemester}
              semesters={semesters}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default App;
