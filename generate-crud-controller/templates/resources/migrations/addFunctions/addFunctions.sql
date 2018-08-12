-- Permmissions for <%= entityName.toLowerCase() %>
INSERT INTO function (id, actionname, deleted, description, menuname, name, submenuname, uri)
VALUES (nextval('function_seq'), '<%= entityName.replace(/^./, function(str){ return str.toLowerCase(); }) %>', FALSE, 'Create<%= entityName %>', '<%= menuName %>',
'create<%= entityName %>', NULL, '/<%= entityName.replace(/^./, function(str){ return str.toLowerCase(); }) %>/create');

INSERT INTO roletypefunction  (id, deleted, disabledcause, enabled, function_id, roletype_id) VALUES (nextval('roletypefunction_seq'), false, NULL, true, currval('function_seq'), 1);
INSERT INTO rolefunction (id, deleted, disabledcause, enabled, function_id, role_id) SELECT nextval('rolefunction_seq'), false, NULL, true, currval('function_seq'), id_role_type.id FROM (SELECT distinct(r.id) FROM role r WHERE r.roletype_id = 1) as id_role_type;

INSERT INTO function (id, actionname, deleted, description, menuname, name, submenuname, uri)
VALUES (nextval('function_seq'), '<%= entityName.replace(/^./, function(str){ return str.toLowerCase(); }) %>', FALSE, 'Delete<%= entityName %>', '<%= menuName %>',
'delete<%= entityName %>', NULL, '/<%= entityName.replace(/^./, function(str){ return str.toLowerCase(); }) %>/search');

INSERT INTO roletypefunction  (id, deleted, disabledcause, enabled, function_id, roletype_id) VALUES (nextval('roletypefunction_seq'), false, NULL, true, currval('function_seq'), 1);
INSERT INTO rolefunction (id, deleted, disabledcause, enabled, function_id, role_id) SELECT nextval('rolefunction_seq'), false, NULL, true, currval('function_seq'), id_role_type.id FROM (SELECT distinct(r.id) FROM role r WHERE r.roletype_id = 1) as id_role_type;

INSERT INTO function (id, actionname, deleted, description, menuname, name, submenuname, uri)
VALUES (nextval('function_seq'), '<%= entityName.replace(/^./, function(str){ return str.toLowerCase(); }) %>', FALSE, 'Modify<%= entityName %>', '<%= menuName %>',
'modify<%= entityName %>', NULL, '/<%= entityName.replace(/^./, function(str){ return str.toLowerCase(); }) %>/modify');

INSERT INTO roletypefunction  (id, deleted, disabledcause, enabled, function_id, roletype_id) VALUES (nextval('roletypefunction_seq'), false, NULL, true, currval('function_seq'), 1);
INSERT INTO rolefunction (id, deleted, disabledcause, enabled, function_id, role_id) SELECT nextval('rolefunction_seq'), false, NULL, true, currval('function_seq'), id_role_type.id FROM (SELECT distinct(r.id) FROM role r WHERE r.roletype_id = 1) as id_role_type;

INSERT INTO function (id, actionname, deleted, description, menuname, name, submenuname, uri)
VALUES (nextval('function_seq'), '<%= entityName.replace(/^./, function(str){ return str.toLowerCase(); }) %>', FALSE, 'List<%= entityName %>', '<%= menuName %>',
'list<%= entityName %>', NULL, '/<%= entityName.replace(/^./, function(str){ return str.toLowerCase(); }) %>/list');

INSERT INTO roletypefunction  (id, deleted, disabledcause, enabled, function_id, roletype_id) VALUES (nextval('roletypefunction_seq'), false, NULL, true, currval('function_seq'), 1);
INSERT INTO rolefunction (id, deleted, disabledcause, enabled, function_id, role_id) SELECT nextval('rolefunction_seq'), false, NULL, true, currval('function_seq'), id_role_type.id FROM (SELECT distinct(r.id) FROM role r WHERE r.roletype_id = 1) as id_role_type;

INSERT INTO function (id, actionname, deleted, description, menuname, name, submenuname, uri)
VALUES (nextval('function_seq'), '<%= entityName.replace(/^./, function(str){ return str.toLowerCase(); }) %>', FALSE, 'Search<%= entityName %>', '<%= menuName %>',
'search<%= entityName %>', NULL, '/<%= entityName.replace(/^./, function(str){ return str.toLowerCase(); }) %>/delete');

INSERT INTO roletypefunction  (id, deleted, disabledcause, enabled, function_id, roletype_id) VALUES (nextval('roletypefunction_seq'), false, NULL, true, currval('function_seq'), 1);
INSERT INTO rolefunction (id, deleted, disabledcause, enabled, function_id, role_id) SELECT nextval('rolefunction_seq'), false, NULL, true, currval('function_seq'), id_role_type.id FROM (SELECT distinct(r.id) FROM role r WHERE r.roletype_id = 1) as id_role_type;
