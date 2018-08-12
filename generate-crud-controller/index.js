var Generator = require('yeoman-generator');
const cheerio = require('cheerio');

module.exports = class extends Generator {

  init(){
    if(this.options.version){
      this.version = this.options.version;
      this.entityData = this.options.entityData;
      this._writing();
    } else {
      this._validateFolder();
      this._promptingVersion();
    }
  }

  _validateFolder(){
    var fs = require('fs');
    if (!fs.existsSync('universe-core') || !fs.existsSync('universe-web')) {
        this.log.error("You must run this generator on a root folder that contains universe-core and universe-web projects!");
        process.exit(1);
    }
  }

  _promptingVersion() {
    return this.prompt([{
      type    : 'input',
      name    : 'version',
      message : 'Enter Universe Version',
    }]).then((data) => {
      this.version = data.version;
      this._promptingEntityName();
    });
  }

  _promptingEntityName(){
    return this.prompt([{
      type    : 'input',
      name    : 'entityName',
      message : 'Your new entity name(in UpperCamelCase, example: LicensePlate)',
    }]).then((data) => {
      this.entityData = data;
      this.entityData.properties = [];
      this._promptingMenuName();
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
    this._generateCrudCtrl(this.entityData);
    this._addToCtrlServletContextXml(this.entityData);
    this._generateFunctionsMigration(this.entityData);
  }

  _generateCrudCtrl(renderData) {
    this.fs.copyTpl(
      this.templatePath('main/controller/CrudCtrl.java'),
      this.destinationPath('universe-core/src/java/main/controller/org/universe/core/controller/'+ renderData.entityName.toLowerCase() + '/' + renderData.entityName +'Ctrl.java'),
      renderData
    );
  }

  _addToCtrlServletContextXml(renderData) {
    var entityName = renderData.entityName
    var ctrlServletContextPath = 'universe-core/src/java/resources/spring/ctrlServletContext.xml'
    var content = this.fs.read(ctrlServletContextPath);
    var $ = cheerio.load(content, { xmlMode: true });
    $('beans>beans').append(`    <!-- ${entityName} Ctrl -->
    <bean id="${entityName.replace(/^./, function(str){ return str.toLowerCase(); })}Ctrl" class="org.universe.core.controller.${entityName.toLowerCase()}.${entityName}Ctrl" scope="request"/>
  \n`);

    this.fs.write(ctrlServletContextPath,$.xml());
  }

  _generateFunctionsMigration(renderData) {
    var baseDate = new Date();
    var stringDate = new Date(baseDate.getTime() + 60000 - (baseDate.getTimezoneOffset() * 60000)).toISOString();
    var migrationVersion = stringDate.substring(0,stringDate.lastIndexOf(':')).replace('Z','').replace(/[-.T:]/g,'.');
    this.fs.copyTpl(
      this.templatePath('resources/migrations/addFunctions/addFunctions.sql'),
      this.destinationPath(`universe-core/src/java/resources/migrations/migration.${this.version}/V${migrationVersion}__I_${this.version}_${renderData.entityName}_Functions.sql`),
      renderData
    );
  }
};
