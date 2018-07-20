<?php
/**
 * 极客之家 高端PHP - 采集管理模块
 * @copyright  Copyright (c) 2016 QIN TEAM (http://www.qlh.com)
 * @license    GUN  General Public License 2.0
 * @version    Id:  Type_model.php 2016-6-12 16:36:52
 */
namespace app\admin\controller;
use think\Controller;
use think\Request;
use think\Db;
use app\admin\model\GatherModel;
class Gather extends Controller	
{
	/**
	 * 采集列表
	 * @return [type] [description]
	 */
	public function index()
	{
		return $this->fetch();
	}

	/**
	 * 计划采集
	 * @return [type] [description]
	 */
	public function get_gather()
	{
		return $this->fetch();
	}

	/**
	 * 开始采集
	 * @return [type] [description]
	 */
	public function gather_add()
	{
		$gather = new GatherModel();
		
		$url1 = "http://xinsanban.eastmoney.com/Article/NewsList/881.html";
		$url2 = "http://xinsanban.eastmoney.com/Article/NewsList/884.html";
		$url3 = "http://xinsanban.eastmoney.com/Article/NewsList/894.html";
		$DataUrl = $gather->GatherUrl($url1,$url2,$url3);//得到采集的链接地址
		// print_r($DataUrl);die;
		//根据采集到的链接地址采集详情页内容
		$flag = $gather->GatherDetails($DataUrl['data']);

		return json(['code' => $flag['code'], 'data' => $flag['data'], 'msg' => $flag['msg']]);
	}
}