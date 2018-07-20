<?php
/**
 * 极客之家 高端PHP - 新闻管理
 * @copyright  Copyright (c) 2016 QIN TEAM (http://www.qlh.com)
 * @license    GUN  General Public License 2.0
 * @version    Id:  Type_model.php 2016-6-12 16:36:52
 */
namespace app\admin\controller;
use think\Config;
use think\Db;
use think\Session;
use think\Request;
use app\admin\model\NewsModel;
use app\admin\model\UploadModel;
use app\admin\model\DrawModel;
use app\admin\model\BaseModel;
class News extends Base
{

	/**
	 * 新闻列表
	 * @return [type] [description]
	 */
	public function news_list()
	{
        $page = input('get.page') ? input('get.page') : 1;//当前页
        $news = new NewsModel;
        $data = $news->showAll($page);

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
    public function news_add()
    {
         $news  = new newsModel;
        if(request()->isAjax())
        {
            $data = input('param.');
            unset($data['file']);
            //这里要移动图片位置到正式上传目录 生成正式路径
            $base  = new BaseModel;
            $new_file = $base->MoveFile("news",$data['img']);
            // p($str);
            if($data['status'] == 'on'){$data['status'] = 0;}//状态
            $data['img'] = $new_file['data'];
            $data['time'] = time();
            // print_r($data);die;
            $flag = $news->news_add($data);
            return json(['code' => $flag['code'], 'data' => $flag['data'], 'msg' => $flag['msg']]);
           
        }
            $ClassData = $news->ShowClass();//查询分类
            $this->assign("ClassData",$ClassData);
            return $this->fetch();
    }

    /**
     * 项目列表修改
     */
    public function news_update()
    {
        $news  = new NewsModel;
        $draw = new DrawModel();
        if(request()->isAjax()){
            $data = input('param.');
            unset($data['file']);
            //这里要移动图片位置到正式上传目录 生成正式路径
            $base = new BaseModel();
            $new_file = $base->MoveFile("news",$data['img']);
            $data['img'] = $new_file['data'];
            $id = $data['id'];
            if($data['status'] == 'on'){$data['status'] = 0;}
            $flag = $news->news_update($data,$id);
            return json(['code' => $flag['code'], 'data' => $flag['data'], 'msg' => $flag['msg']]);
        }

        $id = input('param.id');
        $data = $news->NewsUpdateshow($id);
        // p($data);
        $ClassData = $news->ShowClass();//查询分类
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
    public function news_delete()
    {
        $id = input('param.id');
        $news  = new NewsModel;
        $flag = $news->news_delete($id);
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


    //********************************************新闻分类管理*********************************************//
    /**
     * 项目分类
     * @return [type] [description]
     */
    public function news_class()
    {
        $data = DB::name("news_class")->select();
        $this->assign("list",$data);
        return $this->fetch();
    }

    /**
     * 添加项目分类
     */
    public function add_newsClass()
    {
        $news  = new NewsModel;
        if(request()->isAjax())
        {
           $data = input('param.'); 
           $flag = $news->add_newsClass($data);
           return json(['code' => $flag['code'], 'data' => $flag['data'], 'msg' => $flag['msg']]);
        }
        return $this->fetch("add_news_class");
    }

     /**
      * 编辑分类
      * @return [type] [description]
      */
    public function edit_newsClass()
    {
        $news  = new NewsModel;
        if(request()->isAjax()){

            $param = input('post.');         
            $flag = $news->edit_newsClass($param);
            return json(['code' => $flag['code'], 'data' => $flag['data'], 'msg' => $flag['msg']]);
        }

        $id = input('param.id');
        $data = Db::name('news_class')->where('c_id',$id)->find();
        $this->assign('list',$data);
        $this->assign('c_id',$id);
        return $this->fetch("edit_news_class");
    }


    /**
     * [del_prijectClass 删除文章]
     * @return [type] $id [分类ID]
     * @author [qlh] [1397118453@qq.com]
     */
    public function del_newsClass()
    {
        $id = input('param.id');
        $news  = new NewsModel;
        $flag = $news->del_newsClass($id);
        return json(['code' => $flag['code'], 'data' => $flag['data'], 'msg' => $flag['msg']]);
    }

    /**
     * [project_class_state 分类状态]
     * @return [type] [description]
     * @author [qinlh] [1397118453@qq.com]
     */
    public function news_class_state()
    {
        $id=input('param.c_id');
        $status = Db::name('news_class')->where(array('c_id'=>$id))->value('status');//判断当前状态情况
        if($status==1)
        {
            $flag = Db::name('news_class')->where(array('c_id'=>$id))->setField(['status'=>0]);
            return json(['code' => 1, 'data' => $flag['data'], 'msg' => '已禁止']);
        }
        else
        {
            $flag = Db::name('news_class')->where(array('c_id'=>$id))->setField(['status'=>1]);
            return json(['code' => 0, 'data' => $flag['data'], 'msg' => '已开启']);
        }
    
    }


}