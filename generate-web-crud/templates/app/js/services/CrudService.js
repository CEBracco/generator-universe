
'use strict';
/**
 * <%= entityName %> Service
 */
define(function() {
	var app = angular.module('universeApp');

	app._serviceProvider.service('<%= entityName %>Service', ['UniverseService', function(UniverseService) {
		return {
			create: function (params, successFn, errorFn) {
				return UniverseService.authPost('/<%= lowerCamelCase(entityName) %>/create.json', params, successFn, errorFn);
			},
			remove: function (params, successFn, errorFn) {
				return UniverseService.authPost('/<%= lowerCamelCase(entityName) %>/delete.json', params, successFn, errorFn);
			},
			modify: function (params, successFn, errorFn) {
				return UniverseService.authPost('/<%= lowerCamelCase(entityName) %>/modify.json', params, successFn, errorFn);
			},
			list: function (params, successFn, errorFn) {
				return UniverseService.authPost('/<%= lowerCamelCase(entityName) %>/list.json', params, successFn, errorFn);
			},
			search: function (params, successFn, errorFn) {
				return UniverseService.authPost('/<%= lowerCamelCase(entityName) %>/search.json', params, successFn, errorFn);
			}
		};
	}]);
});
