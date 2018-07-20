<?php
/**
 * 极客之家 高端PHP - Excel导出导入
 * @copyright  Copyright (c) 2016 QIN TEAM (http://www.qlh.com)
 * @license    GUN  General Public License 2.0
 * @version    Id:  Type_model.php 2016-6-12 16:36:52
 */
namespace app\admin\controller;
use think\Controller;
use think\Request;
use think\Db;
use think\Cache;
use app\admin\model\ExcelModel;
use app\admin\model\BaseModel;
use app\admin\model\ProjectModel;
// use think\PHPExcel\PHPExcel;
class Excel extends	Controller
{


//********************************************导出数据*********************************************//
    /**
     * 根据表名判断导出数据
     * @return [type] [description]
     */
		public function index()
    {
        // $Capital = new CapitalModel;
        $ExcelTable = new ExcelModel;
        $table = input("param.table");
        if($table == "user_baowo")
        {
            $header = array('编号','姓名','手机','城市','中奖信息','注册时间');
            $data = $ExcelTable->user_baowo($table);
            foreach ($data as $key => $value)
            {
                $dataArr[] = array(
                    'dealer_id'=>$value['dealer_id'],
                    'name'=>$value['name'],
                    'phone'=>$value['phone'],
                    'city'=>$value['city'],
										'lotter'=>$value['lotter'],
                    'time'=>$value['time'],
                );
            }

            $ExcelTable->writer($header,$dataArr);//导出 此导出表头最长为A-Z,如果需要更长，请自行更改
        }

        if($table == "user_dongbiao" || $table == "user_db_yongle" || $table == "user_db_meituan")
        {
            if($table == "user_dongbiao"){$lottery_table = "lottery_dongbiao";$lotuser_table = "lotuser_dongbiao";}
            if($table == "user_db_meituan"){$lottery_table = "lottery_db_meituan";$lotuser_table = "lotuser_db_meituan";}
            if($table == "user_db_yongle"){$lottery_table = "lottery_db_yongle";$lotuser_table = "lotuser_db_yongle";}
            $header = array('编号','姓名','手机','经销商','车系车型','获得奖品','注册时间');
            $data = $ExcelTable->user_dongbiao($table,$lottery_table,$lotuser_table);
            foreach ($data as $key => $value)
            {
                $dataArr[] = array(
                    'user_id'=>$value['user_id'],
                    'name'=>$value['name'],
                    'phone'=>$value['phone'],
										'dealer'=>$value['dealer'],
										'models'=>$value['models'],
                    'dealer_name'=>$value['lotter'],
                    'time'=>$value['time']
                );
            }

            $ExcelTable->writer($header,$dataArr);//导出 此导出表头最长为A-Z,如果需要更长，请自行更改
        }
    }


    /**
     * [index_position 导出【福特项目】用户留资信息]
     * @return [type] [description]
     * @author [qinlh] [1397118453@qq.com]
     */
    public function FuteDealerExcel(){
			  $ExcelTable = new ExcelModel;
        //先查询所有用户信息
        $data = DB::connect("db_flowuser")->name("user_fute")->select();
        foreach ($data as $key => $val)
        {
            $data[$key]['time'] = date("Y-m-d H:i:s",$val['time']);
            //查询用户选择的经销商
            $arr = DB::connect("db_flowuser")->name("dealer_fute")->where("dealer_id","in",$val['dealer_name'])->field("dealer_name")->select();
            $array = array();
            foreach ($arr as $k => $v) {
                $array[] = $v['dealer_name'];
            }
            $data[$key]['dealer_name'] = join(",",$array);

            // print_r($arr);
            // print_r($num);
            //判断查询来源渠道
            switch ($val['source'])
            {
                case 1:
                  $data[$key]['source'] = "天津玩艺儿";
                break;
                case 2:
                  $data[$key]['source'] = "看天津";
                break;
                case 3:
                  $data[$key]['source'] = "天津生活通";
                break;
                case 4:
                  $data[$key]['source'] = "乐活北京";
                break;
                case 5:
                  $data[$key]['source'] = "石家庄本地通";
                break;
                case 6:
                  $data[$key]['source'] = "掌控沧州";
                break;
                case 7:
                  $data[$key]['source'] = "家在济南";
                break;
                case 8:
                  $data[$key]['source'] = "青岛圈";
                break;
                case 9:
                  $data[$key]['source'] = "晋城头条";
                break;
                case 10:
                  $data[$key]['source'] = "太原人微生活";
                break;
                default:
                  $data[$key]['source'] = "未选择";
                break;
            }
        }
        //定制表头
        $header = array('编号','姓名','手机','经销商','感兴趣车型','计划购车时间','注册时间','来源渠道');
        foreach ($data as $key => $value)
        {
            $dataArr[] = array(
                'user_id'=>$value['user_id'],
                'name'=>$value['name'],
                'mobile'=>$value['mobile'],
                'dealer_name'=>$value['dealer_name'],
                'car_type'=>$value['car_type'],
                'buy_time'=>$value['buy_time'],
                'time'=>$value['time'],
                'source'=>$value['source']
            );
        }
        //导出
        $ExcelTable->writer($header,$dataArr);//导出 此导出表头最长为A-Z,如果需要更长，请自行更改
    }

