'use strict';


export let form_subject = function(editable) {

    let title = "";
    let text_btn = "";
    let prop = "";
    let style = "";

    if( editable){
        title = "Editar materia";
        text_btn = "Actualizar";
        prop = "disabled";
        style = "display : block"

    }else{
        title = "Crear nueva materia";
        text_btn = "Registrar";
        prop = "";
        style = "display : none"
    }

    return  `
    <div class="modal fade" id="formSubjectModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-center" id="exampleModalLongTitle">${title}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="form_subject" element="subjects">

                        <div class="form-group">
                            <label for="name_subject">Nombre:</label>
                            <input type="text" id="name_subject"  name="name_subject" class="form-control"
                                placeholder="Ingrese su nombre" ${prop}>
                        </div>
                        
                        <div class="form-check mb-3" style="${style}">
                            <input class="form-check-input" type="checkbox" id="check_name">
                            <label class="form-check-label" for="check_name">
                                Editar nombre
                            </label>
                         </div> 

                        <div class="form-group">
                            <label for="description">Descripción:</label>
                            <textarea name="description" id="description" rows="3" class="form-control" style="resize: none" 
                                placeholder="Ingrese una descripción"></textarea>                    
                        </div>               

                        <button class="btn btn-primary btn-block navigation" id="btn_form_subject" type="submit">${text_btn}</button>
                    </form>
                </div>                
            </div>
        </div>
    </div>
`;
};












