package org.universe.core.model.<%= entityName.toLowerCase() %>;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.SequenceGenerator;

import org.pojomatic.annotations.AutoProperty;
import org.pojomatic.annotations.DefaultPojomaticPolicy;
import org.pojomatic.annotations.PojomaticPolicy;
import org.pojomatic.annotations.Property;
import org.universe.core.model.I_Model;

@Entity
@AutoProperty(policy=DefaultPojomaticPolicy.TO_STRING)
public class <%= entityName %> implements I_Model, Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = -1L;
	
	/**
	 * Entity ID.
	 */
	@Id
	@GeneratedValue(strategy=GenerationType.SEQUENCE, generator="<%= entityName.toLowerCase() %>_seq")
	@SequenceGenerator(name="<%= entityName.toLowerCase() %>_seq",sequenceName="<%= entityName.toLowerCase() %>_seq",allocationSize=1)
	@Property(policy=PojomaticPolicy.EQUALS)
	private Long id;
	
	/**
	 * Logic deletion flag.
	 */
	private Boolean deleted;
	
	<%_ properties.forEach(function(property){ _%>
	/**
	 * <%= property.name %> attribute.
	 */
	private <%= property.clazz %> <%= property.name %>;
	
	<%_ }); _%>
	
	<%_ properties.forEach(function(property){ _%>
	public <%= property.clazz %> get<%= capitalize(property.name) %>() {
		return <%= property.name %>;
	}

	public void set<%= capitalize(property.name) %>(<%= property.clazz %> <%= property.name %>) {
		this.<%= property.name %> = <%= property.name %>;
	}
	
	<%_ }); _%>
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Boolean getDeleted() {
		return deleted;
	}

	public void setDeleted(Boolean deleted) {
		this.deleted = deleted;
	}

}