    /**
     * [导出【长城项目】用户留资信息]
     * @return [type] [description]
     * @author [qinlh] [1397118453@qq.com]
     */
    public function ChangchenDealerExcel(){
			  $ExcelTable = new ExcelModel;
        //先查询所有用户信息
        $data = DB::connect("db_flowuser")->name("user_changchen")->select();
        foreach ($data as $key => $val)
        {
            $data[$key]['time'] = date("Y-m-d H:i:s",$val['time']);
            //查询用户选择的经销商
            $arr = DB::connect("db_flowuser")->name("dealer_changchen")->where("dealer_id","in",$val['dealer_name'])->field("dealer_name")->select();
            $array = array();
            foreach ($arr as $k => $v) {
                $array[] = $v['dealer_name'];
            }
            $data[$key]['dealer_name'] = join(",",$array);

            //判断查询来源渠道
            /*  斗鱼直播app   dyzb
                思想聚焦      sxjuj
                背包旅行摄影  bblxsy
                占豪          zhanhao
                车买买        chemm
                微信平台      wxpt
                今日头条      jrtt
                一点资讯      ydzx
                网易          wynet
                UC            uc
                百家          bj
            **/
            switch ($val['source'])
            {
                case 'dyzb':
                  $data[$key]['source'] = "斗鱼直播app";
                break;
                case 'sxjuj':
                  $data[$key]['source'] = "思想聚焦";
                break;
                case 'bblxsy':
                  $data[$key]['source'] = "背包旅行摄影";
                break;
                case 'zhanhao':
                  $data[$key]['source'] = "占豪";
                break;
                case 'chemm':
                  $data[$key]['source'] = "车买买";
                break;
                case 'wxpt':
                  $data[$key]['source'] = "微信平台";
                break;
                case 'jrtt':
                  $data[$key]['source'] = "今日头条";
                break;
                case 'ydzx':
                  $data[$key]['source'] = "一点资讯";
                break;
                case 'wynet':
                  $data[$key]['source'] = "网易";
                break;
                case 'uc':
                  $data[$key]['source'] = "UC";
                break;
                case 'bj':
                  $data[$key]['source'] = "百家";
                break;
                default:
                  $data[$key]['source'] = "未选择渠道";
                break;
            }

        }

        // p($data);
        //定制表头
        $header = array('编号','姓名','手机','经销商','感兴趣车型','性别','注册时间','来源渠道');
        foreach ($data as $key => $value)
        {
            $dataArr[] = array(
                'user_id'=>$value['user_id'],
                'name'=>$value['name'],
                'mobile'=>$value['mobile'],
                'dealer_name'=>$value['dealer_name'],
                'car_type'=>$value['car_type'],
                'sex'=>$value['sex'],
                'time'=>$value['time'],
                'source'=>$value['source']
            );
        }
        //导出
        $ExcelTable->writer($header,$dataArr);//导出 此导出表头最长为A-Z,如果需要更长，请自行更改
    }


