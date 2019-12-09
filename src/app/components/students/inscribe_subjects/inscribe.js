'use strict';

import {app} from "../../../app.js";
//Services
import {students_service} from '../../../services/students_service.js';
import {inscribed_student_service} from '../../../services/inscribed_student_service.js';
import {users_service} from '../../../services/users_service.js';
import {register_subject_service} from "../../../services/register_subject_service.js";


let template_list = ""; //template para el listBox de materias


export function students_inscribe () {

    let session = JSON.parse(localStorage.getItem("session")); //Sesión actual

    //Código que carga el combobox de estudiantes dinámicamente
    let template_students = "<option value='default' selected>Seleccione un estudiante</option>";
    let students = students_service.getStudents();
    let combo_students = $("#combo_students");

    if(session.type_user === "Estudiante"){
        template_students  += `
            <option key="${session._id}">${session.name + " " + session.lastname}</option>
        `;

    }else{
        students.forEach(function (student) {
            template_students  += `
            <option key="${student._id}">${student.name + " " + student.lastname}</option>
        `;
        });
    }

    combo_students.html(template_students);

    let student_selected = "";// opcion selecionada en el combobox de estudiantes
    let student_id = ""; //Guarda el id del estudiante seleccionado
    let subjects_disponible = null;

    combo_students.change(function () {
        student_selected = $(this).val();

       if(student_selected !== "default"){
           student_id = $("option:selected", $(this)).attr("key");
           //Se agrega en un <span> el nombre del estudiante seleccionado
           $("#student_selected").html(`<span key="${student_id}" id="id_student">${student_selected}</span>`);

           $(this).prop("disabled", true); //Se bloquea el estudiante hasta que inscriba una materia o cancele el proceso

           /* Se verifican las materias que tiene inscritas el estudiante para eliminarlas de combobox de materias,
            para garantizar que no este disponible una materia previamente inscrita */
           subjects_disponible =
               inscribed_student_service.getNoInscribedSubjects(inscribed_student_service.getInscribedSubjects(student_id));

           genComboSubjectsTemplate(subjects_disponible);

        }else{
           student_selected = "";
           student_id = "";
           $("#student_selected").html(student_selected);
           $("#list_subjects").html("");
       }

    });

    //Gestión del combobox de materias
    let combo_subjects_jquery = $("#combo_subjects");
    let combo_subjects_vanilla = document.getElementById("combo_subjects");

    combo_subjects_jquery.html("<option value='default'>Seleccione una materia</option>");

    let subject_selected = ""; // opcion selecionada en el combobox de materias
    let subject_id = "";

    combo_subjects_jquery.change(function () {
       subject_selected = $(this).val();

       if(subject_selected !== "default"){
           subject_id = $("option:selected", $(this)).attr("key");
           preInscribe(subject_selected, subject_id, combo_subjects_vanilla);
       }else{
           subject_selected = "";
           subject_id = "";
       }

    });

    //Lógica para inscribir materias

    $("#btn_inscribe").click(function () {
        //id del estudiante guardado en un <span> con el nombre del estudiante
        let student_id = $("#id_student").attr("key");
        //materias pre seleccionadas guardadas en el listBox
        let data_items = document.querySelectorAll(".data-subjects-items");

        if(student_id !== undefined && data_items.length >0){
            Swal.fire({
                title: '¿Desea registrar las materias?',
                text: "¡Los cambios serán guardados!",
                type: 'info',
                showCancelButton: true,
                confirmButtonColor: '#66d655',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.value) {
                    inscribe(student_id);
                    subject_selected = "";
                }
            });
        }else{
            if(student_id === undefined ){
                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: '!Debes elegir un estudiante primero!'
                });
            }else if(data_items.length === 0){
                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: '!Debes selecionar por lo menos una materia!'
                });
            }
        }
    });

    $("#btn_cancel").click(function () {
        Swal.fire({
            title: '¿Desea cancelar el proceso',
            text: "¡Los cambios no serán guardados!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#1ccecd',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) {
                cancel();
            }
        });
    });

}

//Genera combobox con las materias disponibles
function genComboSubjectsTemplate(subjects_student){

    let template = "<option value='default'>Seleccione una materia</option>";

    subjects_student.forEach(function (subject) {
        template += `
            <option key="${subject._id}">${subject.name}</option>
        `;
    });

    $("#combo_subjects").html(template);
}

//Función que permite crear un listbox con las materias pre-incritas

function genList(subject, id) {

    if(subject !== ""){
        template_list += `
        <li class="list-group-item w-75 data-subjects-items" key="${id}" sbj_name="${subject}">
            ${subject}   
            <i class="fas fa-times drop-item" style="margin-left: 20px; color: red; cursor: pointer"></i>
        </li>
    `;
        $("#list_subjects").html(template_list);

        //Solicita eliminar items de la lista

        $(".drop-item").click(function () {
            dropSubjectList($(this).parent());
            template_list = "";
        });
    }
}

//Elimina items de la lista
function dropSubjectList(element) {
    addSubjectCombo(element);
    element.remove();
}

//Elimina opciones del combobox de materias
function dropSubjectCombo(element) {

    let index = element.selectedIndex;

    if(index !== 0){
        element.remove(index);
    }
}

//Agrega elementos al combobox cuando estos son eliminados de la lista
function addSubjectCombo(element) {
    let option = document.createElement("option");
    option.setAttribute("key", element.attr("key"));
    option.text = element.attr("sbj_name");
    document.getElementById("combo_subjects").add(option);
}

