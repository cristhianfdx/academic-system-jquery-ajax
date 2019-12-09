
import {app} from '../src/app/app.js';


$(document).ready(function () {

    //Inicio de la aplicación
    app.startApp();

    //---Eventos del frontend---
    //Se carga la vista solicitada por el usuario
    $(document).on("click", ".navigation", function () {
        let element = $(this);
        app.petitionRoute(element);
    });
    //---Fin--Eventos del frontend---

    //Generar data para pruebas (Estudiantes, Docentes y Materias)
    $(document).on("click", "#generate_data", function () {
        app.generateData();
        app.startApp();
    });

});