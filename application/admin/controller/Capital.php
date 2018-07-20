<?php
/**
 * 极客之家 高端PHP - 用户留资信息列表
 * @copyright  Copyright (c) 2016 QIN TEAM (http://www.qlh.com)
 * @license    GUN  General Public License 2.0
 * @version    Id:  Type_model.php 2016-6-12 16:36:52
 */
namespace app\admin\controller;
use app\admin\model\ArticleModel;
use app\admin\model\ArticleCateModel;
use app\admin\model\CapitalModel;
use think\Db;
use com\IpLocation;
use app\admin\model\BaseModel;
class Capital extends Base
{
	/**
	 * 东标-火辣健身用户留资列表
	 * @return [type] [description]
	 */
	function user_dongbiao()
	{
        $serchName = input("param.phone");
        if(isset($serchName) || !empty($serchName)){
            $where = "phone='$serchName'";
        }
        else
        {
            $where = 1;
        }
        $project_tablename = "user_dongbiao";
        $lotuser_table = "lotuser_dongbiao";//奖品表
				$key = input('key');
		        $map = [];
		        if($key && $key !== ""){
		            $map['admin_id'] =  $key;
		        }
		  	  $res = Db::name("user_dongbiao")->order("user_id desc")->select();

          $Nowpage = input('get.page') ? input('get.page'):1;
	        $limits = 10;// 获取总条数
	        $count = Db::name('user_dongbiao')->where($where)->count();//总条数
	        $allpage = intval(ceil($count / $limits));//计算总页面
	        $lists = Db::name('user_dongbiao')->where($where)->page($Nowpage, $limits)->order('user_id desc')->select();
	        //查询经销商
            foreach ($lists as $key => $val) {
                $array = Db::name("dealer_dongbiao")->where("dealer_id",'in',$val['dealer_name'])->select();
                $arr = array();
                foreach ($array as $kk => $vv) {
                    $arr[] = $vv['dealer_name'];
                }
                $string = join(",",$arr);
                $lists[$key]['dealer'] = mb_strlen($string, 'utf-8') > 9 ? mb_substr($string, 0, 9, 'utf-8').'....' :$string;
        		$lists[$key]['time'] = date("Y-m-d H:i:s",$val['time']);

                //查询用户获得的奖品
                $lists[$key]['lotter'] = 0;
                $lotterArray = DB::name("user_dongbiao")->alias("d")->join("flow_lotuser_dongbiao l","l.userid=d.user_id")->field("d.user_id,l.lotid,l.userid")->where("d.user_id",$val['user_id'])->select();
                foreach ($lotterArray as $k => $v) {
                    $res = DB::name("lottery_dongbiao")->where("id",$v['lotid'])->field("name,id")->select();
                    foreach ($res as $kkk => $vvv) {
                        $lists[$key]['lotter'] = $vvv['name'];
                    }
                }

				//查询车型
				$ModelCar = DB::name("car_series")->where("car_id",$val['models'])->field("car_id,car_name")->find();

				$lists[$key]['models'] = $ModelCar['car_name'];
            }
	        $Ip = new IpLocation('UTFWry.dat'); // 实例化类 参数表示IP地址库文件
	        $this->assign('Nowpage', $Nowpage); //当前页
	        $this->assign('allpage', $allpage); //总页数
	        $this->assign('count', $count);
	        $this->assign("search_user",$res);
	        $this->assign('val', $key);
	        $this->assign('table', $project_tablename);
            $this->assign('lotuser_table', $lotuser_table);
            $this->assign("phone",$serchName);//搜索条件
	        if(input('get.page')){
	            return json($lists);
	        }
	        return $this->fetch('dongbiaouser_list');
	}

