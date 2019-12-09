'use strict';

import {app} from '../../app.js';
import  {form_subject} from "./form.js";
//Services
import {users_service} from '../../services/users_service.js';
import {subjects_service} from '../../services/subjects_service.js';
import {inscribed_student_service} from "../../services/inscribed_student_service.js";
import {register_subject_service} from "../../services/register_subject_service.js";


let editable = false; //Define si se va a editar una materia

export let subject_component = {
    loadTableSubjects: function(){
        let template = "";

        subjects_service.getSubjects().forEach(function (subject) {
            template += `
                <tr key="${subject._id}">
                    <td>${subject.name}</td>
                    <td>${subject.description}</td>                    
                    <td>
                        <button class="btn btn-danger btn-sm delete-subject" element="subjects">
                            <i class="btn-icons fas fa-trash-alt"></i>
                        </button>                        
                    </td>
                    <td>
                        <button class="btn btn-success btn-sm edit-subject" data-toggle="modal"  element="subjects"
                                data-target="#formSubjectModal">
                            <i class="btn-icons-edit fas fa-edit"></i> 
                        </button>
                    </td>
                </tr>
        `;
        });

        $("#data_subjects").html(template);

        $(".delete-subject").click(function () {

            let id = $(this).parent().parent().attr("key");

            let subjects_inscribe = inscribed_student_service.getInscribedForSubject(id);
            let subjects_register = register_subject_service.getAsignForSubject(id);

            if(subjects_inscribe.length <= 0 && subjects_register.length <=0){
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
                        subjects_service.deleteSubject(id);
                        app.petitionRoute($(this));
                    }
                });
            }else{
                if(subjects_inscribe.length >= 0 && subjects_register.length >=0){
                    Swal.fire({
                        type: 'error',
                        title: 'Oops...',
                        text: '!La materia se encuentra inscrita por uno ó más estudiantes y/o asignada a un docente!'
                    });
                }else if(subjects_inscribe.length >= 0){
                    Swal.fire({
                        type: 'error',
                        title: 'Oops...',
                        text: '!La materia se encuentra inscrita por uno ó más estudiantes!'
                    });
                }else if (subjects_register.length >=0){
                    Swal.fire({
                        type: 'error',
                        title: 'Oops...',
                        text: '!La materia se encuentra asignada a un docente!'
                    });
                }

            }


        });

        $(".edit-subject").click(function () {
            let id = $(this).parent().parent().attr("key");
            editable = true;
            $("#modal").html(form_subject(editable));
            sendSubject(editable, id, $(this));
        });
    },
    loadFormSubject: function () {
        $("#create_new").click(function () {
            editable = false;
            $("#modal").html(form_subject(editable));
            sendSubject(editable, "", "");
        });
    }
};

function sendSubject(editable, id, element) {
    let _id = ""; //Id asignado al estudiante

    if(editable && id !== ""){
        let subject = subjects_service.getOneSubject(id);
        $("#name_subject").val(subject.name);
        $("#description").val(subject.description);

        let checkbox = $("#check_name");

        checkbox.on("change", function () {
            if($(this).prop("checked")){
                $("#name_subject").prop("disabled", false);
            }else{
                $("#name_subject").prop("disabled", true);
            }
        });
    }

    //Método para validar si una materia existe por su nombre
    $.validator.addMethod("checkSubject", function (value){
        return subjects_service.getSubjectForName(value).length <=0;
    });

    let _form_ = $("#form_subject");

    _form_.validate({
        rules:{
            name_subject: {
                required: true,
                minlength: 5,
                maxlength: 30,
                checkSubject: "name_subject"
            },
            description: {
                required: true,
                minlength: 5,
                maxlength: 50
            }
        },
        messages:{
            name_subject:{
                checkSubject: "Ya se encuentra registrada una materia con este nombre"
            }
        },
        submitHandler: function(){

            if(id !== ""){
                _id = id;
            }else{
                _id = users_service.generateID();
            }

            let data = {
                _id: _id,
                name: $("#name_subject").val().toUpperCase(),
                description: $("#description").val().toUpperCase()
            };

            if(editable){
                subjects_service.editSubject(id, data);
                $("#formSubjectModal").modal('toggle');
                app.petitionRoute(element);
            }else{
                subjects_service.createSubject(data);
                $("#formSubjectModal").modal('toggle');
                app.petitionRoute(_form_);
            }
            $(_form_)[0].reset();
        }
    });
}