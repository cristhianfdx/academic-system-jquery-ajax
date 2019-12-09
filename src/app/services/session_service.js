'use strict';

//Services
import {admin} from './users_service.js';
import {students_service} from "./students_service.js";
import {teachers_service} from "./teachers_service.js";

export let session_service = {
    //Se encarga de buscar si el usuario existe y permite iniciar sesión
    createSession: function (cedula, password) {
        let users = []; //Array que guarda todos los usuarios: Admin, estudiantes y profesores
        let exists = false; //Define si el usuario existe
        let user_data = null; //Guarda los datos del usuario encontrado
        let message = "";

        //Se agregan todos los arrays de usuarios a un nuevo array, da como resultado un "array de arrays"
        users.push(
            admin.getAdmin(),
            students_service.getStudents(),
            teachers_service.getTeachers()
        );

        //Se recorre el array multidimensional
        users.forEach(function (user) {
            for(let i = 0; i< user.length; i++){
                if(user[i].cedula === cedula && atob(user[i].password ) === password){
                    user_data = user[i];
                }

                if(user[i].cedula === cedula){
                    message = "La cédula existe, pero la contraseña esta errada";
                }else{
                    message = "La cédula no existe, por favor contacte al administrador del sistema";
                }
            }
        });

        if(user_data !== null){//Crea una sesión con el usuario encontrado
            localStorage.setItem("session", JSON.stringify(user_data));
            message = "¡Hola! " + user_data.name + ", El sistema académico te da la bienvenida";
            exists = true;
        }

        return {exists, message};
    }
    ,
    destroySession: function () {
        if(localStorage.getItem("session") !== null){
            localStorage.removeItem("session");
        }
    }
};