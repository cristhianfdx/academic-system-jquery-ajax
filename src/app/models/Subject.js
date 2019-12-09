'use strict';


export let Subject = {
    _id: "",
    name: "",
    description: ""
};

export let SubjectsData = [
    {
        _id: generateID(),
        name: "BIOLOGIA",
        description: "CIENCIAS NATURALES"
    },
    {
        _id: generateID(),
        name: "CALCULO INTEGRAL",
        description: "MATEMATICAS"
    },
    {
        _id: generateID(),
        name: "PROGRAMACION FUNCIONAL",
        description: "CIENCIAS DE LA COMPUTACION"
    },
    {
        _id: generateID(),
        name: "INGLES",
        description: "LENGUA EXTRANJERA"
    },
    {
        _id: generateID(),
        name: "DISEÑO DE INTERFACES",
        description: "DISEÑO WEB"
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