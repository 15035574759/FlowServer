<?php
/**
 * 极客之家 高端PHP - 世界杯购车季模块
 * @copyright  Copyright (c) 2000-2019 QIN TEAM (http://www.qlh.com)
 * @version    GUN  General Public License 10.0.0
 * @license    Id:  Worcar.php 2018-5-9 16:33:59
 * @author     Qinlh WeChat QinLinHui0706
 */
namespace app\admin\controller;
use app\admin\model\WorcarModel;
use app\admin\model\BaseModel;
use app\admin\model\ExcelModel;
use think\Db;
class Worcar extends Base
{
  /**
   * [worcar_list] [活动列表]
   * @param [param] [description]
   * @return [type] [description]
   * @author [qinlh] [WeChat QinLinHui0706]
   */
    public function worcar_list() {
      $page = input('get.page') ? input('get.page') : 1;//当前页
      $worcar  = new WorcarModel;
      $data = $worcar->WorcarList($page);

      $count = $data['count'];
      $allpage = $data['allpage'];
      $lists = $data['lists'];
      $this->assign([
          'count'  => $count,//总条数
          'allpage' => $allpage,//总页面
      ]);
      if(input('get.page')){
          return json($lists);//数据
      }
      return $this->fetch();
    }

    /**
     * [worcar_add] [添加活动]
     * @param [param] [description]
     * @return [type] [description]
     * @author [qinlh] [WeChat QinLinHui0706]
     */
    public function worcar_add() {
      $worcar = new WorcarModel();
      if(request()->isAjax()) {
        $data = input('param.');
        if(!isset($data['nameuse']) && $data['nameuse'] == '') exit(json_encode(['code'=>1004, 'data'=>$data, 'msg'=>'参数有误']));
        if(!isset($data['image']) && $data['image'] == '') exit(json_encode(['code'=>1004, 'data'=>$data, 'msg'=>'参数有误']));
        if(!isset($data['describe']) && $data['describe'] == '') exit(json_encode(['code'=>1004, 'data'=>$data, 'msg'=>'参数有误']));
        if(!isset($data['cityId']) && $data['cityId'] == 0) exit(json_encode(['code'=>1004, 'data'=>$data, 'msg'=>'参数有误']));

        $base  = new BaseModel;
        $new_file = $base->MoveFile("worcar",$data['image']);
        $AddData = [
           'name' => $data['nameuse']
          ,'describe' => $data['describe']
          ,'cover_img' => $new_file['data']
          ,'vip_url' => $data['vip_url']
          ,'city_id' => $data['cityId']
          ,'addtime' => time()
          ,'state' => isset($data['state']) ? 1 : 0
          ,'sort' => isset($data['sort']) ? $data['sort'] : @DB::connect('db_active')->name("worcar_activity")->max('id') + 1
        ];
        $flag = $worcar->WorcarAdd($AddData);
        return json(['code' => $flag['code'], 'data' => $flag['data'], 'msg' => $flag['msg']]);
      }
      $CityList = $worcar->WorcarCityList();
      $WorcarId = @DB::connect('db_active')->name("worcar_activity")->max('id') + 1;
      $this->assign([
         'CityList' => $CityList,
         'WorcarId' => $WorcarId
      ]);
      return $this->fetch();
    }

    /**
     * [WorcarUpdate] [修改品牌活动]
     * @param [param] [description]
     * @return [type] [description]
     * @author [qinlh] [WeChat QinLinHui0706]
     */
    public function WorcarUpdate() {
      $worcar = new WorcarModel();
      $base  = new BaseModel;
      if(request()->isAjax()) {
        $data = input('param.');
        // p($data);
        if(!isset($data['nameuse']) && $data['nameuse'] == '') exit(json_encode(['code'=>1004, 'data'=>$data, 'msg'=>'参数有误']));
        if(!isset($data['image']) && $data['image'] == '') exit(json_encode(['code'=>1004, 'data'=>$data, 'msg'=>'参数有误']));
        if(!isset($data['describe']) && $data['describe'] == '') exit(json_encode(['code'=>1004, 'data'=>$data, 'msg'=>'参数有误']));
        if(!isset($data['cityId']) && $data['cityId'] == 0) exit(json_encode(['code'=>1004, 'data'=>$data, 'msg'=>'参数有误']));

        $img_str = $data['image']; //图片上传状态、是否重新上传图片
        if($data['img_start'] == 1) {//说明图片重新上传了、替换移动图片
            $new_file = $base->MoveFile("worcar",$data['image']);
        } else {
            $new_file['data'] = $data['image'];
        }
        $UpdateData = [
           'name' => $data['nameuse']
          ,'describe' => $data['describe']
          ,'cover_img' => $new_file['data']
          ,'vip_url' => $data['vip_url']
          ,'city_id' => $data['cityId']
          ,'updatetime' => time()
          ,'state' => isset($data['state']) ? 1 : 0
          ,'sort' => isset($data['sort']) ? $data['sort'] : @DB::connect('db_active')->name("worcar_activity")->max('id') + 1
        ];
        $flag = $worcar->WorcarUpdate($UpdateData,$data);
        return json(['code' => $flag['code'], 'data' => $flag['data'], 'msg' => $flag['msg']]);
      }
      $id = input('param.id');
      $data = $worcar->WorcarUpdateshow($id);
      $CityList = $worcar->WorcarCityList($data['city_id']);
      // p($CityList);
      $this->assign([
         'CityList' => $CityList,
         'UpdateData' => $data,
         'id' => $id
      ]);
      return $this->fetch('worcar_update');
    }

