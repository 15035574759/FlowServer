<?php
/**
 * 极客之家 高端PHP - 项目模块
 * @copyright  Copyright (c) 2016 QIN TEAM (http://www.qlh.com)
 * @license    GUN  General Public License 2.0
 * @version    Id:  Type_model.php 2016-6-12 16:36:52
 */
namespace app\admin\model;
use think\Model;
use think\Db;

class ProjectModel extends Model
{

    protected $table = "flow_project";
    protected $name = "project";

    /**
     * 查询所有项目
     * @return [type] [description]
     */
    public function showAll($page)
    {
      $where = [];
      //查询当前用户拥有哪些项目查看权限
      $UserProjectAuthor = DB::name("admin")->where("id",session('admin_uid'))->field('id,project_start')->find()['project_start'];
      if($UserProjectAuthor != 0) {
        $where['id'] =['in',$UserProjectAuthor];
      }
      // p($where);
      $limits = 15;// 获取总条数
      $count = Db::name($this->name)->where($where)->count();//计算总页面
      $allpage = intval(ceil($count / $limits));
    	$lists = Db::name($this->name)
                      ->where($where)
                      ->alias("p")
                      ->join("flow_project_class pc","p.class_id=pc.c_id")
                      // ->join("flow_project_label pl","p.label_id=pl.b_id")
                      ->page($page, $limits)
                      ->order("sort desc")
                      ->select();
      //查询标签以及分类、描述、名称字数控制
    	foreach ($lists as $key => $val)
      {
        $lists[$key]['label_id'] = Db::name("project_label")->where("b_id",'in',$val['label_id'])->select();
    		$lists[$key]['class_id'] = Db::name("project_class")->where("c_id",'in',$val['class_id'])->field("c_id,class_name")->select();
        $lists[$key]['project_name'] = mb_strlen($val['project_name'], 'utf-8') > 15 ? mb_substr($val['project_name'], 0, 15, 'utf-8').'....' : $val['project_name'];
        $lists[$key]['describe'] = mb_strlen($val['describe'], 'utf-8') > 9 ? mb_substr($val['describe'], 0, 9, 'utf-8').'....' : $val['describe'];
    	}
        // p($lists);
        return ['count'=>$count,'allpage'=>$allpage,'lists'=>$lists];
    }

    /**
     * [showAllProject] [项目管理列表]
     * @return [type] [description]
     * @author [qinlh] [WeChat QinLinHui0706]
     */
    public function showAllProject($project_start='')
    {
      try{
        // echo $project_start;die;
          $list = DB::name("project")->field("id,project_name")->select();
          // p($list);
          if(false == $list){
              return ['code' => 0, 'data' => '', 'msg' => $this->getError()];
          }
          foreach ($list as $key => $val) {
              $list[$key]['project_name'] = mb_strlen($val['project_name'], 'utf-8') > 9 ? mb_substr($val['project_name'], 0, 9, 'utf-8').'....' : $val['project_name'];
              if(!empty($project_start)) {
                $arr = explode(",",$project_start);
                if(in_array($val['id'],$arr))
                {
                    $list[$key]['num'] = 1;
                }
                else
                {
                    $list[$key]['num'] = 0;
                }
              }
          }
          // p($list);
          return $list;
      }catch( PDOException $e){
          return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
      }
    }

    /**
     * 添加项目
     * @param  [type] $data [description]
     * @return [type]       [description]
     */
    public function project_add($data)
    {
        try{
            DB::name("project")->insert($data);
            $projectId = Db::name('project')->getLastInsID();
            if($projectId < 1){
                return ['code' => 0, 'data' => '', 'msg' => $this->getError()];
            }else{
                return ['code' => 1, 'data' => $projectId, 'msg' => '添加项目成功'];
            }
        }catch( PDOException $e){
            return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
        }
    }

