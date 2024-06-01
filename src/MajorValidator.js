class MajorValidator{
    static categorySatisfied(category, scheduledClasses) {
        return category.courses.every(req => MajorValidator.checkReqCondition(req, scheduledClasses));
    }

    static checkReqCondition(req, scheduledClasses) {
        if (typeof req === 'number') {
            return scheduledClasses.some(scheduledClass => scheduledClass.id === req);
        }
        if (req.type === 'category') {
            return req.courses.every(req => MajorValidator.checkReqCondition(req, scheduledClasses));
        }
        if (req.type === 'or') {
            return req.courses.some(course => MajorValidator.checkReqCondition(course, scheduledClasses));
        }
        if (req.type === 'and') {
            return req.courses.every(course => MajorValidator.checkReqCondition(course, scheduledClasses));
        }
        return false;
    }

    static getRemainingCourses(category, scheduledClasses){
        return category.courses.filter(course => 
            (typeof course === 'number' || course.type === 'or' || course.type === 'category') ? 
            !this.checkReqCondition(course, scheduledClasses) : true).map(course =>
                (typeof course !== 'number' && course.type === 'and') ?
                    this.getRemainingCourses(course, scheduledClasses) : course
            );
    }

    static requirementsStringify(course){
        if (typeof course === 'number'){
            return course.toString();
        }
        if (course.type === 'or' || course.type === 'and'){
            let strList = course.courses.map(prereq => this.requirementsStringify(prereq));
            let res = '('
            for (let i = 0; i < strList.length; i++){
              res = res.concat(strList[i].toString());
              if (i < strList.length - 2){
                res = res.concat(', ');
              }
              if (i === course.courses.length - 2){
                res = course.type === 'or' ? res.concat(' or ') : res.concat(' and ');
              }
            }
            return res.concat(')');
        }
        if (course.type === "category"){
            return course.name;
        }
        return ""

    }

    static stringifyCategoryRequirements(category, scheduledClasses){
        let remainingCourses = MajorValidator.getRemainingCourses(category, scheduledClasses);
        if (remainingCourses.length === 0){
            return "";
        }
        let res = " Needs "
        for (let i = 0; i < remainingCourses.length; i++){
            res = res.concat(this.requirementsStringify(remainingCourses[i]));
            if (i < remainingCourses.length - 2){
                res = res.concat(', ');
              }
              if (i === remainingCourses.length - 2){
                res = res.concat(' and ');
              }
        }
        return res;

    }
}

export default MajorValidator;