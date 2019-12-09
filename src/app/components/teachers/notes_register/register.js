'use strict';

import {teachers_service} from "../../../services/teachers_service.js";
import {register_subject_service} from "../../../services/register_subject_service.js";
import {students_service} from "../../../services/students_service.js";
import {inscribed_student_service} from "../../../services/inscribed_student_service.js";
import {app} from "../../../app.js";

let students = [];

//Elementos para el formulario de notas
let index = 0; //variable que perimite iterar los estudiantes del formulario

export  let load_subjects_and_teachers_for_notes = function () {

    let combo_teachers = $("#combo_teachers_notes");
    let combo_subjects = $("#combo_subjects_asign_notes");

    //Botones de guardar, anterior y siguiente
    let btn_left = $("#left_btn");
    let btn_right = $("#right_btn");
    let btn_save = $("#btn_save_note");

    //Se desabilitan al inicio
    btn_left.prop("disabled", true);
    btn_right.prop("disabled", true);
    btn_save.prop("disabled", true);
    //--Fin-----Elementos para el formulario de notas

    //Carga del combobox de docentes
    let session = JSON.parse(localStorage.getItem("session"));

    if(session.type_user === "Docente"){
        let template = "<option value='default' selected>Seleccione el docente</option>";
        template += `
            <option key="${session._id}">${session.name + " " +session.lastname}</option>
        `;
        combo_teachers.html(template);

    }else{
        generateTeachersCombo();
    }

    let subjects_asigned = null;
    let teacher_selected = "";

    combo_subjects.html("<option value='default' selected>Seleccione una materia</option>");

    combo_teachers.change(function () {

        teacher_selected = $(this).val();
        let teacher_id = "";

       if($(this).val() !== "default"){
           teacher_id = $("option:selected", $(this)).attr("key");//Guarda el id del docente seleccionado
           $("#teacher_notes_selected").html(`<span key="${teacher_id}" id="id_teacher_selected">${teacher_selected}</span>`);

            subjects_asigned = register_subject_service.getAsignedSubjects(teacher_id);
           $(this).prop("disabled", true);

           //Carga del combobox con todas las materias
           generateComboSubjects(subjects_asigned);

       }else {
           students = [];
           teacher_selected = "";
           $("#teacher_notes_selected").html(teacher_selected);
       }

        $("#subject_notes_selected").html("");
    });

    let subject_selected = "";

    combo_subjects.change(function () {
        subject_selected = $(this).val();
        let subject_id = "";

        if($(this).val() !== "default"){
            subject_id = $("option:selected", $(this)).attr("key");//Guarda el id de la materia seleccionada;
            $("#subject_notes_selected").html(`<span key="${subject_id}" id="id_subject_selected">${subject_selected}</span>`);
            $(this).prop("disabled", true);
        }else{
            students = [];
            subject_selected = "";
            $("#subject_notes_selected").html("");
        }

    });


    //Se solicita realizar la busqueda de los estudiantes asociados a un docente y a una materia
    $("#btn_filter_subjects").click(function () {
        let id_teacher = $("#id_teacher_selected").attr("key");
        let id_subject  = $("#id_subject_selected").attr("key");


        if(id_teacher !== undefined && id_subject !== undefined){
            index = 0;

            btn_right.prop("disabled", false);
            btn_save.prop("disabled", false);
            fillForm(id_subject, index);
            $("#name_student_note").prop("disabled", true);
            $("#lastname_student_note").prop("disabled", true);
        }else{

            students = [];

            if(id_teacher  === undefined ){

                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: '!Debes elegir un docente primero!'
                });
            }else if(id_subject === undefined){

                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: '!Debes selecionar una materia!'
                });
            }
        }
    });

    //Evento de los checkbox que permiten editar una nota

    $("#check_edit_note1").on("change", function () {
        if($(this).prop("checked")){
            $("#student_note1").prop("disabled", false)
        }else{
            $("#student_note1").prop("disabled", true)
        }
    });

    $("#check_edit_note2").on("change", function () {
        if($(this).prop("checked")){
            $("#student_note2").prop("disabled", false)
        }else{
            $("#student_note2").prop("disabled", true)
        }
    });

    //Paginación

    btn_left.click(function () {

        let id_subject  = $("#id_subject_selected").attr("key");

        btn_right.prop("disabled", false);

        if(index <= 0){
            index = 0;
            btn_left.prop("disabled", true);
        }else{
            index--;
        }

        fillForm(id_subject, index);

    });

    btn_right.click(function () {
        let id_subject  = $("#id_subject_selected").attr("key");

        btn_left.prop("disabled", false);

        if(index >= (students.length-1)){
            index = students.length-1;
            btn_right.prop("disabled", true);
        }else{
            index++;
        }

        fillForm(id_subject, index);
    });

    //Guardar notas en el localStorage

    //Métodos adicionales de validación

    let _form = $("#form_asign_notes");

    _form.validate({
        rules:{
            student_note1:{
                required: true,
                number: true,
                min: 0.1,
                max: 5
            },
            student_note2:{
                required: true,
                number: true,
                min: 0.1,
                max: 5
            }
        },
        messages:{
            student_note1:{
                min: "La mínima nota es 0.1",
                max: "La máxima nota es 5",
                number: "Por favor, escribe un formato númerico válido"
            },
            student_note2:{
                min: "La mínima nota es 0.1",
                max: "La máxima nota es 5",
                number: "Por favor, escribe un formato númerico válido"
            }
        },
        submitHandler: function () {

            let note1 = $("#student_note1").val();
            let note2 = $("#student_note2").val();
            let id_subject  = $("#id_subject_selected").attr("key");

            if(note1 !== "" && note2 !== ""){
                saveNote(note1, note2, id_subject, index);
            }
        }
    });

    $("#btn_finalize").on('click', function () {
        Swal.fire({
            title: '¿Desea finalizar el proceso',
            text: "¡Los cambios no guardados serán descartados!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#1ccecd',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) {
                finalizeProcess();
            }
        });
    })
};

