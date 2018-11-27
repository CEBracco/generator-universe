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
      this._promptingMigrationName();
    });
  }

  _promptingMigrationName() {
    return this.prompt([
      {
        type    : 'input',
        name    : 'name',
        message : 'Your migration name(recommendation: use snake_case, example: version_change)',
      },
      {
        type    : 'list',
        name    : 'type',
        message : 'Your migration type',
        choices : ['ALTER','CREATE','DELETE','INSERT','UPDATE'],
        default : '0'
      }
    ]).then((data) => {
      this.migrationData = data;
      this.log('');
      this._writing();
    });
  }

  _writing() {
    var renderData = {
      migration: this.migrationData
    }

    this._generateMigration(renderData);
  }

  _generateMigration(renderData) {
    var baseDate = new Date();
    var stringDate = new Date(baseDate.getTime() - (baseDate.getTimezoneOffset() * 60000)).toISOString();
    var migrationVersion = stringDate.substring(0,stringDate.lastIndexOf(':')).replace('Z','').replace(/[-.T:]/g,'.');
    this.fs.copyTpl(
      this.templatePath('resources/migrations/newMigration/newMigration.sql'),
      this.destinationPath(`universe-core/src/java/resources/migrations/migration.${this.version}/V${migrationVersion}__${renderData.migration.type[0]}_${this.version}_${renderData.migration.name}.sql`),
      renderData
    );
  }

};