    /**
     * [position_state 项目状态]
     * @return [type] [description]
     * @author [jonny] [980218641@qq.com]
     */
    public function WorcarStart() {
        $id = input('param.id');
        $status = Db::connect('db_active')->name('worcar_activity')->where(array('id'=>$id))->value('state');//判断当前状态情况
        if($status == 1) {
            writelog(session('admin_uid'),session('admin_username'),'用户【'.session('admin_username').'】禁止世界杯活动【'.$id.'】状态成功',1);
            $flag = Db::connect('db_active')->name('worcar_activity')->where(array('id'=>$id))->setField(['state'=>0]);
            return json(['code' => 1, 'data' => $flag['data'], 'msg' => '已禁止']);
        } else {
            writelog(session('admin_uid'),session('admin_username'),'用户【'.session('admin_username').'】开启世界杯活动【'.$id.'】状态成功',1);
            $flag = Db::connect('db_active')->name('worcar_activity')->where(array('id'=>$id))->setField(['state'=>1]);
            return json(['code' => 0, 'data' => $flag['data'], 'msg' => '已开启']);
        }
    }

    /**
     * [WorcarDelete 删除活动]
     * @return [type] [description]
     * @author [jonny] [980218641@qq.com]
     */
    public function WorcarDelete() {
        $id = input('param.id');
        $worcar = new WorcarModel();
        $flag = $worcar->WorcarDelete($id);
        return json(['code' => $flag['code'], 'data' => $flag['data'], 'msg' => $flag['msg']]);
    }

    /**
     * [uploadProjectImage 添加活动上传图片]
     * @return [type] [description]
     * @author [qinlh] [15035574759@163.com]
     */
    public function uploadWorcarImage()
    {
        $file = request()->file('file');
        // print_r($file);die;
        $info = $file->move(ROOT_PATH . 'public' . DS . 'upload/testfile');//先移动到临时文件
        if($info) {
            $res['status'] = 1;
            $res['image_name'] = $info->getSaveName();
            return json_encode($res);
        } else {
            $res['status']=0;
            $res['error_info'] = $file->getError();
            return json_encode($res);
        }
    }


    /**
     * [ShowWorcarUserList] [查询对应活动用户留资列表]
     * @param [param] [description]
     * @return [type] [description]
     * @author [qinlh] [WeChat QinLinHui0706]
     */
    public function ShowWorcarUserList() {
      $worcar = new WorcarModel();
      $id = input('get.id') ? input('get.id') : '';
      $pageId = input('get.pageId') ? input('get.pageId') : 1;
      $map = [];
      if($id && $id > 0) $map['act_id'] = $id;
      $data = $worcar->ShowWorcarUserList($pageId, $map);
      $count = $data['count'];
      $allpage = $data['allpage'];
      $lists = $data['lists'];
      $this->assign([
          'count'  => $count,//总条数
          'allpage' => $allpage,//总页面
          'name' => $data['name'],//活动名称
          'act_id' => $id
      ]);
      if(input('get.page')){
          return json($lists);//数据
      }
      writelog(session('admin_uid'),session('admin_username'),'用户【'.session('admin_username').'】查询世界杯留资数据对应活动【'.$id.'】成功',1);
      return $this->fetch('user_list');
    }

