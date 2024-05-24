class ClassValidator {
    static arePrerequisitesMet(classItem, scheduledClasses) {
      return classItem.prerequisites.every(prerequisiteId =>
        scheduledClasses.some(scheduledClass => scheduledClass.id === prerequisiteId)
      );
    }
  
    static arePrerequisitesMetForSemester(classItem, semester, semesters) {
      const scheduledClassesBefore = semesters
        .slice(0, semesters.indexOf(semester))
        .flatMap(s => s.classes);
      
      return classItem.prerequisites.every(prerequisiteId =>
        scheduledClassesBefore.some(scheduledClass => scheduledClass.id === prerequisiteId)
      );
    }
  }
  
  export default ClassValidator;