function preInscribe(option, subject_id, element){

    if(option !== ""){
        genList(option, subject_id);
        dropSubjectCombo(element);
    }
}

function inscribe (student_id) {
    //Se obtienen los elementos de la lista de preinscritos que se encuentran en el listbox
    let data_items = document.querySelectorAll(".data-subjects-items");
    let subjects_data = [];//Guarda las materias que seran almacenadas en el localstorage

    let data = null; // Datos que serán guardados en el localStorage
    //Se busca un inscrito por id de estudiante para verificar si ya se encuentra registrado
    let students_inscribed = inscribed_student_service.getOneStudentInscribed(student_id);

    if(students_inscribed.length > 0){
        let id_inscribe = students_inscribed[0]._id; // id de inscrito
        let data_subjects = null;

        data_items.forEach(function (subject) {
            data_subjects = {
                subject_id : subject.getAttribute("key"),
                notes: {
                    note1 : "",
                    note2: "",
                    media: ""
                }
            }
        });

        //Inscrito con las nuevas materias agregadas
        data = inscribed_student_service.insertSubjects(student_id, data_subjects);

        inscribed_student_service.editInscribe(id_inscribe, data);
        $("#list_subjects").html("");
        template_list = "";
        app.petitionRoute($("#btn_inscribe"));

    }else{

        data_items.forEach(function (subject) {
            subjects_data.push({
                subject_id : subject.getAttribute("key"),
                notes: {
                    note1 : "",
                    note2: "",
                    media: ""
                }
            });
        });

        data = {
            _id : users_service.generateID(),
            student_id: student_id,
            subjects: subjects_data,
            state:true
        };

        inscribed_student_service.inscribeStudent(data);
        $("#list_subjects").html("");
        template_list = "";
        app.petitionRoute($("#btn_inscribe"));
    }

}

function cancel() {
    $("#list_subjects").html("");
    template_list = "";
    app.petitionRoute($("#btn_inscribe"));
}

export function drawTableInscribe() {
    let template = "";

    students_service.getStudents().forEach(function (student) {
        inscribed_student_service.getInscribed().forEach(function (inscribe) {
            if(student._id === inscribe.student_id){
                template += `
                    <tr key_inscribe="${inscribe._id}">
                        <td>${student.name}</td>
                        <td>${student.lastname}</td>
                        <td>${student.cedula}</td>
                        <td>
                            <select name="subjects_inscribe" class="form-control mr-sm-3 subjects_inscribe" 
                                    key_student ="${student._id}">
                                ${generateComboInscribeSubjects(student._id)}
                            </select>
                        </td>
                        <td>
                            <button class="btn btn-warning btn-sm delete-subject-inscribe">
                                <i class="btn-icons fas fa-minus-circle"></i>
                            </button>                                                       
                        </td>
                        <td>
                            <button class="btn btn-danger btn-sm delete-inscribe">
                                <i class="btn-icons fas fa-trash-alt"></i>
                            </button> 
                        </td>
                    </tr>
                `;
            }
        });
    });

    $("#data_students_subjects").html(template);

    let combo_subjects = $(".subjects_inscribe");
    let option_selected = "";
    let subject_id = "";
    let student_id = "";

    combo_subjects.change(function () {
        if($(this).val() !== "default"){
            option_selected = $(this).val();
            subject_id = $("option:selected", $(this)).attr("key_subject");
            student_id = $(this).attr("key_student");
        }else{
            option_selected = "";
            subject_id = "";
            student_id = "";
        }
    });

    $(".delete-subject-inscribe").click(function () {
        if(option_selected !== "" &&  subject_id !== "" && student_id !== ""){
            Swal.fire({
                title: '¿Desea borrar?',
                text: "Esta a punto de eliminar esta materia!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, borrar!',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.value) {
                    inscribed_student_service.deleteSubjectsInscribed(student_id, subject_id);
                    app.petitionRoute($("#btn_inscribe"));
                }
            });
        }else{
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: '!Debes selecionar por lo menos una materia!'
            });
        }
    });

    $(".delete-inscribe").click(function () {
        let id = $(this).parent().parent().attr("key_inscribe");

        Swal.fire({
            title: '¿Desea borrar?',
            text: "Esta a punto de eliminar todas las materias inscritas del estudiante!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, borrar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) {
                inscribed_student_service.deleteInscribe(id);
                app.petitionRoute($("#btn_inscribe"));
            }
        });
    });
}

function generateComboInscribeSubjects(student_id) {
    let template = "";
    template = "<option value='default'>Materias inscritas</option>";

    let data = inscribed_student_service.getInscribedSubjects(student_id);
    data.forEach(function (x) {
        template += `
            <option key_subject="${x._id}">${x.name}</option>
        `;
    });
    return template;
}

export function drawTableOneStudentInscribe() {
    let session = JSON.parse(localStorage.getItem("session")); //Sesión actual
    let inscribe_subjects = inscribed_student_service.getInscribedSubjects(session._id);
    let template = "";

    inscribe_subjects.forEach(function (subject) {

        template += `
            <tr>
                <td>${subject.name}</td>
                <td>${register_subject_service.getTeacherForSubject(subject._id) !== null ?
                        register_subject_service.getTeacherForSubject(subject._id).name + " " +
                        register_subject_service.getTeacherForSubject(subject._id).lastname : "Sin asignar"}
                </td>
            </tr>
        `;
    });

    $("#data_student_subjects").html(template);
}



