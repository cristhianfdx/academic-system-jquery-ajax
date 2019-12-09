'use strict';

import {app} from '../../app.js';
//Componentes
import {form_students} from "./form.js";
//Servicios
import {users_service} from '../../services/users_service.js';
import {students_service} from '../../services/students_service.js';
import {inscribed_student_service} from "../../services/inscribed_student_service.js";

let editable = false; //Define si se va a editar un estudiante


export let students_component = {
    loadTableStudents: function(){
        let template = "";
        students_service.getStudents().forEach(function (student) {
            template += `
                <tr key="${student._id}">
                    <td>${student.name}</td>
                    <td>${student.lastname}</td>
                    <td>${student.cedula}</td>
                    <td>
                        <button class="btn btn-sm btn-danger delete-student" element="students">
                            <i class="btn-icons fas fa-user-times"></i>
                        </button>                        
                    </td>
                    <td>
                        <button class="btn btn-sm btn-success edit-student" element="students" data-toggle="modal" 
                                data-target="#formStudentModal">
                               <i class="btn-icons fas fa-user-edit"></i> 
                        </button>
                    </td>
                </tr>
        `;
        });

        $("#data_students").html(template);


        $(".delete-student").click(function () {
            let id = $(this).parent().parent().attr("key");
            let inscribed = inscribed_student_service.getOneStudentInscribed(id);//Trae la inscripción de un estudiante

            if(inscribed.length <= 0){
                Swal.fire({
                    title: '¿Desea borrar?',
                    text: "Esta a punto de eliminar este estudiante!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sí, borrar!',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.value) {
                        students_service.deleteStudent(id);
                        app.petitionRoute($(this));
                    }
                });

            }else{
                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: '!El estudiante no puede ser borrado!',
                    footer: "Se encuentra inscrito en una o más materias"
                });
            }
        });

        $(".edit-student").click(function () {
            let id = $(this).parent().parent().attr("key");
            editable = true;
            $("#modal").html(form_students(editable));
            sendStudent(editable, id, $(this));
        });

    },
    loadForm: function () {//Carga el fomulario para crear nuevo estudiante
        $("#create_new").click(function () {
            editable = false;
           $("#modal").html(form_students(editable));
           sendStudent(editable, "", "")
        });
    }

};

function sendStudent(editable, id, element) {
    let _id = ""; //Id asignado al estudiante

    if(editable && id !== ""){
        let student = students_service.getOneStudent(id);
        $("#name_student").val(student.name);
        $("#lastname_student").val(student.lastname);
        $("#cedula_student").val(student.cedula);
        $("#password").val(atob(student.password));
        $("#confirm_password").val(atob(student.password));

        let checkbox = $("#check_cedula");

        checkbox.on("change", function () {
            if($(this).prop("checked")){
                $("#cedula_student").prop("disabled", false);
            }else{
                $("#cedula_student").prop("disabled", true);
            }
        });

    }

    //Métodos para validación

    $.validator.addMethod("checkCedula", function (value) {
        return users_service.matchCedula(value).length <= 0;
    });

    $.validator.addMethod("checkName", function (value) {
        return /^[a-zA-Z][a-zA-Z]*/ .test( value );
    }, "Por favor no escribas números ni cáracteres especiales");

    $.validator.addMethod("checkPassword", function (value) {
        return /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/ .test( value );
    }, "La contraseña debe tener al entre 8 y 16 caracteres, al menos un número, al menos una minúscula y al menos una mayúscula.\n" +
            "Puede tener otros símbolos.");


    let _form = $("#form_students");

    _form.validate({
        rules:{
            name_student: {
                required: true,
                minlength: 3,
                maxlength: 20,
                checkName:  'name_student'
            },
            lastname_student: {
                required: true,
                minlength: 3,
                maxlength: 20,
                checkName:  'lastname_student'
            },
            cedula_student: {
                required: true,
                number: true,
                checkCedula: "cedula_student",
                minlength: 5,
                maxlength: 12
            },
            password:{
                required: true,
                minlength: 8,
                maxlength: 16,
                checkPassword: "password"
            },
            confirm_password: {
                required: true,
                equalTo: "#password"
            }
        },
        messages:{
            cedula_student: {
                checkCedula: "El número de cédula ya se encuentra registrado"
            },
            confirm_password:{
                equalTo: "por favor escribe el mismo valor del campo contraseña"
            }
        },
        submitHandler: function(){

            let password_plain = $("#password").val();
            let password_encrypted = btoa(password_plain);

            if(id !== ""){
                _id = id;
            }else{
                _id = users_service.generateID();
            }

            let data = {
                _id: _id,
                name: $("#name_student").val().toUpperCase(),
                lastname: $("#lastname_student").val().toUpperCase(),
                cedula: $("#cedula_student").val(),
                password: password_encrypted,
                type_user: ""
            };

            if(editable){
                students_service.editStudent(id, data);
                $("#formStudentModal").modal('toggle');
                app.petitionRoute(element);
            }else{
                students_service.createStudent(data);
                $("#formStudentModal").modal('toggle');
                app.petitionRoute(_form);
            }
            $(_form)[0].reset();
        }
    });
}

