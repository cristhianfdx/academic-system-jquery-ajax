'use strict';

import {app} from "../../app.js";

//Servicios
import {users_service} from "../../services/users_service.js";
import {teachers_service} from "../../services/teachers_service.js";
import {register_subject_service} from "../../services/register_subject_service.js";
import {form_teachers} from "./form.js";


let editable = false; //Define si se va a editar un docente

export let teachers_component = {
    loadTableTeachers: function () {
        let template = "";

        teachers_service.getTeachers().forEach(function (teacher) {
            template += `
                <tr key="${teacher._id}">
                    <td>${teacher.name}</td>
                    <td>${teacher.lastname}</td>
                    <td>${teacher.cedula}</td>
                    <td>
                        <button class="btn btn-danger btn-sm delete-teacher" element="teachers">
                            <i class="btn-icons fas fa-user-times"></i>
                        </button>                        
                    </td>
                    <td>
                        <button class="btn btn-success btn-sm edit-teacher" data-toggle="modal"  element="teachers"
                                data-target="#formTeacherModal">
                            <i class="btn-icons-edit fas fa-user-edit"></i> 
                        </button>
                    </td>
                </tr>
        `;
        });

        $("#data_teachers").html(template);

        $(".delete-teacher").click(function () {
            let id = $(this).parent().parent().attr("key");
            let register = register_subject_service.getOneTeacherAsigned(id);

            if(register.length <= 0){
                Swal.fire({
                    title: '¿Desea borrar?',
                    text: "Esta a punto de eliminar este docente!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sí, borrar!',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.value) {
                        teachers_service.deleteTeacher(id);
                        app.petitionRoute($(this));
                    }
                });
            }else{
                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: '!El docente no puede ser borrado!',
                    footer: "Se encuentra con una o más materias asignadas"
                });
            }

        });

        $(".edit-teacher").click(function () {
            let id = $(this).parent().parent().attr("key");
            editable = true;
            $("#modal").html(form_teachers(editable));
            sendTeacher(true, id, $(this));
        });
    },
    loadForm: function () {
        $("#create_new").click(function () {
            editable = false;
            $("#modal").html(form_teachers(editable));
            sendTeacher(editable, "", "")
        });
    }
};

function sendTeacher(editable, id, element) {
    let _id = ""; //Id asignado al estudiante

    if(editable && id !== ""){
        let teacher = teachers_service.getOneTeacher(id);
        $("#name_teacher").val(teacher.name);
        $("#lastname_teacher").val(teacher.lastname);
        $("#cedula_teacher").val(teacher.cedula);
        $("#password").val(atob(teacher.password));
        $("#confirm_password").val(atob(teacher.password));

        let checkbox = $("#check_cedula");

        checkbox.on("change", function () {
            if($(this).prop("checked")){
                $("#cedula_teacher").prop("disabled", false)
            }else{
                $("#cedula_teacher").prop("disabled", true)
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

    let _form = $("#form_teacher");

    _form.validate({
        rules:{
            name_teacher: {
                required: true,
                minlength: 3,
                maxlength: 20,
                checkName:  'name_teacher'
            },
            lastname_teacher: {
                required: true,
                minlength: 3,
                maxlength: 20,
                checkName:  'lastname_teacher'
            },
            cedula_teacher: {
                required: true,
                number: true,
                checkCedula: "cedula_teacher",
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
            cedula_teacher: {
                checkCedula: "El número de cédula ya se encuentra registrado"
            }
        },
        submitHandler: function(){

            if(id !== ""){
                _id = id;
            }else{
                _id = users_service.generateID();
            }

            let password_plain = $("#password").val();
            let password_encrypted = btoa(password_plain);

            let data = {
                _id: _id,
                name: $("#name_teacher").val().toUpperCase(),
                lastname: $("#lastname_teacher").val().toUpperCase(),
                cedula: $("#cedula_teacher").val(),
                password: password_encrypted,
                type_user: ""
            };

            if(editable){
                teachers_service.editTeacher(id, data);
                $("#formTeacherModal").modal('toggle');
                app.petitionRoute(element);
            }else{
                teachers_service.createTeacher(data);
                $("#formTeacherModal").modal('toggle');
                app.petitionRoute(_form);
            }
            $(_form)[0].reset();
        }
    });
}