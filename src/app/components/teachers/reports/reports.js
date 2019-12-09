'use strict';


import {teachers_service} from "../../../services/teachers_service.js";
import {register_subject_service} from "../../../services/register_subject_service.js";
import {students_service} from "../../../services/students_service.js";
import {app} from "../../../app.js";

export let reports = function () {

    //Cargar los ComboBox

    let combo_teachers =  $("#combo_report_teacher");
    let combo_subjects = $("#combo_subjects_report");
    let combo_options = $("#combo_option_report");
    let session = JSON.parse(localStorage.getItem("session"));

    if(session.type_user === "Docente"){
        let template = "<option value='default' selected>Seleccione un docente</option>";
        template += `
            <option key="${session._id}">${session.name + " " +session.lastname}</option>
        `;
        combo_teachers.html(template);
    }else{
        generateTeachersReportCombo();
    }

    generateComboOptions();

    let subjects_asigned = null;
    let teacher_selected = "";
    let teacher_id = "";

    combo_subjects.html("<option value='default' selected>Seleccione una materia</option>");

    combo_teachers.change(function () {

        teacher_selected = $(this).val();

        if($(this).val() !== "default"){

            teacher_id = $("option:selected", $(this)).attr("key");//Guarda el id del docente seleccionado

            subjects_asigned = register_subject_service.getAsignedSubjects(teacher_id);

            $(this).prop("disabled", true);

            //Carga del combobox con todas las materias asignadas al docente
            generateComboReportSubjects(subjects_asigned);

        }else {
            teacher_selected = "";
            teacher_id = "";
        }

    });


    let subject_selected = "";
    let subject_id = "";

    combo_subjects.change(function () {
        subject_selected = $(this).val();

        if($(this).val() !== "default"){
            subject_id = $("option:selected", $(this)).attr("key");//Guarda el id de la materia seleccionada;

            $(this).prop("disabled", true);
        }else{
            subject_selected = "";
            subject_id = "";

        }
    });

    let option_selected = "";
    let option = "";

    combo_options.change(function () {
        option_selected = $(this).val();

       if($(this).val()!== "default"){

           $(this).prop("disabled", true);

           if(option_selected === "Con notas"){
               option = "with"
           }else{
               option = "without";
           }

       }else{
           option_selected = "";
           option = "";
       }
    });


    $("#btn_filter_report").click(function () {

        if(subject_id !== "" && teacher_id !== "" && option !== ""){
            drawTableReport(option, teacher_selected, subject_selected, subject_id);
        }else{
            if(teacher_id === ""){
                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: '!Debes elegir un docente primero!'
                });

            }else if(subject_id === ""){
                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: '!Debes elegir una materia primero!'
                });

            }else if(option === ""){
                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: '!Debes elegir una opción primero!'
                });
            }
        }

    });

    $("#btn_finalize_report").click(function () {
        finalizeProcess();
    });

};

function generateTeachersReportCombo() {
    let template = "<option value='default' selected>Seleccione un docente</option>";
    let teachers = teachers_service.getTeachers();

    let combo =  $("#combo_report_teacher");

    teachers.forEach(function (teacher) {
        template += `
            <option key="${teacher._id}">${teacher.name + " " +teacher.lastname}</option>
        `;
    });

    combo.html(template);
}

function generateComboReportSubjects(subjects) {
    let template = "<option value='default' selected>Seleccione una materia</option>";

    let combo = $("#combo_subjects_report");

    subjects.forEach(function (subject) {
        template += `
            <option key="${subject._id}">${subject.name}</option>
        `;
    });

    combo.html(template);
}

function generateComboOptions() {
    let template = "<option value='default' selected>Seleccione una opcion</option>";

    let combo = $("#combo_option_report");

    template += `
        <option>Con notas</option>
        <option>Sin notas</option>
    `;

    combo.html(template);
}

function finalizeProcess() {
    app.petitionRoute($("#btn_finalize_report"));
}

//Gestión del reporte

