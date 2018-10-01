package org.universe.core.controller.<%= entityName.toLowerCase() %>;

import java.lang.reflect.Type;
import java.text.ParseException;

import javax.persistence.EntityManager;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.universe.core.dao.EntityManagerHolder;
import org.universe.core.dao.configuration.parameter.I_ParameterDao;
import org.universe.core.dao.<%= entityName.toLowerCase() %>.I_<%= entityName %>Dao;
import org.universe.core.fx.I_FxFactory;
import org.universe.core.fx.<%= entityName.toLowerCase() %>.Fx_Create<%= entityName %>;
import org.universe.core.fx.<%= entityName.toLowerCase() %>.Fx_Delete<%= entityName %>;
import org.universe.core.fx.<%= entityName.toLowerCase() %>.Fx_Modify<%= entityName %>;
import org.universe.core.json.JsonResponse;
import org.universe.core.utils.ErrorCodes;
import org.universe.core.vo.PaginatedListVo;
import org.universe.core.vo.PaginatedRequestVo;
import org.universe.core.vo.PaginatedSearchRequestVo;
import org.universe.core.vo.configuration.parameter.ParameterVo;
import org.universe.core.vo.<%= entityName.toLowerCase() %>.<%= entityName %>Vo;
import org.universe.core.web.WebContextHolder;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

/**
 * Controller for the <%= entityName.toLowerCase() %> entities.
 *
 */
@RequestMapping(value = "/<%= entityName.replace(/^./, function(str){ return str.toLowerCase(); }) %>", produces = "text/json;charset=utf-8", method = RequestMethod.POST)
public class <%= entityName %>Ctrl {

	/**
	 * Logger
	 */
	private Logger logger = LoggerFactory.getLogger(<%= entityName %>Ctrl.class);

	/**
	 * Entity Manager Holder
	 */
	@Autowired
	private EntityManagerHolder entityManagerHolder;

	/**
	 * <%= entityName.toLowerCase() %> DAO
	 */
	@Autowired
	private I_<%= entityName %>Dao <%= entityName.toLowerCase() %>Dao;

	/**
	 * Parameter DAO
	 */
	@Autowired
	private I_ParameterDao parameterDao;

	/**
	 * Gson Holder
	 */
	@Autowired
	private Gson gson;

	/**
	 * FX Factory.
	 */
	@Autowired
	private I_FxFactory fxFactory;

	/**
	 * Web Context Holder.
	 */
	@Autowired
	private WebContextHolder webContextHolder;