		//************************************** 公共方法导出项目留资数据 ************************************
			/**
			 * [UserInfoListExcel] [Excel导出所有数据 公共方法]
			 * @return [type] [description]
			 * @author [qinlh] [1397118453@qq.com]
			 */
			public function UserInfoListExcel(){
				ini_set('max_execution_time', '0');
				ini_set("memory_limit","1024M");
				// Cache::set("verifyFile",0,3600);
				// sleep(20);//暂停n秒
				$ExcelTable = new ExcelModel;
				$base = new BaseModel;
				$project_id = input("param.project_id");
				$more_name = input("param.more_name") ? input("param.more_name") : ''; //接受单表多开名称
				$source_end = input("param.source_end") ? input("param.source_end") : ''; //留资来源
				//先查询项目对应用户、经销商表
				$user_table = DB::name("project_user_dealer")->where("project_id",$project_id)->find()['user_table'];
				$dealer_table = DB::name("project_user_dealer")->where("project_id",$project_id)->find()['dealer_table'];

				$where = [];
				// $where['status'] = 0;
				if($more_name && $more_name !== '') {
					$where['source'] = $more_name;
				}

				if($source_end && $source_end !== '') {
					$where['source_end'] = $source_end;
				}
				// $where['user_id'] = ['<=', 10000];
				//先查询用户总数据 如果数据大于10000条数据，只导出万条数据之后的数据
				$DataSum = DB::connect("db_flowuser")->name($user_table)->count();
				if($DataSum >= 10000) {
					$where['user_id'] = ['>', substr($DataSum,0,1)."0000"];
				}

				// echo $DataSum;die;
				//先查询所有用户信息
				$data = DB::connect("db_flowuser")->where($where)->name($user_table)->order("user_id desc")->select();
				$LineBlank = array(" ","　","\t","\n","\r"); //php去除空格和换行
				// $TableKeyAbbre = @DB::connect("db_flowuser")->name($dealer_table)->find(); //用于查询简称表字段
				foreach ($data as $key => $val)
				{
						if (isset($val['source_end'])) {
							if ($val['source_end'] == 1) {
								$data[$key]['source_end'] = "pc端";
							} else if ($val['source_end'] == 2) {
								$data[$key]['source_end'] = "移动端";
							} else {
								$data[$key]['source_end'] = "其他";
							}
						}
						$data[$key]['time'] = date("Y-m-d H:i:s",$val['time']);
						if(substr($val['dealer_name'],0,1) == 0) {
							if (substr($val['dealer_name'],0,1) === 0) {
								$data[$key]['dealer_name'] = '未选择';
							} else {
								$data[$key]['dealer_name'] = $val['dealer_name'];
							}
							// if(isset($TableKeyAbbre['abbre'])) $data[$key]['abbre'] = '未选择';
						} else {
              $TableKeyAbbre = @DB::connect("db_flowuser")->name($dealer_table)->find(); //用于查询简称表字段
							// var_dump($TableKeyAbbre['abbre']);die;
							// echo explode(",",$val[$val['dealer_name'])][1];die;
              if(isset($TableKeyAbbre['abbre'])) {
									$abbreArrar = explode(",",$val['dealer_name']);
    							$Abbre = str_replace([" ","　","\t","\n","\r"], '', @DB::connect("db_flowuser")->name($dealer_table)->where("dealer_id", $abbreArrar[count($abbreArrar) - 1])->field("abbre")->find()['abbre']);
    							$data[$key]['abbre'] = $Abbre;
              }
							//查询用户选择的经销商
							$DealerData = DB::connect("db_flowuser")->name($dealer_table)->where("dealer_id","in",$val['dealer_name'])->field("dealer_name")->select();
							// p($DealerData);
							$array = array();
							foreach ($DealerData as $k => $v) {
									$array[] = $v['dealer_name'];
							}
							$data[$key]['dealer_name'] = join(",",$array);
						}
						//开始判断是否查询来源渠道
						$project = DB::name("project")->where("id",$project_id)->field("source_start,draw_id")->find();
						if($project['source_start'] == 1)
						{//开始统计来源渠道
								$data[$key]['source'] = $base->SourceStatistics($project_id,str_replace($LineBlank, '', $val['source']));
						}
						 $data[$key]['draw_name'] = '无活动';
						 //如果项目活动ID不是 0 的话，查询对应抽奖信息
						  if($project['draw_id'] > 0) {
	 						 //查询对应的活动关联表、概率表、用户抽奖信息表
	 							$lotuser_table = DB::name("draw")->where("draw_id",$project['draw_id'])->field("drawuser_table,drawtable_name")->find();
	 						 	$drawData = DB::connect("db_flowuser")->name($lotuser_table['drawuser_table'])->field("userid,lotid")->where('userid',$val['user_id'])->find();
	 							$data[$key]['draw_name'] = DB::name($lotuser_table['drawtable_name'])->where("id",$drawData['lotid'])->field('name')->find()['name'];
	 							if($drawData == array()) {
	 								$data[$key]['draw_name'] = '未中奖';
	 							}
						  }
				}
				// p($data);
				// 分割经销商为三个字段（省、城市、经销商）
				$ArrDealerName = [];
				foreach ($data as $key => $val) {
					$ArrDealerName = explode(",",$val['dealer_name']);
					$data[$key]['dealer_name01'] = '未定义'; //省份
					$data[$key]['dealer_name02'] = '未定义'; //城市
					$data[$key]['dealer_name03'] = '未定义'; //经销商
					if(count($ArrDealerName) === 3) { //省、市 经销商都存在
						$data[$key]['dealer_name01'] = $ArrDealerName[0];
						$data[$key]['dealer_name02'] = $ArrDealerName[1];
						$data[$key]['dealer_name03'] = $ArrDealerName[2];
					} else if(count($ArrDealerName) === 2) { //市、经销商
						$data[$key]['dealer_name01'] = $ArrDealerName[0];
						$data[$key]['dealer_name02'] = $ArrDealerName[1];
					} else if(count($ArrDealerName) === 1) { //只有经销商
						$data[$key]['dealer_name03'] = $ArrDealerName[0];
					} else {
						$data[$key]['dealer_name01'] = '未定义'; //省份
						$data[$key]['dealer_name02'] = '未定义'; //城市
						$data[$key]['dealer_name03'] = '未定义'; //经销商
					}
				}

				// p($arr);
				//定制表头
				$header = array('编号','姓名','性别','手机','省份','城市','经销商','简称','感兴趣车型','购车时间','是否中奖','注册时间','来源渠道','受访设备','其他');
				foreach ($data as $key => $value) {
						$dataArr[] = [
								'user_id'		=>		$value['user_id'],
								'name'		=>		$value['name'],
								'sex'		=>		$value['sex'],
								'mobile'		=>		$value['mobile'],
								'dealer_name01'		=>		$value['dealer_name01'], //省份
								'dealer_name02'		=>		$value['dealer_name02'], //城市
								'dealer_name03'		=>		$value['dealer_name03'], //经销商
								'abbre'		=>	  isset($value['abbre']) ? $value['abbre'] : '', //简称
								'car_type'		=>		$value['car_type'],
								'buy_time'		=>		$value['buy_time'],
								'draw_name'				=>		$value['draw_name'],
								'time'		=>		$value['time'],
								'source'		=>		$value['source'],
								'source_end'		=>		isset($value['source_end']) ? $value['source_end'] : '其他',
								'others'		=>		isset($value['others']) ? $value['others'] : '未知'
						];
				}

				//如果经销商表简称不存在 删除表头以及内容中简称数据
				if(!isset($TableKeyAbbre['abbre'])) {
					unset($header[7]); //如果简称未定义就删除
					foreach ($dataArr as $key => $val) {
						unset($dataArr[$key]['abbre']);
					}
			}
				// p($header);
				// p($dataArr);
				//导出
				$ExcelTable->writer($header,$dataArr);//导出 此导出表头最长为A-Z,如果需要更长，请自行更改
				$projectName = DB::name("project")->where("id", $project_id)->field("id,project_name")->find()['project_name'];
				@writelog(session('admin_uid'),session('admin_username'),'用户【'.session('admin_username').'】导出Excel数据【'.$projectName.'】',1);
				// echo 111;die;
				// Cache::set("verifyFile",1,3600);
				// exit(json_encode(['code'=>1001]));
		}

