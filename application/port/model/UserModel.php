<?php
/**
 * 极客之家 高端PHP - 用户留资Model
 * @copyright  Copyright (c) 2016 QIN TEAM (http://www.qlh.com)
 * @license    GUN  General Public License 2.0
 * @version    Id:  Type_model.php 2017-7-5 16:36:52
 */
namespace app\port\model;
use think\Model;
use think\Db;
class UserModel extends Model
{
    protected $table = "flow_project";
    protected $name = 'project';

    /**
     * 用户添加
     * Test
     */
    public function ProjectAdd($data,$table)
    {
    	//过滤字段添加
    	return DB::name($table)->insert($data);
    }

    /**
     * 福特用户留资接口
     * @param [type] $data [数据]
     */
    public function FuteUserAdd($data,$table)
    {
        try{
            //先添加入库操作
            $dataArr = array(
                    'name'=>$data['name'],
                    'sex'=>$data['sex'],
                    'mobile'=>$data['mobile'],
                    'buy_time'=>$data['buy_time'],
                    'car_type'=>$data['car_type'],
                    'dealer_name'=>$data['dealer_name'],
                    'source'=>$data['source'],//来源渠道
                    'time'=>time(),
                );
            DB::connect("db_flowuser")->name($table)->insert($dataArr);
            $userId = Db::connect("db_flowuser")->name($table)->getLastInsID();
            if($userId > 1)
            {
                return ['code'=>1001,'data'=>$userId,'msg'=>"Add Data Success"];
            }
            else
            {
                return ['code'=>1007,'data'=>'','msg'=>"Add Data Error"];
            }

        }catch( PDOException $e){
            return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
        }

    }

    /**
     * 长城用户留资接口
     * @param [type] $data [数据]
     */
    public function ChangchenUserAdd($data)
    {
        try{
            //先添加入库操作
            $dataArr = array(
                    'name'=>$data['name'],
                    'mobile'=>$data['mobile'],
                    'car_type'=>$data['car_type'],
                    'dealer_name'=>$data['dealer_name'],
                    'sex'=>$data['sex'],
                    'source'=>$data['source'],//来源渠道
                    'time'=>time(),
                );
            DB::connect("db_flowuser")->name("user_changchen")->insert($dataArr);
            $userId = Db::connect("db_flowuser")->name("user_changchen")->getLastInsID();
            if($userId > 1)
            {
                return ['code'=>1001,'data'=>$userId,'msg'=>"Add Data Success"];
            }
            else
            {
                return ['code'=>1007,'data'=>'','msg'=>"Add Data Error"];
            }

        }catch( PDOException $e){
            return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
        }

    }
}
