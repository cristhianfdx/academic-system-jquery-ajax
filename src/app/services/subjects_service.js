'use strict';

export let subjects_service = {
    createSubject: function (subject) {
        let subjects = [];

        if(localStorage.getItem("subjects") === null){
            subjects = [];
            subjects.push(subject);
            localStorage.setItem("subjects", JSON.stringify(subjects));
        }else{
            subjects = JSON.parse(localStorage.getItem("subjects"));
            subjects.push(subject);
            localStorage.setItem("subjects", JSON.stringify(subjects));
        }
    },
    getSubjects: function(){

        let subjects = [];

        if(localStorage.getItem("subjects") === null){
            subjects = [];
        }else{
            subjects = JSON.parse(localStorage.getItem("subjects"));
        }

        return subjects;
    },
    deleteSubject: function (id) {
        let subjects = JSON.parse(localStorage.getItem("subjects"));

        for (let i = 0; i < subjects.length; i++){
            if(id === subjects[i]._id){
                subjects.splice(i, 1);
                localStorage.setItem("subjects", JSON.stringify(subjects));
            }
        }
    },
    getOneSubject: function(id){
        let subjects = JSON.parse(localStorage.getItem("subjects"));
        let subject = [];

        for (let i = 0; i < subjects.length; i++){
            if(id === subjects[i]._id){
                subject = subjects[i];
            }
        }

        return subject;
    },
    editSubject: function (id, data) {
        let subjects = JSON.parse(localStorage.getItem("subjects"));

        for (let i = 0; i < subjects.length; i++){
            if(id === subjects[i]._id){
                subjects[i] = data;
                localStorage.setItem("subjects", JSON.stringify(subjects));
            }
        }
    },
    getSubjectForName: function (name) {
        //Se eliminan los acentos del nombre
        let name_normalize = name.normalize('NFD').replace(/[\u0300-\u036f]/g,"");

        let subjects = JSON.parse(localStorage.getItem("subjects"));
        let subject = [];

        for(let i = 0; i < subjects.length; i++){
            if(name_normalize.toUpperCase() === subjects[i].name){
                subject.push(subjects);
            }
        }

        return subject;
    }

};