<?php
/**
 * 极客之家 高端PHP - 长城Model
 * @copyright  Copyright (c) 2016 QIN TEAM (http://www.qlh.com)
 * @license    GUN  General Public License 2.0
 * @version    Id:  Type_model.php 2016-6-12 16:36:52
 */
namespace app\port\model;
use think\Model;
use think\Db;
class UserlottercaceModel extends Model
{
    protected $table = 'user_changche';

//*************************************扒取长城官网数据--就是为了测试(一次性使用)*****************************************
    /**
	 * 检测名称是否存在
	 * @param [type] $name [description]
	 */
	function ExistQueryDealer($name)
	{
		return DB::connect("db_flowuser")->name("dealer_changchen")->field("dealer_id")->where('dealer_name',$name)->select();
	}

	/**
	 * 批量入库
	 * @param [type] $name [description]
	 */
	function ExistAddDealer($data)
	{
		DB::connect("db_flowuser")->name("dealer_changchen")->insert($data);
		return DB::connect("db_flowuser")->name("dealer_changchen")->getLastInsID(); 
	}


}
