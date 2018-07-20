<?php
/**
 * 极客之家 高端PHP - 用户留资列表
 * @copyright  Copyright (c) 2016 QIN TEAM (http://www.qlh.com)
 * @license    GUN  General Public License 2.0
 * @version    Id:  Type_model.php 2016-6-12 16:36:52
 */

namespace app\admin\model;
use think\Db;
use think\Model;
class CapitalModel extends Model
{
    protected $table = '';

    // 开启自动写入时间戳字段
    protected $autoWriteTimestamp = true;

    /**
     * 根据表名查询对应用户数据
     * @param  [type] $table [description]
     * @return [type]        [description]
     */
    public function UserListData($page,$table,$where)
    {
        try{
            // echo $where;die;
            // $arr = Db::name($table)->where("mobile","15110110706")->order("user_id desc")->select(); //获取用户列表
            // foreach ($arr as $kk => $vv) {
            //     $arr[$kk]['time'] = date("Y-m-d",$vv['time']);
            // }
            $limits = 30;// 获取总条数
            $count = Db::connect("db_flowuser")->name($table)->where($where)->count();//计算总页面
            // echo $count;die;
            $allpage = intval(ceil($count / $limits));
            $lists = Db::connect("db_flowuser")->name($table)->where($where)->page($page, $limits)->order('user_id desc')->select();
             foreach ($lists as $kk => $vv) {
                $lists[$kk]['time'] = date("Y-m-d H:i:s",$vv['time']);
            }
            $sql = "select COLUMN_NAME from information_schema.columns where table_name='flow_".$table."'";
            // echo $sql;die;
            $res = Db::connect("db_flowuser")->query($sql);
            $arr = [];
            foreach ($res as $key => $val) {
                $arr[] = $val['COLUMN_NAME'];
            }
            if (in_array("source_end",$arr)) {
                $is_column = 1;
            } else {
                $is_column = 0;
            }
            // p($lists);
            return ['count'=>$count,'allpage'=>$allpage,'list'=>$lists,'is_column'=>$is_column];

        }catch( PDOException $e){
            return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
        }
    }

    /**
     * 修改用户信息
     * 查询单条数据
     * 宝沃
     * @param [type] $id [description]
     */
    public function BuserWfind($id)
    {
        return DB::name("user_baowo")->where("dealer_id",$id)->find();
    }

    /**
     * 修改用户信息
     * 查询单条数据
     * 东标
     * @param [type] $id [description]
     * @param [type] $table [查询表]
     */
    public function DuserBfind($id,$table)
    {
        return DB::name($table)->where("user_id",$id)->find();
    }

    /**
     * 修改用户数据
     * 宝沃
     * @param [type] $data [description]
     */
    public function BuserWedit($data)
    {
        try{
            $result = DB::name("user_baowo")->where("dealer_id",$data['id'])->update(["name"=>$data['name'],"phone"=>$data['phone'],"city"=>$data['citys'],"time"=>time()]);
            if(false === $result){
                return ['code' => 0, 'data' => '', 'msg' => $this->getError()];
            }else{
                return ['code' => 1, 'data' => '', 'msg' => '修改成功'];
            }
        }catch( PDOException $e){
            return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
        }
    }

    /**
     * 修改用户数据
     * 东标项目
     * @param [type] $data  [新修改数据]
     * @param [type] $table [修改用户表]
     */
    public function DuserBedit($data,$table)
    {
        try{
            $result = DB::name($table)->where("user_id",$data['id'])->update(["name"=>$data['name'],"phone"=>$data['phone'],"dealer_name"=>$data['cityId'],"models"=>$data['models'],"time"=>time()]);
            if(false === $result){
                return ['code' => 0, 'data' => '', 'msg' => $this->getError()];
            }else{
                return ['code' => 1, 'data' => '', 'msg' => '修改成功'];
            }
        }catch( PDOException $e){
            return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
        }
    }


    /**
     * 删除用户留资 宝沃
     * @param $id
     */
    public function BuserWdel($id)
    {
        try{

            DB::name("user_baowo")->where('dealer_id', $id)->delete();
            Db::name('lotuser')->where('userid', $id)->delete();
            writelog(session('admin_uid'),session('username'),'用户【'.session('admin_username').'】删除留资用户成功(ID='.$id.')',1);
            return ['code' => 1, 'data' => '', 'msg' => '删除留资用户成功'];

        }
        catch( PDOException $e)
        {
            return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
        }
    }

    /**
     * 删除用户留资 东标
     * @param [type] $id            [删除用户ID]
     * @param [type] $table         [用户表]
     * @param [type] $lotuser_table [用户奖品表]
     */
    public function DuserBdel($id,$table,$lotuser_table)
    {
        try{
            DB::name($table)->where('user_id', $id)->delete();
            Db::name($lotuser_table)->where('userid', $id)->delete();
            writelog(session('admin_uid'),session('username'),'用户【'.session('admin_username').'】删除留资用户成功(ID='.$id.')',1);
            return ['code' => 1, 'data' => '', 'msg' => '删除留资用户成功'];
        }
        catch( PDOException $e)
        {
            return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
        }
    }


    //************************************* 一条奇怪的分界线 一下为公用的 *****************************************


    /**
     * 删除用户留资
     * @param [type] $id   [删除用户ID]
     * @param [type] $table [用户表]
     */
    public function DealerDel($id,$table)
    {
        try {
            DB::connect("db_flowuser")->name($table)->where('user_id', $id)->delete();
            writelog(session('admin_uid'),session('username'),'用户【'.session('admin_username').'】删除留资用户成功(ID='.$id.')',1);
            return ['code' => 1, 'data' => '', 'msg' => '删除留资用户成功'];
        }catch( PDOException $e){
            return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
        }
    }

    /**
     * 懂车帝订单详情查询
     * @param [type] $id   [用户ID]
     * @param [type] $table   [用户表]
     */
    public function OrderDetail($id,$table)
    {
        // p($table);
        try {
            $data = DB::connect("db_flowuser")->name('cardili_order')->join($table,"flow_cardili_order.user_id = ".$table.".user_id")->where('flow_cardili_order.user_id', $id)->find();
            if ($data) {
                return ['code' => 1, 'data' => $data];
            } else {
                return ['code' => 0, 'data' => ''];
            }
        }catch( PDOException $e){
            return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
        }
    }
}
