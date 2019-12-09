import {Student} from '../models/Student.js';

let students = [];

export let students_service = {
    createStudent: function (student) {
        students = [];
        //Se asignan datos provenientes del modelo
        student.type_user = Student.type_user;

        if(localStorage.getItem("students") === null){
            students = [];
            students.push(student);
            localStorage.setItem("students", JSON.stringify(students));
        }else{
            students = JSON.parse(localStorage.getItem("students"));
            students.push(student);
            localStorage.setItem("students", JSON.stringify(students));
        }
    },
    getStudents: function(){

        if(localStorage.getItem("students") === null){
            students = [];
        }else{
            students = JSON.parse(localStorage.getItem("students"));
        }

        return students;
    },
    deleteStudent: function (id) {
        students = [];
        students = JSON.parse(localStorage.getItem("students"));

        for (let i = 0; i < students.length; i++){
            if(id === students[i]._id){
                students.splice(i, 1);
                localStorage.setItem("students", JSON.stringify(students));
            }
        }
    },
    getOneStudent: function(id){
        students = [];
        students = JSON.parse(localStorage.getItem("students"));
        let student = [];

        for (let i = 0; i < students.length; i++){
            if(id === students[i]._id){
                student = students[i];
            }
        }

        return student;
    },
    editStudent: function (id, data) {
        students = [];
        students = JSON.parse(localStorage.getItem("students"));

        for (let i = 0; i < students.length; i++){
            if(id === students[i]._id){
                students[i] = data;
                localStorage.setItem("students", JSON.stringify(students));
            }
        }
    }

};