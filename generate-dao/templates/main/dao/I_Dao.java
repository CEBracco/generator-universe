package org.universe.core.dao.<%= entityName.toLowerCase() %>;

import org.universe.core.dao.I_Dao;
import org.universe.core.vo.<%= entityName.toLowerCase() %>.<%= entityName %>Vo;

public interface I_<%= entityName %>Dao  extends I_Dao<<%= entityName %>Vo>{

}
