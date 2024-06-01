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
      return condition.conditions.every(id => scheduledClasses.some(scheduledClass => scheduledClass.genEds != null && scheduledClass.genEds.includes(id)));
    }
    return true;
  }

  static arePrerequisitesMetForSemester(classItem, semester, semesters) {
    const scheduledClassesBefore = semesters
      .slice(0, semesters.indexOf(semester))
      .flatMap(s => s.classes);
    
      return ClassValidator.arePrerequisitesMet(classItem, scheduledClassesBefore, true);
  }



  static checkStatus(prerequisites, scheduledClasses, forSemester){

    return prerequisites.filter(prereq => (typeof prereq === 'number') ? 
        !scheduledClasses.some(scheduledClass => scheduledClass.id === prereq) :
          ((prereq.type === 'gen-ed') ?  (prereq.conditions.some(preReqGenEd => !scheduledClasses.some(scheduledClass => scheduledClass.genEds != null && scheduledClass.genEds.includes(preReqGenEd)))) :
           ( prereq.type === 'or' ? !this.checkCondition(prereq.conditions, scheduledClasses) :
              (prereq.type === 'not' ? (forSemester ? !this.checkCondition(prereq, scheduledClasses, forSemester) : false) :
              true)))
      ).map(prereq => (typeof prereq !== 'number' && prereq.type === 'and') ?
        ClassValidator.checkStatus(prereq, scheduledClasses, forSemester) : prereq);
  }

  static getRemainingPrerequisites(classItem, scheduledClasses, forSemester){
    return ClassValidator.checkStatus(classItem.prerequisites, scheduledClasses, forSemester)
  }

  static stringifyHelper(prerequisite){
    if (typeof prerequisite === 'number'){
      return prerequisite.toString();
    }
    if (prerequisite.type === 'gen-ed' || prerequisite.type === 'not'){
      let res = "";
      if (prerequisite.type === 'gen-ed'){
        res = "Credit for ";
      } else{
        res = "Not eligible with credit for ";
      }
      for (let i = 0; i < prerequisite.conditions.length; i++){
        res = res.concat(prerequisite.conditions[i].toString());
        if (i < prerequisite.conditions.length - 1){
          res = res.concat(', ');
        }
      }
      return res.concat(".");
    }
    if (prerequisite.type === 'or' || prerequisite.type === 'and'){
      let strList = prerequisite.conditions.every(prereq => ClassValidator.stringifyHelper(prereq));
      let res = '('
      for (let i = 0; i < strList.length; i++){
        res = res.concat(strList[i].toString());
        if (i < strList.length - 2){
          res = res.concat(', ');
        }
        if (i === prerequisite.ids.length - 2){
        res = prerequisite.type === 'or' ? res.concat(' or ') : res.concat(' and ');
        }
      }
      return res.concat(')');
    }
    return ""
  }


  static prereqStringify(classItem, scheduledClasses, forSemester = false){
    let remainingPrerequisiteList = ClassValidator.getRemainingPrerequisites(classItem, scheduledClasses, forSemester);
    if (remainingPrerequisiteList.length === 0){
      return ""
    } else {
      let res = " Needs ";
      for (let i = 0; i < remainingPrerequisiteList.length; i++){
        res = res.concat(ClassValidator.stringifyHelper(remainingPrerequisiteList[i]));
        if (i < remainingPrerequisiteList.length - 2){
          res = res.concat(', ');
        }
        if (i === remainingPrerequisiteList.length - 2){
          res = res.concat(' and ');
        }
      }
      return res;
    }
  }

  static prerequisiteStringifyForSemester(classItem, semester, semesters) {
    const scheduledClassesBefore = semesters
      .slice(0, semesters.indexOf(semester))
      .flatMap(s => s.classes);
    
    return ClassValidator.prereqStringify(classItem, scheduledClassesBefore, true);
  }
}
  
  export default ClassValidator;