    /**
     * 东标-美团用户留资列表
     * @return [type] [description]
     */
    function user_db_meituan()
    {
        $serchName = input("param.phone");
        if(isset($serchName) || !empty($serchName)){
            $where = "phone='$serchName'";
        }
        else
        {
            $where = 1;
        }
        $project_tablename = "user_db_meituan";//用户表
        $lotuser_table = "lotuser_db_meituan";//奖品表
        $key = input('key');
        $map = [];
        if($key&&$key!==""){
            $map['admin_id'] =  $key;
        }
        $res = Db::name("user_db_meituan")->order("user_id desc")->select();

            $Nowpage = input('get.page') ? input('get.page'):1;
            $limits = 10;// 获取总条数
            $count = Db::name('user_db_meituan')->where($where)->count();//计算总页面
            $allpage = intval(ceil($count / $limits));
            $lists = Db::name('user_db_meituan')->where($where)->page($Nowpage, $limits)->order('user_id desc')->select();

            //查询经销商
            foreach ($lists as $key => $val) {
                $array = Db::name("dealer_dongbiao")->where("dealer_id",'in',$val['dealer_name'])->select();
                $arr = array();
                foreach ($array as $kk => $vv) {
                    $arr[] = $vv['dealer_name'];
                }
                $string = join(",",$arr);
                $lists[$key]['dealer'] = mb_strlen($string, 'utf-8') > 9 ? mb_substr($string, 0, 9, 'utf-8').'....' :$string;
                $lists[$key]['time'] = date("Y-m-d H:i:s",$val['time']);

                //查询用户获得的奖品
                $lists[$key]['lotter'] = 0;
                $lotterArray = DB::name("user_db_meituan")->alias("d")->join("flow_lotuser_db_meituan l","l.userid=d.user_id")->field("d.user_id,l.lotid,l.userid")->where("d.user_id",$val['user_id'])->select();
                foreach ($lotterArray as $k => $v) {
                    $res = DB::name("lottery_db_meituan")->where("id",$v['lotid'])->field("name,id")->select();
                    foreach ($res as $kkk => $vvv) {
                        $lists[$key]['lotter'] = $vvv['name'];
                    }
                }

                //查询车型
                $ModelCar = DB::name("car_series")->where("car_id",$val['models'])->field("car_id,car_name")->find();
                $lists[$key]['models'] = $ModelCar['car_name'];
            }
            // print_r($lists);die;
            $Ip = new IpLocation('UTFWry.dat'); // 实例化类 参数表示IP地址库文件
            $this->assign('Nowpage', $Nowpage); //当前页
            $this->assign('allpage', $allpage); //总页数
            $this->assign('count', $count);
            $this->assign("search_user",$res);
            $this->assign('val', $key);
            $this->assign('table', $project_tablename);
            $this->assign('lotuser_table', $lotuser_table);
            $this->assign("phone",$serchName);//搜索条件
            if(input('get.page')){
                return json($lists);
            }
            return $this->fetch();
    }

    /**
     * 东标-永乐票务用户留资列表
     * @return [type] [description]
     */
    function user_db_yongle()
    {
        $serchName = input("param.phone");
        if(isset($serchName) || !empty($serchName)){
            $where = "phone='$serchName'";
        }
        else
        {
            $where = 1;
        }
        $project_tablename = "user_db_yongle";
        $lotuser_table = "lotuser_db_yongle";//奖品表
        $key = input('key');
        $map = [];
        if($key&&$key!==""){
            $map['admin_id'] =  $key;
        }
        $res = Db::name("user_db_yongle")->order("user_id desc")->select();

            $Nowpage = input('get.page') ? input('get.page'):1;
            $limits = 10;// 获取总条数
            $count = Db::name('user_db_yongle')->where($where)->count();//计算总页面
            $allpage = intval(ceil($count / $limits));
            $lists = Db::name('user_db_yongle')->where($where)->page($Nowpage, $limits)->order('user_id desc')->select();

            //查询经销商
            foreach ($lists as $key => $val) {
                $array = Db::name("dealer_dongbiao")->where("dealer_id",'in',$val['dealer_name'])->select();
                $arr = array();
                foreach ($array as $kk => $vv) {
                    $arr[] = $vv['dealer_name'];
                }
                $string = join(",",$arr);
                $lists[$key]['dealer'] = mb_strlen($string, 'utf-8') > 9 ? mb_substr($string, 0, 9, 'utf-8').'....' :$string;
                $lists[$key]['time'] = date("Y-m-d H:i:s",$val['time']);

                //查询用户获得的奖品
                $lists[$key]['lotter'] = 0;
                $lotterArray = DB::name("user_db_yongle")->alias("d")->join("flow_lotuser_db_yongle l","l.userid=d.user_id")->field("d.user_id,l.lotid,l.userid")->where("d.user_id",$val['user_id'])->select();
                foreach ($lotterArray as $k => $v) {
                    $res = DB::name("lottery_db_yongle")->where("id",$v['lotid'])->field("name,id")->select();
                    foreach ($res as $kkk => $vvv) {
                        $lists[$key]['lotter'] = $vvv['name'];
                    }
                }

                //查询车型
                $ModelCar = DB::name("car_series")->where("car_id",$val['models'])->field("car_id,car_name")->find();
                $lists[$key]['models'] = $ModelCar['car_name'];
            }
            // print_r($lists);die;
            $Ip = new IpLocation('UTFWry.dat'); // 实例化类 参数表示IP地址库文件
            $this->assign('Nowpage', $Nowpage); //当前页
            $this->assign('allpage', $allpage); //总页数
            $this->assign('count', $count);
            $this->assign("search_user",$res);
            $this->assign('val', $key);
            $this->assign('table', $project_tablename);//用户表
            $this->assign('lotuser_table', $lotuser_table);//奖品表
            $this->assign("phone",$serchName);//搜索条件
            if(input('get.page')){
                return json($lists);
            }
            return $this->fetch();
    }

