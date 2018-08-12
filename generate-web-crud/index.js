var Generator = require('yeoman-generator');

module.exports = class extends Generator {

  init(){
    if(this.options.version){
      this.version = this.options.version;
      this.entityData = this.options.entityData;
      this._writing();
    } else {
      this._validateFolder();
      this._promptingEntityName();
    }
  }

  _validateFolder(){
    var fs = require('fs');
    if (!fs.existsSync('universe-core') || !fs.existsSync('universe-web')) {
        this.log.error("You must run this generator on a root folder that contains universe-core and universe-web projects!");
        process.exit(1);
    }
  }

  _promptingEntityName(){
    return this.prompt([{
      type    : 'input',
      name    : 'entityName',
      message : 'Your new entity name(in UpperCamelCase, example: LicensePlate)',
    }]).then((data) => {
      this.entityData = data;
      this.entityData.properties = [];
      this.log('');
      this._promptingProperties();
    });
  }

  _promptingProperties() {
    return this.prompt([{
      type    : 'input',
      name    : 'name',
      message : 'Type property name equals to entity value object(VO), leave this field blank to finish input',
      default : ''
    }, {
      type    : 'input',
      name    : 'clazz',
      message : 'Type the Java class of the property (String, Integer, Boolean)',
      default : 'String'
    }]).then((property) => {
      this.log('');
      if(property.name != ''){
        this.entityData.properties.push(property);
        this._promptingProperties();
      } else {
        this._promptingMenuName();
      }
    });
  }
  
  _promptingMenuName() {
    return this.prompt([{
      type    : 'input',
      name    : 'menuName',
      message : 'The menu name where Crud functions are grouped (ex: configuration, admin, licensePlate)',
      default : 'configuration'
    }]).then((data) => {
      this.entityData.menuName = data.menuName;
      this.log('');
      this._writing();
    });
  }

  _writing(){
    this.entityData.lowerCamelCase = function(string){
      return string.replace(/^./, function(str){ return str.toLowerCase(); });
    };
    this._generateWebCrudCtrl(this.entityData);
    this._generateWebCrudView(this.entityData)
    this._generateWebCrudService(this.entityData);
    this._addToRoutes(this.entityData);
  }

  _generateWebCrudCtrl(renderData) {
    this.fs.copyTpl(
      this.templatePath('app/js/controllers/CrudCtrl.js'),
      this.destinationPath('universe-web/WebContent/app/js/controllers/'+ renderData.entityName.toLowerCase() + '/' + renderData.entityName +'Ctrl.js'),
      renderData
    );
  }

  _generateWebCrudView(renderData) {
    renderData.getInputType = function(javaType){
      var numericTypes = ['Integer','Long','Double','Float','int','float','double','short'];
      var booleanTypes = ['bool','Boolean'];
      
      if (numericTypes.indexOf(javaType) > -1) {
        return 'number';
      } else {
        if (booleanTypes.indexOf(javaType) > -1) {
          return 'checkbox';
        }
        return 'text';
      }
    };
    renderData.isValidType = function(javaType){
      var typesAccepted = ['Integer','Long','Double','Float','int','float','double','short','bool','Boolean','String'];
      return typesAccepted.indexOf(javaType) > -1;
    };
    
    this.fs.copyTpl(
      this.templatePath('app/views/crud.html'),
      this.destinationPath('universe-web/WebContent/app/views/'+ renderData.entityName.toLowerCase() + '/' + renderData.entityName.replace(/^./, function(str){ return str.toLowerCase(); }) +'.html'),
      renderData
    );
  }

  _generateWebCrudService(renderData) {
    this.fs.copyTpl(
      this.templatePath('app/js/services/CrudService.js'),
      this.destinationPath('universe-web/WebContent/app/js/services/'+ renderData.entityName.toLowerCase() + '/' + renderData.entityName +'Service.js'),
      renderData
    );
  }

  _addToRoutes(renderData){
    var entityName = renderData.entityName
    var routesPath = 'universe-web/WebContent/app/js/routes/routes.js'
    var content = this.fs.read(routesPath);
    var matchingLine = "{path: '/404', template: prefix + 'app/views/404.html', controller: 'controllers/NoPageCtrl', controllerName: 'NoPageCtrl'}";

    content = content.replace(
      new RegExp(matchingLine.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')),
      `{path: '/${renderData.menuName}/${renderData.entityName.replace(/^./, function(str){ return str.toLowerCase(); })}', template: prefix + 'app/views/${renderData.entityName.toLowerCase()}/${renderData.entityName.replace(/^./, function(str){ return str.toLowerCase(); })}.html', controller: 'controllers/${renderData.entityName.toLowerCase()}/${renderData.entityName}Ctrl', controllerName: '${renderData.entityName}Ctrl'},`
      + "\n\n		    "
      + matchingLine
    );
    this.fs.write(routesPath,content);
  }
};
