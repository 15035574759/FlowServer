<?php
/**
 * 极客之家 高端PHP - 留言管理模块
 * @copyright  Copyright (c) 2000-2017 QIN TEAM (http://www.qlh.com)
 * @version    GUN  General Public License 10.0.0
 * @license    Id:  Leave.php 2017-7-7 23:59:59
 * @author     Qinlh WeChat QinLinHui0706
 */
namespace app\admin\controller;
use app\admin\model\LeaveModel;
use think\Db;

class Leave extends Base
{

  /**
   * [leavelList] [留言列表]
   * @return [type] [description]
   * @author [qinlh] [WeChat QinLinHui0706]
   */
  public function leave_list() {
      $page = input('get.page') ? input('get.page') : 1;//当前页
      $where = [];
      $where['leave_start'] = 1;
      $leave = new LeaveModel();
      $data = $leave->leave_list($page,$where);
      $count = $data['count'];
      $allpage = $data['allpage'];
      $lists = $data['lists'];
      $this->assign([
          'count'  => $count,//总条数
          'allpage' => $allpage,//总页面
      ]);
      if(input('get.page')){
          return json($lists);//数据
      }
      return $this->fetch();
  }



  /**
   * [LeaveUserData] [用户留言数据]
   * @return [type] [description]
   * @author [qinlh] [WeChat QinLinHui0706]
   */
  public function leave_user_list() {
    $project_id = input('get.project_id') ? input('get.project_id') : '';
    $page = input('get.page') ? input('get.page') : 1;//当前页
    $leave_table = DB::name("leave_table")->where("project_id",$project_id)->field("leave_table")->find()['leave_table'];
    $where = [];
    $leave = new LeaveModel();
    $data = $leave->LeaveUserData($page,$where,$leave_table);
    // p($data);
    $count = $data['count'];
    $allpage = $data['allpage'];
    $lists = $data['lists'];

    $this->assign([
        'count'  => $count,//总条数
        'allpage' => $allpage,//总页面
    ]);
    if(input('get.page')){
        return json($lists);//数据
    }
    $this->assign('project_id', $project_id);
    $this->assign('leave_table', $leave_table);
    return $this->fetch();
  }

  /**
   * [LeaveStart 留言状态]
   * @return [type] [description]
   * @author [jonny] [980218641@qq.com]
   */
  public function LeaveStart()
  {
      $id = input('param.id');
      $table = input('param.table');
      $status = Db::connect("db_flowuser")->name($table)->where(array('id'=>$id))->value('start');//判断当前状态情况
      if($status == 1)
      {
          $flag = Db::connect("db_flowuser")->name($table)->where(array('id'=>$id))->setField(['start'=>0]);
          return json(['code' => 1, 'data' => $flag['data'], 'msg' => '已禁止']);
      }
      else
      {
          $flag = Db::connect("db_flowuser")->name($table)->where(array('id'=>$id))->setField(['start'=>1]);
          return json(['code' => 0, 'data' => $flag['data'], 'msg' => '已开启']);
      }
    }

    /**
     * 删除留言信息数据
     * @return [type] [description]
     */
    public function leave_delete()
    {
        $id = input('param.id');
        $table = input('param.table');
        $leave  = new LeaveModel;
        $flag = $leave->leave_delete($id,$table);
        return json(['code' => $flag['code'], 'data' => $flag['data'], 'msg' => $flag['msg']]);
    }
}
