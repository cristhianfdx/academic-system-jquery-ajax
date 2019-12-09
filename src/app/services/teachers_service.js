import {Teacher} from '../models/Teacher.js';

let teachers = [];

export let teachers_service = {
    createTeacher: function (teacher) {
        teachers = [];
        teachers.type_user = Teacher.type_user;

        if(localStorage.getItem("teachers") === null){
            teachers = [];
            teachers.push(teacher);
            localStorage.setItem("teachers", JSON.stringify(teachers));
        }else{
            teachers= JSON.parse(localStorage.getItem("teachers"));
            teachers.push(teacher);
            localStorage.setItem("teachers", JSON.stringify(teachers));
        }
    },
    getTeachers: function(){

        if(localStorage.getItem("teachers") === null){
            teachers = [];
        }else{
            teachers = JSON.parse(localStorage.getItem("teachers"));
        }

        return teachers;
    },
    deleteTeacher: function (id) {
        teachers = [];
        teachers = JSON.parse(localStorage.getItem("teachers"));

        for (let i = 0; i < teachers.length; i++){
            if(id === teachers[i]._id){
                teachers.splice(i, 1);
                localStorage.setItem("teachers", JSON.stringify(teachers));
            }
        }
    },
    getOneTeacher: function(id){
        teachers = [];
        teachers = JSON.parse(localStorage.getItem("teachers"));
        let teacher = [];

        for (let i = 0; i < teachers.length; i++){
            if(id === teachers[i]._id){
                teacher = teachers[i];
            }
        }

        return teacher;
    },
    editTeacher: function (id, data) {
        teachers = [];
        teachers = JSON.parse(localStorage.getItem("teachers"));

        for (let i = 0; i < teachers.length; i++){
            if(id === teachers[i]._id){
                teachers[i] = data;
                localStorage.setItem("teachers", JSON.stringify(teachers));
            }
        }
    }
};