    /**
     * 添加项目用户、经销商表
     * @param  [type] $data [description]
     * @return [type]       [description]
     */
    public function projectUserDealer_add($data)
    {
        try{
            $user_table = $data['user_table'];
            $dealer_table = $data['dealer_table'];
            //首先判断是否存在用户表以及经销商表
            if(false == @DB::connect("db_flowuser")->query("SHOW TABLES LIKE '%$user_table%'")) {
              @DB::connect("db_flowuser")->query("
              CREATE TABLE `flow_$user_table` (
                `user_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '注册信息id',
                `name` varchar(255) DEFAULT '未选择' COMMENT '姓名',
                `sex` varchar(100) DEFAULT '未选择' COMMENT '性别',
                `mobile` char(11) NOT NULL DEFAULT '0' COMMENT '手机号',
                `dealer_name` varchar(255) DEFAULT '0' COMMENT '经销商 1,2,3',
                `car_type` varchar(255) DEFAULT '未选择' COMMENT '感兴趣车型',
                `buy_time` varchar(100) DEFAULT '未选择' COMMENT '计划购车时间',
                `time` int(11) NOT NULL COMMENT '注册时间',
                `status` int(11) NOT NULL DEFAULT '0' COMMENT '\r\n状态 默认0',
                `source` char(100) DEFAULT NULL COMMENT '来源渠道\r\n',
                `others` varchar(200) DEFAULT NULL  COMMENT '其他',
                `source_end` int(11) NOT NULL DEFAULT '1' COMMENT '\r\n端来源 默认1',
                PRIMARY KEY (`user_id`),
                KEY `phone` (`mobile`) USING BTREE
                ) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
                ");
              }
              if(isset($dealer_table) && $dealer_table !== "") {
                if(false == @DB::connect("db_flowuser")->query("SHOW TABLES LIKE '%$dealer_table%'")) {
                  @DB::connect("db_flowuser")->query("
                  CREATE TABLE `flow_$dealer_table` (
                    `dealer_id` int(11) NOT NULL AUTO_INCREMENT,
                    `dealer_name` varchar(255) DEFAULT NULL COMMENT '经销商名称',
                    `pid` int(11) NOT NULL DEFAULT '0' COMMENT '父 id',
                    `time` int(11) DEFAULT '0' COMMENT '添加时间',
                    `start` int(1) NOT NULL DEFAULT '0' COMMENT '状态',
                    PRIMARY KEY (`dealer_id`)
                    ) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
                    ");
                  }
              }

            DB::name("project_user_dealer")->insert($data);
            $projectId = Db::name('project_user_dealer')->getLastInsID();
            if($projectId < 1){
                return ['code' => 0, 'data' => '', 'msg' => $this->getError()];
            }else{
                return ['code' => 1, 'data' => '', 'msg' => '添加项目成功'];
            }
        }catch( PDOException $e){
            return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
        }
    }

    /**
     * 添加项目用户、经销商表
     * @param  [type] $data [description]
     * @return [type]       [description]
     */
    public function ProjectSouorceConfig($data)
    {
        try{
            DB::name("source_config")->insert($data);
            $projectId = Db::name('source_config')->getLastInsID();
            if($projectId < 1){
                return ['code' => 0, 'data' => '', 'msg' => $this->getError()];
            }else{
                return ['code' => 1, 'data' => '', 'msg' => '添加项目配置成功'];
            }
        }catch( PDOException $e){
            return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
        }
    }



    /**
     * 添加多种品牌以及多种类型表
     * @param  [type] $data [description]
     * @return [type]       [description]
     */
    // public function ProjectMoreConfig($data)
    // {
    //     try{
    //         DB::name("more_config")->insert($data);
    //         $projectId = Db::name('more_config')->getLastInsID();
    //         if($projectId < 1){
    //             return ['code' => 0, 'data' => '', 'msg' => $this->getError()];
    //         }else{
    //             return ['code' => 1, 'data' => '', 'msg' => '添加多种配置成功'];
    //         }
    //     }catch( PDOException $e){
    //         return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
    //     }
    // }

    /**
     * 添加项目对应留言表信息
     * @param  [type] $data [数据]
     * @return [type]       [description]
     */
    public function ProjectLeaveConfig($data)
    {
        try{
            DB::name("leave_table")->insert($data);
            $projectId = Db::name('leave_table')->getLastInsID();
            if($projectId < 1){
                return ['code' => 0, 'data' => '', 'msg' => $this->getError()];
            }else{
                return ['code' => 1, 'data' => '', 'msg' => '添加项目留言成功'];
            }
        }catch( PDOException $e){
            return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
        }
    }


    /**
     * 查询项目对应活动
     */
    public function DrawshowAll()
    {
        // return DB::name("project")->alias("p")->join("flow_draw d","p.draw_id=d.draw_id")->order("d.draw_id desc")->select();
        return DB::name("draw")->order("draw_id desc")->select();
    }

    /**
     * 项目修改 查询单条数据
     * @param [type] $id [description]
     */
    public function ProjectUpdateshow($id)
    {
        $data = DB::name("project")->where("id",$id)->find();
        $str = explode("-", $data['period']);
        $data['start_time'] = str_replace("/","-",$str[0]);//开始时间
        $data['end_time'] = str_replace("/","-",$str[1]);//结束时加
        // $data['label_id'] = explode(",",$data['label_id']);
        // p($data);
        return $data;
    }

    /**
     * 项目修改
     * @return [type] [description]
     */
    public function project_update($data,$id,$DataUserDealer,$DataSouorceConfig,$img_str,$str)
    {
        try{
            //修改数据之前先删除原来项目文件
            $imgurl = DB::name("project")->where("id",$id)->field("project_img")->find()['project_img'];
            $result = DB::name("project")->where("id",$id)->update($data);
            if(false === $result)
            {
                return ['code' => 0, 'data' => '', 'msg' => "修改项目有失败"];
            }
            else
            {
                if($img_str == 1)
                { //如果为 1 的话说明重新上传了图片、删除原来图片文件
                    @unlink(substr($imgurl,1)); //删除原来文件
                }

                //修改项目成功后开始修改用户经销商关联表、以及来源地址配置表
                //判断项目经销商表、用户表状态  开始添加用户、经销商表
                if($data['user_start'] === 1)
                {
                  $dealerUserData = [ //用户经销商数据
                    'project_id' => $id, //项目ID
                    'user_table' => $DataUserDealer['user_table'], //用户信息表
                    'dealer_table' => $DataUserDealer['dealer_table'], //经销商表
                    'time' => time()
                  ];
                  //查询之前是否存在数据
                  $arr = DB::name("project_user_dealer")->where("project_id",$id)->find();
                  if(true == $arr)
                  {
                      $res = DB::name("project_user_dealer")->where("project_id",$id)->update($dealerUserData);
                  }
                  else
                  {
                      $res = DB::name("project_user_dealer")->insert($dealerUserData);
                  }

                  if(false == $res)
                  {
                      return ['code' => 0, 'data' => '', 'msg' => "修改项目用户经销商失败"];
                  }
                }

                //判断项目来源渠道配置数据状态  开始添加配置
                if($data['source_start'] === 1)
                {
                    $this->SourceConfigUpdate($id,$DataSouorceConfig);
                }

                //判断项目一表对哦开是否开启、进行修改或者配置
                // if($data['more_start'] === 1)
                // {
                //     $this->MoreConfigUpdate($id,$str);
                // }

                //判断项目是否有留言功能
                if($data['leave_start'] === 1)
                {
                    $this->LeaveConfigUpdate($id,$str);
                }

                return ['code' => 1, 'data' => '', 'msg' => '修改成功'];
            }
        }catch( PDOException $e){
            return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
        }
    }

    /**
     * 判断项目来源渠道配置数据状态  开始修改或者添加配置
     * @var [type]
     */
    public function SourceConfigUpdate($id,$DataSouorceConfig) {
      $SourceConfig = [
          'project_id' => $id,
          'source_config' => $DataSouorceConfig,
          'start' => 0,
          'time' => time()
      ];
      //查询之前是否存在数据
      $arr = DB::name("source_config")->where("project_id",$id)->find();
      if(true == $arr)
      {
          $res = DB::name("source_config")->where("project_id",$id)->update($SourceConfig);
      }
      else
      {
          $res = DB::name("source_config")->insert($SourceConfig);
      }

      if(false == $res)
      {
          return ['code' => 0, 'data' => '', 'msg' => "修改项目来源地址失败"];
      }

      return true;
    }

    /**
     * 项目一表对哦开是否开启、进行修改或者配置
     * @var [type]
     */
    public function MoreConfigUpdate($id,$str) {
      $MoreConfig = [
          'project_id' => $id,
          'more_config' => $str['more_config'],
          'start' => 0,
          'time' => time()
      ];
      //查询之前是否存在数据
      $arr = DB::name("more_config")->where("project_id",$id)->find();
      if(true == $arr)
      {
          $res = DB::name("more_config")->where("project_id",$id)->update($MoreConfig);
      }
      else
      {
          $res = DB::name("more_config")->insert($MoreConfig);
      }

      if(false == $res)
      {
          return ['code' => 0, 'data' => '', 'msg' => "修改一表多开表失败"];
      }

        return true;
    }

    /**
     * 项目对应留言功能表添加配置
     * @var [type]
     */
    public function LeaveConfigUpdate($id,$str) {
      $LeaveConfig = [
          'project_id' => $id,
          'leave_table' => $str['leave_table'],
          'time' => time()
      ];
      //查询之前是否存在数据
      $arr = DB::name("leave_table")->where("project_id",$id)->find();
      if(true == $arr)
      {
          $res = DB::name("leave_table")->where("project_id",$id)->update($LeaveConfig);
      }
      else
      {
          $res = DB::name("leave_table")->insert($LeaveConfig);
      }

      if(false == $res)
      {
          return ['code' => 0, 'data' => '', 'msg' => "修改留言关联表失败"];
      }

        return true;
    }


     /**
     * 删除项目详情 列表
     * @param [type] $id [description]
     */
    public function project_delete($id)
    {
        try{
            //查询项目封面图片
            @$imgurl = DB::name("project")->where("id",$id)->field("project_img")->find()['project_img'];
            $res = Db::name('project')->where('id', $id)->delete();
            if(true == $res)
            {
              @unlink(substr($imgurl,1)); //删除原来文件
              //删除项目对应用户以及经销商关联表
              @DB::name("project_user_dealer")->where("project_id",$id)->delete();
              //删除项目来源地址关联表
              @DB::name("source_config")->where("project_id",$id)->delete();
              //删除单表多开关联表
              @DB::name("more_config")->where("project_id",$id)->delete();
              //删除留言表关联表
              @DB::name("leave_table")->where("project_id",$id)->delete();
            }
            writelog(session('admin_uid'),session('username'),'用户【'.session('admin_username').'】删除项目成功(ID='.$id.')',1);
            return ['code' => 1, 'data' => '', 'msg' => '删除项目成功'];
        }
        catch( PDOException $e)
        {
            return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
        }
    }





//********************************************项目分类管理*********************************************//

    /**
     * 添加项目分类
     * @param [type] $data [数据]
     */
    public function add_projectClass($data)
    {
        try{
            if($data['status'] == 'on'){$data['status'] = 0;}
            $result = DB::name("project_class")->insert($data);
            if(false === $result){
                return ['code' => -1, 'data' => '', 'msg' => $this->getError()];
            }else{
                return ['code' => 1, 'data' => '', 'msg' => '添加成功'];
            }
        }
        catch( PDOException $e)
        {
            return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
        }
    }

     /**
     * [delMenu 删除分类]
     * @return [type] [description]
     * @author [jonny] [980218641@qq.com]
     */
    public function del_projectClass($id)
    {
        try{
            $result = DB::name("project_class")->where('c_id', $id)->delete();
            if(false === $result){
                return ['code' => -1, 'data' => '', 'msg' => $this->getError()];
            }else{
                return ['code' => 1, 'data' => '', 'msg' => '删除分类成功'];
            }
        }catch( PDOException $e){
            return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
        }
    }

    /**
     * [editMenu 编辑分类]
     * @author [jonny] [980218641@qq.com]
     */
    public function edit_prijectClass($param)
    {
        try{
            if($param['status'] == 'on'){$param['status'] = 0;}
            $result = DB::name("project_class")->update($param, ['id' => $param['c_id']]);
            if(false === $result){
                return ['code' => 0, 'data' => '', 'msg' => $this->getError()];
            }else{
                return ['code' => 1, 'data' => '', 'msg' => '分类编辑成功'];
            }
        }catch( PDOException $e){
            return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
        }
    }

    /**
     * 查询项目分所有类
     */
    public function ShowPrijectClassAll($class_id='')
    {
        try {
            $data = DB::name("project_class")->where("status",1)->select();
            $classId = explode(",",$class_id);
            // p($labelId);
            foreach ($data as $key => $val)
            {

                if(in_array($val['c_id'],$classId))
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




    //********************************************项目标签管理*********************************************//

    /**
     * 添加项目标签
     * @param [type] $data [数据]
     */
    public function add_projectLabel($data)
    {
        try{
            if($data['status'] == 'on'){$data['status'] = 0;}
            $result = DB::name("project_label")->insert($data);
            if(false === $result){
                return ['code' => -1, 'data' => '', 'msg' => $this->getError()];
            }else{
                return ['code' => 1, 'data' => '', 'msg' => '添加成功'];
            }
        }
        catch( PDOException $e)
        {
            return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
        }
    }

     /**
     * [delMenu 删除标签]
     * @return [type] [description]
     * @author [jonny] [980218641@qq.com]
     */
    public function del_projectLabel($id)
    {
        try{
            $result = DB::name("project_label")->where('b_id', $id)->delete();
            if(false === $result){
                return ['code' => -1, 'data' => '', 'msg' => $this->getError()];
            }else{
                return ['code' => 1, 'data' => '', 'msg' => '删除标签成功'];
            }
        }catch( PDOException $e){
            return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
        }
    }

    /**
     * [editMenu 编辑标签]
     * @author [jonny] [980218641@qq.com]
     */
    public function edit_prijectLabel($param)
    {
        try{
            if($param['status'] == 'on'){$param['status'] = 0;}
            $result = DB::name("project_label")->update($param, ['id' => $param['b_id']]);
            if(false === $result){
                return ['code' => 0, 'data' => '', 'msg' => $this->getError()];
            }else{
                return ['code' => 1, 'data' => '', 'msg' => '标签编辑成功'];
            }
        }catch( PDOException $e){
            return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
        }
    }

    /**
     * 查询项目分所有标签
     */
    public function ShowPrijectLabelAll($label_id='')
    {
        try {
            $data = DB::name("project_label")->where("status",1)->select();
            $labelId = explode(",",$label_id);
            // p($labelId);
            foreach ($data as $key => $val)
            {

                if(in_array($val['b_id'],$labelId))
                {
                    $data[$key]['num'] = 1;
                }
                else
                {
                    $data[$key]['num'] = 0;
                }
            }
            return $data;
        } catch (Exception $e) {
            return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
        }
    }

    /**
     * [UserDealerTable]  [查询项目对应用户表、经销商表名称]
     * @return [type] [description]
     * @author [qinlh] [WeChat QinLinHui0706]
     */
    public function UserDealerTable($id)
    {
          try {
            return DB::name("project_user_dealer")->where("project_id",$id)->field("user_table,dealer_table")->find();
          } catch (Exception $e) {
              return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
          }
    }

    //******************************************** 项关联表配置 *********************************************//

    /**
     * [SourceConfig]  [查询想故意对应来源地址配置文件]
     * @return [type] [description]
     * @author [qinlh] [WeChat QinLinHui0706]
     */
    public function SourceConfig($id)
    {
          try {
            return DB::name("source_config")->where("project_id",$id)->field("source_config")->find()['source_config'];
          } catch (Exception $e) {
              return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
          }
    }

    /**
     * [SourceConfig]  [查询项目多种类型配置表]
     * @return [type] [description]
     * @author [qinlh] [WeChat QinLinHui0706]
     */
    public function MoreConfig($id)
    {
          try {
            return DB::name("more_config")->where("project_id",$id)->field("more_config")->find()['more_config'];
          } catch (Exception $e) {
              return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
          }
    }

    /**
     * 添加项目修改日志
     * @param  [type] $data [description]
     * @return [type]       [description]
     */
    public function project_add_log($data)
    {
        try{
            DB::name("project_modify_log")->insert($data);
            $projectId = Db::name('project_modify_log')->getLastInsID();
            if($projectId < 1){
                return ['code' => 0, 'data' => '', 'msg' => $this->getError()];
            }else{
                return ['code' => 1, 'data' => $projectId, 'msg' => '添加项目修改日志成功'];
            }
        }catch( PDOException $e){
            return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
        }
    }

    /**
     * 查询项目修改日志
     * @return [type] [description]
     */
    public function project_update_log($pid)
    {
        try {
            $data = DB::name("project_modify_log l")->where("p_id",$pid)->join("flow_project p","l.p_id=p.id")->field("l.*,p.project_name")->select();
            return ['code'=>1, 'data'=>$data, 'msg'=>''];
        } catch (Exception $e) {
            return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
        }
    }
}
