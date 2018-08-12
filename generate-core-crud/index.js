var Generator = require('yeoman-generator');

module.exports = class extends Generator {

  init(){
    this.composeWith(require.resolve('../generate-crud'), {onlyCore:true});
  }

};
