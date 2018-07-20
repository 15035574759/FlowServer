<?php
/**
 * 极客之家 高端PHP - 导航管理
 * @copyright  Copyright (c) 2016 QIN TEAM (http://www.qlh.com)
 * @license    GUN  General Public License 2.0
 * @version    Id:  Type_model.php 2016-6-12 16:36:52
 */
namespace app\admin\controller;
use think\Config;
use think\Db;
use think\Session;
use think\Request;
use app\admin\model\BaseModel;
use app\admin\model\NavModel;
class Nav extends Base
{
	/**
	 * 导航列表
	 * @return [type] [description]
	 */
	public function nav_list()
	{
		$page = input('get.page') ? input('get.page') : 1;//当前页
        $nav  = new NavModel;
        $data = $nav->nav_list($page);

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
     * 新闻添加
     * @return [type] [description]
     */
    public function nav_add()
    {
         $nav  = new navModel;
        if(request()->isAjax())
        {
            $data = input('param.');
            unset($data['file']);
            //这里要移动图片位置到正式上传目录 生成正式路径
            $base  = new BaseModel;
            $new_file = $base->MoveFile("nav",$data['img']);
            // p($str);
            if($data['status'] == 'on'){$data['status'] = 0;}//状态
            $data['img'] = $new_file['data'];
            $data['time'] = time();
            // print_r($data);die;
            $flag = $nav->nav_add($data);
            return json(['code' => $flag['code'], 'data' => $flag['data'], 'msg' => $flag['msg']]);
           
        }
            return $this->fetch();
    }

    /**
     * 项目列表修改
     */
    public function nav_update()
    {
        $nav  = new navModel;
        $draw = new DrawModel();
        if(request()->isAjax()){
            $data = input('param.');
            unset($data['file']);
            //这里要移动图片位置到正式上传目录 生成正式路径
            $base = new BaseModel();
            $new_file = $base->MoveFile("nav",$data['img']);
            $data['img'] = $new_file['data'];
            $id = $data['id'];
            if($data['status'] == 'on'){$data['status'] = 0;}
            $flag = $nav->nav_update($data,$id);
            return json(['code' => $flag['code'], 'data' => $flag['data'], 'msg' => $flag['msg']]);
        }

        $id = input('param.id');
        $data = $nav->navUpdateshow($id);
        // p($data);
        $ClassData = $nav->ShowClass();//查询分类
        // p($ClassData);
        $this->assign("ClassData",$ClassData);
        $this->assign("id",$id);
        $this->assign("data",$data);
        return $this->fetch();
    }

    /**
     * 删除项目
     * @return [type] [description]
     */
    public function nav_delete()
    {
        $id = input('param.id');
        $nav  = new navModel;
        $flag = $nav->nav_delete($id);
        return json(['code' => $flag['code'], 'data' => $flag['data'], 'msg' => $flag['msg']]);
    }

     /*
     * 更改留资用户状态列表
     */
    public function DstateBleval(){
        $id = input('param.id');

        $status = Db::name('user_fute')->where(array('user_id'=>$id))->value('status');//判断当前状态情况
        if($status == 1)
        {
            $flag = Db::name('user_fute')->where(array('user_id'=>$id))->setField(['status'=>0]);
            return json(['code' => 1, 'data' => $flag['data'], 'msg' => '已禁止']);
        }
        else
        {
            $flag = Db::name('user_fute')->where(array('user_id'=>$id))->setField(['status'=>1]);
            return json(['code' => 0, 'data' => $flag['data'], 'msg' => '已开启']);
        }
    }	
}