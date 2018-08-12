package org.universe.core.vo.<%= entityName.toLowerCase() %>;

import org.universe.core.vo.AbstractVo;


/**
 * Value Object <%= entityName %>
 * 
 */
public class <%= entityName %>Vo extends AbstractVo{

	/**
	 * 
	 */
	private static final long serialVersionUID = -1L;
	
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
	public Boolean getDeleted() {
		return deleted;
	}

	public void setDeleted(Boolean deleted) {
		this.deleted = deleted;
	}
	
}
