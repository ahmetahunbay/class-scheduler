class ClassValidator {
  static arePrerequisitesMet(classItem, scheduledClasses, forSemester = false) {
    return classItem.prerequisites.every(prerequisite => ClassValidator.checkCondition(prerequisite, scheduledClasses, forSemester));
  }

  static checkCondition(condition, scheduledClasses, forSemester) {
    if (typeof condition === 'number') {
      return scheduledClasses.some(scheduledClass => scheduledClass.id === condition);
    }
    if (condition.type === 'or') {
      return condition.conditions.some(cond => ClassValidator.checkCondition(cond, scheduledClasses));
    } 
    if (condition.type === 'and') {
      return condition.conditions.every(cond => ClassValidator.checkCondition(cond, scheduledClasses));
    }
    if (forSemester && condition.type === 'not') {
      return condition.conditions.every(cond => !ClassValidator.checkCondition(cond, scheduledClasses));
    }
    if (condition.type === 'gen-ed') {
      return condition.ids.every(id => scheduledClasses.some(scheduledClass => scheduledClass.genEds != null && scheduledClass.genEds.includes(id)));
    }
    return true;
  }

  static arePrerequisitesMetForSemester(classItem, semester, semesters) {
    const scheduledClassesBefore = semesters
      .slice(0, semesters.indexOf(semester))
      .flatMap(s => s.classes);
    
      return ClassValidator.arePrerequisitesMet(classItem, scheduledClassesBefore, true);
  }

  static categorySatisfied(category, scheduledClasses) {
    return category.courses.every(req => ClassValidator.checkReqCondition(req, scheduledClasses));
  }

  static checkReqCondition(req, scheduledClasses) {
    if (typeof req === 'number') {
      return scheduledClasses.some(scheduledClass => scheduledClass.id === req);
    }
    if (req.type === 'category') {
      return req.courses.every(req => ClassValidator.checkReqCondition(req, scheduledClasses));
    }
    if (req.type === 'or') {
      return req.courses.some(course => ClassValidator.checkReqCondition(course, scheduledClasses));
    }
    if (req.type === 'and') {
      return req.courses.every(course => ClassValidator.checkReqCondition(course, scheduledClasses));
    }
    return false;
  }

  static checkStatus(prerequisites, scheduledClasses, forSemester){

    return prerequisites.filter(prereq => (typeof prereq === 'number') ? 
        !scheduledClasses.some(scheduledClass => scheduledClass.id === prereq) :
          (prereq.type === 'gen-ed') ?  (prereq.genEds.every(preReqGenEd => scheduledClasses.some(scheduledClass => scheduledClass.genEds != null && scheduledClass.genEds.includes(preReqGenEd)))) :
            prereq.type === 'or' ? !this.checkCondition(prereq.conditions, scheduledClasses) :
              prereq.type === 'not' ? (forSemester ? !this.checkCondition(prereq.conditions, scheduledClasses, false): false) :
              true
      ).map(prereq => (typeof prereq !== 'number' && prereq.type === 'and') ?
        ClassValidator.checkStatus(prereq, scheduledClasses, forSemester) : prereq);
  }

  static remainingPrerequisites(classItem, scheduledClasses, forSemester){
    return ClassValidator.checkStatus(classItem.prerequisites, scheduledClasses, forSemester)
  }




  static prereqStringify(classItem, scheduledClasses, forSemester){
    if (!forSemester) {
      return "Needs ".concat(stringifyHelper(ClassValidator.remainingPrerequisites(classItem, scheduledClasses, forSemester)));
    } else {
      
    }
    
  }


}
  
  export default ClassValidator;