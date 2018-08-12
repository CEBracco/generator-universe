package org.universe.core.fx.<%= entityName.toLowerCase() %>;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.universe.core.dao.<%= entityName.toLowerCase() %>.I_<%= entityName %>Dao;
import org.universe.core.fx.AbstractFxImpl;
import org.universe.core.fx.FxValidationResponse;
import org.universe.core.fx.I_Fx;
import org.universe.core.json.JsonResponse;
import org.universe.core.model.E_Priority;
import org.universe.core.vo.alert.AlertVo;
import org.universe.core.vo.<%= entityName.toLowerCase() %>.<%= entityName %>Vo;

/**
 * FX for creating a <%= entityName.toLowerCase() %>.
 *
 */
public class Fx_Create<%= entityName %> extends AbstractFxImpl implements I_Fx {

	/**
	 * Logger.
	 */
	private Logger logger = LoggerFactory.getLogger(Fx_Create<%= entityName %>.class);

	/**
	 * <%= entityName %> DAO.
	 */
	@Autowired
	private I_<%= entityName %>Dao dao;

	/*
	 * (non-Javadoc)
	 *
	 * @see org.universe.core.fx.AbstractFxImpl#_execute()
	 */
	@Override
	protected JsonResponse _execute() {
		this.logger.debug("executing Fx_Create<%= entityName %>._execute()");

		try {
			this.beginTransaction();

			// we persist the entity
			<%= entityName %>Vo <%= entityName.toLowerCase() %>Vo = this.getDao().persist(this.getEm(), this.getVo());
			this.setVo(<%= entityName.toLowerCase() %>Vo);

			this.commitTransaction();

			return JsonResponse.ok(
					this.getGson().toJson(<%= entityName.toLowerCase() %>Vo),
					this.getRealMessageSolver().getMessage(
							"default.entity.created.ok",
							new String[] { this.getRealMessageSolver()
									.getMessage("entity.<%= entityName.toLowerCase() %>.name", null) }));
		} catch (Exception e) {
			this.logger.error(
					"error executing Fx_Create<%= entityName %>.execute()", e);
			try {
				this.rollbackTransaction();
			} catch (Exception e1) {
				this.logger.error("error rollbacking transaction", e);
			}

			return this.unexpectedErrorResponse();
		}
	}

	/*
	 * (non-Javadoc)
	 *
	 * @see org.universe.core.fx.AbstractFxImpl#validate()
	 */
	@Override
	protected FxValidationResponse validate() {
		this.logger.debug("executing Fx_Create<%= entityName %>._validate()");
		return FxValidationResponse.ok();
	}

	/*
	 * (non-Javadoc)
	 *
	 * @see
	 * org.universe.core.fx.AbstractFxImpl#_completeAlert(org.universe.core.
	 * vo.alert.AlertVo)
	 */
	@Override
	protected void _completeAlert(AlertVo alertVo) {
		alertVo.setPriority(E_Priority.HIGH);

		alertVo.setDescription(this.getRealMessageSolver().getMessage(
				"fx.<%= entityName.toLowerCase() %>.alert.description.created",
				new String[] { this.getVo().getId() + "" }));
	}

	/**
	 * Casted VO.
	 */
	@Override
	public <%= entityName %>Vo getVo() {
		return (<%= entityName %>Vo) super.getVo();
	}

	/**
	 * @return the dao
	 */
	public I_<%= entityName %>Dao getDao() {
		return this.dao;
	}

	/**
	 * @param dao
	 *            the dao to set
	 */
	public void setDao(I_<%= entityName %>Dao dao) {
		this.dao = dao;
	}

}
