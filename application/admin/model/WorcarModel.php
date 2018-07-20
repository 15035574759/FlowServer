<?php
/**
 * 极客之家 高端PHP - 世界杯购车季活动Model
 * @copyright  Copyright (c) 2018 QIN TEAM (http://www.qlh.com)
 * @license    GUN  General Public License 2.0
 * @version    Id:  WorcarModel.php 2018-5-9 16:36:52
 */
namespace app\admin\model;
use think\Model;
use think\Db;
class WorcarModel extends Model
{
    protected  $name = 'worcar_activity';

    /**
     * [worcar_add] [添加世界杯活动]
     * @param [param] [description]
     * @return [type] [description]
     * @author [qinlh] [WeChat QinLinHui0706]
     */
    public function WorcarAdd($data) {
      try{
          if($data['state'] == 'on'){$data['state'] = 0;}
          Db::connect('db_active')->name("worcar_activity")->insert($data);
          $InsertId = Db::connect('db_active')->name('worcar_activity')->getLastInsID();
          if($InsertId >= 1) {
              writelog(session('admin_uid'),session('admin_username'),'【'.session('admin_username').'】添加世界杯活动【'.$InsertId.'】失败',2);
              return ['code' => -1, 'data' => '', 'msg' => $this->getError()];
          } else {
              writelog(session('admin_uid'),session('admin_username'),'【'.session('admin_username').'】添加世界杯活动【'.$InsertId.'】成功',1);
              return ['code' => 1, 'data' => '', 'msg' => '添加成功'];
          }
      }
      catch( PDOException $e) {
          return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
      }
    }

    /**
     * [WorcarUpdate] [世界杯活动修改]
     * @param [param] [description]
     * @return [type] [description]
     * @author [qinlh] [WeChat QinLinHui0706]
     */
    public function WorcarUpdate($update, $data) {
      try{
        //修改数据之前先删除原来项目文件
        $imgurl = Db::connect('db_active')->name($this->name)->where("id",$data['id'])->field("cover_img")->find()['cover_img'];
        $result = Db::connect('db_active')->name($this->name)->where("id",$data['id'])->update($update);
        if(false === $result){
            writelog(session('admin_uid'),session('admin_username'),'【'.session('admin_username').'】修改世界杯活动【'.$data['id'].'】失败',2);
            return ['code' => -1, 'data' => '', 'msg' => $this->getError()];
        }else{
          if($data['img_start'] == 1) { //如果为 1 的话说明重新上传了图片、删除原来图片文件
              @unlink(substr($imgurl,1)); //删除原来文件
          }
            writelog(session('admin_uid'),session('admin_username'),'【'.session('admin_username').'】修改世界杯活动【'.$data['id'].'】成功',1);
            return ['code' => 1, 'data' => '', 'msg' => '修改成功'];
        }
      } catch( PDOException $e) {
          return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
      }
    }

    /**
     * 项目修改 查询单条数据
     * @param [type] $id [description]
     */
    public function WorcarUpdateshow($id)
    {
        return Db::connect('db_active')->name($this->name)->where("id",$id)->find();
        // $str = explode("-", $data['period']);
        // $data['update_time'] = str_replace("/","-",$str[0]);//开始时间
        // return $data;
    }

    /**
     * [WorcarCityList] [查询所有城市分类数据]
     * @param [$city_id] [分类id]
     * @return [type] [description]
     * @author [qinlh] [WeChat QinLinHui0706]
     */
    public function WorcarCityList($city_id='') {
      try {
          $data = Db::connect('db_active')->name("worcar_city")->where("state", 1)->select();
          $CityId = explode(",", $city_id);
          // p($CityId);
          foreach ($data as $key => $val) {
              if($val['id'] == $city_id) {
                  $data[$key]['num'] = 1;
              } else {
                  $data[$key]['num'] = 0;
              }
          }
          // p($data);
          return $data;
      } catch (Exception $e) {
          return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
      }
    }

    /**
     * [WorcarList] [品牌活动列表]
     * @param [$page] [当前页]
     * @return [type] [description]
     * @author [qinlh] [WeChat QinLinHui0706]
     */
    public function WorcarList($page, $where=[]) {
      $limits = 30;// 获取总条数
      $count = Db::connect('db_active')->name($this->name)->where($where)->count();//计算总页面
      $allpage = intval(ceil($count / $limits));
    	$lists = Db::connect('db_active')->name($this->name)
                      ->where($where)
                      ->alias("wa")
                      ->join("flow_worcar_city wc","wa.city_id=wc.id")
                      ->page($page, $limits)
                      ->field('wa.*, wc.name as city_name')
                      ->order("wa.id desc")
                      ->select();
      foreach ($lists as $key => $val) {
        $lists[$key]['addtime'] = date("Y-m-d H:i:s", $val['addtime']);
        $lists[$key]['describe'] = mb_strlen($val['describe'], 'utf-8') > 15 ? mb_substr($val['describe'], 0, 15, 'utf-8').'....' : $val['describe'];
      }
      // p($lists);
      foreach ($lists as $key => $val) {
        $start = Db::connect('db_active')->name('worcar_user')->where("act_id", $val['id'])->find();
        if(true == $start && $start > 0) {
          $lists[$key]['user_start'] = 1;
        } else {
          $lists[$key]['user_start'] = 0;
        }
      }
      // p($lists);
      return ['count'=>$count,'allpage'=>$allpage,'lists'=>$lists];
    }

