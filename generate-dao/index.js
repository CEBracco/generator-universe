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
      this._writing();
    });
  }

  _writing(){
    this._generateDao(this.entityData);
    this._generateDaoInterface(this.entityData);
    this._addToDaoServletContextXml(this.entityData);
  }

  _generateDao(renderData) {
    this.fs.copyTpl(
      this.templatePath('main/dao/Dao.java'),
      this.destinationPath('universe-core/src/java/main/dao/org/universe/core/dao/'+ renderData.entityName.toLowerCase() + '/' + renderData.entityName +'DaoImp.java'),
      renderData
    );
  }

  _generateDaoInterface(renderData) {
    this.fs.copyTpl(
      this.templatePath('main/dao/I_Dao.java'),
      this.destinationPath('universe-core/src/java/main/dao/org/universe/core/dao/'+ renderData.entityName.toLowerCase() + '/I_' + renderData.entityName +'Dao.java'),
      renderData
    );
  }

  _addToDaoServletContextXml(renderData) {
    var entityName = renderData.entityName
    var daoServletContextPath = 'universe-core/src/java/resources/spring/daoServletContext.xml'
    var content = this.fs.read(daoServletContextPath);
    var $ = cheerio.load(content, { xmlMode: true });
    $('beans>beans').append(`\n      <!-- ${entityName} DAO -->\n      <bean id="${entityName.replace(/^./, function(str){ return str.toLowerCase(); })}" class="org.universe.core.dao.${entityName.toLowerCase()}.${entityName}DaoImp" scope="prototype"/>\n    `);

    this.fs.write(daoServletContextPath,$.xml());
  }

};