	/**
	 * Lists all <%= entityName.toLowerCase() %>.
	 *
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/list.json")
	public String list(@RequestBody String paginationData) {
		this.logger.debug("calling <%= entityName %>Ctrl.list()");
		EntityManager em = this.getEntityManagerHolder().getEntityManager();
		JsonResponse jsonResponse = null;

		try {
			PaginatedRequestVo paginatedRequestVo = this.getGson().fromJson(paginationData, PaginatedRequestVo.class);
			PaginatedListVo<<%= entityName %>Vo> paginatedListVo = this.get<%= entityName %>Dao()
					.listPage(
							em,
							paginatedRequestVo,
							this.getParameterDao()
									.getByName(em, ParameterVo.ITEMS_PER_PAGE)
									.getValue(Long.class));

			String data = this.getGson().toJson(paginatedListVo);

			jsonResponse = JsonResponse.ok(data);
		} catch (ParseException e) {
			this.logger.error("error trying to read items.per.page parameter",
					e);

			jsonResponse = this.getWebContextHolder().unexpectedErrorResponse(
					ErrorCodes.ERROR_PARAMETER_PARSING);
		} catch (Exception e) {
			this.logger.error("error trying to read items.per.page parameter",
					e);

			jsonResponse = this.getWebContextHolder().unexpectedErrorResponse(
					ErrorCodes.ERROR_PARAMETER_MISSING);
		} finally {
			this.getEntityManagerHolder().closeEntityManager(em);
		}

		return this.getGson().toJson(jsonResponse);
	}

	/**
	 * Searches <%= entityName.toLowerCase() %>s.
	 *
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/search.json")
	public String search(@RequestBody String data) {
		this.logger.debug("calling <%= entityName %>Ctrl.search()");
		EntityManager em = this.getEntityManagerHolder().getEntityManager();
		JsonResponse jsonResponse = null;

		try {
			Type type = new TypeToken<PaginatedSearchRequestVo<<%= entityName %>Vo>>() {}.getType();
			PaginatedSearchRequestVo<<%= entityName %>Vo> paginatedSearchRequestVo = this.getGson().fromJson(data, type);
			PaginatedListVo<<%= entityName %>Vo> paginatedListVo = this.get<%= entityName %>Dao()
					.searchPage(
							em,
							paginatedSearchRequestVo,
							this.getParameterDao()
									.getByName(em, ParameterVo.ITEMS_PER_PAGE)
									.getValue(Long.class));

			String responseData = this.getGson().toJson(paginatedListVo);

			jsonResponse = JsonResponse.ok(responseData);
		} catch (ParseException e) {
			this.logger.error("error trying to read items.per.page parameter",
					e);

			jsonResponse = this.getWebContextHolder().unexpectedErrorResponse(
					ErrorCodes.ERROR_PARAMETER_PARSING);
		} catch (Exception e) {
			this.logger.error("error trying to read items.per.page parameter",
					e);

			jsonResponse = this.getWebContextHolder().unexpectedErrorResponse(
					ErrorCodes.ERROR_PARAMETER_MISSING);
		} finally {
			this.getEntityManagerHolder().closeEntityManager(em);
		}

		return this.getGson().toJson(jsonResponse);
	}

	/**
	 * Creates a new <%= entityName.toLowerCase() %>
	 *
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/create.json")
	public String create(@RequestBody String data) {
		this.logger.debug("calling <%= entityName %>Ctrl.create()");
		EntityManager em = this.getEntityManagerHolder().getEntityManager();
		JsonResponse jsonResponse = null;

		try {
			<%= entityName %>Vo <%= entityName.toLowerCase() %>Vo = this.getGson().fromJson(data, <%= entityName %>Vo.class);

			Fx_Create<%= entityName %> fx = this.getFxFactory().getNewFxInstance(
					Fx_Create<%= entityName %>.class);

			fx.setVo(<%= entityName.toLowerCase() %>Vo);
			fx.setEm(em);
			this.logger.debug("executing Fx_Create<%= entityName %>");
			jsonResponse = fx.execute();
		} catch (Exception e) {
			this.logger.debug("unexpected error", e);

			jsonResponse = this.getWebContextHolder().unexpectedErrorResponse(ErrorCodes.ERROR_UNEXPECTED);
		} finally {
			this.getEntityManagerHolder().closeEntityManager(em);
		}

		return this.getGson().toJson(jsonResponse);
	}

	/**
	 * Deletes a <%= entityName.toLowerCase() %>.
	 *
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/delete.json")
	public String delete(@RequestBody String data) {
		this.logger.debug("calling <%= entityName %>Ctrl.delete()");
		EntityManager em = this.getEntityManagerHolder().getEntityManager();
		JsonResponse jsonResponse = null;

		try {
			<%= entityName %>Vo <%= entityName.toLowerCase() %>Vo = this.getGson().fromJson(data, <%= entityName %>Vo.class);

			Fx_Delete<%= entityName %> fx = this.getFxFactory().getNewFxInstance(
					Fx_Delete<%= entityName %>.class);

			fx.setVo(<%= entityName.toLowerCase() %>Vo);
			fx.setEm(em);
			this.logger.debug("executing Fx_Delete<%= entityName %>");
			jsonResponse = fx.execute();
		} catch (Exception e) {
			this.logger.debug("unexpected error", e);

			jsonResponse = this.getWebContextHolder().unexpectedErrorResponse(ErrorCodes.ERROR_UNEXPECTED);
		} finally {
			this.getEntityManagerHolder().closeEntityManager(em);
		}

		return this.getGson().toJson(jsonResponse);
	}

	/**
	 * Modifies a <%= entityName.toLowerCase() %>.
	 *
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/modify.json")
	public String modify(@RequestBody String data) {
		this.logger.debug("calling <%= entityName %>Ctrl.modify()");
		EntityManager em = this.getEntityManagerHolder().getEntityManager();
		JsonResponse jsonResponse = null;

		try {
			<%= entityName %>Vo <%= entityName.toLowerCase() %>Vo = this.getGson().fromJson(data, <%= entityName %>Vo.class);

			Fx_Modify<%= entityName %> fx = this.getFxFactory().getNewFxInstance(
					Fx_Modify<%= entityName %>.class);

			fx.setVo(<%= entityName.toLowerCase() %>Vo);
			fx.setEm(em);
			this.logger.debug("executing Fx_Modify<%= entityName %>");
			jsonResponse = fx.execute();
		} catch (Exception e) {
			this.logger.debug("unexpected error", e);

			jsonResponse = this.getWebContextHolder().unexpectedErrorResponse(ErrorCodes.ERROR_UNEXPECTED);
		} finally {
			this.getEntityManagerHolder().closeEntityManager(em);
		}

		return this.getGson().toJson(jsonResponse);
	}

	/**
	 * @return the entityManagerHolder
	 */
	public EntityManagerHolder getEntityManagerHolder() {
		return this.entityManagerHolder;
	}

	/**
	 * @param entityManagerHolder
	 *            the entityManagerHolder to set
	 */
	public void setEntityManagerHolder(EntityManagerHolder entityManagerHolder) {
		this.entityManagerHolder = entityManagerHolder;
	}

	/**
	 * @return the parameterDao
	 */
	public I_ParameterDao getParameterDao() {
		return this.parameterDao;
	}

	/**
	 * @param parameterDao
	 *            the parameterDao to set
	 */
	public void setParameterDao(I_ParameterDao parameterDao) {
		this.parameterDao = parameterDao;
	}

	/**
	 * @return the gson
	 */
	public Gson getGson() {
		return this.gson;
	}

	/**
	 * @param gson
	 *            the gson to set
	 */
	public void setGson(Gson gson) {
		this.gson = gson;
	}

	/**
	 * @return the fxFactory
	 */
	public I_FxFactory getFxFactory() {
		return this.fxFactory;
	}

	/**
	 * @param fxFactory
	 *            the fxFactory to set
	 */
	public void setFxFactory(I_FxFactory fxFactory) {
		this.fxFactory = fxFactory;
	}

	/**
	 * @return the <%= entityName.toLowerCase() %>Dao
	 */
	public I_<%= entityName %>Dao get<%= entityName %>Dao() {
		return this.<%= entityName.toLowerCase() %>Dao;
	}

	/**
	 * @param <%= entityName.toLowerCase() %>Dao
	 *            the <%= entityName.toLowerCase() %>Dao to set
	 */
	public void set<%= entityName %>Dao(I_<%= entityName %>Dao <%= entityName.toLowerCase() %>Dao) {
		this.<%= entityName.toLowerCase() %>Dao = <%= entityName.toLowerCase() %>Dao;
	}

	/**
	 * @return the webContextHolder
	 */
	public WebContextHolder getWebContextHolder() {
		return this.webContextHolder;
	}

	/**
	 * @param webContextHolder
	 *            the webContextHolder to set
	 */
	public void setWebContextHolder(WebContextHolder webContextHolder) {
		this.webContextHolder = webContextHolder;
	}

}