		/**
		 * [verifyFile] [检测导出验证文件是否存在]
		 * @return [type] [description]
		 * @author [qinlh] [WeChat QinLinHui0706]
		 */
		public function verifyFile() {
			// if(Cache::get('verifyFile') == true) {
				if(Cache::get('verifyFile') == 1) {
					exit(json_encode(['code'=>1001,'data'=>'','msg'=>'导出成功']));
				} else {
					exit(json_encode(['code'=>1002,'data'=>'','msg'=>'正在导出']));
				}
			// }
		}


	//************************************** 公共方法导出留言数据 ************************************
	/**
	 * [LeaveDataExcel] [Excel导出留言信息数据]
	 * @return [type] [description]
	 * @author [qinlh] [1397118453@qq.com]
	 */
	public function LeaveDataExcel() {
		// echo 111;die
		// Cache::set("verifyFile",0,3600);
		// sleep(20);//暂停n秒
		$ExcelTable = new ExcelModel;
		$base = new BaseModel;
		$project_id = input("param.project_id");
		$more_name = input("param.more_name") ? input("param.more_name") : ''; //接受单表多开名称
		//先查询项目对应用户、经销商表
		$leave_table = DB::name("leave_table")->where("project_id",$project_id)->find()['leave_table'];

		$where = [];
		// $where['status'] = 0;
		if($more_name && $more_name !== '') {
			$where['more_name'] = $more_name;
		}

		//先查询所有用户信息
		$data = DB::connect("db_flowuser")->where($where)->name($user_table)->order("user_id desc")->select();
		// p($data);
		$LineBlank = array(" ","　","\t","\n","\r"); //php去除空格和换行
		foreach ($data as $key => $val)
		{
				$data[$key]['time'] = date("Y-m-d H:i:s",$val['time']);
				if(substr($val['dealer_name'],0,1) == 0) {
					$data[$key]['dealer_name'] = '未选择';
				} else {
					//查询用户选择的经销商
					$arr = DB::connect("db_flowuser")->name($dealer_table)->where("dealer_id","in",$val['dealer_name'])->field("dealer_name")->select();
					$array = array();
					foreach ($arr as $k => $v) {
							$array[] = $v['dealer_name'];
					}
					$data[$key]['dealer_name'] = join(",",$array);
				}

				//开始判断是否查询来源渠道
				$project = DB::name("project")->where("id",$project_id)->field("source_start,draw_id")->find();
				if($project['source_start'] == 1)
				{//开始统计来源渠道
						$data[$key]['source'] = $base->SourceStatistics($project_id,str_replace($LineBlank, '', $val['source']));
				}
				 $data[$key]['draw_name'] = '无活动';
				 //如果项目活动ID不是 0 的话，查询对应抽奖信息
				 if($project['draw_id'] > 0) {
					 //查询对应的活动关联表、概率表、用户抽奖信息表
						$lotuser_table = DB::name("draw")->where("draw_id",$project['draw_id'])->field("drawuser_table,drawtable_name")->find();
						$drawData = DB::connect("db_flowuser")->name($lotuser_table['drawuser_table'])->field("userid,lotid")->where('userid',$val['user_id'])->find();
						$data[$key]['draw_name'] = DB::name($lotuser_table['drawtable_name'])->where("id",$drawData['lotid'])->field('name')->find()['name'];
						if($drawData == array()) {
							$data[$key]['draw_name'] = '未中奖';
						}
				 }
		}
		// p($data);
		//定制表头
		$header = array('编号','姓名','性别','手机','经销商','感兴趣车型','购车时间','是否中奖','注册时间','来源渠道');
		foreach ($data as $key => $value)
		{
				$dataArr[] = array(
						'user_id'=>$value['user_id'],
						'name'=>$value['name'],
						'sex'=>$value['sex'],
						'mobile'=>$value['mobile'],
						'dealer_name'=>$value['dealer_name'],
						'car_type'=>$value['car_type'],
						'buy_time'=>$value['buy_time'],
						'draw_name'=>$value['draw_name'],
						'time'=>$value['time'],
						'source'=>$value['source']
				);
		}
		//导出
		$ExcelTable->writer($header,$dataArr);//导出 此导出表头最长为A-Z,如果需要更长，请自行更改
		$projectName = DB::name("project")->where("id", $project_id)->field("id,project_name")->find()['project_name'];
		echo $projectName;die;
		// echo 111;die;
		// Cache::set("verifyFile",1,3600);
		// exit(json_encode(['code'=>1001]));
}



