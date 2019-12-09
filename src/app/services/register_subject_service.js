
import {subjects_service} from './subjects_service.js';
import {app} from '../app.js';
import {inscribed_student_service} from "./inscribed_student_service.js";
import {teachers_service} from "./teachers_service.js";

let register = [];

export let register_subject_service = {
    subjectRegister: function (data) {//Permite realizar un registro a un docente
        register = [];

        if(localStorage.getItem("register_subjects") === null){
            register = [];
            register.push(data);
            localStorage.setItem("register_subjects", JSON.stringify(register));
        }else{
            register = JSON.parse(localStorage.getItem("register_subjects"));
            register.push(data);
            localStorage.setItem("register_subjects", JSON.stringify(register));
        }

    },
    getRegister: function () {//Trae todos los docentes con materias registradas
        if(localStorage.getItem("register_subjects") === null){
            register = [];
        }else{
            register = JSON.parse(localStorage.getItem("register_subjects"));
        }

        return  register;
    },
    getOneRegistry:function(id){//Metodo que trae un registro por _id de registro
        register = [];
        register = JSON.parse(localStorage.getItem("register_subjects"));
        let registry = [];

        if(register === null){
            register = [];
        }else{
            for (let i = 0; i < register.length; i++){
                if(id === register[i]._id){
                    registry = register[i];
                }
            }
        }

        return registry;
    },
    //Obtiene los registros asociados a una materia especifica
    getAsignForSubject: function (subject_id) {
        let register = this.getRegister();
        let result = [];
        let x = 0;

        for(let i = 0; i < register.length; i++){
            for(let j = 0; j < register[i].register.length; j++){
                if(register[i].register[j].subject_id === subject_id){
                    result[x] = register[i];
                    x++;
                }
            }
        }

        return result;
    },
    getOneTeacherAsigned: function(id_teacher){//Método que trae un docente registrado por teacher_id
        let register= JSON.parse(localStorage.getItem("register_subjects"));
        let one_registry = [];

        if(register === null){
            one_registry = [];
        }else{
            register.forEach(function (registry) {
               if(registry.teacher_id === id_teacher){
                   one_registry.push(registry);
               }
            });
        }

    return one_registry;
    },
    //Consulta que trae las materias asignadas a un docente uniendo register_subjects y materias
    getAsignedSubjects: function (id_teacher) {
        register = JSON.parse(localStorage.getItem("register_subjects"));
        let all_subjects = subjects_service.getSubjects();
        let register_subjects = [];

        if(register === null){
            register = [];
            register_subjects = [];
        }else{

            register.forEach(function (registry) {
                if(registry.teacher_id === id_teacher){
                    registry.register.forEach(function (asg_register) {
                       all_subjects.forEach(function (subject) {
                          if(asg_register.subject_id === subject._id){
                              register_subjects.push(subject);
                          }
                       });
                    });
                }
            });
        }

        return register_subjects;
    },
    //Verifica si una materia ya fue asignada a algun docente
    verifyAsignedSubject: function(subject_id){
        register = [];
        register = this.getRegister();
        let exists = false;

        register.forEach(function (registry) {
           registry.register.forEach(function (subjects) {
              if(subjects.subject_id === subject_id){
                  exists = true;
              }
           });
        });

        return exists;
    },
    //Trae unicamente las materias no asignadas al docente, recibe parametro un elemento getAsignedSubjects
    getNoAsignedSubjects: function (asigned_subjects) {
        let all_subjects = subjects_service.getSubjects();
        let subjects_disponible = [];

        //Se agregan unicamente las materias que se encuentran disponibles y no fueron asignadas a otro docente
        for(let i = 0; i < all_subjects.length; i++ ){
            if(!this.verifyAsignedSubject(all_subjects[i]._id)){
                subjects_disponible.push(all_subjects[i]);
            }
        }

        //Se obtienen las materias que se pueden asignar al docente
       for(let j = 0; j < asigned_subjects.length; j++){
           for(let k = 0; k < subjects_disponible.length; k++ ){
               if(asigned_subjects[j]._id === subjects_disponible[k]._id){
                   subjects_disponible.splice(k, 1);
               }
           }
       }
        //Se obtienen las materias que no coincidieron con las ya asignadas
        return subjects_disponible;
    },
    //inserta materias, recibe como parametro el id del docente
    insertSubjects: function(id_teacher, new_subjects){
        let one_teacher= this.getOneTeacherAsigned(id_teacher);
        one_teacher[0].register.push(new_subjects);
        return one_teacher[0];
    },
    //Edita un registro
    editRegister:function (id, data) {
        register = [];
        register = JSON.parse(localStorage.getItem("register_subjects"));

        for (let i = 0; i < register.length; i++){
            if(id === register[i]._id){
                register[i] = data;
                localStorage.setItem("register_subjects", JSON.stringify(register));
            }
        }
    },
    deleteSubjectsAsign: function(id_teacher, subject_id){
        let one_teacher = this.getOneTeacherAsigned(id_teacher);
        let subjects = one_teacher[0].register;

        for(let i = 0; i < subjects.length; i++){
            if(subjects[i].subject_id === subject_id){
                subjects.splice(i, 1);
            }
        }

        if(subjects.length > 0){
            this.editRegister(one_teacher[0]._id, one_teacher[0]);
        }else{
            Swal.fire({
                title: '¿Desea borrar?',
                text: "Solo le queda un materia asignada si esta es borrada se eliminara el registro del docente!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, borrar!',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.value) {
                    this.deleteAsign(one_teacher[0]._id);
                    app.petitionRoute($("#btn_asign_subjects"));
                }
            });
        }
    },
    deleteAsign: function (id) {
        register = [];
        register = JSON.parse(localStorage.getItem("register_subjects"));

        for (let i = 0; i < register.length; i++){
            if(id === register[i]._id){
                register.splice(i, 1);
                localStorage.setItem("register_subjects", JSON.stringify(register));
            }
        }
    },
    //Consulta para traer los estudiantes asociados a una materia y un docente
    getStudentsForSubjectAndTeacher: function (id_subject) {
        let students_inscribe = inscribed_student_service.getInscribedForSubject(id_subject);
        let result = []; //Resultado d ela consulta

        for (let i = 0; i < students_inscribe.length; i++){
            for(let j = 0 ; j < students_inscribe[i].subjects.length; j++){
                if(students_inscribe[i].subjects[j].subject_id === id_subject){
                    result.push({
                        inscribe_id : students_inscribe[i]._id,
                        student_id : students_inscribe[i].student_id,
                        subject_id: students_inscribe[i].subjects[j].subject_id,
                        note1: students_inscribe[i].subjects[j].notes.note1,
                        note2: students_inscribe[i].subjects[j].notes.note2,
                        media: students_inscribe[i].subjects[j].notes.media

                    });
                }
            }
        }

        return result; //Resultado de la consulta
    },
    getTeacherForSubject: function (subject_id) {
        let registry = this.getAsignForSubject(subject_id);

        if(registry.length !== 0){
            return  teachers_service.getOneTeacher(registry[0].teacher_id);
        }else{
            return null;
        }

    }
};