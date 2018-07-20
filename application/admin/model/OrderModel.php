<?php
/**
 * 极客之家 高端PHP - 订单Model模块
 * @copyright  Copyright (c) 2016 QIN TEAM (http://www.qlh.com)
 * @license    GUN  General Public License 2.0
 * @version    Id:  Type_model.php 2016-6-12 16:36:52
 */
namespace app\admin\model;
use think\Model;
use think\Db;

class OrderModel extends Model
{

    protected $table = "order";

    /**
     * 查询用户对应订单列表
     * @return [type] [description]
     */
    public function OrderShowAll($page,$order_table,$user_table,$where) {
      $limits = 15;// 获取总条数
      $count = Db::connect("db_flowuser")->name($order_table)->alias("o")->where($where)->count();//计算总页面
      $allpage = intval(ceil($count / $limits));
      $lists = Db::connect("db_flowuser")
                      ->name($order_table)
                      ->alias("o")
                      ->where($where)
                      ->join("flow_".$user_table." u","o.user_id=u.user_id")
                      ->field("o.*,u.name")
                      // ->join("flow_news_label pl","p.label_id=pl.b_id")
                      ->page($page, $limits)
                      ->order("o.order_id desc")
                      ->select();
      foreach ($lists as $key => $val) {
        $lists[$key]['order_time'] = date("Y-m-d H:i:s",$val['order_time']);
        $lists[$key]['pay_time'] = date("Y-m-d H:i:s",$val['pay_time']);
      }
        return ['count'=>$count,'allpage'=>$allpage,'lists'=>$lists];
    }

}
