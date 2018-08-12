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
    this._generateCreateFx(this.entityData);
    this._generateDeleteFx(this.entityData);
    this._generateModifyFx(this.entityData);
    this._addToFxServletContextXml(this.entityData);
    this._addMessages(this.entityData);
  }

  _generateCreateFx(renderData) {
    this.fs.copyTpl(
      this.templatePath('main/fx/Fx_Create.java'),
      this.destinationPath('universe-core/src/java/main/fx/org/universe/core/fx/'+ renderData.entityName.toLowerCase() + '/Fx_Create' + renderData.entityName +'.java'),
      renderData
    );
  }

  _generateDeleteFx(renderData) {
    this.fs.copyTpl(
      this.templatePath('main/fx/Fx_Delete.java'),
      this.destinationPath('universe-core/src/java/main/fx/org/universe/core/fx/'+ renderData.entityName.toLowerCase() + '/Fx_Delete' + renderData.entityName +'.java'),
      renderData
    );
  }

  _generateModifyFx(renderData) {
    this.fs.copyTpl(
      this.templatePath('main/fx/Fx_Modify.java'),
      this.destinationPath('universe-core/src/java/main/fx/org/universe/core/fx/'+ renderData.entityName.toLowerCase() + '/Fx_Modify' + renderData.entityName +'.java'),
      renderData
    );
  }

  _addToFxServletContextXml(renderData) {
    var entityName = renderData.entityName
    var fxServletContextPath = 'universe-core/src/java/resources/spring/fxServletContext.xml'
    var content = this.fs.read(fxServletContextPath);
    var $ = cheerio.load(content, { xmlMode: true });
    $('beans>beans').append(`
		<!-- ${entityName} -->
		<bean id="create${entityName}" class="org.universe.core.fx.${entityName.toLowerCase()}.Fx_Create${entityName}" scope="prototype"/>
		<bean id="delete${entityName}" class="org.universe.core.fx.${entityName.toLowerCase()}.Fx_Delete${entityName}" scope="prototype"/>
		<bean id="modify${entityName}" class="org.universe.core.fx.${entityName.toLowerCase()}.Fx_Modify${entityName}" scope="prototype"/>
  `);

    this.fs.write(fxServletContextPath,$.xml());
  }

  _addMessages(renderData){
    this._addMessagesSpanish(renderData);
    this._addMessagesItalian(renderData);
    this._addMessagesPortuguese(renderData);
  }

  _addMessagesSpanish(renderData) {
    var entityName = renderData.entityName
    var filePath = 'universe-core/src/java/resources/messages/messages_es.properties'
    var newMessages = `
#${entityName}
entity.${entityName.toLowerCase()}.name=${entityName}
fx.${entityName.toLowerCase()}.alert.description.created=${entityName} creado: {0}.
fx.${entityName.toLowerCase()}.alert.description.modified=${entityName} modificado: {0}.
fx.${entityName.toLowerCase()}.alert.description.deleted=${entityName} eliminado: {0}.
fx.${entityName.toLowerCase()}.validation.entityNotExists=El/La ${entityName} que se quiere {0} no existe.`;

    this.fs.append(filePath,newMessages);
  }

  _addMessagesItalian(renderData) {
    var entityName = renderData.entityName
    var filePath = 'universe-core/src/java/resources/messages/messages_it.properties'
    var newMessages = `
#${entityName}
entity.${entityName.toLowerCase()}.name=${entityName}
fx.${entityName.toLowerCase()}.alert.description.created=${entityName} creato: {0}.
fx.${entityName.toLowerCase()}.alert.description.modified=${entityName} modificato: {0}.
fx.${entityName.toLowerCase()}.alert.description.deleted=${entityName} eliminato: {0}.
fx.${entityName.toLowerCase()}.validation.entityNotExists=Il ${entityName} che si desidera {0} non esiste.`;

    this.fs.append(filePath,newMessages);
  }

  _addMessagesPortuguese(renderData) {
    var entityName = renderData.entityName
    var filePath = 'universe-core/src/java/resources/messages/messages_pt.properties'
    var newMessages = `
#${entityName}
entity.${entityName.toLowerCase()}.name=${entityName}
fx.${entityName.toLowerCase()}.alert.description.created=${entityName} criado: {0}.
fx.${entityName.toLowerCase()}.alert.description.modified=${entityName} alterado: {0}.
fx.${entityName.toLowerCase()}.alert.description.deleted=${entityName} excluído: {0}.
fx.${entityName.toLowerCase()}.validation.entityNotExists=O ${entityName} que você deseja {0} não existe.`;

    this.fs.append(filePath,newMessages);
  }

};
