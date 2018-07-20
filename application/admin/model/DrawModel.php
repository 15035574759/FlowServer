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
class DrawModel extends Model
{
    protected $table = '';


    /**
     * 添加活动
     * @param [type] $data [description]
     */
    public function DrawAdd($data)
    {
        try{
            $drawtable_name = $data['drawtable_name'];
            $drawuser_table = $data['drawuser_table'];
            //首先判断是否存在活动用户表以及活动概率表
            if(false == @DB::connect("db_flowuser")->query("SHOW TABLES LIKE '%$drawuser_table%'")) {
                  @DB::connect("db_flowuser")->query("
                        CREATE TABLE `flow_$drawuser_table` (
                            `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '获奖用户信息 主键',
                            `userid` int(11) NOT NULL COMMENT '用户id',
                            `phone` char(11) NOT NULL COMMENT '用户手机号',
                            `lotid` tinyint(2) NOT NULL COMMENT '奖项id',
                            `status` tinyint(2) NOT NULL DEFAULT '0' COMMENT '0为未领取，1为已领取，2后台取消,3中奖，奖项无库存，插入',
                            `proid` int(5) NOT NULL DEFAULT '0' COMMENT '项目id',
                            `bflotid` tinyint(2) NOT NULL DEFAULT '0' COMMENT '中奖无库存情况，加入中奖id',
                            PRIMARY KEY (`id`)
                        ) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
                    ");
              }
            if(false == @DB::query("SHOW TABLES LIKE '%$drawtable_name%'")) {
                @DB::query("
                        CREATE TABLE `flow_$drawtable_name` (
                          `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键id',
                          `name` varchar(255) NOT NULL COMMENT '奖项名称',
                          `chance` double(7,3) NOT NULL COMMENT '获奖概率',
                          `num` int(4) NOT NULL COMMENT '奖品数量',
                          `status` tinyint(2) NOT NULL DEFAULT '1' COMMENT '是否开启，状态',
                          `sumnum` int(11) NOT NULL COMMENT '奖品总数量',
                          PRIMARY KEY (`id`)
                        ) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
                    ");
            }
            $data['time'] = date("Y-m-d");
            if($data['start'] == 'on'){$data['start'] = 0;}
            $result = DB::name("draw")->insert($data);
            if(false === $result){
                return ['code' => -1, 'data' => '', 'msg' => $this->getError()];
            }else{
                return ['code' => 1, 'data' => '', 'msg' => '添加成功'];
            }
        }catch( PDOException $e){
            return ['code' => -2, 'data' => '', 'msg' => $e->getMessage()];
        }
    }

    /**
     * 修改活动列表  查询修改数据
     * @param  [type] $id [修改id]
     * @return [type]     [description]
     */
    public function activity_updateshow($id)
    {
        return DB::name("draw")->where("draw_id",$id)->find();
    }

    /**
     * 修改活动列表数据
     * @param  [type] $id    [修改ID]
     * @param  [type] $param [修改数据]
     * @return [type]        [description]
     */
    public function activity_update($id,$param)
    {
        try{
            if($param['start'] == 'on'){$param['start'] = 0;}
            $result = DB::name("draw")->where("draw_id",$id)->update($param);
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
     * 删除活动列表
     * @param  [type] $id [删除ID]
     * @return [type]     [description]
     */
    public function activity_delete($id)
    {
        try{
            Db::name('draw')->where('draw_id', $id)->delete();
            writelog(session('admin_uid'),session('username'),'用户【'.session('admin_username').'】删除留资用户成功(ID='.$id.')',1);
            return ['code' => 1, 'data' => '', 'msg' => '删除活动详情成功'];
        }
        catch( PDOException $e)
        {
            return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
        }
    }

    /**
     * 奖品详情
     */
    public function ActivityDetails($table)
    {
        return DB::name($table)->select();
    }

    /**
     * 添加活动奖品
     * @param [type] $data  添加数据
     * @param [type] $table 表名
     */
    public function add_lotter($data,$table)
    {
        try{
            if($data['status'] == 'on'){$data['status'] = 0;}
            $result = DB::name($table)->insert($data);
            if(false === $result){
                return ['code' => 0, 'data' => '', 'msg' => $this->getError()];
            }else{
                return ['code' => 1, 'data' => '', 'msg' => '添加成功'];
            }
        }catch( PDOException $e){
            return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
        }
    }

    /**
     * 查询对应单条奖品
     * @param [type] $id    奖品id
     * @param [type] $table 表名
     */
    public function LotterFindname($id,$table)
    {
        return DB::name($table)->where("id",$id)->find();
    }

    /**
     * 根据条件修改奖品
     * @param  [type] $id    [奖品id]
     * @param  [type] $table [表]
     * @param  [type] $param [修改数据]
     * @return [type]        [true]
     */
    public function updatelotter_name($id,$table,$param)
    {
      try{
            if($param['status'] == 'on'){$param['status'] = 0;}
            $result = DB::name($table)->where("id",$id)->update($param);
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
     * 删除活动详情 列表
     * @param [type] $id [description]
     */
    public function PrizeDel($id,$table)
    {
        try{
            Db::name($table)->where('id', $id)->delete();
            return ['code' => 1, 'data' => '', 'msg' => '删除活动详情成功'];
        }
        catch( PDOException $e)
        {
            return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
        }
    }

    /**
     * 查询活动列表
     * @return [type] [description]
     */
    public function ActivityAll()
    {
        return DB::name("draw")->field("draw_id,draw_name")->select();
    }
}