		//********************************************** 后台程序 ***********************************************

		/**
		 * [excel_lead] [查询经销商Excel列表]
		 * @return [type] [description]
		 * @author [qinlh] [WeChat QinLinHui0706]
		 */
		public function excel_lead() {
			//要读取的目录
			$folder = "UploadFiles/excel/";
			//打开目录
			$fp = opendir($folder);
			//阅读目录
			while(false != ($file = readdir($fp))) {
			//列出所有文件并去掉'.'和'..'
				 if($file != '.' && $file != '..') {
						 //$file="$folder/$file";
						 $file = " $file ";
						 //赋值给数组
						 $arr_file[]['name'] = $file;
						 foreach ($arr_file as $key => $val) { //获取时间
							  $arr_file[$key]['time'] = date("Y-m-d H:i:s",filectime($folder));
						 }
					}
			}
			closedir($fp);//关闭目录
			// p($arr_file);
			$this->assign("data",$arr_file);
			return $this->fetch();
		}

		/**
		 * [fileReader] [文件下载功能]
		 * @return [type] [description]
		 * @author [qinlh] [WeChat QinLinHui0706]
		 */
		public function fileReader($file_url='', $new_name='') {
			$file_url = input("param.file") ? str_replace(array("+"),"",input("param.file")) : '';
			if(empty($file_url)) {
				echo '参数传入有误';die;
			}
			$news_file = "UploadFiles/excel/".$file_url;
			if(!isset($news_file) || trim($news_file)==''){
					echo '服务器错误';die;
			}
			if(!file_exists($news_file)){ //检查文件是否存在
					echo '文件找不到';die;
			}
			$file_name = basename($news_file);
			$file_type = explode('.', $news_file);
			$file_type = $file_type[count($file_type) - 1];
			$file_name = trim($new_name == '') ? $file_name : urlencode($new_name);
			$file_type = fopen($news_file, 'r'); //打开文件
			//输入文件标签
			header("Content-type: application/octet-stream");
			header("Accept-Ranges: bytes");
			header("Accept-Length: ".filesize($news_file));
			header("Content-Disposition: attachment; filename=".$file_name);
			//输出文件内容
			echo fread($file_type,filesize($news_file));
			fclose($file_type);
		}