    /**
     * 东标-Vista用户留资列表
     * @return [type] [description]
     */
    function user_db_vista()
    {
        $serchName = input("param.phone");
        if(isset($serchName) || !empty($serchName)){
            $where = "phone='$serchName'";
        }
        else
        {
            $where = 1;
        }
        $project_tablename = "user_db_vista";
        $lotuser_table = "lotuser_db_vista";//奖品表
        $key = input('key');
        $map = [];
        if($key&&$key!==""){
            $map['admin_id'] =  $key;
        }
        $res = Db::name("user_db_vista")->order("user_id desc")->select();

            $Nowpage = input('get.page') ? input('get.page'):1;
            $limits = 10;// 获取总条数
            $count = Db::name('user_db_vista')->where($where)->count();//计算总页面
            $allpage = intval(ceil($count / $limits));
            $lists = Db::name('user_db_vista')->where($where)->page($Nowpage, $limits)->order('user_id desc')->select();

            //查询经销商
            foreach ($lists as $key => $val) {
                $array = Db::name("dealer_dongbiao")->where("dealer_id",'in',$val['dealer_name'])->select();
                $arr = array();
                foreach ($array as $kk => $vv) {
                    $arr[] = $vv['dealer_name'];
                }
                $string = join(",",$arr);
                $lists[$key]['dealer'] = mb_strlen($string, 'utf-8') > 9 ? mb_substr($string, 0, 9, 'utf-8').'....' :$string;
                $lists[$key]['time'] = date("Y-m-d H:i:s",$val['time']);

                //查询用户获得的奖品
                $lists[$key]['lotter'] = 0;
                $lotterArray = DB::name("user_db_vista")->alias("d")->join("flow_lotuser_db_vista l","l.userid=d.user_id")->field("d.user_id,l.lotid,l.userid")->where("d.user_id",$val['user_id'])->select();
                foreach ($lotterArray as $k => $v) {
                    $res = DB::name("lottery_db_vista")->where("id",$v['lotid'])->field("name,id")->select();
                    foreach ($res as $kkk => $vvv) {
                        $lists[$key]['lotter'] = $vvv['name'];
                    }
                }

                //查询车型
                $ModelCar = DB::name("car_series")->where("car_id",$val['models'])->field("car_id,car_name")->find();
                $lists[$key]['models'] = $ModelCar['car_name'];
            }
            // print_r($lists);die;
            $Ip = new IpLocation('UTFWry.dat'); // 实例化类 参数表示IP地址库文件
            $this->assign('Nowpage', $Nowpage); //当前页
            $this->assign('allpage', $allpage); //总页数
            $this->assign('count', $count);
            // $this->assign("search_user",$res);
            // $this->assign('val', $key);
            $this->assign('table', $project_tablename);//用户表
            $this->assign('lotuser_table', $lotuser_table);//奖品表
            $this->assign("phone",$serchName);//搜索条件
            if(input('get.page')){
                return json($lists);
            }
            return $this->fetch();
    }

