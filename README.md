# Proyecto Sistema Académico

En este proyecto se busca tener una aplicación web que permita gestionar un sistema académico de modo básico, en cual se podrá asignar materias a los docentes, inscripción de materias para los estudiantes, registro y lectura de notas, etc.

## Requerimientos

### Principales

- Existen los roles de usuario: Administrador, Estudiante y Docente.
- El sistema debe contar con manejo de sesiones.
- La contraseña de cada usuario debe ser guardada con encriptación para proteger los datos.
- El sistema cuenta con un botón que genera datos aleatorios para pruebas.
- No pueden existir usuarios con cédulas duplicadas.
- El Administrador puede visualizar todos los estudiantes, docentes y materias.
- No se puede ver una nota hasta que esta se encuentre registrada por el docente.
- El sistema permite eliminar un estudiante siempre y cuando este no tenga inscrita una materia.
- El sistema permite eliminar un docente siempre y cuando este no tenga asignada una materia.
- El sistema permite eliminar una materia siempre y cuando esta no se encuentre asignada a un docente y/o inscrita a un         estudiante.
- El sistema permite generar un listado de estudiantes con la opción de visualizar con notas o sin notas.
- El listado puede ser descargado de la aplicación en formato .xls (Excel).
- El Administrador crea los usuarios y las materias.
- El Administrador asigna las materias a cada docente.
- Si una materia ha sido asignada a un docente, esta no podrá ser asignada de nuevo a otro docente.

### Estudiante

- El estudiante puede inscribir materias y estas no se pueden repetir.
- El estudiante solo puede ver las materias que tiene inscritas.
- El estudiante solo puede ver las notas que le han sido registradas según la materia inscrita.

### Docente

- El docente no puede asignarse las materias a sí mismo, esto lo debe hacer el administrador del sistema.
- El docente solo puede ver las materias que tiene asignadas.
- El docente no puede tener una materia repetida.
- El docente puede ver el listado de estudiantes según las materias que tenga asignadas.
- El docente puede descargar el listado con o sin notas en formato .xls (Excel).

### Materias

- No puede existir una materia repetida.
- Se puede visualizar el listado de materias.

## Tecnologías utilizadas

La aplicación se encuentra desarrollada utilizando las siguientes tecnologías:

- HTML5 y CSS3.
- Boostrap 4 como librería de CSS para la interfaz gráfica y manejo del responsive design.
- JQuery librería de Javascript para simplificar el manejo del DOM.
- Se usa la tecnología AJAX con el fin de ofrecer una Single Page Application (Aplicación de una sola página) la cual permite
  interactuar con la aplicación sin necesidad de recargar la página, para este fin se utiliza el método $.ajax de JQuery,       renderizando netamente HTML en la interfaz gráfica.
- Se utiliza JQuery Validate en la validación de campos de formularios.
- Los datos son guardados mediante el uso de la API Storage de HTML5, utlizando localStorage.
- La lógica de aplicación se encuentra desarrollada 100% con Javascript.
- Se aplican los principios de NoSQL para generar manualmente una especie de motor de base de datos, para ser almacenados en   localStorage.
- El proyecto se encuentra ordenado en carpetas siguiendo el patrón MVC.

## Modelo de datos utlizado

Administrador =
{
    _id,
    name,
    cedula,
    password,
    type_user: "Administrador"
}

Estudiante =
{
    _id,
    name,
    cedula,
    password,
    type_user: "Estudiante"
}

Docente =
{
    _id,
    name,
    cedula,
    password,
    type_user: "Docente"
}

Materia =
{
    _id,
    name,
    description
}

MateriaRegistrada = {
    _id,
    date,
    teacher_id,
    register: 
    [
        { subject_id }
    ],
    state: false
}

MateriaInscrita = {
    _id,
    student_id,
    subjects: [
        {
            subject_id,
            notes: {
                note1,
                note2,
                media
            }
        }
    ],
    state: false
};



## Recomendaciones

- Para la prueba de la aplicación de modo local se utilizo un servidor con Apache, para este caso se utilizó XAMPP.
 https://www.apachefriends.org/es/index.html
- Si desea visualizar la aplicación en un ambiente productivo puede hacerlo en la siguiente dirección:  https://cristhianfdx.github.io/academic-system-jquery-ajax/

## Screenshots de la aplicación

### Login

![Screenshot from 2019-06-05 15-24-43](https://user-images.githubusercontent.com/40704923/58989506-ac36b500-87a9-11e9-97f5-9ba758f9e521.png)

### Datos de acceso

![Screenshot from 2019-06-05 15-27-38](https://user-images.githubusercontent.com/40704923/58989773-2e26de00-87aa-11e9-9fd4-610423b82748.png)

### Home Administrador

![Screenshot from 2019-06-05 15-25-29](https://user-images.githubusercontent.com/40704923/58989822-43037180-87aa-11e9-8b1a-ca9d7628e98e.png)

### Generando listado de estudiantes

![Screenshot from 2019-06-05 15-26-59](https://user-images.githubusercontent.com/40704923/58989874-5a425f00-87aa-11e9-976c-0266759cc527.png)
 
 