    /**
    * 删除世界杯活动 列表
    * @param [type] $id [description]
    */
   public function WorcarDelete($id)
   {
       try{
           //查询项目封面图片
           @$imgurl = Db::connect('db_active')->name($this->name)->where("id",$id)->field("cover_img")->find()['cover_img'];
           $res = Db::connect('db_active')->name($this->name)->where('id', $id)->delete();
           if(false == $res) {
             writelog(session('admin_uid'),session('admin_username'),'用户【'.session('admin_username').'】删除世界杯活动失败(ID='.$id.')',2);
           }
           @unlink(substr($imgurl,1)); //删除原来文件
           writelog(session('admin_uid'),session('admin_username'),'用户【'.session('admin_username').'】删除世界杯活动成功(ID='.$id.')',1);
           return ['code' => 1, 'data' => '', 'msg' => '删除活动成功'];
       } catch( PDOException $e) {
           return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
       }
   }

   /**
    * [ShowWorcarUserList] [查询对应活动用户留资列表]
    * @param [$page] [当前页]
    * @param [$where] [查询条件]
    * @return [type] [description]
    * @author [qinlh] [WeChat QinLinHui0706]
    */
   public function ShowWorcarUserList($page, $where) {
     $limits = 30;// 获取总条数
     $count = Db::connect('db_active')->name("worcar_user")->where($where)->count();//计算总页面
     $allpage = intval(ceil($count / $limits));
     $lists = Db::connect('db_active')->name("worcar_user")
                     ->alias("wu")
                     ->where($where)
                     ->join("flow_worcar_city wc","wu.city_id=wc.id")
                     ->join("flow_worcar_activity wa","wu.act_id=wa.id")
                     ->page($page, $limits)
                     ->field('wu.*, wc.name as city_name,wa.name as act_name  ')
                     ->order("wa.id desc")
                     ->select();
      foreach ($lists as $key => $val) {
        $lists[$key]['time'] = date("Y-m-d H:i:s", $val['time']);
      }
      $name = Db::connect('db_active')->name($this->name)->where("id",$where['act_id'])->field("name")->find()['name'];
    //  p($lists);
     return ['count'=>$count,'allpage'=>$allpage,'lists'=>$lists,'name'=>$name];
   }

   //******************************************** 世界杯城市管理*********************************************//

       /**
        * 添加活世界杯城市
        * @param [type] $data [数据]
        */
       public function add_worcarClass($data)
       {
           try{
               $data['state'] = isset($data['state']) ? 1 : 0;
               $res = DB::connect('db_active')->name("worcar_city")->where("name",$data['name'])->find();
               if(true == $res) {
                 return ['code' => -1, 'data' => '', 'msg' => '该城市已经存在'];
               }
               $result = DB::connect('db_active')->name("worcar_city")->insert($data);
              //  $InsertId = Db::connect('db_active')->name('worcar_city')->getLastInsID();
               if(false === $result){
                   writelog(session('admin_uid'),session('admin_username'),'用户【'.session('admin_username').'】添加世界杯城市【'.$data['name'].'】失败',2);
                   return ['code' => -1, 'data' => '', 'msg' => $this->getError()];
               }else{
                   writelog(session('admin_uid'),session('admin_username'),'用户【'.session('admin_username').'】添加世界杯城市【'.$data['name'].'】成功',1);
                   return ['code' => 1, 'data' => '', 'msg' => '添加成功'];
               }
           }
           catch( PDOException $e)
           {
               return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
           }
       }

        /**
        * [delMenu 删除世界杯城市]
        * @return [type] [description]
        * @author [jonny] [980218641@qq.com]
        */
       public function del_worcarClass($id)
       {
           try{
               $result = DB::connect('db_active')->name("worcar_city")->where('id', $id)->delete();
               if(false === $result){
                  writelog(session('admin_uid'),session('admin_username'),'用户【'.session('admin_username').'】删除世界杯城市【'.$id.'】失败',2);
                   return ['code' => -1, 'data' => '', 'msg' => $this->getError()];
               }else{
                  writelog(session('admin_uid'),session('admin_username'),'用户【'.session('admin_username').'】删除世界杯城市【'.$id.'】成功',1);
                   return ['code' => 1, 'data' => '', 'msg' => '删除分类成功'];
               }
           }catch( PDOException $e){
               return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
           }
       }

       /**
        * [editMenu 编辑世界杯城市]
        * @author [jonny] [980218641@qq.com]
        */
       public function edit_worcarClass($param)
       {
           try{
               $param['state'] = isset($param['state']) ? 1 : 0;
               $result = DB::connect('db_active')->name("worcar_city")->update($param, ['id' => $param['id']]);
               if(false === $result){
                   writelog(session('admin_uid'),session('admin_username'),'用户【'.session('admin_username').'】编辑世界杯城市【'.$id.'】失败',2);
                   return ['code' => 0, 'data' => '', 'msg' => $this->getError()];
               }else{
                   writelog(session('admin_uid'),session('admin_username'),'用户【'.session('admin_username').'】编辑世界杯城市【'.$id.'】成功',1);
                   return ['code' => 1, 'data' => '', 'msg' => '分类编辑成功'];
               }
           }catch( PDOException $e){
               return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
           }
       }

       /**
        * 查询世界杯城市所有
        */
       public function ShowWorcarClassAll($class_id='')
       {
           try {
               $data = DB::connect('db_active')->name("worcar_city")->where("state",1)->select();
               $classId = explode(",",$class_id);
               // p($labelId);
               foreach ($data as $key => $val)
               {

                   if(in_array($val['id'],$classId))
                   {
                       $data[$key]['num'] = 1;
                   }
                   else
                   {
                       $data[$key]['num'] = 0;
                   }
               }
               // p($data);
               return $data;
           } catch (Exception $e) {
               return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
           }
       }
}