	/**
	 * 宝沃留资列表
	 * @return [type] [description]
	 */
	function user_baowo()
	{
        $serchName = input("param.phone");
        if(isset($serchName) || !empty($serchName)){
            $where = "phone='$serchName'";
        }
        else
        {
            $where = 1;
        }

		$project_tablename = "user_baowo";
		$key = input('key');
        $map = [];
        if($key&&$key!==""){
            $map['admin_id'] =  $key;
        }
		$arr = Db::name("user_baowo")->where($where)->order("dealer_id desc")->select(); //获取用户列表
       // foreach ($arr as $kk => $vv) {
       //      $arr[$kk]['time'] = date("Y-m-d",$vv['time']);
       //  }
        $Nowpage = input('get.page') ? input('get.page'):1;
        $limits = 10;// 获取总条数
        $count = Db::name('user_baowo')->where($where)->count();//计算总页面
        // echo $count;die;
        $allpage = intval(ceil($count / $limits));
        $lists = Db::name('user_baowo')->where($where)->page($Nowpage, $limits)->order('dealer_id desc')->select();
         foreach ($lists as $kk => $vv) {
        	$lists[$kk]['time'] = date("Y-m-d H:i:s",$vv['time']);

            //查询用户获得的奖品
            $lists[$kk]['lotter'] = 0;
            $lotterArray = DB::name("user_baowo")->alias("b")->join("flow_lotuser l","l.userid=b.dealer_id")->field("b.dealer_id,l.lotid,l.userid")->where("b.dealer_id",$vv['dealer_id'])->select();
            foreach ($lotterArray as $k => $v) {
                $res = DB::name("lottery")->where("id",$v['lotid'])->field("name,id")->select();
                foreach ($res as $kkk => $vvv) {
                    $lists[$kk]['lotter'] = $vvv['name'];
                }
            }
        }
        // print_r($lists);die;
        $Ip = new IpLocation('UTFWry.dat'); // 实例化类 参数表示IP地址库文件
        $this->assign('Nowpage', $Nowpage); //当前页
        $this->assign('allpage', $allpage); //总页数
        $this->assign('count', $count);
        // $this->assign("search_user",$arr);
        // $this->assign('val', $key);
        $this->assign("phone",$serchName);
        $this->assign('table', $project_tablename);
        if(input('get.page')){
            return json($lists);
        }
        return $this->fetch('baowouser_list');
	}


    /*
     * 更改留资用户状态列表
     * 宝沃
     */
    public function BstateWleval(){
        $id = input('param.id');
        $status = Db::name('user_baowo')->where(array('dealer_id'=>$id))->value('status');//判断当前状态情况
        if($status == 1)
        {
            $flag = Db::name('user_baowo')->where(array('dealer_id'=>$id))->setField(['status'=>0]);
            return json(['code' => 1, 'data' => $flag['data'], 'msg' => '已禁止']);
        }
        else
        {
            $flag = Db::name('user_baowo')->where(array('dealer_id'=>$id))->setField(['status'=>1]);
            return json(['code' => 0, 'data' => $flag['data'], 'msg' => '已开启']);
        }
    }

    /**
     * [BuserWedit 编辑用户 宝沃]
     * @return [type] [description]
     * @author [jonny] [980218641@qq.com]
     */
    public function BuserWedit()
    {
        $Capital = new CapitalModel();

        if(request()->isAjax()){

            $param = input('post.');
            $province = strtok($param['province'], '_');  //省
            $city = strtok($param['city'], '_');  //市
            // $cityId = $province.",".$city.",".$param['area'];//省市县id
            $cityId = $province.",".$city;//省市县id

            $arr = DB::name("city")->where("region_id","in",$cityId)->select();
            foreach($arr as $key => $val){
                $string[] = $val['region_name'];
            }
            $param['citys'] = implode(",",$string);//省市县名称

            $flag = $Capital->BuserWedit($param);

            return json(['code' => $flag['code'], 'data' => $flag['data'], 'msg' => $flag['msg']]);
        }

        $id = input('param.id');
        $data = $Capital->BuserWfind($id);

        $this->assign("dealer_id",$id);
        $this->assign("data",$data);
        return $this->fetch();
    }

