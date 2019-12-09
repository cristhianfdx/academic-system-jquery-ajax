'use strict';

import {session_service} from '../../services/session_service.js';
import {app} from "../../app.js";

export let login = function () {
    $("#formLogin").validate({
        rules:{
            cedula:{
                required: true,
                number: true,
                minlength: 5,
                maxlength: 12
            },
            password: "required"
        },
        submitHandler: function () {
            let cedula = $("#cedula").val();
            let password = $("#password").val();

            let session = session_service.createSession(cedula, password);
            //Se obtiene true si el usuario existe
            if(session.exists){
                app.runApp("accept");
                Swal.fire({
                    position: 'top-end',
                    type: 'success',
                    title: session.message,
                    showConfirmButton: false,
                    customClass:{
                        popup: "animated tada"
                    },
                    timer: 3000
                });

            }else{
                Swal.fire({
                    type: "error",
                    title: "Error de autenticación",
                    text: session.message
                });
            }
        }
    });
};