import {inscribed_student_service} from './inscribed_student_service.js';
//import {app} from '../app.js';

export let notes_service = {
    //Método que trae los estudiante y sus notas por materia
    getNotesForSubject: function (subject_id) {
        let subjects_inscribed = inscribed_student_service.getInscribedForSubject(subject_id);
        let notes = [];
        let x = 0;

        subjects_inscribed.forEach(function (subject_inscribe) {
            subject_inscribe.subjects.forEach(function (subject) {
                if(subject.subject_id === subject_id){
                    notes[x] = {student_id : subject_inscribe.student_id, subject};
                    x++;
                }
            });

        });

        return notes;
    }
};

