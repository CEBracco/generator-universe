### Introducción
Este generador pretende facilitar el desarrollo de nuevas funcionalidades en Universe, la idea es "Automatizar" al estilo de ciertos 
frameworks como Symfony, Angular o RoR, ciertas tareas que realizamos en las cuales que ya estamos interiorizados (crear nuevas entidades del modelo, nuevos parametros, migraciones, etc.), para enfocarnos 
en cuestiones mas complejas y especificas de la nueva función a implementar. 
El mismo provee un set de comandos que son llamados desde consola.

### Instalación

Para usar el generador es necesario:
- Node.js ([Windows](https://nodejs.org) y [Linux](https://github.com/creationix/nvm), usando nvm)
- npm (incluido en Node.js).
- [Yeoman](http://yeoman.io)

Una vez instalado, clonar el repo en algun lugar del filesystem y posicionados desde la consola en la raiz del repo 
ejecutar `npm link` para que se descarguen las dependencias del proyecto.

### Uso
- Los scripts de los comandos siempre controlan que se ejecute en un directorio que contenga los proyectos "universe-core" y "universe-web".
- Una vez ejecutado el generador va a ir pidiendo los datos al estilo "Asistente". 
- Luego de correr cada comando actualizar las carpetas de cada proyecto en eclipse para que sincronize los nuevos archivos en el workspace.

##### Crear un parámetro
```shell
yo universe:generate-parameter
```

##### Crear una migration
```shell
yo universe:generate-migration
```

##### Crear una entidad
```shell
yo universe:generate-entity
```

##### Crear un DAO
```shell
yo universe:generate-dao
```

#### CRUD
Para generar una nueva entidad con su correspondientes ABM's tanto en el backend (universe-core) como en el frontend (universe-web)
se debera ejecutar el comando `yo universe:generate-crud`, este generador esta modularizado en varios "subgeneradores", los cuales tambien 
pueden ser llamados de manera individual.

##### CRUD: Creación de FX's
```shell
yo universe:generate-crud-fx
```

##### CRUD: Creación del Controller
```shell
yo universe:generate-crud-controller
```

##### CRUD: Creación de View
```shell
yo universe:generate-web-crud
```

##### CRUD: Creación Backend (Entity + DAO + FX's + Controller)
```shell
yo universe:generate-core-crud
```

##### CRUD: Creación Full Stack (Entity + DAO + FX's + Controller + View)
```shell
yo universe:generate-crud
```