function generateTeachersCombo() {
    let template = "<option value='default' selected>Seleccione un docente</option>";
    let teachers = teachers_service.getTeachers();

    let combo = $("#combo_teachers_notes");

    teachers.forEach(function (teacher) {
        template += `
            <option key="${teacher._id}">${teacher.name + " " +teacher.lastname}</option>
        `;
    });

    combo.html(template);
}

function generateComboSubjects(subjects) {
    let template = "<option value='default' selected>Seleccione una materia</option>";

    let combo = $("#combo_subjects_asign_notes");

    subjects.forEach(function (subject) {
        template += `
            <option key="${subject._id}">${subject.name}</option>
        `;
    });

    combo.html(template);
}


function filterStudentsForTeacherAndSubject (subject_id) {
    let filter_students = [];
    let students_for_teacher_subject = register_subject_service.getStudentsForSubjectAndTeacher(subject_id);
    let all_students = students_service.getStudents();

    all_students.forEach(function (student) {
       students_for_teacher_subject.forEach(function (student_inscribe) {
           if(student._id === student_inscribe.student_id){
               filter_students.push({
                   inscribe_id :student_inscribe.inscribe_id,
                   student_id: student._id,
                   subject_id: student_inscribe.subject_id,
                   name: student.name,
                   lastname: student.lastname,
                   note1: student_inscribe.note1,
                   note2: student_inscribe.note2,
                   media: student_inscribe.media
               });
           }
       })
    });

    return filter_students;
}

function saveNote(note1, note2, id_subject, i) {

    let note_1 = parseFloat(note1);
    let note_2= parseFloat(note2);
    let media = (note_1 + note_2) / 2;

    let notes ={
        note1: note_1,
        note2: note_2,
        media: media
    };

    inscribed_student_service.insertNotes(
        $("#title_student").attr("key_student"),
        id_subject ,
        notes
    );

    fillForm(id_subject , i);
}

//Pinta los datos en el formulario de notas cada vez que se solicite

function fillForm(id_subject, i) {

    students = filterStudentsForTeacherAndSubject(id_subject); //Guarda los estudiantes con las notas de una materia

    //Se desactiva el campo de notas cuando estas ya se encuentren diligenciadas
    if(students[i].note1 !== "" && students[i].note2 !== ""){
        $("#student_note1").prop("disabled", true);
        $("#student_note2").prop("disabled", true);
    }else{
        $("#student_note1").prop("disabled", false);
        $("#student_note2").prop("disabled", false);
    }

    //Cada vez que se pulsa en alguno de los botones de anterior y siguiente se cargan los datos correspondientes
    $("#title_student").attr("key_student", students[i].student_id);
    $("#name_student_note").val(students[i].name);
    $("#lastname_student_note").val(students[i].lastname);
    $("#student_note1").val(students[i].note1);
    $("#student_note2").val(students[i].note2);

}

function finalizeProcess() {
    students = [];
    $("#form_asign_notes")[0].reset();
    app.petitionRoute($("#btn_finalize"));
}