    /**
     * [BuserWedit 编辑用户 东标]
     * @return [type] [description]
     * @author [jonny] [980218641@qq.com]
     */
    public function DuserBedit()
    {
        $Capital = new CapitalModel();
        if(request()->isAjax()){
            $param = input('post.');
            $table = $param['table'];
            unset($param['table']);
            $province = strtok($param['province'], '_');  //省
            $city = strtok($param['city'], '_');  //市
            $param['cityId'] = $province.",".$city.",".$param['area'];//省市县id
            $flag = $Capital->DuserBedit($param,$table);

            return json(['code' => $flag['code'], 'data' => $flag['data'], 'msg' => $flag['msg']]);
        }

        $id = input('param.id');
        $table = input('param.table');
        $data = $Capital->DuserBfind($id,$table);
        $this->assign("dealer_id",$id);
        $this->assign("data",$data);
        $this->assign("table",$table);
        return $this->fetch();
    }

    /*
     * 更改留资用户状态列表
     * 东标
     */
    public function DstateBleval()
    {
        $id = input('param.id');

        $status = Db::name('user_dongbiao')->where(array('user_id'=>$id))->value('status');//判断当前状态情况
        if($status == 1)
        {
            $flag = Db::name('user_dongbiao')->where(array('user_id'=>$id))->setField(['status'=>0]);
            return json(['code' => 1, 'data' => $flag['data'], 'msg' => '已禁止']);
        }
        else
        {
            $flag = Db::name('user_dongbiao')->where(array('user_id'=>$id))->setField(['status'=>1]);
            return json(['code' => 0, 'data' => $flag['data'], 'msg' => '已开启']);
        }
    }


    /**
     * [UserDel 删除用户]
     * 宝沃
     * @return [type] [description]
     * @author [jonny] [980218641@qq.com]
     */
    public function BuserWdel()
    {
        $id = input('param.id');
        $Capital = new CapitalModel;
        $flag = $Capital->BuserWdel($id);
        return json(['code' => $flag['code'], 'data' => $flag['data'], 'msg' => $flag['msg']]);
    }

    /**
     * [UserDel 删除用户]
     * 东标
     * @return [type] [description]
     * @author [jonny] [980218641@qq.com]
     */
    public function DuserBdel()
    {
        $id = input('param.id');
        $table = input('param.table');
        $lotuser_table = input('param.lotuser_table');
        $Capital = new CapitalModel;
        $flag = $Capital->DuserBdel($id,$table,$lotuser_table);
        return json(['code' => $flag['code'], 'data' => $flag['data'], 'msg' => $flag['msg']]);
    }

		/**
     * 福特留资列表
     * @return [type] [description]
     */
    function user_fute()
    {
        $Nowpage = input('get.page') ? input('get.page'):1;
        $serchName = input("param.phone");
        $table = input("param.table");
        $where = [];
        if(isset($serchName) || !empty($serchName)){
            $where = "mobile='$serchName'";
        }
        $capital = new CapitalModel();
        $data = $capital->UserListData($Nowpage,$table,$where);
        foreach ($data['list'] as $key => $val) {
            $dealer_name = DB::connect("db_flowuser")->name("dealer_fute")->where("dealer_id","in",$val['dealer_name'])->field("dealer_name")->select();
            $num = [];
            foreach ($dealer_name as $k => $v) {
                $num[] = $v['dealer_name'];
                $data['list'][$key]['dealer_name'] = join(",",$num);
            }
        }
        // p($data);
        $this->assign('Nowpage', $Nowpage); //当前页
        $this->assign('allpage', $data['allpage']); //总页数
        $this->assign('count', $data['count']);
        $this->assign("phone",$serchName);
        $this->assign('table', $table);
        if(input('get.page')){
            return json($data['list']);
        }
        return $this->fetch();
    }

