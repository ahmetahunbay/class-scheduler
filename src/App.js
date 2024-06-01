import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ClassList from "./ClassList";
import Semester from "./Semester";
import ClassValidator from './ClassValidator';
import SelectedMajor from "./SelectedMajor";

 //For computer science, you need (math or science), and philosophy, and you cannot have credit for history
const App = () => {
  const totalClasses = [
    { id: 1, name: "Math", credits: 3, description: "Math class", genEds: ["QRA"], level: "Intermediate", breadth: "NS", prerequisites: [] },
    { id: 2, name: "Science", credits: 3, description: "Science class", level: "Elementary", prerequisites: [1] },
    { id: 3, name: "History", credits: 3, description: "History class", level: "Intermediate", breadth: "NS", prerequisites: [] },
    { id: 4, name: "Social Studies", credits: 3, description: "SS Class", genEds: ["QRA"], level: "Elementary", breadth: "PS", prerequisites: [] },
    { id: 5, name: "Philosophy", credits: 3, description: "phil class", level: "Intermediate", prerequisites: [] },
    {
      id: 6,
      name: "Computer Science",
      credits: 3,
      description: "cs class",
      genEds: ["LAS"],
      level: "Elementary",
      prerequisites: [
        { type: 'or', conditions: [1, 2, { type: 'and', conditions: [{ type: 'gen-ed', conditions: ['QRB'] }, 3] }] },
        { type: 'not', conditions: [3] },
        5,
        4,
        { type: 'gen-ed', conditions: ['QRA'] }
      ]
    },
  ];

  const initialClasses = [];

  const majors = [
    {
      id: 1,
      name: "Computer Science",
      categories: [
        {name: "general classes", type: "category", courses: [5], credits: 3},
        {name: "math and science", type: "category", courses: [
          { type: 'and', courses: [1, 2] }
        ], credits: 3},
        {name: "humanities", courses: [{
          type: "category",
          name: "social sciences",
          courses: [4]
        }], credits: 2, numCourses: 1},
        {name: "comp sci breadth", type: "category", courses: [6], credits: 3}],
      relevantCourses: [1, 2, 3, 4, 5, 6]
    },
  ];

  const initialSemesters = [
    { id: 1, name: 'Fall 2024', classes: [] },
    { id: 2, name: 'Spring 2025', classes: [] },
    { id: 3, name: 'Fall 2025', classes: [] },
  ];

  const [classes, setClasses] = useState(initialClasses);
  const [semesters, setSemesters] = useState(initialSemesters);
  const [selectedMajors, setSelectedMajors] = useState([]);

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
    const currentClasses = [...semesters.flatMap(semester => semester.classes), ...classes];
    setClasses(currentClasses);
    setSemesters(initialSemesters);
  };

  const handleMajorChange = (major, isChecked) => {
    if (isChecked) {
      const updatedMajors = [...selectedMajors, major];
      setSelectedMajors(updatedMajors);
      const majorClasses = totalClasses.filter(classItem => 
        updatedMajors.some(m => m.relevantCourses.includes(classItem.id) )
        && !classes.some(item => item.id === classItem.id) 
        && !semesters.some(semester => semester.classes.some(item => item.id === classItem.id) ));
      setClasses(majorClasses);
    } else {
      const updatedMajors = selectedMajors.filter(m => m.id !== major.id);
      setSelectedMajors(updatedMajors);
      const newClasses = totalClasses.filter(classItem =>
        updatedMajors.some(m => m.relevantCourses.includes(classItem.id))
        && !classes.some(item => item.id === classItem.id)
        && !semesters.some(semester => semester.classes.some(item => item.id === classItem.id))
      );
      setClasses(newClasses);
    }
  };

  const getScheduledClasses = () => {
    return semesters.flatMap((semester) => semester.classes);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app-container">
        <div className="left-sidebar">
          <div className="major-list">
            <h3>Majors</h3>
            {majors.map(major => (
              <div key={major.id} className="major-item">
                <input
                  type="checkbox"
                  checked={selectedMajors.some(m => m.id === major.id)}
                  onChange={(e) => handleMajorChange(major, e.target.checked)}
                />
                <label>{major.name}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="main-content">
          <button onClick={handleClear}>Clear</button>
          <div className="class-list-container">
            <ClassList
              classes={classes}
              scheduledClasses={getScheduledClasses()}
              arePrerequisitesMet={ClassValidator.arePrerequisitesMet}
              onDrop={handleDrop}
              prerequisiteStringify={ClassValidator.prereqStringify}
            />
          </div>
          <div className="semesters-container">
            {semesters.map(semester => (
              <Semester
                key={semester.id}
                semester={semester}
                arePrerequisitesMetForSemester={ClassValidator.arePrerequisitesMetForSemester}
                onDrop={handleDrop}
                semesters={semesters}
                prerequisiteStringifyForSemester={ClassValidator.prerequisiteStringifyForSemester}
              />
            ))}
          </div>
        </div>
        <div className="right-sidebar">
          <div className="selected-major-list">
            <h3>Selected Majors</h3>
            {selectedMajors.map(major => (
              <SelectedMajor
                key={major.id}
                major={major}
                scheduledClasses={getScheduledClasses()}
              ></SelectedMajor>
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default App;
