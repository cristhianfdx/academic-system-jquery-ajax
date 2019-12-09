'use strict';

import {subjects_service} from './subjects_service.js';
import {app} from '../app.js';

let inscribed = [];

export let inscribed_student_service = {
    inscribeStudent: function (data) {//Permite inscribir un estudiante
        inscribed = [];

        if(localStorage.getItem("inscribed") === null){
            inscribed = [];
            inscribed.push(data);
            localStorage.setItem("inscribed", JSON.stringify(inscribed));
        }else{
            inscribed = JSON.parse(localStorage.getItem("inscribed"));
            inscribed.push(data);
            localStorage.setItem("inscribed", JSON.stringify(inscribed));
        }

    },
    getInscribed: function () {//Trae todos los estudiantes inscritos
        if(localStorage.getItem("inscribed") === null){
            inscribed = [];
        }else{
            inscribed = JSON.parse(localStorage.getItem("inscribed"));
        }

        return  inscribed;
    },
    getOneStudentInscribed: function(id_student){ //Método que trae un estudiante inscrito por student_id
        let inscribed = JSON.parse(localStorage.getItem("inscribed"));
        let one_inscribed = [];

        if(inscribed === null){
            one_inscribed = [];
        }else{
            inscribed.forEach(function (inscribe) {
                if(inscribe.student_id === id_student){
                    one_inscribed.push(inscribe);
                }
            });
        }

        return one_inscribed;
    },
    /*Consulta que trae las materias inscritas por un estudiante
        subject_id,
        name,
        description
    */
    getInscribedSubjects: function (id_student) {
        inscribed = JSON.parse(localStorage.getItem("inscribed"));
        let all_subjects = subjects_service.getSubjects();
        let inscribed_subjects = [];

        if(inscribed === null){
            inscribed_subjects = [];
        }else{
            inscribed.forEach(function (inscribe) {
                if(inscribe.student_id === id_student){
                    inscribe.subjects.forEach(function (ins_subject) {
                        all_subjects.forEach(function (subject) {
                            if(ins_subject.subject_id === subject._id){
                                inscribed_subjects.push(subject);
                            }
                        });
                    });
                }
            });
        }

        return inscribed_subjects;
    },
    //Trae unicamente las materias no inscritas por el estudiante, recibe parametro un elemento getInscribedSubjects
    getNoInscribedSubjects: function (inscribed_subjects) {
        let all_subjects = subjects_service.getSubjects();

        for (let i = 0 ; i < inscribed_subjects.length; i++) {
            for (let j = 0; j < all_subjects.length; j++) {
                if (inscribed_subjects[i]._id === all_subjects[j]._id ) {//Se eliminan las materias iguales
                    all_subjects.splice(j, 1)
                }
            }
        }

        //Se obtienen las materias que no coincidieron con las ya inscritas
        return all_subjects;
    },
    //inserta materias, recibe como parametro el id del estudiante
    insertSubjects: function(id_student, new_subjects){
        let one_student = this.getOneStudentInscribed(id_student);
        one_student[0].subjects.push(new_subjects);
        return one_student[0];
    },
    insertNotes: function(student_id, subject_id, new_notes){
        let one_student = this.getOneStudentInscribed(student_id);
        let subjects = one_student[0].subjects;

        for(let i = 0; i < subjects.length; i++ ){
            if(subjects[i].subject_id === subject_id){
                subjects[i].notes = {
                    note1: new_notes.note1,
                    note2: new_notes.note2,
                    media: new_notes.media
                }
            }
        }

        this.editInscribe(one_student[0]._id, one_student[0]);

    },
    deleteSubjectsInscribed: function(id_student, subject_id){
        let one_student = this.getOneStudentInscribed(id_student);
        let subjects = one_student[0].subjects;

        for(let i = 0; i < subjects.length; i++){
            if(subjects[i].subject_id === subject_id){
                subjects.splice(i, 1);
            }
        }

        if(subjects.length > 0){
            this.editInscribe(one_student[0]._id, one_student[0]);
        }else{
            Swal.fire({
                title: '¿Desea borrar?',
                text: "Solo le queda un materia inscrita si esta es borrada se eliminara la inscripción!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, borrar!',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.value) {
                    this.deleteInscribe(one_student[0]._id);
                    app.petitionRoute($("#btn_inscribe"));
                }
            });
        }
    },
    editInscribe:function (id, data) {
        inscribed = [];
        inscribed = JSON.parse(localStorage.getItem("inscribed"));

        for (let i = 0; i < inscribed.length; i++){
            if(id === inscribed[i]._id){
                inscribed[i] = data;
                localStorage.setItem("inscribed", JSON.stringify(inscribed));
            }
        }
    },
    deleteInscribe: function (id) {
        inscribed = [];
        inscribed = JSON.parse(localStorage.getItem("inscribed"));

        for (let i = 0; i < inscribed.length; i++){
            if(id === inscribed[i]._id){
                inscribed.splice(i, 1);
                localStorage.setItem("inscribed", JSON.stringify(inscribed));
            }
        }
    },
    //Obtiene los inscritos que se encuentren asociados a una materia especifica
    getInscribedForSubject: function (subject_id) {
        let inscribed = this.getInscribed();
        let result = [];
        let x = 0;

        for(let i = 0; i < inscribed.length; i++){
            for(let j = 0; j < inscribed[i].subjects.length; j++){
                if(inscribed[i].subjects[j].subject_id === subject_id){
                    result[x] = inscribed[i];
                    x++;
                }
            }
        }

        return result;
    }
};