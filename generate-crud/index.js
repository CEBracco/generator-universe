var Generator = require('yeoman-generator');

module.exports = class extends Generator {

  validateFolder(){
    var fs = require('fs');
    if (!fs.existsSync('universe-core') || !fs.existsSync('universe-web')) {
        this.log.error("You must run this generator on a root folder that contains universe-core and universe-web projects!");
        process.exit(1);
    }
  }

  promptingVersion() {
    return this.prompt([{
      type    : 'input',
      name    : 'version',
      message : 'Enter Universe Version',
    }]).then((data) => {
      this.version = data.version;
      this.log('');
    });
  }

  promptingEntityName() {
    return this.prompt([{
      type    : 'input',
      name    : 'entityName',
      message : 'Your new entity name(in UpperCamelCase, example: LicensePlate)',
    }]).then((data) => {
      this.entityData = data;
      this.entityData.properties = [];
      this.log('');
    });
  }

  promptingProperties() {
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
        this.promptingProperties();
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
      this._promptingWebCreation();
    });
  }

  _promptingWebCreation() {
    if(!this.options.onlyCore){
      return this.prompt([{
        type    : 'confirm',
        name    : 'webCreation',
        message : 'Do you want to create Web Crud?',
        default : true
      }]).then((data) => {
        this.options.onlyCore = data.webCreation
        this._generate();
      });
    } else {
      this._generate();
    }
  }

  _generate(){
    var options = {entityData:this.entityData, version:this.version};
    this.composeWith(require.resolve('../generate-entity'), options);
    this.composeWith(require.resolve('../generate-dao'), options);
    this.composeWith(require.resolve('../generate-crud-fx'), options);
    this.composeWith(require.resolve('../generate-crud-controller'), options);
    if(this.options.onlyCore){
      this.composeWith(require.resolve('../generate-web-crud'), options);
    }
    this.log('Generating files... On conflicts you can select "a" option to overwrite all files\n');
  }

};
