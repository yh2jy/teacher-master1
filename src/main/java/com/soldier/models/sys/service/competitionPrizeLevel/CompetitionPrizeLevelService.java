package com.soldier.models.sys.service.competitionPrizeLevel;

import com.soldier.common.vo.PageBean;
import com.soldier.models.sys.model.CompetitionPrizeLevelEntity;

import java.util.List;

/**
 * @author soldier
 * @title: AcademicPaperService
 * @projectName teacher_files
 * @date 19-7-5上午11:14
 */
public interface CompetitionPrizeLevelService {

    /**
     * 添加
     * @param competitionPrizeLevelEntity
     */
    public void save(CompetitionPrizeLevelEntity competitionPrizeLevelEntity);

    /**
     * 删除
     * @param competitionPrizeLevelEntity
     */
    public void delete(CompetitionPrizeLevelEntity competitionPrizeLevelEntity);

    /**
     * 修改
     * @param competitionPrizeLevelEntity
     */
    public void update(CompetitionPrizeLevelEntity competitionPrizeLevelEntity);

    /**
     * 查询
     * @param competitionPrizeLevelEntity
     * @return
     */
    public CompetitionPrizeLevelEntity findById(CompetitionPrizeLevelEntity competitionPrizeLevelEntity);

    /**
     * 查询
     * @param key
     * @param pageBean
     * @return
     */
    public PageBean findByPage(String key, PageBean<CompetitionPrizeLevelEntity> pageBean);

    /**
     * 查询全部，用于下拉框渲染
     * @return
     */
    public List<CompetitionPrizeLevelEntity> findAll();

    /**
     * 批量删除
     * @param Ids
     */
    public void deleteBatch(String[] Ids);

}
