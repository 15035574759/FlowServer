<?php
/**
 * 极客之家 高端PHP - 采集管理
 * @copyright  Copyright (c) 2016 QIN TEAM (http://www.qlh.com)
 * @license    GUN  General Public License 2.0
 * @version    Id:  Type_model.php 2016-6-12 16:36:52
 */
namespace app\admin\model;
use think\Db;
use think\Model;
class GatherModel extends Model
{
	protected $name = '';

	/**
	 * 采集列表地址路径
	 * @param [type] $url [description]
	 */
	public function GatherUrl($url1,$url2,$url3)
	{
		try{
			import("phpQuery",EXTEND_PATH.'phpQuery');
			
			// 抓取相关数据
				// 取值类似jQuery的操作
				$reg = array('url'=>array('.text p a:eq(0)','href'));
				// 抓取内容的div
				$rang = '.newsList ul li';
				$hj1 = new \QueryList($url1,$reg,$rang,'curl');
				$hj2 = new \QueryList($url2,$reg,$rang,'curl');
				$hj3 = new \QueryList($url3,$reg,$rang,'curl');
			    $arr1 = $hj1->jsonArr;
			    $arr2 = $hj2->jsonArr;
			    $arr3 = $hj3->jsonArr;
			    foreach ($arr1 as $k => $v) {
			    	$arr1[$k]["url"] = "http://xinsanban.eastmoney.com".$v['url'];
			    }
			    foreach ($arr2 as $k => $v) {
			    	$arr2[$k]["url"] = "http://xinsanban.eastmoney.com".$v['url'];
			    }
			    foreach ($arr3 as $k => $v) {
			    	$arr3[$k]["url"] = "http://xinsanban.eastmoney.com".$v['url'];
			    }
			    $UrlData = array_merge_recursive($arr1,$arr2,$arr3);//合并多个数组
			    // print_r($UrlData);die;
		    if(false === $UrlData)
		    {
		    	return ['code' => -1, 'data' => '', 'msg' => $this->getError()];
		    }
		    else
		    {
		    	return ['code' => 1, 'data' => $UrlData, 'msg' => '采集链接地址成功'];
		    }

	    }catch( PDOException $e){
	    	return ['code' => -2, 'data' => '', 'msg' => $e->getMessage()];
        }
	}

	/**
	 * 采集详情页面内容
	 * @param [type] $Arr [description]
	 */
	public function GatherDetails($Arr)
	{
		try{
			import("phpQuery",EXTEND_PATH.'phpQuery');
			//循环采集列表内容数据
		    foreach ($Arr as $kk => $val) {
		    	$url = $val["url"];
		    	$strurl = file_get_contents($val["url"]);//为了获取内容标签元素  采用file_get_contents 采集

		    	$reg = array('title'=>array('h1','text'),//标题
		    				   'time'=>array('.time','text'),//时间
		    				   'source'=>array('.source','text'),//来源
		    				   'compile'=>array('.time-source span a:eq(0)','text'),//作者
		    				   // 'content'=>array('.Body','text'),//内容
		    		);

		    	// 抓取内容的div
				$rang = '.newsContent';
				$hj = new \QueryList($url,$reg,$rang,'curl1');
			    $GetData = $hj->jsonArr;//得到多维数组 数据
			    // print_r($GetData);
			    //开始循环处理数据  进行入库操作
			    foreach ($GetData as $key => $value) {
			    	$GetData[$key]['source'] = substr(preg_replace('# #', '',$value['source']),11.5);//来源
			    	$reg = '#<div id="ContentBody" class="Body">(.*)<div class="BodyEnd" id="comBodyEnd">#isU';
				    preg_match_all($reg,$strurl,$data);
				     // print_r($data);
				    unset($data[0]);
			    	$GetData[$key]['content'] = $data[1][0];//获取标签内容

			    	$GetData[$key]['imgurl'] = $this->RandImg();//在这里需要随机获取一张图片
			    	
			    	//获取导航类型
			    	$strlen = strlen($url);//查询总长度
			    	$num1 = strpos($url,"=") + 1;//查询 = 位置
			    	$num = strpos($url,"&");//查询 & 位置
			    	$num_strlen = $num - $strlen;//计算 负数
			    	$GetData[$key]['type'] = substr($url,$num1,$num_strlen);//导航类型  
			    	// print_r($GetData);
			    	//开始入库操作
			    	foreach ($GetData as $k => $v) {
			    		$DbData = array(//入库数据
			    			'title'     => 	$v['title'],
			    			'time'  	=> 	$v['time'],
			    			'content' 	=> 	$v['content'],
			    			'laiyuan' 	=> 	$v['source'],
			    			'bianji' 	=> 	$v['compile'],
			    			'images' 	=> 	$v['imgurl'],
			    			'type' 		=> 	$v['type']
			    		);
			    		print_r($GetData);
			    		// $res = DB::name("mation")->insert($DbData);
			    	}
			    }
		    }die;

			    if(false === $res)
			    {
			    	return ['code' => -1, 'data' => '', 'msg' => $this->getError()];
			    }
			    else
			    {
			    	return ['code' => 1, 'data' => '', 'msg' => '采集成功'];
			    }

		   	}catch( PDOException $e){
		    	return ['code' => -2, 'data' => '', 'msg' => $e->getMessage()];
	        }
	}

	/**
     * 随机获取一张图片
     * @param [return] [str]
     */
	public function RandImg()
	{
		//先读取图片所在目录
		$handle = opendir('imground/'); //当前目录
		while (false !== ($file = readdir($handle))) 
		{ //遍历该php教程文件所在目录
		list($filesname,$kzm)=explode(".",$file);//获取扩展名
			if ($kzm == "gif" or $kzm == "jpg") 
			{ //文件过滤
				if (!is_dir('./'.$file)) 
				{ //文件夹过滤
					$array[] = "/imground/".$file;//把符合条件的文件名存入数组
				}
			}
		}

		$suiji=array_rand($array); //使用array_rand函数从数组中随机抽出一个单元
		return $array[$suiji];
	}
}