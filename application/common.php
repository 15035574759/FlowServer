<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2016 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: 流年 <liu21st@gmail.com>
// +----------------------------------------------------------------------

// 应用公共文件
//




/**
 * 高端PHP - 自定义函数
 *
 * @copyright  Copyright (c) 2016 QIN TEAM (http://www.qlh.com)
 * @license    GUN  General Public License 2.0
 * @version    Id:  Type_model.php 2016-6-12 16:36:52
 */

/**
 * 打印函数 打印关于变量的易于理解的信息。
 * @param  [type] $var [description]
 * @return [type]      [description]
 */
if (! function_exists('p'))
{
	function p($var)
	{
	 	echo "<pre>";
	  	print_r($var);
	    exit;
	}
}

/**
 * 打印函数 打印关于变量的详细信息。
 * @param  [type] $var [description]
 * @return [type]      [description]
 */
if (! function_exists('dd'))
{
	function dd($var)
	{
		echo "<pre>";
		var_dump($var);
		exit;
	}
}

/**
 * echo 打印函数 输出一个或者多个字符串
 * @param  [type] $val [description]
 * @return [type]      [description]
 */
if (! function_exists('e'))
{
	function e($val)
	{
		echo "<pre>";
		echo $val;
		exit;
	}
}

/**
 * [RecordDataLog 记录系统访问量、新用户数、新的留言、新的活动  以日期为单位统计]
 * @param  [type] $param [要更新的参数]
 * @param  [type] $status      [1 成功 2 失败]
 * @author [qinlh] [WeChat QinLinHui0706]
 */
function RecordDataLog($param = '') {
	$time = date("Y-m-d");
	$isExist = DB("statisc")->where("time_up",$time)->field("id")->find();
	if(true == $isExist) {
		//更新对应数据
		$res = @DB("statisc")->where('id',$isExist['id'])->setInc($param);
	} else {
		//添加一条数据
		$res = @DB("statisc")->insert([$param=>1,'time_up'=>$time,'time'=>date("Y-m-d H:i:s")]);
	}
	return ['code'=>1,'msg'=>'Log Success'];
}
