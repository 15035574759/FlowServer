<?php
/**
 * 极客之家 高端PHP - 项目管理
 *
 * @copyright  Copyright (c) 2016 QIN TEAM (http://www.qlh.com)
 * @license    GUN  General Public License 2.0
 * @version    Id:  Type_model.php 2016-6-12 16:36:52
 */
namespace app\admin\controller;
use think\Config;
use think\Db;
use think\Session;
use think\Request;
use app\admin\model\ProjectModel;
use app\admin\model\UploadModel;
use app\admin\model\DrawModel;
use app\admin\model\BaseModel;
use app\admin\model\LeaveModel;
class Project extends Base
{

  /**
   * [test]  [测试方法]
   * @return [type] [description]
   * @author [qinlh] [WeChat QinLinHui0706]
   */
  public function test() {
    $source = "jrtt";
    $data = DB::name("source_config")->where("project_id",33)->find();
    $datas = explode("\n",$data['source_config']);
    $name = "未选择";
    foreach ($datas as $key => $val)
    {
        $num = explode(":",$val);
        // print_r($num);
        if(in_array($source,$num))
        {
          $name = $num[1];
        }
    }
    echo $name;die;
  }

    /**
     * 项目列表
     * @return [type] [description]
     */
    public function project_list() {
        $page = input('get.page') ? input('get.page') : 1;//当前页
        $project  = new ProjectModel;
        $data = $project->showAll($page);

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
     * [TestingTable] [检测该用户表是否对应多个渠道]
     * @param [param] [description]
     * @return [type] [description]
     * @author [qinlh] [WeChat QinLinHui0706]
     */
    // public function TestingTable() {
    //   $table = input("param.user_table") ? input("param.user_table") : '';
    //   $SourceConfig = DB::name("table_source")->where("table_name",$table)->find()['source_name'];
    //   // p($SourceConfig);
    //   if(true == $SourceConfig) {
    //     exit(json_encode(['code'=>1,'data'=>$SourceConfig]));
    //   } else {
    //     exit(json_encode(['code'=>0,'data'=>'','msg'=>'渠道为空']));
    //   }
    // }

    /**
     * 项目添加
     * @return [type] [description]
     */
    public function project_add()
    {
         $project  = new ProjectModel;
        // $data = DB::name("city")->where("parent_id",0)->select();
        // $this->assign("data",$data);
        if(request()->isAjax())
        {
            $str = input('param.');
            // p($str);
            $str['user_start'] = isset($str['user_start']) ? 1 : 0;
            $str['source_start'] = isset($str['source_start']) ? 1 : 0;
            // $str['more_start'] = isset($str['more_start']) ? 1 : 0;
            $str['leave_start'] = isset($str['leave_start']) && $str['leave_start'] == 'on' ? 1 : 0;//留言状态
            //这里要移动图片位置到正式上传目录 生成正式路径
            $base  = new BaseModel;
            $new_file = $base->MoveFile("project",$str['project_img']);
            // p($str);
            $beginPeriod = str_replace("-","/",$str['beginPeriod']);
            $endPeriod = str_replace("-","/",$str['endPeriod']);

            // p($data);
            $data = [
                'period'  =>  $beginPeriod.' - '.$endPeriod,
                'time'  =>  date("Y-m-d H:i:s"), //添加时间
                'lines_time'  =>  !empty($str['lines_time']) ? $str['lines_time'] : date("Y-m-d H:i:s"), //上线时间
                'project_name'  =>  $str['project_name'],//项目名称
                'class_id'  =>  $str['classId'],//项目分類ID
                'describe'  =>  $str['describe'],
                'line_url'  =>  $str['line_url'],//项目url地址
                // 'database_name'  =>  $str['database_name'],//表名称
                'user_start'  =>  $str['user_start'], //是否统计经销商、用户表
                'source_start'  =>  $str['source_start'], //是否显示来源渠道
                // 'more_start'  =>  $str['more_start'], //是否支持单表多开
                'draw_id'  =>  $str['draw_id'],//活动ID
                'project_img'  =>  $new_file['data'],//项目封面图
                'label_id'  =>  $str['labelId'],
                'leave_start'  =>  $str['leave_start'],
                'start'  =>  isset($str['start']) ? 1 : 0, //项目状态
                'sort'  =>  $str['sort'], //项目排序
                'other_start'  =>  isset($str['other_start']) ? 1 : 0, //其他项目状态
                'stage_start'  =>  isset($str['stage_start']) ? 1 : 0, //山海经项目、临时
            ];

            // p($data);die;
            $flag = $project->project_add($data,$str);

            //判断项目经销商表、用户表状态  开始添加用户、经销商表
            if($str['user_start'] === 1) {
              $dealerUserData = [ //用户经销商数据
                'project_id' => $flag['data'], //项目ID
                'user_table' => $str['user_table'], //用户信息表
                'dealer_table' => $str['dealer_table'], //经销商表
                'time' => time()
              ];
              $project->projectUserDealer_add($dealerUserData);
            }

            //判断项目来源渠道配置数据状态  开始添加配置
            if($str['source_start'] === 1) {
                $SourceConfig = [
                    'project_id' => $flag['data'],
                    'source_config' => $str['source_config'],
                    'start' => 0,
                    'time' => time()
                ];
                $project->ProjectSouorceConfig($SourceConfig);
            }

            //判断是否支持一张表对应多种品牌以及类型
            // if($str['more_start'] === 1) {
            //     $MoreConfig = [
            //         'project_id' => $flag['data'],
            //         'more_config' => $str['more_config'],
            //         'start' => 0,
            //         'time' => time()
            //     ];
            //     $project->ProjectMoreConfig($MoreConfig);
            // }

            //判断是否添加项目留言功能
            if(isset($str['leave_start']) && $str['leave_start'] === 1) {
              $LeaveConfig = [
                'leave_table' => $str['leave_table'],
                'project_id' => $flag['data'],
                'time' => time(),
              ];
              $project->ProjectLeaveConfig($LeaveConfig);
            }

            return json(['code' => $flag['code'], 'data' => $flag['data'], 'msg' => $flag['msg']]);

        }
            $draw = new DrawModel();
            //查询活动
            $data = $draw->ActivityAll();
            $projectId = DB::name("project")->max('id') + 1;
            // p($data);
            $ClassData = $project->ShowPrijectClassAll();//查询分类
            $LabelData = $project->ShowPrijectLabelAll();//查询标签
            $this->assign("data",$data);
            $this->assign("ClassData",$ClassData);
            $this->assign("LabelData",$LabelData);
            $this->assign("projectId",$projectId);
            return $this->fetch();
    }

    /**
     * [project_update] [项目修改]
     * @return [type] [description]
     * @author [qinlh] [WeChat QinLinHui0706]
     */
    public function project_update()
    {
        $project  = new ProjectModel;
        $draw = new DrawModel();
        $leave = new LeaveModel();
        if(request()->isAjax()){
            $str = input('param.');
            //这里要移动图片位置到正式上传目录 生成正式路径
            $base  = new BaseModel;
            $img_str = $str['project_img']; //图片上传状态、是否重新上传图片
            if($str['img_start'] == 1)
            {//说明图片重新上传了、替换移动图片
                $new_file = $base->MoveFile("project",$str['project_img']);
            }
            else
            {
                $new_file['data'] = $str['project_img'];
            }
            // p($new_file);
            $beginPeriod = str_replace("-","/",$str['beginPeriod']);
            $endPeriod = str_replace("-","/",$str['endPeriod']);
            $data['period'] = $beginPeriod.'-'.$endPeriod;
            $data['update_time'] = date("Y-m-d H:i:s"); //更新时间
            $data['lines_time'] = $str['lines_time']; //上线时间;
            $data['project_name'] = $str['project_name'];
            $data['class_id'] = $str['classId'];
            // $data['database_name'] = $str['database_name']; //已经废弃
            $data['describe'] = $str['describe'];//项目描述
            $data['line_url'] = $str['line_url'];//项目url地址
            $data['project_img'] = $new_file['data'];//项目封面图
            $data['draw_id'] = $str['draw_id'];//项目活动ID
            $data['label_id'] = $str['labelId'];//项目标签ID
            $data['user_start'] = isset($str['user_start']) ? 1 : 0;
            $data['source_start'] = isset($str['source_start']) ? 1 : 0;
            $data['start'] = isset($str['start']) ? 1 : 0; //项目状态
            $data['sort'] = $str['sort']; //项目排序
            $data['other_start'] = isset($str['other_start']) ? 1 : 0; //其他项目状态
            $data['stage_start']  =  isset($str['stage_start']) ? 1 : 0; //山海经项目、临时
            $data['leave_start'] = isset($str['leave_start']) && $str['leave_start'] == 'on' ? 1 : 0;//留言状态
            // $data['more_start'] = isset($str['more_start']) ? 1 : 0;
            $id = $str['id'];
            $DataUserDealer = [ //用户经销商、用户表
                  'user_table' => $str['user_table'],
                  'dealer_table' => $str['dealer_table'],
            ];
            $DataSouorceConfig = $str['source_config']; //来源地址配置文件
            // p($data);
            $flag = $project->project_update($data,$id,$DataUserDealer,$DataSouorceConfig,$img_str,$str);
            return json(['code' => $flag['code'], 'data' => $flag['data'], 'msg' => $flag['msg']]);
        }
        $id = input('param.id');
        $data = $project->ProjectUpdateshow($id);
        // p($data);
        $DrawData = $draw->ActivityAll($id);
        $ClassData = $project->ShowPrijectClassAll($data['class_id']);//查询分类
        $LabelData = $project->ShowPrijectLabelAll($data['label_id']);//查询标签
        $SourceConfig = $project->SourceConfig($id);//查询用户来源地址配置文件
        $UserDealerTable = $project->UserDealerTable($id);//查询用户表、经销商表
        // $MoreConfig = $project->MoreConfig($id);//查询x项目多种品牌表
        $LeaveConfig = ''; //留言功能
        if($data['leave_start'] === 1) {
          $LeaveConfig = $leave->LeaveTable($id);
        }

        $this->assign("ClassData",$ClassData);
        $this->assign("LabelData",$LabelData);
        $this->assign("id",$id);
        $this->assign("data",$data);
        $this->assign("DrawData",$DrawData);
        $this->assign("SourceConfig",$SourceConfig);
        // $this->assign("MoreConfig",$MoreConfig);
        $this->assign("UserDealerTable",$UserDealerTable);
        $this->assign("LeaveConfig",$LeaveConfig);
        return $this->fetch();
    }

    /**
     * 删除项目
     * @return [type] [description]
     */
    public function project_delete()
    {
        $id = input('param.id');
        $project  = new ProjectModel;
        $flag = $project->project_delete($id);
        return json(['code' => $flag['code'], 'data' => $flag['data'], 'msg' => $flag['msg']]);
    }

    /**
     * [position_state 项目状态]
     * @return [type] [description]
     * @author [jonny] [980218641@qq.com]
     */
    public function ProjectStart()
    {
        $id=input('param.id');
        $status = Db::name('project')->where(array('id'=>$id))->value('start');//判断当前状态情况
        if($status==1)
        {
            $flag = Db::name('project')->where(array('id'=>$id))->setField(['start'=>0]);
            return json(['code' => 1, 'data' => $flag['data'], 'msg' => '已禁止']);
        }
        else
        {
            $flag = Db::name('project')->where(array('id'=>$id))->setField(['start'=>1]);
            return json(['code' => 0, 'data' => $flag['data'], 'msg' => '已开启']);
        }

    }



//********************************************项目分类管理*********************************************//
    /**
     * 项目分类
     * @return [type] [description]
     */
    public function project_class()
    {
        $data = DB::name("project_class")->select();
        $this->assign("list",$data);
        return $this->fetch();
    }

    /**
     * 添加项目分类
     */
    public function add_projectClass()
    {
        $project  = new ProjectModel;
        if(request()->isAjax())
        {
           $data = input('param.');
           $flag = $project->add_projectClass($data);
           return json(['code' => $flag['code'], 'data' => $flag['data'], 'msg' => $flag['msg']]);
        }
        return $this->fetch("add_project_class");
    }

     /**
      * 编辑分类
      * @return [type] [description]
      */
    public function edit_projectClass()
    {
        $project  = new ProjectModel;
        if(request()->isAjax()){
            $param = input('post.');
            $flag = $project->edit_prijectClass($param);
            return json(['code' => $flag['code'], 'data' => $flag['data'], 'msg' => $flag['msg']]);
        }

        $id = input('param.id');
        $data = Db::name('project_class')->where('c_id',$id)->find();
        $this->assign('list',$data);
        $this->assign('c_id',$id);
        return $this->fetch("edit_project_class");
    }


    /**
     * [del_prijectClass 删除文章]
     * @return [type] $id [分类ID]
     * @author [qlh] [1397118453@qq.com]
     */
    public function del_projectClass()
    {
        $id = input('param.id');
        $project  = new ProjectModel;
        $flag = $project->del_projectClass($id);
        return json(['code' => $flag['code'], 'data' => $flag['data'], 'msg' => $flag['msg']]);
    }

    /**
     * [project_class_state 分类状态]
     * @return [type] [description]
     * @author [qinlh] [1397118453@qq.com]
     */
    public function project_class_state()
    {
        $id=input('param.c_id');
        $status = Db::name('project_class')->where(array('c_id'=>$id))->value('status');//判断当前状态情况
        if($status==1)
        {
            $flag = Db::name('project_class')->where(array('c_id'=>$id))->setField(['status'=>0]);
            return json(['code' => 1, 'data' => $flag['data'], 'msg' => '已禁止']);
        }
        else
        {
            $flag = Db::name('project_class')->where(array('c_id'=>$id))->setField(['status'=>1]);
            return json(['code' => 0, 'data' => $flag['data'], 'msg' => '已开启']);
        }

    }

    //********************************************项目标签管理*********************************************//

    /**
     * 项目分类
     * @return [type] [description]
     */
    public function project_label()
    {
        $data = DB::name("project_label")->select();
        // p($data);
        $this->assign("list",$data);
        return $this->fetch();
    }

    /**
     * 添加项目分类
     */
    public function add_projectLabel()
    {
        $project  = new ProjectModel;
        if(request()->isAjax())
        {
           $data = input('param.');
           $flag = $project->add_projectLabel($data);
           return json(['code' => $flag['code'], 'data' => $flag['data'], 'msg' => $flag['msg']]);
        }
        return $this->fetch("add_project_label");
    }

     /**
      * 编辑分类
      * @return [type] [description]
      */
    public function edit_projectLabel()
    {
        $project  = new ProjectModel;
        if(request()->isAjax()){

            $param = input('post.');
            $flag = $project->edit_prijectLabel($param);
            return json(['code' => $flag['code'], 'data' => $flag['data'], 'msg' => $flag['msg']]);
        }

        $id = input('param.id');
        $data = Db::name('project_label')->where('b_id',$id)->find();
        $this->assign('list',$data);
        $this->assign('b_id',$id);
        return $this->fetch("edit_project_label");
    }


    /**
     * [del_prijectClass 删除文章]
     * @return [type] $id [分类ID]
     * @author [qlh] [1397118453@qq.com]
     */
    public function del_projectLabel()
    {
        $id = input('param.id');
        $project  = new ProjectModel;
        $flag = $project->del_projectLabel($id);
        return json(['code' => $flag['code'], 'data' => $flag['data'], 'msg' => $flag['msg']]);
    }

    /**
     * [project_class_state 分类状态]
     * @return [type] [description]
     * @author [qinlh] [1397118453@qq.com]
     */
    public function project_label_state()
    {
        $id=input('param.c_id');
        $status = Db::name('project_label')->where(array('b_id'=>$id))->value('status');//判断当前状态情况
        if($status==1)
        {
            $flag = Db::name('project_label')->where(array('b_id'=>$id))->setField(['status'=>0]);
            return json(['code' => 1, 'data' => $flag['data'], 'msg' => '已禁止']);
        }
        else
        {
            $flag = Db::name('project_label')->where(array('b_id'=>$id))->setField(['status'=>1]);
            return json(['code' => 0, 'data' => $flag['data'], 'msg' => '已开启']);
        }

    }

    /**
     * [updateLog 项目修改日志列表]
     * @return [type] [description]
     * @author [qinlh] [1397118453@qq.com]
     */
    public function updateProjectLog() {
        $projectId = input("param.project_id") ? input("param.project_id") : '';
        $projectName = DB::name("project")->where("id", $projectId)->field("project_name")->find()['project_name'];
        $project  = new ProjectModel;
        $data = $project->project_update_log($projectId);
        foreach($data['data'] as $key=>$v) {
            $data['data'][$key]['content'] = explode("\n",$v['content']);
        }
        // p($data['data']);
        $this->assign("data",$data['data']);
        $this->assign("project_id",$projectId);
        $this->assign("projectName",$projectName);
        return $this->fetch('project_update_log');
    }

    /**
     * [addProjectLog 添加项目修改日志]
     * @return [type] [description]
     * @author [qinlh] [1397118453@qq.com]
     */
    public function addProjectLog()
    {
        $project  = new ProjectModel;
        $p_id = input('param.id');
        if(request()->isAjax())
        {
            $data = input("param.");
            $flag = $project->project_add_log($data);
            return json(['code' => $flag['code'], 'pId'=>$data['p_id'], 'data' => $flag['data'], 'msg' => $flag['msg']]);
        }
        $this->assign('p_id',$p_id);
        return $this->fetch("project_add_log");
    }
}