    /**
     * [UserListExcel] [导出对应用户留资数据]
     * @param [param] [description]
     * @return [type] [description]
     * @author [qinlh] [WeChat QinLinHui0706]
     */
    public function UserListExcel() {
      $id = input('param.id') ? input('param.id') : '';//活动id
      $ExcelTable = new ExcelModel;
      $where = [];
      $where['act_id'] = $id;
      //先查询所有用户信息
      $data = DB::connect('db_active')
                      ->name("worcar_user")
                      ->alias("wu")
                      ->where($where)
                      ->join("flow_worcar_city wc","wu.city_id=wc.id")
                      ->join("flow_worcar_activity wa","wu.act_id=wa.id")
                      ->field('wu.*, wc.name as city_name,wa.name as act_name  ')
                      ->order("wa.id desc")
                      ->select();
      foreach ($data as $key => $val) {
        $data[$key]['time'] = date("Y-m-d H:i:s", $val['time']);
        if($val['source_end'] == 1) {
          $data[$key]['source_end'] = 'PC端';
        } else {
          $data[$key]['source_end'] = '移动端';
        }
      }
        //定制表头
    		$header = array('编号','姓名','手机','城市','活动名称','注册时间','来源设备');
    		foreach ($data as $key => $value)
    		{
    				$dataArr[] = array(
    						'user_id'=>$value['user_id'],
    						'name'=>$value['name'],
    						'mobile'=>$value['mobile'],
    						'city_name'=>$value['city_name'],
    						'act_name'=>$value['act_name'],
    						'time'=>$value['time'],
    						'source_end'=>$value['source_end']
    				);
    		}
        writelog(session('admin_uid'),session('admin_username'),'用户【'.session('admin_username').'】导出世界杯活动【'.$id.'】数据成功',1);
    		//导出
    		$ExcelTable->writer($header,$dataArr);//导出 此导出表头最长为A-Z,如果需要更长，请自行更改
    }


    //********************************************城市分类管理*********************************************//
        /**
         * 世界杯城市
         * @return [type] [description]
         */
        public function worcar_class()
        {
            $data = DB::connect('db_active')->name("worcar_city")->order("id desc")->select();
            $this->assign("list",$data);
            return $this->fetch();
        }

        /**
         * 添加世界杯城市
         */
        public function add_worcarClass()
        {
            $worcar  = new WorcarModel;
            if(request()->isAjax())
            {
               $data = input('param.');
               $flag = $worcar->add_worcarClass($data);
               return json(['code' => $flag['code'], 'data' => $flag['data'], 'msg' => $flag['msg']]);
            }
            return $this->fetch("add_worcar_class");
        }

         /**
          * 编辑世界杯城市
          * @return [type] [description]
          */
        public function edit_worcarClass()
        {
            $worcar  = new WorcarModel;
            if(request()->isAjax()){
                $param = input('post.');
                $flag = $worcar->edit_worcarClass($param);
                return json(['code' => $flag['code'], 'data' => $flag['data'], 'msg' => $flag['msg']]);
            }

            $id = input('param.id');
            $data = Db::connect('db_active')->name('worcar_city')->where('id',$id)->find();
            $this->assign('list',$data);
            $this->assign('id',$id);
            return $this->fetch("edit_worcar_class");
        }


        /**
         * [del_prijectClass 删除世界杯城市]
         * @return [type] $id [分类ID]
         * @author [qlh] [1397118453@qq.com]
         */
        public function del_worcarClass()
        {
            $id = input('param.id');
            $worcar  = new WorcarModel;
            $flag = $worcar->del_worcarClass($id);
            return json(['code' => $flag['code'], 'data' => $flag['data'], 'msg' => $flag['msg']]);
        }

        /**
         * [project_class_state 世界杯城市状态]
         * @return [type] [description]
         * @author [qinlh] [1397118453@qq.com]
         */
        public function worcar_class_state()
        {
            $id=input('param.id');
            $arr = Db::connect('db_active')->name('worcar_city')->where(array('id'=>$id))->find();//判断当前状态情况
            if($arr['state'] == 1) {
                writelog(session('admin_uid'),session('admin_username'),'用户【'.session('admin_username').'】禁止世界杯活动城市【'.$arr['name'].'】状态成功',1);
                $flag = Db::connect('db_active')->name('worcar_city')->where(array('id'=>$id))->setField(['state'=>0]);
                return json(['code' => 1, 'data' => $flag['data'], 'msg' => '已禁止']);
            } else {
                writelog(session('admin_uid'),session('admin_username'),'用户【'.session('admin_username').'】开启世界杯活动城市【'.$arr['name'].'】状态成功',1);
                $flag = Db::connect('db_active')->name('worcar_city')->where(array('id'=>$id))->setField(['state'=>1]);
                return json(['code' => 0, 'data' => $flag['data'], 'msg' => '已开启']);
            }

        }
}
