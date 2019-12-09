'use strict';
//Models
import {Admin} from '../models/User.js';
//Services
import {students_service} from '../services/students_service.js';
import {teachers_service} from '../services/teachers_service.js';

let user = [];

export let admin = {
    createAdmin: function () {

        if(localStorage.getItem("admin") === null){
            user = [];
            user.push(Admin);
            localStorage.setItem("admin", JSON.stringify(user));
        }

        console.log("%c¡Hola!", "font-family: ';Arial';, serif; font-weight: bold; color: red; font-size: 45px");
        console.log("%cEsta es una aplicación educativa sin ánimo de lucro, fue desarrollada con el fin de aprender a utilizar localStorage para la persistencia de datos en una aplicación real.", "font-family: ';Arial';, serif; color: black; font-size: 20px");
        console.log("%cSi deseas acceder a ella y verificar su funcionamiento necesitas los siguientes datos:", "font-family: ';Arial';, serif; color: black; font-size: 20px");
        console.log("%cRol de administrador", "font-family: ';Arial';, serif; color: blue; font-size: 20px");
        console.log("%cCédula = 12345678", "font-family: ';Arial';, serif; color: crimson; font-size: 20px");
        console.log("%cContraseña = admin", "font-family: ';Arial';, serif; color: crimson; font-size: 20px");
        console.log("%cRol de Estudiante", "font-family: ';Arial';, serif; color: blue; font-size: 20px");
        console.log("%cCédula = 11111111", "font-family: ';Arial';, serif; color: crimson; font-size: 20px");
        console.log("%cContraseña = 1234", "font-family: ';Arial';, serif; color: crimson; font-size: 20px");
        console.log("%cRol de Docente", "font-family: ';Arial';, serif; color: blue; font-size: 20px");
        console.log("%cCédula = 44444444", "font-family: ';Arial';, serif; color: crimson; font-size: 20px");
        console.log("%cContraseña = 1234", "font-family: ';Arial';, serif; color: crimson; font-size: 20px");
        console.log("%cNota : Para acceder como estudiante o docente es necesario Generar Data", "font-family: ';Arial';, serif; color: orange; font-size: 16px");
        console.log("%cEsta aplicación fue desarrollada por  Cristhian Alexander Forero Domínguez", "font-family: ';Arial';, serif; color: black; font-size: 18px; font-style:italic");
        console.log("%cSe utilizó Boostrap y JQuery en su última versión, la lógica de la aplicación esta elaborada netamente en Javascript sin ningún framework; utilizando el patrón MVC; se útlizan módulos en Js y funciones propias de Ecmascript 5 y 6", "font-family: ';Arial';, serif; color: black; font-size: 16px");
    },
    getAdmin: function () {
        if(localStorage.getItem("admin") === null) {
            user = [];
        }else{
            user = JSON.parse(localStorage.getItem("admin"));
        }
        return user;
    }
};

export let users_service = {
    generateID: function () {
        let d = new Date().getTime();
        return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });

    },
    matchCedula: function (cedula) {
        let users = [];
        let user_match =[];

        users.push(
            admin.getAdmin(),
            students_service.getStudents(),
            teachers_service.getTeachers()
            )
        ;

        users.forEach(function (user) {
           for(let i = 0; i < user.length; i++){
               if(user[i].cedula === cedula){
                   user_match = user[i];
               }
           }
        });

       return user_match;
    }
};