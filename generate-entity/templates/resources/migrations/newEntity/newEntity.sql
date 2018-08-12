CREATE TABLE <%= entityName.toLowerCase() %>(
    id bigint NOT NULL,
    <%_ properties.forEach(function(property){ _%>
    <%= property.name.toLowerCase() %> <%= property.columnType %>,
    <%_ }); _%>
    deleted boolean
);

CREATE SEQUENCE <%= entityName.toLowerCase() %>_seq INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1;

ALTER TABLE ONLY <%= entityName.toLowerCase() %>
    ADD CONSTRAINT <%= entityName.toLowerCase() %>_pkey PRIMARY KEY (id);
