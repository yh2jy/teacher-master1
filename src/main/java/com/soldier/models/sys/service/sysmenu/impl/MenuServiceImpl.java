package com.soldier.models.sys.service.sysmenu.impl;

import com.soldier.common.vo.PageBean;
import com.soldier.models.sys.dao.sysmenu.MenuDao;
import com.soldier.models.sys.model.SysMenuEntity;
import com.soldier.models.sys.service.sysmenu.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author soldier
 * @title: MenuServiceImpl
 * @projectName teacher_files
 * @date 19-7-5上午10:57
 */
@Service
public class MenuServiceImpl implements MenuService {

    @Autowired
    private MenuDao menuDao;

    @Override
    public List<SysMenuEntity> getMenuByRoleType(Integer roleId) {
        return menuDao.getMenuByRoleType(roleId);
    }

    @Override
    public void save(SysMenuEntity sysMenuEntity) {
        menuDao.save(sysMenuEntity);
    }

    @Override
    public void delete(SysMenuEntity sysMenuEntity) {
        menuDao.delete(sysMenuEntity);
    }

    @Override
    public void update(SysMenuEntity sysMenuEntity) {
        menuDao.update(sysMenuEntity);
    }

    @Override
    public SysMenuEntity findById(SysMenuEntity sysMenuEntity) {
        return menuDao.findById(sysMenuEntity);
    }

    @Override
    public PageBean findByPage(String key, PageBean<SysMenuEntity> pageBean) {
        return menuDao.findByPage(key, pageBean);
    }

    @Override
    public List<SysMenuEntity> findAll() {
        return menuDao.findAll();
    }

    @Override
    public void deleteBatch(String[] Ids) {
        menuDao.deleteBatch(Ids);
    }
}
