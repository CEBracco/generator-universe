INSERT INTO parameter (id, deleted, description, fixed, global, name, type, value, tags, viewed) 
VALUES (nextval('parameter_seq'), FALSE, '<%= description %>', TRUE, TRUE, 
'<%= name %>', '<%= type %>', '<%= value %>', '<%= tags %>', FALSE);
