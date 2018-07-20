<?php
/**
 * 极客之家 高端PHP - 用户留资
 * 福特
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
class Userftlotter extends Controller
{
	/**
	 * 用户注册
	 * @return [type] [description]
	 */
	public function UserLotter()
	{
		//检测该秘钥是否使用
		$secure = new SecureModel;
		$Userlotter = new UserModel;

		//判断当前是否为手机客户端访问
		$isMobile = $secure->isMobile();
		if($isMobile == false){
			exit(json_encode(array("start"=>1004,"msg"=>"访问设备出错")));
		}

		$data = input("param.");
	 	if(!isset($data) || empty($data['mobile']) && empty($data['chart'])){
			exit(json_encode(array("code"=>1041,"msg"=>"数据传入有误")));
		}
		$table = $data['chart'];
		// @unset($data['chart']);
		// $enc = $data['key'];  //加密串 检测
		// $encckend = $secure->Ckencstr($enc); //检测结果
		//
		// //return json_encode( $encckend);
		// if($encckend != 1)
		// {
		// 	exit(json_encode(['code'=>1005,'msg'=>'key值验证失败']));
		// }

		// //判断手机号是否合法
		if(!preg_match("/1[34758]{1}\d{9}$/",$data['mobile'])){
			exit(json_encode(array("scode"=>1002,"msg"=>"手机号不合法")));
		}

		// //判断手机号是否存在
		$phoneBe = DB::connect("db_flowuser")->name($table)->where("mobile",$data['mobile'])->find();
		if($phoneBe || !empty($phoneBe)){
			exit(json_encode(array("code"=>1003,"msg"=>"该手机已经注册")));
		}


		//开始添加入库
		$arr = $Userlotter->FuteUserAdd($data,$table);
		exit(json_encode($arr));
	}

	/**
	 * 查询福特经销商数据
	 * @return [type] [description]
	 */
	public function ShowDealerData()
	{
		$city = new CityModel();
		$data = $city->ShowFtDealerAll();
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
		exit($DealerDataFute);
	}

	/**
	 * 随机查询对应媒体渠道三个经纪人信息
	 * @param $source [渠道编码 0随机三条 1天津玩艺儿 2看天津 3天津生活通 4乐活北京  5石家庄本地通 6掌控沧州 7家在济南 8青岛圈 9晋城头条 10太原人微生活]
	 * @return [type] [description]
	 */
	public function RandomBroker()
	{
		$source = input("param.source") ? input("param.source") : 0;
		$table = input("param.chart") ? input("param.chart") : '';
		if(empty($table)){
			exit(json_encode(array("code"=>1041,"msg"=>"数据传入有误")));
		}

		switch ($source)
		{
			case 0:
		  	  //查询所有经纪人 随机取出三条信息
			  $BrokerData = DB::connect("db_flowuser")->name($table)->where("pro_id","<>",0)->order("RAND()")->field("pro_id,dealer_id,dealer_name,pid")->limit(3)->select();
			  foreach ($BrokerData as $key => $val)
			  {
				$DataArr[] = DB::connect("db_flowuser")->name($table)->where("pid",$val['pid'])->order("RAND()")->field("dealer_name,pid")->limit(1)->find();
			  }
			  break;
			case 1:
			  //如果为 1 的话 随机查询天津经纪人数据 天津自增ID 175
			  $BrokerData = DB::connect("db_flowuser")->name($table)->where("pid",175)->order("RAND()")->field("dealer_id,dealer_name,pid")->limit(3)->select();
			  // p($BrokerData);
			  foreach ($BrokerData as $key => $val)
			  {
				$DataArr[] = DB::connect("db_flowuser")->name($table)->where("pid",$val['dealer_id'])->order("RAND()")->field("dealer_name,pid")->limit(1)->find();
			  }
			  break;
			case 2:
			  //如果为 2 的话 随机查询天津经纪人数据 天津自增ID 175
			  $BrokerData = DB::connect("db_flowuser")->name($table)->where("pid",175)->order("RAND()")->field("dealer_id,dealer_name,pid")->limit(3)->select();
			  foreach ($BrokerData as $key => $val)
			  {
				$DataArr[] = DB::connect("db_flowuser")->name($table)->where("pid",$val['dealer_id'])->order("RAND()")->field("dealer_name,pid")->limit(1)->find();
			  }
			  break;
			case 3:
			  //如果为 3 的话 随机查询天津经纪人数据 天津自增ID 175
			  $BrokerData = DB::connect("db_flowuser")->name($table)->where("pid",175)->order("RAND()")->field("dealer_id,dealer_name,pid")->limit(3)->select();
			  foreach ($BrokerData as $key => $val)
			  {
				$DataArr[] = DB::connect("db_flowuser")->name($table)->where("pid",$val['dealer_id'])->order("RAND()")->field("dealer_name,pid")->limit(1)->find();
			  }
			  break;
			case 4:
			  //如果为 4 的话 随机查询北京经纪人数据 北京自增ID 83
			  $BrokerData = DB::connect("db_flowuser")->name($table)->where("pid",83)->order("RAND()")->field("dealer_id,dealer_name,pid")->limit(3)->select();
			  foreach ($BrokerData as $key => $val)
			  {
				$DataArr[] = DB::connect("db_flowuser")->name($table)->where("pid",$val['dealer_id'])->order("RAND()")->field("dealer_name,pid")->limit(1)->find();
			  }
			  break;
			case 5:
			  //如果为 5 的话 随机查询石家庄经纪人数据 石家庄自增ID 58
			  $BrokerData = DB::connect("db_flowuser")->name($table)->where("pid",58)->order("RAND()")->field("dealer_id,dealer_name,pid")->limit(3)->select();
			  foreach ($BrokerData as $key => $val)
			  {
				$DataArr[] = DB::connect("db_flowuser")->name($table)->where("pid",$val['dealer_id'])->order("RAND()")->field("dealer_name,pid")->limit(1)->find();
			  }
			  break;
			case 6:
			  //如果为 6 的话 随机查询沧州经纪人数据 沧州自增ID 352
			  $BrokerData = DB::connect("db_flowuser")->name($table)->where("pid",352)->order("RAND()")->field("dealer_id,dealer_name,pid")->limit(3)->select();
			  foreach ($BrokerData as $key => $val)
			  {
				$DataArr[] = DB::connect("db_flowuser")->name($table)->where("pid",$val['dealer_id'])->order("RAND()")->field("dealer_name,pid")->limit(1)->find();
			  }
			  break;
			case 7:
			  //如果为 7 的话 随机查询济南经纪人数据 济南自增ID 161
			  $BrokerData = DB::connect("db_flowuser")->name($table)->where("pid",161)->order("RAND()")->field("dealer_id,dealer_name,pid")->limit(3)->select();
			  foreach ($BrokerData as $key => $val)
			  {
				$DataArr[] = DB::connect("db_flowuser")->name($table)->where("pid",$val['dealer_id'])->order("RAND()")->field("dealer_name,pid")->limit(1)->find();
			  }
			  break;
			case 8:
			  //如果为 8 的话 随机查询青岛经纪人数据 青岛自增ID 263
			  $BrokerData = DB::connect("db_flowuser")->name($table)->where("pid",263)->order("RAND()")->field("dealer_id,dealer_name,pid")->limit(3)->select();
			  foreach ($BrokerData as $key => $val)
			  {
				$DataArr[] = DB::connect("db_flowuser")->name($table)->where("pid",$val['dealer_id'])->order("RAND()")->field("dealer_name,pid")->limit(1)->find();
			  }
			  break;
			case 9:
			  //如果为 9 的话 随机查询晋城经纪人数据 晋城自增ID 584
			  $BrokerData = DB::connect("db_flowuser")->name($table)->where("pid",584)->order("RAND()")->field("dealer_id,dealer_name,pid")->limit(3)->select();
			  foreach ($BrokerData as $key => $val)
			  {
				$DataArr[] = DB::connect("db_flowuser")->name($table)->where("pid",$val['dealer_id'])->order("RAND()")->field("dealer_name,pid")->limit(1)->find();
			  }
			  break;
			case 10:
			  //如果为 10 的话 随机查询太原经纪人数据 太原自增ID 32
			  $BrokerData = DB::connect("db_flowuser")->name($table)->where("pid",32)->order("RAND()")->field("dealer_id,dealer_name,pid")->limit(3)->select();
			  foreach ($BrokerData as $key => $val)
			  {
				$DataArr[] = DB::connect("db_flowuser")->name($table)->where("pid",$val['dealer_id'])->order("RAND()")->field("dealer_name,pid")->limit(1)->find();
			  }
			  break;
			default:
			 //查询所有经纪人 随机取出三条信息
			  $BrokerData = DB::connect("db_flowuser")->name($table)->where("pro_id","<>",0)->order("RAND()")->field("pro_id,dealer_id,dealer_name,pid")->limit(3)->select();
			  foreach ($BrokerData as $key => $val)
			  {
				$DataArr[] = DB::connect("db_flowuser")->name($table)->where("pid",$val['pid'])->order("RAND()")->field("dealer_name,pid")->limit(1)->find();
			  }
			break;
		}
		//处理数据为数组
		foreach ($DataArr as $key => $val)
		{
			$DataArr[$key] = json_decode($val['dealer_name'],true);
			$DataArr[$key]['pid'] = $val['pid'];
			$DataArr[$key]['dealer_name'] = DB::connect("db_flowuser")->name($table)->where("dealer_id",$val['pid'])->field("dealer_name")->find()['dealer_name'];
		}
		// p($DataArr);
		exit(json_encode($DataArr));
	}

	/**
	 * 随机查询对应媒体渠道三个经纪人信息
	 * @param $source [渠道编码 0随机三条 1天津玩艺儿 2看天津 3天津生活通 4乐活北京  5石家庄本地通 6掌控沧州 7家在济南 8青岛圈 9晋城头条 10太原人微生活]
	 * @return [type] [description]
	 */
	public function RandomBrokerFutetwo()
	{
		$area = input("param.area") ? input("param.area") : 0;
		$table = input("param.chart") ? input("param.chart") : '';
		if(empty($table)){
			exit(json_encode(array("code"=>1041,"msg"=>"数据传入有误")));
		}

		switch ($area)
		{
			case 'beijing':
		  	  //查询北京经纪人 随机取出三条信息
			  $BrokerData = DB::connect("db_flowuser")->name($table)->where("pro_id",2)->order("RAND()")->field("pro_id,dealer_id,dealer_name,pid")->limit(3)->select();
			  foreach ($BrokerData as $key => $val)
			  {
					$DataArr[] = DB::connect("db_flowuser")->name($table)->where("pid",$val['pid'])->order("RAND()")->field("dealer_name,pid")->limit(1)->find();
			  }
			  break;
			case 'tianjing':
			  	  //查询非北京经纪人 随机取出三条信息
				  $BrokerData = DB::connect("db_flowuser")->name($table)->where('pro_id',['<>',2],['<>',0])->order("RAND()")->field("pro_id,dealer_id,dealer_name,pid")->limit(3)->select();
				  foreach ($BrokerData as $key => $val)
				  {
					$DataArr[] = DB::connect("db_flowuser")->name($table)->where("pid",$val['pid'])->order("RAND()")->field("dealer_name,pid")->limit(1)->find();
				  }
				  break;
			default:
			 //查询所有经纪人 随机取出三条信息
			  $BrokerData = DB::connect("db_flowuser")->name($table)->where("pro_id","<>",0)->order("RAND()")->field("pro_id,dealer_id,dealer_name,pid")->limit(3)->select();
			  foreach ($BrokerData as $key => $val)
			  {
				$DataArr[] = DB::connect("db_flowuser")->name($table)->where("pid",$val['pid'])->order("RAND()")->field("dealer_name,pid")->limit(1)->find();
			  }
			break;
		}
		//处理数据为数组
		foreach ($DataArr as $key => $val)
		{
			$DataArr[$key] = json_decode($val['dealer_name'],true);
			$DataArr[$key]['pid'] = $val['pid'];
			$DataArr[$key]['dealer_name'] = DB::connect("db_flowuser")->name($table)->where("dealer_id",$val['pid'])->field("dealer_name")->find()['dealer_name'];
		}
		// p($DataArr);
		exit(json_encode($DataArr));
	}

	/**
	 * 用户选择经销商 查询对应经销商经纪人数据
	 * @param  $dealer_id  [经销商ID]
	 * @return [type] [description]
	 */
	public function DealerDataVert()
	{
		$dealer_id = input("param.dealer_id") ? input("param.dealer_id") : '';
		$table = input("param.chart") ? input("param.chart") : '';
		if($dealer_id == '' || empty($table))
		{
				exit(json_encode(['errorcode'=>1041,'data'=>'','msg'=>'数据传入有误']));
		}

		//开始根据经销商ID查询对应随机经纪人
		$BrokerData = DB::connect("db_flowuser")->name($table)->where("pid",$dealer_id)->order("RAND()")->field("dealer_id,dealer_name")->limit(3)->select();
		if(false == $BrokerData)
		{
				exit(json_encode(['code'=>2004,'data'=>'','msg'=>'Query Data Error']));
		}
		//处理数据为数组
		foreach ($BrokerData as $key => $val)
		{
			$BrokerData[$key] = json_decode($val['dealer_name'],true);
			$BrokerData[$key]['dealer_id'] = $val['dealer_id'];
			$BrokerData[$key]['dealer_name'] = DB::connect("db_flowuser")->name($table)->where("dealer_id",$dealer_id)->field("dealer_name")->find()['dealer_name'];
		}
		// p($BrokerData);
		exit(json_encode(['code'=>2001,'data'=>$BrokerData,'msg'=>'Query Data Success']));
	}

	/**
	 * 测试经销商
	 * @return [type] [description]
	 */
	// function test()
	// {
 //        $json = json_encode([
 //            'name' => '王鹏',
 //            'imgurl' => '',
 //            'phone' => '18535625214',
 //        ]);
 //        echo $json;
	// }

}