     /**
     * 长城留资列表
     * @return [type] [description]
     */
    function user_changchen()
    {
        // echo 11;
        $Nowpage = input('get.page') ? input('get.page'):1;
        $serchName = input("param.phone");
        $table = input("param.table");
        $where = [];
        if(isset($serchName) || !empty($serchName)){
            $where = "mobile='$serchName'";
        }
        $capital = new CapitalModel();
        $data = $capital->UserListData($Nowpage,$table,$where);
        foreach ($data['list'] as $key => $val) {
            $dealer_name = DB::connect("db_flowuser")->name("dealer_changchen")->where("dealer_id","in",$val['dealer_name'])->field("dealer_name")->select();
            $num = [];
            foreach ($dealer_name as $k => $v) {
                $num[] = $v['dealer_name'];
                $data['list'][$key]['dealer_name'] = join(",",$num);
            }
        }
        // p($data);
        $this->assign('Nowpage', $Nowpage); //当前页
        $this->assign('allpage', $data['allpage']); //总页数
        $this->assign('count', $data['count']);
        $this->assign("phone",$serchName);
        $this->assign('table', $table);
        if(input('get.page')){
            return json($data['list']);
        }
        return $this->fetch();
    }




 ////////////////////////////////////////////// 道奇怪的分界线--没理由--就是为了分界！////////////////////////////////////////////

