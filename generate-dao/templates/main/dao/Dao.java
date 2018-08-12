package org.universe.core.dao.<%= entityName.toLowerCase() %>;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.universe.core.dao.AbstractDao;
import org.universe.core.model.<%= entityName.toLowerCase() %>.<%= entityName %>;
import org.universe.core.vo.<%= entityName.toLowerCase() %>.<%= entityName %>Vo;

public class <%= entityName %>DaoImp extends AbstractDao<<%= entityName %>, <%= entityName %>Vo>
implements I_<%= entityName %>Dao{

	@Override
	public Class<<%= entityName %>Vo> getVoClazz() {
		return <%= entityName %>Vo.class;
	}

	@Override
	protected Class<<%= entityName %>> getClazz() {
		return <%= entityName %>.class;
	}

	@Override
	protected Predicate addFilters(Root<<%= entityName %>> root, CriteriaBuilder builder, Predicate filters, <%= entityName %>Vo vo) {
		return filters;
	}

}
