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
      this.log('');
      this._promptingEntityName();
    });
  }

  _promptingEntityName() {
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
      message : 'Type a new property name, leave this field blank to finish input',
      default : ''
    }, {
      type    : 'input',
      name    : 'clazz',
      message : 'Type the Java class of the new property (String, Integer, Float, etc.)',
      default : 'String'
    }, {
      type    : 'input',
      name    : 'columnType',
      message : 'Type the Posgresql column type of the new property (CHARACTER VARYING, BIGDECIMAL, BIGINT, etc.)',
      default : 'CHARACTER VARYING(255)'
    }]).then((property) => {
      this.log('');
      if(property.name != ''){
        this.entityData.properties.push(property);
        this._promptingProperties();
      } else {
        this._promptingDaoCreation();
      }
    });
  }

  _promptingDaoCreation() {
    return this.prompt([{
      type    : 'confirm',
      name    : 'daoCreation',
      message : 'Do you want to create Dao?',
      default : true
    }]).then((data) => {
      if(data.daoCreation){
        this.composeWith(require.resolve('../generate-dao'), {version: this.version, entityData: this.entityData});
        this._writing();
      }
    });
  }

  _writing() {
    var renderData = {
      entityName: this.entityData.entityName,
      properties: this.entityData.properties,
      capitalize: function(string){
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
    }

    this._generateModel(renderData);
    this._generateVo(renderData);
    this._generateMigration(renderData);
    this._addToPersistenceXml(renderData);
  }

  _generateModel(renderData) {
    this.fs.copyTpl(
      this.templatePath('main/model/Model.java'),
      this.destinationPath('universe-core/src/java/main/model/org/universe/core/model/'+ renderData.entityName.toLowerCase() + '/' + renderData.entityName +'.java'),
      renderData
    );
  }

  _generateVo(renderData) {
    this.fs.copyTpl(
      this.templatePath('main/vo/ModelVo.java'),
      this.destinationPath('universe-core/src/java/main/vo/org/universe/core/vo/'+ renderData.entityName.toLowerCase() + '/' + renderData.entityName +'Vo.java'),
      renderData
    );
  }

  _generateMigration(renderData) {
    var baseDate = new Date();
    var stringDate = new Date(baseDate.getTime() - (baseDate.getTimezoneOffset() * 60000)).toISOString();
    var migrationVersion = stringDate.substring(0,stringDate.lastIndexOf(':')).replace('Z','').replace(/[-.T:]/g,'.');
    this.fs.copyTpl(
      this.templatePath('resources/migrations/newEntity/newEntity.sql'),
      this.destinationPath(`universe-core/src/java/resources/migrations/migration.${this.version}/V${migrationVersion}__C_${this.version}_${renderData.entityName}.sql`),
      renderData
    );
  }

  _addToPersistenceXml(renderData) {
    var entityName = renderData.entityName
    var persistencePath = 'universe-core/src/java/resources/jpa/persistence.xml'
    var content = this.fs.read(persistencePath);
    var $ = cheerio.load(content, { xmlMode: true });
    var lastClassTag = $('class')[$('class').length - 1];
    $(lastClassTag).after(`\n\n        <!-- ${entityName} -->\n        <class>org.universe.core.model.${entityName.toLowerCase()}.${entityName}</class>`);

    this.fs.write(persistencePath,$.xml());
  }
};
