'use strict';

export let form_students = function (editable) {

    let title = "";
    let text_btn = "";
    let style = "";
    let prop = "";

    if( editable){
        title = "Editar estudiante";
        text_btn = "Actualizar";
        style = "display : block";
        prop = "disabled";

    }else{
        title = "Crear nuevo estudiante";
        text_btn = "Registrar";
        style = "display: none";
        prop = "";
    }

    return `
        <div class="modal fade" id="formStudentModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" 
            aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title text-center" id="exampleModalLongTitle">${title}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="form_students" element="students">

                            <div class="form-group">
                                <label for="name_student">Nombre:</label>
                                <input type="text" id="name_student"  name="name_student" class="form-control"
                                    placeholder="Ingrese su nombre">
                            </div>

                            <div class="form-group">
                                <label for="lastname_student">Apellido:</label>
                                <input type="text" id="lastname_student"  name="lastname_student" class="form-control"
                                    placeholder="Ingrese su apellido">
                            </div>

                            <div class="form-group">
                                <label for="cedula_student">Cédula:</label>
                                <input type="text" id="cedula_student"  name="cedula_student"  class="form-control" 
                                    placeholder="Ingrese su cédula" ${prop}>
                            </div>
                        
                            <div class="form-check mb-3" style="${style}">
                                <input class="form-check-input" type="checkbox" id="check_cedula">
                                <label class="form-check-label" for="check_cedula">
                                    Editar cédula
                                </label>
                            </div> 

                            <div class="form-group">
                                <label for="password">Contraseña:</label>
                                <input type="password" id="password"  name="password" class="form-control" 
                                    placeholder="Ingrese una contraseña">                            
                            </div>                                              

                            <div class="form-group">
                                <label for="confirm_password">Confirmar contraseña:</label>
                                <input type="password" id="confirm_password" name="confirm_password" class="form-control"
                                    placeholder="Confirme su contraseña">
                            </div>
                            <button class="btn btn-primary btn-block" id="btn_form_student" type="submit">
                                ${text_btn}
                            </button>                        
                        </form>
                    </div>                
                </div>
            </div>
        </div>
    `;
};


















