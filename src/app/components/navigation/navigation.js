'use strict';

export function navigation(role){
    let template = "";

    if(role === "admin"){
        template = `
            <li class="nav-item active">
                <a class="nav-link navigation" href="javascript:void(0)" element="home" id="home">
                    Inicio 
                    <span class="sr-only">(current)</span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link navigation" href="javascript:void(0)" element="students">Estudiantes</a>
            </li>
            <li class="nav-item">
                <a class="nav-link navigation" href="javascript:void(0)" element="teachers">Docentes</a>
            </li>
            <li class="nav-item">
                <a class="nav-link navigation" href="javascript:void(0)" element="subjects">Materias</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="https://cristhianforerod.github.io/website-ajax/" target="_blank">Planetas</a>
            </li>
        `;
    }else{
        template = `
            <li class="nav-item">
                <a class="nav-link" href="https://cristhianforerod.github.io/website-ajax/" target="_blank">Planetas</a>
            </li>
        `;
    }

    return`
    <nav class="navbar navbar-expand-lg navbar-dark" id="nav">
        <span class="navbar-brand">Sistema acádemico</span>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" 
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto"> ${template} </ul>
            <ul class="nav d-flex justify-content-end justify-content-sm-start">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" role="button" 
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" 
                        id="user_account" href="javascript:void(0)">
                        <span class="icons">
                            <i class="fas fa-user-circle"></i>
                        </span>
                    </a>
                    <div class="dropdown-menu" aria-labelledby="user_account">
                        <span class="dropdown-item user-icon">
                            <i class="fas fa-user"></i>
                        </span>
                        <span class="dropdown-item" id="user-name"></span>
                        <div class="dropdown-divider"></div> 
                        <span class="dropdown-item" id="user-role"></span>
                        <div class="dropdown-divider"></div> 
                        <span class="dropdown-item" id="user-cedula"></span>                                               
                    </div>
                </li>
                <li class="nav-item">
                    <a class="nav-link navigation" element="logout" href="javascript:void(0)"
                        role="button" data-toggle="popover" data-trigger="hover"
                        data-content="Cerrar sesión" data-placement="bottom" id="logout">
                            <span class="icons logout">
                                <i class="fas fa-sign-in-alt"></i>
                            </span>
                    </a>
                </li>
            </ul>            
        </div>
    </nav>
`;
}

