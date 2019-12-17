package com.soldier.models.sys.dao.sysrole.impl;

import com.soldier.common.vo.PageBean;
import com.soldier.models.sys.dao.sysrole.RoleDao;
import com.soldier.models.sys.model.SysRoleEntity;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate4.HibernateTemplate;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * @author soldier
 * @title: RoleDao
 * @projectName teacher_files
 * @date 19-7-5上午11:14
 */
@Component
public class RoleDaoImpl implements RoleDao {

    @Autowired
    private SessionFactory sessionFactory;

    @Autowired
    private HibernateTemplate hibernateTemplate;

    @Override
    public void save(SysRoleEntity sysRoleEntity) {
        sessionFactory.getCurrentSession().save(sysRoleEntity);
    }

    @Override
    public void delete(SysRoleEntity sysRoleEntity) {
        sessionFactory.getCurrentSession().delete(sysRoleEntity);
    }

    @Override
    public void update(SysRoleEntity sysRoleEntity) {
        sessionFactory.getCurrentSession().update(sysRoleEntity);
    }

    @Override
    public SysRoleEntity findById(SysRoleEntity sysRoleEntity) {
        Session session = sessionFactory.openSession();

        Criteria criteria = session.createCriteria(SysRoleEntity.class);

        List list = criteria.add(Restrictions.eq("roleId", sysRoleEntity.getRoleId())).list();

        session.close();

        return list!=null&&list.size()>0? (SysRoleEntity) list.get(0) :null;
    }

    @Override
    public PageBean findByPage(String key, PageBean<SysRoleEntity> pageBean) {

        Session session = sessionFactory.openSession();

        Criteria criteria = session.createCriteria(SysRoleEntity.class);
        criteria.add(Restrictions.eq("canLook", 1));//是否允许除系统管理员之外的角色查看

        if (key != null && !key.equals("")) {
            criteria.add(Restrictions.or(
                            Restrictions.or(Restrictions.like("roleName", key, MatchMode.ANYWHERE))));
        }

        // 获取记录数
        pageBean.setTotal(Math.toIntExact((Long) criteria.setProjection(Projections.rowCount()).uniqueResult()));

        // 获取结果--将 Projection 设为空，再进行正常分页
        criteria.setProjection(null);
        pageBean.setRows(criteria.setFirstResult((pageBean.getCurrPage() - 1) * pageBean.getPageSize())
                .setMaxResults(pageBean.getPageSize()).setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY).list());

        session.close();

        return pageBean;
    }

    @Override
    public List<SysRoleEntity> findByOtherRole() {

        Session session = sessionFactory.openSession();

        Criteria criteria = session.createCriteria(SysRoleEntity.class);
        criteria.add(Restrictions.eq("canLook", 1));//是否允许除系统管理员之外的角色查看

        List list = criteria.setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY).list();

        session.close();

        return list;
    }

    @Override
    public List<SysRoleEntity> findBySysAdmin() {

        Session session = sessionFactory.openSession();

        Criteria criteria = session.createCriteria(SysRoleEntity.class);

        List list = criteria.setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY).list();

        session.close();

        return list;
    }

    @Override
    public void deleteBatch(String[] Ids) {

        List<SysRoleEntity> list = new ArrayList<>();

        for (String id : Ids) {
            SysRoleEntity sysRoleEntity = new SysRoleEntity();
            sysRoleEntity.setRoleId(Integer.parseInt(id));
            list.add(sysRoleEntity);
        }

        hibernateTemplate.deleteAll(list);
    }
}