		/**
		 * [ExcelLead] [数据导入功能]
		 * @return [type] [description]
		 * @author [qinlh] [WeChat QinLinHui0706]
		 */
		public function ExcelLead() {
			if(request()->isAjax())
			{
				$excel  = new ExcelModel;
				$data = input("param.");
				if(!isset($data['table_name']) || empty($data['table_name'])) return json(['code' => 0, 'data'=>'', 'msg' => '传入参数有误']);
				$new_file = $excel->MoveFilePublic("UploadFiles/excel/",$data['images_url'])['data'];
				//开始导入数据
				$arr = $excel->ExcelLead($new_file); //先转换成数组格式
				// p($arr);
				foreach ($arr as $key => $val) {
					$newArray[] = array_filter($val);
					foreach ($newArray as $k => $v) {
						if(!isset($v['A']) || empty($v['A']) && !isset($v['B']) || empty($v['B']) && !isset($v['C']) || empty($v['C'])) {
							return json(['code' => 0, 'data'=>'', 'msg' => '数据格式有误']);
						}
					}
				}
				// p($newArray);
				$res = $excel->getExcelLead($newArray,$data['table_name']);
				// p($res);
				if($res['code'] == 1) {
					return json(['code' => 1, 'data'=>'', 'msg' => '数据导入成功']);
				} else {
					return json(['code' => 0, 'data'=>'', 'msg' => '数据导入失败']);
				}
			}
			return $this->fetch('excel_add');
		}

		/**
     * [uploadExcel Excel文件导入]
     * @return [type] [description]
     * @author [qinlh] [15035574759@163.com]
     */
    public function uploadExcel()
    {
        $file = request()->file('file');
        // print_r($file);die;
        $info = $file->move(ROOT_PATH . 'public' . DS . 'UploadFiles/testexcel','');//先移动到临时文件
        if($info) {
            $res['status'] = 1;
            $res['image_name'] = $info->getSaveName();
            return json($res);

        } else {

            $res['status']=0;
            $res['error_info'] = $file->getError();
            return json($res);
        }
    }

    /**
     * [projectLogExcel 项目修改日志导出]
     * @return [type] [description]
     */
    public function projectLogExcel()
    {
        $ExcelTable = new ExcelModel;
        $project  = new ProjectModel;
				$projectId = input("param.project_id") ? input("param.project_id") : '';
        $data = $project->project_update_log($projectId);
        $header = array('编号','项目名称','是否上线','修改端','修改人','修改时间','修改内容');
        foreach ($data['data'] as $key => $value)
        {
            $dataArr[] = array(
                'id'=> $value['id'],
                'project_name'=> $value['project_name'],
                'state'=> $value['state'] == 0 ? '未上线' : '已上线',
                'source_end'=> $value['source_end'] == 3 ? '双端' : ($value['source_end'] == 2 ? '移动' : 'PC'),
                'name'=> $value['name'],
                'time'=> $value['time'],
                'content'=> $value['content'],
            );
        }

        $ExcelTable->writer($header,$dataArr);//导出 此导出表头最长为A-Z,如果需要更长，请自行更改
    }
}
