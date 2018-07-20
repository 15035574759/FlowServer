<?php
/**
 * 极客之家 高端PHP - 留言功能Model
 * @copyright  Copyright (c) 2016 QIN TEAM (http://www.qlh.com)
 * @license    GUN  General Public License 2.0
 * @version    Id:  Type_model.php 2016-6-12 16:36:52
 */

namespace app\admin\model;
use think\Db;
use think\Model;
class LeaveModel extends Model
{
	protected $name = 'table';

  /**
   * 留言列表
   * @param  [type] $page  [当前页]
   * @param  [type] $where [查询条件]
   * @return [type]        [数组]
   */
  public function leave_list($page,$where) {
    $limits = 15;// 获取总条数
    $count = Db::name("project")->where($where)->count();//计算总页面
    $allpage = intval(ceil($count / $limits));
    $lists = Db::name("project")
                    ->where($where)
                    ->page($page, $limits)
                    ->order("id desc")
                    ->select();
    return ['count'=>$count,'allpage'=>$allpage,'lists'=>$lists];
  }

  /**
   * 查询对应留言表名称
   * @param [type] $id [description]
   */
  public function LeaveTable($id) {
    try{
      return DB::name("leave_table")->where("project_id",$id)->field("leave_table")->find()['leave_table'];
    }catch( PDOException $e){
        return ['code' => -2, 'data' => '', 'msg' => $e->getMessage()];
    }
  }

  /**
   * 留言数据
   * @param [type] $page  [当前页]
   * @param [type] $where [查询条件]
   * @param [type] $table [表名]
   */
  public function LeaveUserData($page,$where,$table) {
    $limits = 30;// 获取总条数
    $count = Db::connect("db_flowuser")->name($table)->where($where)->count();//计算总页面
    $allpage = intval(ceil($count / $limits));
    $lists = Db::connect("db_flowuser")->name($table)
                    ->where($where)
                    ->page($page, $limits)
                    ->order("id desc")
                    ->select();
    return ['count'=>$count,'allpage'=>$allpage,'lists'=>$lists];
  }


	/**
	* 删除项目详情 列表
	* @param [type] $id [description]
	*/
 public function leave_delete($id,$table)
 {
		 try{
				 //查询项目封面图片
				 $res = DB::connect("db_flowuser")->name($table)->where('id', $id)->delete();
				 if(false == $res) {
					 	return ['code' => -1, 'data' => '', 'msg' => '删除项目失败'];
				 }
				 return ['code' => 1, 'data' => '', 'msg' => '删除项目成功'];
		 }
		 catch( PDOException $e)
		 {
				 return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
		 }
}

}