 	 /**
		* [UserDealerList] [用户经销商信息列表]
		* @return [type] [description]
		* @author [qinlh] [WeChat QinLinHui0706]
	  */
		public function UserDealerList()
		{
			 $base = new BaseModel;
			 $project_id = input("param.project_id");
			 //先查询项目对应用户、经销商表
			 $user_table = DB::name("project_user_dealer")->where("project_id",$project_id)->find()['user_table'];
			//  echo $user_table;die;
			 $dealer_table = DB::name("project_user_dealer")->where("project_id",$project_id)->find()['dealer_table'];


			 //查询经销商名称
			 $project_name = DB::name("project")->where("id",$project_id)->field("project_name,time,source_start,draw_id")->find();
			//  p($project_name);
			 $Nowpage = input('param.page') ? input('param.page'):1;
			 $serchName = input("param.phone");
			 $moreName = input("param.more_name") ? input("param.more_name") : '';
       $source_end = input("param.source_end") ? input("param.source_end") : '';
       // p($source_end);
			 $status = input("param.status") ? input("param.status") : '';
				// var_dump($moreName);die;

				$where = [];
				if($project_name['source_start'] == 1) {
					//查询项目对应渠道配置表
					$SourceData = explode("\n",trim(@DB::name("source_config")->where("project_id",$project_id)->find()['source_config']));
					foreach ($SourceData as $key => $val) {
						$SourceData[$key] = substr($val,0,strrpos($val,':'));
					}
					$SourceDataStr = implode(",", $SourceData);
					if(strtotime($project_name['time']) >= 1530633600) { //时间从2018.7.14开始只查询来源渠道名称
						$where['source'] = ['in', $SourceDataStr];
					}
				}

			 if($status && $status !== '') {
				 $where['status'] = 0;
			 }
			 if(isset($serchName) || !empty($serchName)){
					$where['mobile'] = $serchName;
			 }

       if($source_end && $source_end !== ''){
          $where['source_end'] = $source_end;
       }
			 if($moreName && $moreName !== '') {
				 $where['source'] = $moreName;
			 } elseif ($moreName == '全部') {
				 $where['source'] = '';
			 }
			//  p($where);
			 $capital = new CapitalModel();
			 $data = $capital->UserListData($Nowpage,$user_table,$where);
			 foreach ($data['list'] as $key => $val) {
					 $num = [];
					 $LineBlank = array(" ","　","\t","\n","\r"); //php去除空格和换行
					 //开始判断是否查询来源渠道
					 $data['list'][$key]['source'] = "未选择";
					 $data['list'][$key]['dealer_name'] = "未选择";
					 if($project_name['source_start'] == 1)
					 {//开始统计来源渠道
							 $data['list'][$key]['source'] = $base->SourceStatistics($project_id,str_replace($LineBlank, '', $val['source']));
					 }
					 $str = @substr($val['dealer_name'],0,1);
					 //查询经销商名称
					 if(!is_numeric($str) && !empty($str)) {
						 	$data['list'][$key]['dealer_name'] = $val['dealer_name'];
					 } else if(is_numeric($str) && $str !== 0) {
						 // 开始对应查询经销商
						 $dealer_name = DB::connect("db_flowuser")->name($dealer_table)->where("dealer_id","in",$val['dealer_name'])->field("dealer_name")->select();
						 foreach ($dealer_name as $k => $v) {
							 $num[] = $v['dealer_name'];
							 $data['list'][$key]['dealer_name'] = mb_strlen(join(",",$num), 'utf-8') > 20 ? mb_substr(join(",",$num), 0, 20, 'utf-8').'....' : join(",",$num);
						 }
					 }

					 //如果项目活动ID不是 0 的话，查询对应抽奖信息
					 if($project_name['draw_id'] > 0) {
						 //查询对应的活动关联表、概率表、用户抽奖信息表
							$lotuser_table = DB::name("draw")->where("draw_id",$project_name['draw_id'])->field("drawuser_table,drawtable_name")->find();
						 	$drawData = DB::connect("db_flowuser")->name($lotuser_table['drawuser_table'])->field("userid,lotid")->where('userid',$val['user_id'])->find();
							$data['list'][$key]['draw_name'] = DB::name($lotuser_table['drawtable_name'])->where("id",$drawData['lotid'])->field('name')->find()['name'];
							if($drawData == array()) {
								$data['list'][$key]['draw_name'] = '未参加活动';
							}
					 }
			 }

			 if($project_name['source_start'] == 1) {
				 $MoreConfigName = explode("\n",trim(@DB::name("source_config")->where("project_id",$project_id)->find()['source_config']));
				 foreach ($MoreConfigName as $keykey => $value) {
						$MoreConfigName[$keykey] = explode(":",$value);
				 }
				 $this->assign('MoreConfigName', $MoreConfigName);
			 }
			//  p($data);

			 $this->assign('Nowpage', $Nowpage); //当前页
			 $this->assign('allpage', $data['allpage']); //总页数
			 $this->assign('count', $data['count']);
			 $this->assign("phone",$serchName);
       $this->assign("source_end",$source_end);
       $this->assign("is_column",$data['is_column']);
			 $this->assign("moreName",$moreName);
			 $this->assign('table', $user_table);
			 $this->assign('project_name', $project_name['project_name']);
			 $this->assign('source_start', $project_name['source_start']);
			 $this->assign('project_id', $project_id);
			 $this->assign('status', $status);
			 $this->assign('draw_id', $project_name['draw_id']); //抽奖ID
			 if(input('get.page')) {
					 return json($data['list']);
			 }
			 return $this->fetch("user_list_public");
		}


     /**
     * 修改用户信息状态
     * @return [type] [description]
     */
    public function DealerUserStatus()
    {
        $id = input('param.id') ? input('param.id') : 0;//接受数据ID
        $table = input('param.table') ? input('param.table') : '';//接受数据表名

        $status = Db::name($table)->where(array('user_id'=>$id))->value('status');//判断当前状态情况
        if($status == 1)
        {
            $flag = Db::name($table)->where(array('user_id'=>$id))->setField(['status'=>0]);
            return json(['code' => 1, 'data' => $flag['data'], 'msg' => '已禁止']);
        }
        else
        {
            $flag = Db::name($table)->where(array('user_id'=>$id))->setField(['status'=>1]);
            return json(['code' => 0, 'data' => $flag['data'], 'msg' => '已开启']);
        }
    }

    /**
     * [UserDel 删除项目]
     * @return [type] [description]
     * @author [jonny] [980218641@qq.com]
     */
    public function DealerDel()
    {
        $id = input('param.id');
        $table = input('param.table');
        // echo $id;die;
        $Capital = new CapitalModel;
        $flag = $Capital->DealerDel($id,$table);
        return json(['code' => $flag['code'], 'data' => $flag['data'], 'msg' => $flag['msg']]);
    }

}
