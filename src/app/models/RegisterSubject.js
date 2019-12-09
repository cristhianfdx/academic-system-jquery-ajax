'use strict';

let actual_date = new Date();

export let RegisterSubject = {
    _id: "",
    date: actual_date.getDate() + "/" + (actual_date.getMonth()+1) + "/" + actual_date.getFullYear(),
    teacher_id :"",
    register: [
        {
            subject_id: "",

        }
    ],
    state: false
};