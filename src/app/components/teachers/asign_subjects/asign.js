'use strict';

import {app} from "../../../app.js";
//Model
import {RegisterSubject} from "../../../models/RegisterSubject.js";
//Services
import {teachers_service} from "../../../services/teachers_service.js";
import {register_subject_service} from "../../../services/register_subject_service.js";
import {users_service} from "../../../services/users_service.js";
import {inscribed_student_service} from "../../../services/inscribed_student_service.js";


let template_list = "";//template para el listBox de materias

export function teachers_asign() {
    //Código que carga el combobox de docentes dinámicamente
    let template_teachers = "<option value='default' selected>Seleccione un docente</option>";

    let teachers = teachers_service.getTeachers();
    let combo_teachers = $("#combo_teachers");

    teachers.forEach(function (teacher) {
        template_teachers += `
            <option key="${teacher._id}">${teacher.name + " " + teacher.lastname}</option>
        `;
    });

    combo_teachers.html(template_teachers);

    //Código que permite poner en un <span> el nombre del estudiante seleccionado

    let teacher_selected = "";
    let subjects_asign_disponible = null;

    combo_teachers.change(function () {
        teacher_selected = $(this).val();
        if($(this).val() !== "default"){
            let id = $("option:selected", $(this)).attr("key");//Guarda el id del docente seleccionado
            $("#teacher_selected").html(`<span key="${id}" id="id_teacher">${teacher_selected}</span>`);

            //Se traen las materias que no tiene registradas el docente para mostrarlas como diponibles en el combobox
            subjects_asign_disponible =
                register_subject_service.getNoAsignedSubjects(register_subject_service.getAsignedSubjects(id));

            genComboAsignSubjectsTemplate(subjects_asign_disponible);

            $(this).prop("disabled", true);//Se bloquea el docente hasta que asigne una materia  o se cancele el proceso

            //Se limpia el listBox cuando se cambie de docente
            $("#list_asign_subjects").html("");
            template_list = "";

        }else{
            teacher_selected = "";
            $("#teacher_selected").html(teacher_selected);
            $("#list_asign_subjects").html("");
        }
    });

    //Gestión del ComboBox de materias

    let combo_jquery = $("#combo_subjects_asign");
    let combo_vanilla = document.getElementById("combo_subjects_asign");

    //Código que identifica la materia seleccionada
    combo_jquery.html("<option value='default'>Seleccione una materia</option>");

    let subject_selected = "";
    let subject_id = "";

    combo_jquery.change(function () {
        if($(this).val() !== "default"){
            subject_selected = $(this).val();
            subject_id = $("option:selected", $(this)).attr("key");
            preAsign(subject_selected, subject_id, combo_vanilla);
        }else{
            subject_selected = "";
            subject_id = "";
        }
    });

    $("#btn_asign_subjects").click(function () {
        let teacher_id = $("#id_teacher").attr("key");//id del docente guardado en un <span> con el nombre del estudiante
        let data_items = document.querySelectorAll(".data-subjects-asign-items");//materias pre seleccionadas guardadas en el listBox

        if(teacher_id !== undefined && data_items.length > 0){
            Swal.fire({
                title: '¿Desea asignar las materias?',
                text: "¡Los cambios serán guardados!",
                type: 'info',
                showCancelButton: true,
                confirmButtonColor: '#66d655',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.value) {
                    asign(teacher_id);
                    subject_selected = "";
                }
            });
        }else{
            if(teacher_id === undefined ){
                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: '!Debes elegir un docente primero!'
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

    $("#btn_cancel_asign").click(function () {
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
                cancelAsign();
            }
        });
    });


}

function genComboAsignSubjectsTemplate(subjects_teachers) {
    //Código que carga el combobox de materias dinámicamente

    let template = "<option value='default'>Seleccione una materia</option>";

    subjects_teachers.forEach(function (subject) {
        template += `
            <option key="${subject._id}">${subject.name}</option>
        `;
    });

    $("#combo_subjects_asign").html(template);
}

//Función que permite crear un listbox con las materias pre-selecionadas

function genListSubjects(subject, id) {

    if(subject !== ""){
        template_list += `
        <li class="list-group-item w-75 data-subjects-asign-items" key="${id}" sbj_name="${subject}">${subject} 
            <i class="fas fa-times drop-item" style="margin-left: 20px; color: red; cursor: pointer"></i>
        </li>
    `;
        $("#list_asign_subjects").html(template_list);

        //Solicita eliminar items de la lista

        $(".drop-item").click(function () {
            dropSubjectList($(this).parent());
            template_list = "";
        });
    }
}

function preAsign(option, subject_id, element) {
    if(option !== ""){
        genListSubjects(option, subject_id);
        dropSubjectCombo(element);
    }
}

