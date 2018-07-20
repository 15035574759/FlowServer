<?php
/**
 * 极客之家 高端PHP - 订单管理
 * @copyright  Copyright (c) 2018 QIN TEAM (http://www.qlh.com)
 * @license    GUN  General Public License 2.0
 * @version    Id:  Order.php 2018-1-13 16:36:52
 */
namespace app\admin\controller;
use think\Config;
use think\Db;
use think\Session;
use think\Request;
use app\admin\model\OrderModel;
use app\admin\model\BaseModel;
class Order extends Base
{

    /**
     * [order_list] [用户订单列表]
     * @return [type] $param['id'] [用户id]
     * @return [type] $param['table'] [用户表]
     * @author [qinlh] [WeChat QinLinHui0706]
     */
    public function order_list() {
      $param = input("param.");
      $page = input('get.page') ? input('get.page') : 1;//当前页
      $order = new OrderModel;
      $where = [];
      $where['o.user_id'] = $param['id'];
      $order_table = explode('_', $param['table'])[1]."_order"; // 用户订单表
      $data = $order->OrderShowAll($page,$order_table,$param['table'],$where);
      // p($data);
      $count = $data['count'];
      $allpage = $data['allpage'];
      $lists = $data['lists'];
      $this->assign([
          'count'  => $count,//总条数
          'allpage' => $allpage,//总页面
          'user_id' => $param['id'],//用户id
          'table' => $param['table'],//用户表
      ]);
      if(input('get.page')){
          return json($lists);//数据
      }
      return $this->fetch();
    }

    /**
    * 修改用户信息状态
    * @return [type] [description]
    */
   public function OrderStart()
   {
       $id = input('param.id') ? input('param.id') : 0;//接受数据ID
       $table = input('param.table') ? input('param.table') : '';//用户表
       $order_table = explode('_', $table)[1]."_order";
      //  p($id);
       $state = Db::connect("db_flowuser")->name($order_table)->where(array('order_id'=>$id))->value('state');//判断当前状态情况
       if($state == 1)
       {
           $flag = Db::connect("db_flowuser")->name($order_table)->where(array('order_id'=>$id))->setField(['state'=>0]);
           return json(['code' => 1, 'data' => $flag['data'], 'msg' => '已禁止']);
       }
       else
       {
           $flag = Db::connect("db_flowuser")->name($order_table)->where(array('order_id'=>$id))->setField(['state'=>1]);
           return json(['code' => 0, 'data' => $flag['data'], 'msg' => '已开启']);
       }
   }
}
