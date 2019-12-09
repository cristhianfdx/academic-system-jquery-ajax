'use strict';

import {subjects_service} from "../../../services/subjects_service.js";
import {notes_service} from "../../../services/notes_service.js";
import {students_service} from "../../../services/students_service.js";
import {inscribed_student_service} from "../../../services/inscribed_student_service.js";
import {register_subject_service} from "../../../services/register_subject_service.js";

export let search_notes_subjects = function () {

    //Carga de combobox con todas las materias
    let template = "<option value='default' selected>Seleccione una materia</option>";
    let subjects = subjects_service.getSubjects();

    let combo = $("#combo_subjects_notes");

    subjects.forEach(function (subject) {
        template += `
            <option key="${subject._id}">${subject.name}</option>
        `;
    });

    combo.html(template);

    let option_selected = "";
    let subject_id = "";

    combo.change(function () {
        option_selected = $(this).val();
       if($(this).val() !== "default"){
           subject_id = $("option:selected", $(this)).attr("key");//Guarda el id de la materia selecionada
       }else{
           option_selected = "";
           subject_id = "";
           $("#data_students_notes").html("");
       }
    });

    $("#btn_search").click(function () {
        drawTableNotes(subject_id);
    });


};

function drawTableNotes(subject_id){
    let notes_subjects = notes_service.getNotesForSubject(subject_id);
    let template = "";

    if(subject_id !== ""){

        notes_subjects.forEach(function (note) {
            students_service.getStudents().forEach(function (student) {
                if(student._id === note.student_id){
                    template +=`
                        <tr>
                            <td>${student.name}</td>
                            <td>${student.lastname}</td>
                            <td>${student.cedula}</td>
                            <td>${note.subject.notes.note1 !== "" ? note.subject.notes.note1 : "0"}</td>
                            <td>${note.subject.notes.note2 !== "" ? note.subject.notes.note2 : "0"}</td>
                            <td>${note.subject.notes.media !== "" ? note.subject.notes.media : "0"}</td>                           
                        </tr>
                  `;
                }
            });
        });

    }else{
        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: '!Debes selecionar una materia!'
        });
    }

    $("#data_students_notes").html(template);
}

export function generateNotesOneStudent() {
    let session = JSON.parse(localStorage.getItem("session")); //Sesión actual
    let inscribe_subjects = inscribed_student_service.getInscribedSubjects(session._id);
    let template = "";

    inscribe_subjects.forEach(function (subjects) {

        for(let i = 0; i < notes_service.getNotesForSubject(subjects._id).length; i++){

            if(session._id === notes_service.getNotesForSubject(subjects._id)[i].student_id){
                template += `
                <tr>
                    <td>${subjects.name}</td>
                    <td>${register_subject_service.getTeacherForSubject(subjects._id) !== null ?
                            register_subject_service.getTeacherForSubject(subjects._id).name + " " +
                            register_subject_service.getTeacherForSubject(subjects._id).lastname : "Sin asignar"}
                    </td>
                    <td>${notes_service.getNotesForSubject(subjects._id)[i].subject.notes.note1 !== "" ?
                            notes_service.getNotesForSubject(subjects._id)[i].subject.notes.note1:
                            "0"}
                    </td>
                    <td>${notes_service.getNotesForSubject(subjects._id)[i].subject.notes.note2 !== "" ?
                            notes_service.getNotesForSubject(subjects._id)[i].subject.notes.note2:
                            "0"}
                    </td>
                    <td>${notes_service.getNotesForSubject(subjects._id)[i].subject.notes.media !== "" ?
                            notes_service.getNotesForSubject(subjects._id)[i].subject.notes.media:
                            "0"}
                    </td>
                </tr>
            `;
            }
        }
    });

    $("#data_student_notes").html(template);
}

