<?php
/**
 * 极客之家 高端PHP - 项目模块
 * @copyright  Copyright (c) 2016 QIN TEAM (http://www.qlh.com)
 * @license    GUN  General Public License 2.0
 * @version    Id:  Type_model.php 2016-6-12 16:36:52
 */
namespace app\admin\model;
use think\Model;
use think\Db;

class ThorprojectModel extends Model
{

    protected $table = "flow_project";
    protected $name = "project";

    /**
     * 查询其他所有项目
     * @return [type] [description]
     */
    public function showAll($page)
    {
      $where = [];
      $where['other_start'] = 1; //查询其他项目
      //查询当前用户拥有哪些项目查看权限
      $UserProjectAuthor = DB::name("admin")->where("id",session('admin_uid'))->field('id,project_start')->find()['project_start'];
      if($UserProjectAuthor != 0) {
        $where['id'] =['in',$UserProjectAuthor];
      }
      // p($where);
      $limits = 15;// 获取总条数
      $count = Db::name($this->name)->where($where)->count();//计算总页面
      $allpage = intval(ceil($count / $limits));
    	$lists = Db::name($this->name)
                      ->where($where)
                      ->alias("p")
                      ->join("flow_project_class pc","p.class_id=pc.c_id")
                      // ->join("flow_project_label pl","p.label_id=pl.b_id")
                      ->page($page, $limits)
                      ->order("id desc")
                      ->select();
      //查询标签以及分类、描述、名称字数控制
    	foreach ($lists as $key => $val)
      {
        $lists[$key]['label_id'] = Db::name("project_label")->where("b_id",'in',$val['label_id'])->select();
    		$lists[$key]['class_id'] = Db::name("project_class")->where("c_id",'in',$val['class_id'])->field("c_id,class_name")->select();
        $lists[$key]['project_name'] = mb_strlen($val['project_name'], 'utf-8') > 15 ? mb_substr($val['project_name'], 0, 15, 'utf-8').'....' : $val['project_name'];
        $lists[$key]['describe'] = mb_strlen($val['describe'], 'utf-8') > 9 ? mb_substr($val['describe'], 0, 9, 'utf-8').'....' : $val['describe'];
    	}
        // p($lists);
        return ['count'=>$count,'allpage'=>$allpage,'lists'=>$lists];
    }

    /**
     * [showAllProject] [项目管理列表]
     * @return [type] [description]
     * @author [qinlh] [WeChat QinLinHui0706]
     */
    public function showAllProject()
    {
      try{
          $list = DB::name("project")->field("id,project_name")->select();
          if(false == $list){
              return ['code' => 0, 'data' => '', 'msg' => $this->getError()];
          }
          foreach ($list as $key => $val) {
              $list[$key]['project_name'] = mb_strlen($val['project_name'], 'utf-8') > 9 ? mb_substr($val['project_name'], 0, 9, 'utf-8').'....' : $val['project_name'];
          }
          return $list;
      }catch( PDOException $e){
          return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
      }
    }
}
