<?php
/**
 * 极客之家 高端PHP - 用户留资
 * 长城
 * @copyright  Copyright (c) 2016 QIN TEAM (http://www.qlh.com)
 * @license    GUN  General Public License 2.0
 * @version    Id:  Type_model.php 2016-6-12 16:36:52
 */
namespace app\port\controller;
use think\Controller;
use think\Config;
use think\Db;
use think\Session;
use think\Cache;
use think\Loader;
use app\port\model\SecureModel;
use app\port\model\UserModel;
use app\port\model\CityModel;
use app\port\model\UserlottercaceModel;
class Usercacelotter extends Controller
{
	/**
	 * 用户留资入库
	 * @param [data] [接受数据]
	 */
	public function UserLotter()
	{
		// $str = "-1,-1";
		// $sin = strpos($str,"-1");
		// var_dump($sin);die;
		$secure = new SecureModel;
		$Userlotter = new UserModel;
		$data = input("param.");
	 	if(!isset($data) || empty($data['mobile'])){
			exit(json_encode(array("code"=>1004,"msg"=>"数据传入有误")));
		}
		$data['dealer_name'] = strpos($data['dealer_name'],"-1") === false ? $data['dealer_name'] : "未选择";
		$data['car_type'] = $data['car_type'] === "-1" ? "未选择" : $data['car_type'];
		// echo $data['mobile'];die;

		// $enc = $data['key'];  //加密串 检测
		// $encckend = $secure->Ckencstr($enc); //检测结果

		// //判断手机号是否合法
		if(!preg_match("/1[34758]{1}\d{9}$/",$data['mobile'])){
			exit(json_encode(array("scode"=>1002,"msg"=>"手机号不合法")));
		}

		// //判断手机号是否存在
		$phoneBe = DB::connect("db_flowuser")->name("user_changchen")->where("mobile",$data['mobile'])->find();
		if($phoneBe || !empty($phoneBe)){
			exit(json_encode(array("code"=>1003,"msg"=>"该手机已经注册")));
		}

		//判断当前是否为手机客户端访问
		// $isMobile = $secure->isMobile();
		// if($isMobile == false){
		// 	exit(json_encode(array("start"=>1004,"msg"=>"访问设备出错")));
		// }

		//开始添加入库
		$arr = $Userlotter->ChangchenUserAdd($data);
		exit(json_encode($arr));
	}


	/**
	 * 查询福特经销商数据
	 * @return [type] [description]
	 */
	public function ShowDealerData()
	{
		$city = new CityModel();
		$data = $city->ShowChangchenDealerAll();
		// p($data);
		$DealerDataFute = json_encode($data);
		if(Cache::get('DealerDataFute'))
		{
			$GetDealerData = Cache::get('DealerDataFute');
		}
		else
		{
			Cache::set('DealerDataFute',$DealerDataFute,3600);
			$GetDealerData = Cache::get('DealerDataFute');
		}
		exit($GetDealerData);
	}














































	//*************************************扒取长城官网数据--就是闲的慌(一次性使用)*****************************************

	/**
	 * 计划自己扒长城数据
	 */
	public function GatherDealer()
	{
		ini_set('max_execution_time', '0');
		$cace = new UserlottercaceModel();
		//获取长城经销商数据
		$url = "http://www.wey.com/wey2017/province";
		$data = file_get_contents($url);
		$DataArr = json_decode($data,true);
		$DealerName = array();
		foreach ($DataArr as $key => $val) {
			$url01 = "http://www.wey.com/wey2017/carclass?province=".$val['province']."&city=".$val['city'];
			$DataArr[$key]['dealerName'] = json_decode(file_get_contents($url01),true);
		}
		p($DataArr);
		// $json = json_encode($DataArr);
		// echo $json;die; //保存到文件里面 以便好测试

		// $dataArr = json_decode(file_get_contents('upload/testfile/dealer_name.php'),true);
		// p($dataArr);
		// foreach ($dataArr as $key => $val)
		// {
		// 	//先检测省份是否存在
		// 	$province = $cace->ExistQueryDealer($val['province']);
		// 	if($province)
		// 	{
		// 		//检测城市是否存在
		// 		$city = $cace->ExistQueryDealer($val['city']);
		// 		if($city)
		// 		{
		// 			//继续入库经销商
		// 			foreach ($val['dealerName'] as $k => $v)
		// 			{
		// 				$dealerData = ['dealer_name'=>$v['name'],'pid'=>$city[0]['dealer_id']];
		// 				$dealerId = $cace->ExistAddDealer($dealerData);
		// 			}
		// 		}
		// 		else
		// 		{
		// 			//继续入库市
		// 			$cityData = ['dealer_name'=>$val['city'],'pid'=>$province[0]['dealer_id']];
		// 			$cityId = $cace->ExistAddDealer($cityData);
		// 			//继续入库经销商
		// 			foreach ($val['dealerName'] as $k => $v)
		// 			{
		// 				$dealerData = ['dealer_name'=>$v['name'],'pid'=>$cityId];
		// 				$dealerId = $cace->ExistAddDealer($dealerData);
		// 			}
		// 		}
		// 	}
		// 	else
		// 	{
		// 		//先入库省
		// 		$provinceData = ['dealer_name'=>$val['province'],'pid'=>0];
		// 		$provinceId = $cace->ExistAddDealer($provinceData);
		// 		//继续入库市
		// 		$cityData = ['dealer_name'=>$val['city'],'pid'=>$provinceId];
		// 		$cityId = $cace->ExistAddDealer($cityData);
		// 		//继续入库经销商
		// 		foreach ($val['dealerName'] as $k => $v)
		// 		{
		// 			$dealerData = ['dealer_name'=>$v['name'],'pid'=>$cityId];
		// 			$dealerId = $cace->ExistAddDealer($dealerData);
		// 		}
		// 	}
		// }
	}

	//************************************* 扒取长城官网数据 -- 使用一次以后不再用 end *****************************************

}
