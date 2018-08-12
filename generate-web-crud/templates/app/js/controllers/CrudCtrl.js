'use strict';
/**
 * <%= entityName %> Controller
 */
define(['services/<%= entityName.toLowerCase() %>/<%= entityName %>Service'], function() {
	return ['<%= entityName %>Ctrl', '$scope', '$rootScope', '<%= entityName %>Service', '$filter',
     	function($scope, $rootScope, <%= entityName %>Service, $filter) {

     		$scope.<%= lowerCamelCase(entityName) %> = {};
     		$scope.<%= lowerCamelCase(entityName) %>List = [];
     		$scope.editing = false;

     		var paginationHelper;

     		$scope.create = function() {
     			$rootScope.dim();
     			<%= entityName %>Service.create($scope.<%= lowerCamelCase(entityName) %>, function(response) {
     				if (response.ok) {
     					// <%= lowerCamelCase(entityName) %> successfully created
     					var par = JSON.parse(response.data);

     					$rootScope.keepMessages = true;
     					$scope.initialize();
     				}
     				$rootScope.unDim();
     			}, $scope.errorManager);
     		};

     		$scope.list = function(pagination) {
     			<%= entityName %>Service.list(pagination, function(response) {
     				if (response.ok) {
     					var responseObject = JSON.parse(response.data);

     					if (responseObject.page) {
     						$scope.<%= lowerCamelCase(entityName) %>List = responseObject.items;
     						paginationHelper.extendCallback(responseObject);
     					} else {
     						$scope.<%= lowerCamelCase(entityName) %>List = responseObject;
     					}
     				}
     			}, $rootScope.manageError);
     		};

     		$scope.edit = function(<%= lowerCamelCase(entityName) %>) {
     			$scope.editing = true;

     			$scope.<%= lowerCamelCase(entityName) %> =  <%= lowerCamelCase(entityName) %>;

     			$scope.<%= lowerCamelCase(entityName) %>List.splice($scope.<%= lowerCamelCase(entityName) %>List.indexOf($scope.<%= lowerCamelCase(entityName) %>), 1);
     		};

     		$scope.modify = function() {
     			<%= entityName %>Service.modify($scope.<%= lowerCamelCase(entityName) %>, function(response) {
     				if (response.ok) {
     					// <%= lowerCamelCase(entityName) %> successfully edited
     					var par = JSON.parse(response.data);

     					$scope.<%= lowerCamelCase(entityName) %>List.push(par);

     					$rootScope.keepMessages = true;
     					$scope.initialize();
     				}
     			}, this.errorManager);
     		};

     		$scope.clean = function() {
     			$scope.initialize();
     		};

     		$scope.cancel = function() {
     			if ($scope.editing) {

     				$scope.<%= lowerCamelCase(entityName) %> = null;
     				$scope.editing = false;
     			}

     			$scope.initialize();
     		};

     		$scope.remove = function(<%= lowerCamelCase(entityName) %>) {
     			<%= entityName %>Service.remove(<%= lowerCamelCase(entityName) %>, function(response) {
     				if (response.ok) {
     					$scope.<%= lowerCamelCase(entityName) %>List.splice($scope.<%= lowerCamelCase(entityName) %>List.indexOf(<%= lowerCamelCase(entityName) %>),
     							1);
     				}
     			}, this.errorManager);
     		};

     		$scope.search = function(pagination) {
     			var data;

     			if (pagination) {
     				pagination.vo = $scope.<%= lowerCamelCase(entityName) %>;
     				data = pagination;
     			} else {
     				data = $scope.<%= lowerCamelCase(entityName) %>;
     			}

     			<%= entityName %>Service.search(data, function(response) {
     				if (response.ok) {
     					var responseObject = JSON.parse(response.data);

     					if (responseObject.page) {
     						$scope.<%= lowerCamelCase(entityName) %>List = responseObject.items;
     						paginationHelper.extendCallback(responseObject);
     					} else {
     						$scope.<%= lowerCamelCase(entityName) %>List = responseObject;
     					}
     				}
     			}, $rootScope.manageError);
     		};

     		paginationHelper = PaginationHelper($scope, '<%= lowerCamelCase(entityName) %>NameSpace', true);

     		$scope.initialize = function(){

     			$scope.editing = false;
     			$scope.<%= lowerCamelCase(entityName) %> = null;

     			$scope.list();

     			$rootScope.areErrorMessages = false;
     		};
     		$scope.initialize();
     	}
	];
});
