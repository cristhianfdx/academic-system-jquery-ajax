'use strict';

//Componentes
import {login} from "./components/login/login.js";
import {navigation} from './components/navigation/navigation.js';
import {students_component} from "./components/students/students.js";
import {students_inscribe, drawTableInscribe, drawTableOneStudentInscribe} from "./components/students/inscribe_subjects/inscribe.js";
import {search_notes_subjects, generateNotesOneStudent} from "./components/students/notes_registered/registered.js";
import {teachers_component} from "./components/teachers/teachers.js";
import {load_subjects_and_teachers_for_notes} from "./components/teachers/notes_register/register.js";
import {teachers_asign, drawTableAsign, drawTableAsignOneTeacher} from "./components/teachers/asign_subjects/asign.js";
import {reports} from "./components/teachers/reports/reports.js";
import {subject_component} from "./components/subjects/subjects.js";
//Servicios
import {admin} from './services/users_service.js';
import {session_service} from "./services/session_service.js";
//Modelos
import {Students, Teachers} from "./models/User.js";
import {SubjectsData} from  './models/Subject.js';

export let app = {
    startApp: function () {//Inicia la aplicación

        if(localStorage.getItem("session") === null){
            //Se crea un administrador del sistema por defecto
            admin.createAdmin();
            //Cuando no existe una sesión creada se carga la vista de login
            this.router("login/login", "#app", "login");
            $("#header").html("");
        }else{
            this.runApp("accept");
        }
    },
    runApp: function(access){//Mantiene la aplicación en ejecución
        //Se obtiene la sesión actual
        let session = JSON.parse(localStorage.getItem("session"));
        let role = "";

        if(session !== null){
            role = session.type_user;
        }

        if(access === "accept"){

            let header = $("#header");

            switch (role) {
                case "Administrador":
                    header.html(navigation("admin"));
                    this.router("admin/index", "#app", "user");
                    $("#home").attr("route", "admin/index");
                    break;
                case "Estudiante":
                    header.html(navigation("student"));
                    this.router("students/index_student", "#app", "students");
                    break;
                default:
                    header.html(navigation("teacher"));
                    this.router("teachers/index_teacher", "#app", "teachers");
                    break;
            }

            //Carga la barra de navegación y los datos de usuario en el dropdown
            $("#user-name").html(session.name);
            $("#user-role").html(role);
            $(" #user-cedula").html("CC: "+ session.cedula);
            $("body").removeClass("background-login").addClass("background-users");

        }
    },
    petitionRoute: function(element){ //Gestiona las peticiones del usuario para cargar una vista
        //Se identifica el elemento que genero el evento
        let attribute = element.attr("element");//Este atributo contiene el nombre del componente principal
        let route = element.attr("route"); //este atributo guarda la ruta del componente a cargar en el subcontenido

        switch (attribute) {
            case "home":
                this.router($("#home").attr("route"), "#app");
                break;
            case "students":
                if(route){
                    this.router(route, "#subcontent", "students");
                }else{
                    this.router("students/index","#app", "students");
                }
                break;
            case "teachers":
                if(route){
                    this.router(route, "#subcontent", "teachers");
                }else{
                    this.router("teachers/index", "#app", "teachers");
                }
                break;
            case "subjects":
                if(route){
                    this.router(route, "#subcontent", "subjects");
                }else{
                    this.router("subjects/index", "#app", "subjects");
                }
                break;
            case "logout":
                //Alert personalizado son sweet Alert js
                Swal.fire({
                    title: '¿Desea cerrar sessión?',
                    text: "¡Si quieres continuar pulsa el botón cancelar!",
                    type: 'warning',
                    animation: false,
                    customClass: {
                        popup: 'animated tada'
                    },
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Salir',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.value) {
                        session_service.destroySession();
                        $("body").removeClass("background-users");
                        this.startApp();
                    }
                });
                break;
        }

    },
    router:function (origin, element, component) { //Carga las vistas requeridas

        let url = `src/app/components/${origin}.html`; //Guarda la url de la vista a cargar
        let session = JSON.parse(localStorage.getItem("session")); //Sesión actual

        $.ajax({
            url: url,
            data: {},
            type: 'GET',
            dataType: 'html',
            success: function (response) {

                $(element).html(response);

                //Se agrega un popover para brindar indormación en el bótón de cerrar sesión
                $(document).find("#logout").popover({
                    trigger: 'hover'
                });

                if(component === "login"){
                    let toast_element = $(".toast");
                    $("body").addClass("background-login");
                    $("input#cedula").focus();
                    login(); //Método que contiene la lógica para el inicio de sesión

                    if(localStorage.getItem("students") === null
                        && localStorage.getItem("teachers") === null
                        && localStorage.getItem("subjects") === null){

                        toast_element.toast({autohide: false});
                        toast_element.toast("show");
                    }

                }else if (component === "students"){
                    if(session.type_user === "Estudiante"){
                        $("#title-jumbo").html(`¡Hola, ${session.name.toLowerCase()}!`);
                        $(".view-admin").remove();
                        drawTableOneStudentInscribe(); //Métooo que pinta la tabla de materias inscritas de un solo estudiante
                        generateNotesOneStudent(); //Método que carga las notas de un solo estudiante

                    }else{
                        $(".view-student").remove();
                        students_component.loadTableStudents(); //Carga la tabla de estudiantes
                        students_component.loadForm(); // Carga el formulario para crear estudiantes
                        drawTableInscribe(); //Método que pinta la tabla de materias inscritas
                        search_notes_subjects(); //Genera la búsqueda de notas
                    }

                    students_inscribe(); // Método que contiene la lógica par inscribir materias

                }else if(component === "teachers"){
                    if(session.type_user === "Docente"){
                        $("#title-jumbo").html(`¡Hola, ${session.name.toLowerCase()}!`);
                        drawTableAsignOneTeacher(); //Método que pinta la tabla de materias asignadas a un solo docente
                    }else{
                        teachers_component.loadTableTeachers(); //Carga la tabla de docentes
                        teachers_component.loadForm(); // Carga el formulario para crear docentes
                        drawTableAsign(); //Método que pinta la tabla de materias asignadas
                    }

                    teachers_asign(); // Método que contiene la lógica par asignar materias
                    load_subjects_and_teachers_for_notes(); //Método que carga el docente y la materia para poner notas
                    $("#btn_save_note").popover({ //notificación cuando se guarda una nota
                        trigger: 'focus'
                    });
                    reports();// Método que contiene la lógica para generar el reporte en excel
                }else if(component === "subjects"){
                    subject_component.loadTableSubjects();
                    subject_component.loadFormSubject();
                }
            }
        });
    },
    generateData: function () {
        if(localStorage.getItem("students") === null
            && localStorage.getItem("teachers") === null
            && localStorage.getItem("subjects") === null){

            localStorage.setItem("students", JSON.stringify(Students));
            localStorage.setItem("teachers", JSON.stringify(Teachers));
            localStorage.setItem("subjects", JSON.stringify(SubjectsData));
        }
    }
};
