<?php

namespace app\admin\model;
use Think\Model;
use Think\Db;

class ArticleModel extends Model
{
    protected $name = 'article';

    // 开启自动写入时间戳字段
    protected $autoWriteTimestamp = true;


    /**
     * 根据搜索条件获取用户列表信息
     * @author [jonny] [980218641@qq.com]
     */
    public function getArticleByWhere($map, $Nowpage, $limits)
    {
        return $this->field('flow_article.*,cate_name')
                    ->join('flow_article_cate', 'flow_article.cate_id = flow_article_cate.id')
                    ->where($map)
                    ->limit($Nowpage,$limits)
                    ->order('id desc')
                    ->select();

    }


    /**
     * [insertArticle 添加文章]
     * @author [jonny] [980218641@qq.com]
     */
    public function insertArticle($param)
    {
        try{
            $result = $this->allowField(true)->save($param);
            if(false === $result){
                return ['code' => -1, 'data' => '', 'msg' => $this->getError()];
            }else{
                return ['code' => 1, 'data' => '', 'msg' => '文章添加成功'];
            }
        }catch( PDOException $e){
            return ['code' => -2, 'data' => '', 'msg' => $e->getMessage()];
        }
    }



    /**
     * [updateArticle 编辑文章]
     * @author [jonny] [980218641@qq.com]
     */
    public function updateArticle($param)
    {
        try{
            $result = $this->allowField(true)->save($param, ['id' => $param['id']]);
            if(false === $result){
                return ['code' => 0, 'data' => '', 'msg' => $this->getError()];
            }else{
                return ['code' => 1, 'data' => '', 'msg' => '文章编辑成功'];
            }
        }catch( PDOException $e){
            return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
        }
    }



    /**
     * [getOneArticle 根据文章id获取一条信息]
     * @author [jonny] [980218641@qq.com]
     */
    public function getOneArticle($id)
    {
        return $this->where('id', $id)->find();
    }



    /**
     * [delArticle 删除文章]
     * @author [jonny] [980218641@qq.com]
     */
    public function delArticle($id)
    {
        try{
            $this->where('id', $id)->delete();
            return ['code' => 1, 'data' => '', 'msg' => '删除文章成功'];
        }catch( PDOException $e){
            return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
        }
    }

}
