<?php
/**
 * 极客之家 高端PHP - 导航Model模块
 * @copyright  Copyright (c) 2016 QIN TEAM (http://www.qlh.com)
 * @license    GUN  General Public License 2.0
 * @version    Id:  Type_model.php 2017-7-14 16:36:52
 */
namespace app\admin\model;
use think\Model;
use think\Db;
class NavModel extends Model
{
	protected $table = "nav";

	/**
	 * 导航列表
	 * @return [type] [description]
	 */
	public function nav_list($page)
	{
		$BasePage  = new BaseModel;
        $table = "nav";
        $where = 1;
        $id = "id";//自增ID
        $DataArr = $BasePage->GetPage($table,$where,$page,$id);//查询分页数据
        return ['count'=>$DataArr['count'],'allpage'=>$DataArr['allpage'],'lists'=>$DataArr['lists']];
	}
}