//Elimina items de la lista
function dropSubjectList(element) {
    addSubjectAsignCombo(element);
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
function addSubjectAsignCombo(element) {
    let option = document.createElement("option");
    option.setAttribute("key", element.attr("key"));
    option.text = element.attr("sbj_name");
    document.getElementById("combo_subjects_asign").add(option);
}

function asign(teacher_id) {
    //Se obtienen los elementos de la lista de materias seleccionadas que se encuentran en el listbox
    let data_items = document.querySelectorAll(".data-subjects-asign-items");
    let register = [];//Guarda el array de materias registradas para un docente

    let data = null; // Todos los datos que serán guardados en el localStorage

    /*Se busca un registro de materias por id de docente para verificar si este ya se encuentra en en el register_subjects
    * Si no es asi se crea un nuevo registro de lo contrario se dita uno ya existente*/

    let teacher_register = register_subject_service.getOneTeacherAsigned(teacher_id);

    if(teacher_register.length > 0){
        let id_register = teacher_register [0]._id; // id de registro
        register = null;

        data_items.forEach(function (subject) {
            register = {
                subject_id :subject.getAttribute("key")
            }
        });

        //Se registran unicamente las materias y posteriormente se retorna un objeto ya modificado para luego ser insertado en el localStorage
        data = register_subject_service.insertSubjects(teacher_id, register);
        register_subject_service.editRegister(id_register, data);
        $("#list_asign_subjects").html("");
        template_list = "";
        app.petitionRoute($("#btn_asign_subjects"));

    }else{

        register = [];

        data_items.forEach(function (subject) {
            register.push({
                subject_id: subject.getAttribute("key")
            });
        });

        data = {
            _id: users_service.generateID(),
            date: RegisterSubject.date,
            teacher_id:  teacher_id,
            register: register,
            state: true
        };

        register_subject_service.subjectRegister(data);
        $("#list_asign_subjects").html("");
        template_list = "";
        app.petitionRoute($("#btn_asign_subjects"));
    }

}

function cancelAsign() {
    $("#list_asign_subjects").html("");
    template_list = "";
    app.petitionRoute($("#btn_asign_subjects"));
}

export function drawTableAsign() {
    let template = "";

    teachers_service.getTeachers().forEach(function (teacher) {
        register_subject_service.getRegister().forEach(function (registry) {
            if(teacher._id === registry.teacher_id){
                template += `
                    <tr key_registry="${registry._id}">
                        <td>${teacher.name}</td>
                        <td>${teacher.lastname}</td>
                        <td>${teacher.cedula}</td>
                        <td>
                            <select name="subjects_asign" class="form-control mr-sm-3 subjects_asign" key_teacher ="${teacher._id}"> 
                                ${generateComboAsignSubjects(teacher._id)}                           
                            </select>
                        </td>
                        <td>
                            <button class="btn btn-warning btn-sm delete-subject-asign">
                                <i class="btn-icons fas fa-minus-circle"></i>
                            </button>                            
                        </td>
                        <td>
                            <button class="btn btn-danger btn-sm delete-asign">
                                <i class="btn-icons fas fa-trash-alt"></i>
                            </button>
                        </td>
                    </tr>               
               `;
            }
        });
    });

    $("#data_teachers_subjects").html(template);

    let combo_subjects = $(".subjects_asign");
    let option_selected = "";
    let subject_id = "";
    let teacher_id = "";

    combo_subjects.change(function () {
        if($(this).val() !== "default"){
            option_selected = $(this).val();
            subject_id = $("option:selected", $(this)).attr("key_subject");
            teacher_id = $(this).attr("key_teacher");
        }else{
            option_selected = "";
            subject_id = "";
            teacher_id = "";
        }
    });

    $(".delete-subject-asign").click(function () {
        if(option_selected !== "" &&  subject_id !== "" && teacher_id !== ""){
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
                    register_subject_service.deleteSubjectsAsign(teacher_id, subject_id);
                    app.petitionRoute($("#btn_asign_subjects"));
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

    $(".delete-asign").click(function () {
        let id = $(this).parent().parent().attr("key_registry");

        Swal.fire({
            title: '¿Desea borrar?',
            text: "Esta a punto de eliminar todas las materias asignadas al estudiante!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, borrar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) {
                register_subject_service.deleteAsign(id);
                app.petitionRoute($("#btn_asign_subjects"));
            }
        });
    });
}

function generateComboAsignSubjects(teacher_id) {
    let template = "";
    template = "<option value='default'>Materias asignadas</option>";

    let data = register_subject_service.getAsignedSubjects(teacher_id);
    data.forEach(function (x) {
        template += `
            <option key_subject="${x._id}">${x.name}</option>
        `;
    });
    return template;
}

export function drawTableAsignOneTeacher() {
    let session = JSON.parse(localStorage.getItem("session")); //Sesión actual
    let template = "";


    register_subject_service.getAsignedSubjects(session._id).forEach(function (subject) {
        template += `
            <tr>
                <td>${subject.name}</td>
                <td>${inscribed_student_service.getInscribedForSubject(subject._id).length}</td>
            </tr>
        `;

    });

    $("#data_teacher_subjects").html(template);

}