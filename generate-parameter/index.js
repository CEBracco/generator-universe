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
    return this.prompt([
      {
        type    : 'input',
        name    : 'name',
        message : 'Your new parameter name',
        default : ''
      },
      {
        type    : 'input',
        name    : 'description',
        message : 'Your new parameter description',
        default : ''
      },
      {
        type    : 'list',
        name    : 'type',
        message : 'Your new parameter type',
        choices : ['STRING','DATE','TIME','DATETIME','LONG','BIGDECIMAL','BOOLEAN'],
        default : '0'
      },
      {
        type    : 'input',
        name    : 'value',
        message : 'Your new parameter value',
        default : ''
      },
      {
        type    : 'input',
        name    : 'tags',
        message : 'Your new parameter tags',
        default : ''
      }
    ]).then((data) => {
      this.parameterData = data;
      this._writing();
    });
  }
  
  _writing(){
    this._generateMigration();
    this._addToParameterVo();
  }
  
  _generateMigration(){
    var baseDate = new Date();
    var stringDate = new Date(baseDate.getTime() - (baseDate.getTimezoneOffset() * 60000)).toISOString();
    var migrationVersion = stringDate.substring(0,stringDate.lastIndexOf(':')).replace('Z','').replace(/[-.T:]/g,'.');
    var parameterNameCamel= this.parameterData.name.replace(/\.([a-z])/g, function (g) { return g[1].toUpperCase(); });
    this.fs.copyTpl(
      this.templatePath('resources/migrations/newParameter/newParameter.sql'),
      this.destinationPath(`universe-core/src/java/resources/migrations/migration.${this.version}/V${migrationVersion}__I_${this.version}_addParameter_${parameterNameCamel}.sql`),
      this.parameterData
    );
  }
  
  _addToParameterVo(){
    var parameterVoPath = 'universe-core/src/java/main/vo/org/universe/core/vo/configuration/parameter/ParameterVo.java'
    var content = this.fs.read(parameterVoPath);
    var parameterContantName = this.parameterData.name.toUpperCase().replace(/\./g,'_');
    var newLine = `\n\n	public static final String ${parameterContantName} = "${this.parameterData.name}";\n`
    var afterLine = `
	/**
		* Parameter's name.`
    content = content.replace(/\s*\/\*\*\s*\*\s*Parameter's\s*name./, newLine + afterLine)
    this.fs.write(parameterVoPath, content);
  }
  
};
