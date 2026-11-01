// Course identity is shared by navigation, progress, daily practice and exports.
export const COURSES = {
  beginner: { label:'Beginner', description:'Your foundations: seven chapters from the first note to complete pieces.', subtitle:'Classical piano, one small step at a time', readiness:'rh-c-position', unlock:'Right hand C position', notes:'all' },
  intermediate: { label:'Intermediate', description:'Eight chapters for confident, expressive hymn playing. Start with the transition chapter.', subtitle:'Intermediate hymn piano, one small step at a time', readiness:'int-readiness', unlock:'A calm starting point', notes:'intermediate' },
  advanced: { label:'Advanced', description:'Eight chapters for independent solo hymn playing and accompanying singers. For an 88-key piano with sustain pedal.', subtitle:'Advanced hymn piano: technique, interpretation and independent musicianship', readiness:'adv-readiness', unlock:'Your advanced starting point', notes:'advanced' },
};
export const validCourse = course => Object.hasOwn(COURSES,course) ? course : 'beginner';
export const courseForLesson = id => id.startsWith('adv-') ? 'advanced' : id.startsWith('int-') ? 'intermediate' : 'beginner';
export const practiceKey = (course,date) => validCourse(course)==='beginner' ? date : validCourse(course)+':'+date;
