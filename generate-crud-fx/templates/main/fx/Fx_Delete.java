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
import org.universe.core.utils.ErrorCodes;
import org.universe.core.vo.alert.AlertVo;
import org.universe.core.vo.<%= entityName.toLowerCase() %>.<%= entityName %>Vo;

/**
 * FX for deleting a <%= entityName.toLowerCase() %>.
 * 
 */
public class Fx_Delete<%= entityName %> extends AbstractFxImpl implements I_Fx {

	/**
	 * Logger.
	 */
	private Logger logger = LoggerFactory.getLogger(Fx_Delete<%= entityName %>.class);

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
		this.logger.debug("executing Fx_Delete<%= entityName %>._execute()");

		try {
			this.beginTransaction();

			// we persist the entity
			this.getDao().delete(this.getEm(), this.getVo());

			this.commitTransaction();

			return JsonResponse.ok(
					"",
					this.getRealMessageSolver().getMessage(
							"default.entity.deleted.ok",
							new String[] { this.getRealMessageSolver()
									.getMessage("entity.<%= entityName.toLowerCase() %>.name",
											null) }));
		} catch (Exception e) {
			this.logger.error("error executing Fx_Delete<%= entityName %>._execute()", e);
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
		this.logger.debug("executing Fx_Delete<%= entityName %>.validate()");

		if (this.getVo().getId() == null) {

			String errorCodeMessage = this.getRealMessageSolver().getMessage("default.error.code", new Object[] { ErrorCodes.ERROR_ENTITY_ID_UNDEFINED });
			String jsonResponseMessage = this.getRealMessageSolver().getMessage("default.entity.deleted.error", new String[] { this.getRealMessageSolver().getMessage("entity.<%= entityName.toLowerCase() %>.name", null), errorCodeMessage });

			return FxValidationResponse.error(jsonResponseMessage);
		} else {
			<%= entityName %>Vo <%= entityName.toLowerCase() %>Vo = this.getDao().getById(this.getEm(),this.getVo().getId());

			if (<%= entityName.toLowerCase() %>Vo == null) {
				String jsonResponseMessage = this.getRealMessageSolver().getMessage("fx.<%= entityName.toLowerCase() %>.validation.entityNotExists", new String[] { this.getRealMessageSolver().getMessage("default.delete", null) });

				return FxValidationResponse.error(jsonResponseMessage);
			} else {
				return FxValidationResponse.ok();
			}
		}
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
				"fx.<%= entityName.toLowerCase() %>.alert.description.deleted",
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
