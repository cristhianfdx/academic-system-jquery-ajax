'use strict';


export let Admin ={
    _id: generateID(),
    name: "Administrador",
    cedula: "12345678",
    password: btoa("admin"),
    type_user: "Administrador"
};

export let Students = [
    {
        _id: generateID(),
        name: "LUIS CARLOS",
        lastname: "LOPEZ",
        cedula: "11111111",
        password: btoa("1234"),
        type_user: "Estudiante"
    },
    {
        _id: generateID(),
        name: "PEDRO ANTONIO",
        lastname: "FERNANDEZ",
        cedula: "22222222",
        password: btoa("1234"),
        type_user: "Estudiante"
    },
    {
        _id: generateID(),
        name: "DANIELA",
        lastname: "MARTINEZ",
        cedula: "33333333",
        password: btoa("1234"),
        type_user: "Estudiante"
    }
];

export let Teachers = [
    {
        _id: generateID(),
        name: "ANDREA",
        lastname: "ORTIZ",
        cedula: "44444444",
        password: btoa("1234"),
        type_user: "Docente"
    },
    {
        _id: generateID(),
        name: "CAMILO ANDRES",
        lastname: "HURTADO",
        cedula: "55555555",
        password: btoa("1234"),
        type_user: "Docente"
    },
    {
        _id: generateID(),
        name: "LUISA",
        lastname: "SUAREZ",
        cedula: "66666666",
        password: btoa("1234"),
        type_user: "Docente"
    }
];

function generateID() {
    let d = new Date().getTime();
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}