function drawTableReport(option, teacher, subject_name, subject_id){
    let template = `
            <h3 class="my-4" id="name_list">Listado de estudiantes</h3>

            <ul class="list-group">
                <li class="list-group-item">
                    <span class="font-weight-bold">Nombre del docente :</span> <span class="ml-2" id="name_teacher_report">${teacher}</span>
                </li>
                <li class="list-group-item">
                    <span class="font-weight-bold">Nombre de la materia :</span> <span class="ml-2" id="name_subject_report">
                        ${subject_name}
                    </span>
                </li>
            </ul>
  `;

    if(option === "with"){

        template += `       

            <table class="table table-hover my-4" id="table_report">
                <thead class="bg-primary text-light">
                <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">Apellido</th>
                    <th scope="col">Número de Cédula</th>
                    <th scope="col">Nota 1</th>
                    <th scope="col">Nota 2</th>
                    <th scope="col">Nota definitiva</th>
                </tr>
                </thead>
                <tbody id="data_students_report"></tbody>
            </table>            
        `;

    }else if(option === "without"){
        template += `       

            <table class="table table-hover my-4" id="table_report">
                <thead class="bg-primary text-light">
                <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">Apellido</th>
                    <th scope="col">Número de Cédula</th>                    
                </tr>
                </thead>
                <tbody id="data_students_report"></tbody>
            </table>            
      `;
    }

    template += `
        <ul class="list-group">
            <li class="list-group-item">Firma del docente :____________________________________</li>
        </ul>        
  `;

    $("#list_report").html(template);
    generateDataReport(subject_id, option);
    $("#space_btn_excel").html(`
            <button class="btn btn-success" id="btn_excel">
                Generar archivo Excel
                <i class="btn-icons fas fa-file-excel ml-2"></i>
            </button>
    `);

    $("#btn_excel").click(function () {
        generateExcel();
    });
}

//Lógica para generar el archivo Excel

function generateDataReport(subject_id, option) {
    let template = "";
    let students_for_teacher_subject = register_subject_service.getStudentsForSubjectAndTeacher(subject_id);
    let all_students = students_service.getStudents();

    all_students.forEach(function (student) {
        students_for_teacher_subject.forEach(function (student_inscribe) {
            if(student._id === student_inscribe.student_id){
                if(option === "with"){
                    template += `
                        <tr>
                            <td>${student.name}</td>
                            <td>${student.lastname}</td>
                            <td>${student.cedula}</td>                        
                            <td>${student_inscribe.note1 !== "" ? student_inscribe.note1 : "0"}</td>
                            <td>${student_inscribe.note2 !== "" ? student_inscribe.note2 : "0"}</td>
                            <td>${student_inscribe.media !== "" ? student_inscribe.media : "0"}</td>
                        </tr>               
                    `;

                }else{

                    template += `
                        <tr>
                            <td>${student.name}</td>
                            <td>${student.lastname}</td>
                            <td>${student.cedula}</td>                          
                        </tr>               
                    `;

                }
            }
        })
    });

    $("#data_students_report").html(template);

}

function excelData () {

    let data = [];

    data.push(
        [$("#name_list").text()],
        ["Nombre del docente :", $("#name_teacher_report").text()],
        ["Nombre de la materia :", $("#name_subject_report").text()]
    );

    data.push([""],[""]);

    convertTableToArray().forEach(function (table) {
        data.push(table);
    });

    data.push([""],[""]);

    data.push(["Firma del docente : ", "__________________________________________"]);

    return data;
};

function convertTableToArray() {
    let tableArray = [];

    $("table#table_report tr").each(function () {
        let row = [];
        let tableData = $(this).find('th, td');

        if(tableData.length > 0){
            tableData.each(function () {
                row.push($(this).text());
            });
            tableArray.push(row);
        }
    });

    return tableArray;

}

function generateExcel() {
    let date = new Date();//Fecha


    let wb = XLSX.utils.book_new(); //Se crea un nuevo libro
    wb.Props = {// Propiedades del libro
        Title: "Listado de estudiantes",
        Author: "Cristhian Forero",
        CreatedDate: date.getDay() + "/" + (date.getMonth()+1) + "/" + date.getFullYear()
    };

    wb.SheetNames.push("Listado Excel");

    wb.Sheets["Listado Excel"] = XLSX.utils.aoa_to_sheet(excelData());

    let wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});

    saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'Listado.xlsx');


}

function s2ab(s) {
    let buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    let view = new Uint8Array(buf);  //create uint8array as viewer
    for (let i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;
}
