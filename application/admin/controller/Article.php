<?php
/**
 * 极客之家 高端PHP - 文章管理模块
 * @copyright  Copyright (c) 2000-2017 QIN TEAM (http://www.qlh.com)
 * @version    GUN  General Public License 10.0.0
 * @license    Id:  Leave.php 2017-7-7 23:59:59
 * @author     Qinlh WeChat QinLinHui0706
 */
namespace app\admin\controller;
use app\admin\model\ArticleModel;
use app\admin\model\ArticleCateModel;
use think\Db;

class Article extends Base
{

    /**
     * [index 文章列表]
     * @author [jonny] [980218641@qq.com]
     */
    public function index(){

        $key = input('key');
        $map = [];
        if($key&&$key!==""){
            $map['title'] = ['like',"%" . $key . "%"];
        }
        $Nowpage = input('get.page') ? input('get.page'):1;

        $limits = 10;// 获取总条数
        $start = $limits * ($Nowpage - 1);
        $count = Db::name('article')->where($map)->count();//计算总页面
        $allpage = ceil($count / $limits);
        $article = new ArticleModel();
        $lists = $article->getArticleByWhere($map, $start, $limits);

        foreach($lists as $k=>$v){
            $lists[$k]['create_time']=date('Y-m-d H:i:s',$v['create_time']);
            $lists[$k]['update_time']=date('Y-m-d H:i:s',$v['update_time']);
        }
        $this->assign('Nowpage', $Nowpage); //当前页
        $this->assign('allpage', $allpage); //总页数
        $this->assign('count', $count);
        $this->assign('val', $key);
        if(input('get.page')){
            //$article->getlastsql();
            return json($lists);
        }
        return $this->fetch();
    }


    /**
     * [add_article 添加文章]
     * @return [type] [description]
     * @author [jonny] [980218641@qq.com]
     */
    public function add_article()
    {
        if(request()->isAjax()){

            $param = input('post.');
            $article = new ArticleModel();
            $flag = $article->insertArticle($param);
            return json(['code' => $flag['code'], 'data' => $flag['data'], 'msg' => $flag['msg']]);
        }

        $nav=Db::name('nav')->where('status',1)->select();//文章导航

        $cate = new ArticleCateModel();//文章分类模型
        $this->assign('cate',$cate->getAllCate());
        $this->assign('nav',$nav);
        return $this->fetch();
    }


    /**
     * [edit_article 编辑文章]
     * @return [type] [description]
     * @author [jonny] [980218641@qq.com]
     */
    public function edit_article()
    {
        $article = new ArticleModel();
        if(request()->isAjax()){

            $param = input('post.');
            $flag = $article->updateArticle($param);
            return json(['code' => $flag['code'], 'data' => $flag['data'], 'msg' => $flag['msg']]);
        }

        $id = input('param.id');
        $cate = new ArticleCateModel();
        $nav=Db::name('nav')->where('status',1)->select();//文章导航
        $this->assign('cate',$cate->getAllCate());
        $this->assign('nav',$nav);
        $this->assign('article',$article->getOneArticle($id));
        return $this->fetch();
    }



    /**
     * [del_article 删除文章]
     * @return [type] [description]
     * @author [jonny] [980218641@qq.com]
     */
    public function del_article()
    {
        $id = input('param.id');
        $cate = new ArticleModel();
        $flag = $cate->delArticle($id);
        return json(['code' => $flag['code'], 'data' => $flag['data'], 'msg' => $flag['msg']]);
    }



    /**
     * [article_state 文章状态]
     * @return [type] [description]
     * @author [jonny] [980218641@qq.com]
     */
    public function article_state()
    {
        $id=input('param.id');
        $status = Db::name('article')->where(array('id'=>$id))->value('is_status');//判断当前状态情况
        if($status==1)
        {
            $flag = Db::name('article')->where(array('id'=>$id))->setField(['is_status'=>0]);
            return json(['code' => 1, 'data' => $flag['data'], 'msg' => '已禁止']);
        }
        else
        {
            $flag = Db::name('article')->where(array('id'=>$id))->setField(['is_status'=>1]);
            return json(['code' => 0, 'data' => $flag['data'], 'msg' => '已开启']);
        }

    }



    //*********************************************分类管理*********************************************//

    /**
     * [index_cate 分类列表]
     * @return [type] [description]
     * @author [jonny] [980218641@qq.com]
     */
    public function index_cate(){

        $cate = new ArticleCateModel();
        $list = $cate->getAllCate();
        $this->assign('list',$list);
        return $this->fetch();
    }


    /**
     * [add_cate 添加分类]
     * @return [type] [description]
     * @author [jonny] [980218641@qq.com]
     */
    public function add_cate()
    {
        if(request()->isAjax()){

            $param = input('post.');
            $cate = new ArticleCateModel();
            $flag = $cate->insertCate($param);
            return json(['code' => $flag['code'], 'data' => $flag['data'], 'msg' => $flag['msg']]);
        }

        return $this->fetch();
    }


    /**
     * [edit_cate 编辑分类]
     * @return [type] [description]
     * @author [jonny] [980218641@qq.com]
     */
    public function edit_cate()
    {
        $cate = new ArticleCateModel();

        if(request()->isAjax()){

            $param = input('post.');
            $flag = $cate->editCate($param);
            return json(['code' => $flag['code'], 'data' => $flag['data'], 'msg' => $flag['msg']]);
        }

        $id = input('param.id');
        $this->assign('cate',$cate->getOneCate($id));
        return $this->fetch();
    }


    /**
     * [del_cate 删除分类]
     * @return [type] [description]
     * @author [jonny] [980218641@qq.com]
     */
    public function del_cate()
    {
        $id = input('param.id');
        $cate = new ArticleCateModel();
        $flag = $cate->delCate($id);
        return json(['code' => $flag['code'], 'data' => $flag['data'], 'msg' => $flag['msg']]);
    }



    /**
     * [cate_state 分类状态]
     * @return [type] [description]
     * @author [jonny] [980218641@qq.com]
     */
    public function cate_state()
    {
        $id=input('param.id');
        $status = Db::name('article_cate')->where(array('id'=>$id))->value('status');//判断当前状态情况
        if($status==1)
        {
            $flag = Db::name('article_cate')->where(array('id'=>$id))->setField(['status'=>0]);
            return json(['code' => 1, 'data' => $flag['data'], 'msg' => '已禁止']);
        }
        else
        {
            $flag = Db::name('article_cate')->where(array('id'=>$id))->setField(['status'=>1]);
            return json(['code' => 0, 'data' => $flag['data'], 'msg' => '已开启']);
        }

    }
    /**
     * 获取文章一级分类
     * @return
     */
    public function get_cate(){
        $nav_id=input('post.nav_id');
        $pid=0;
        $cate_list=Db::name('article_cate')->where(array('nav_id'=>$nav_id,'pid'=>0))->field('id,cate_name')->select();
        return json($cate_list);

    }

    /**
     * 获取文章二级分类
     */
    public function get_cate_child(){

        $pid=input('post.cate_id');
        $cate_list=Db::name('article_cate')->where('pid',$pid)->field('id,cate_name')->select();
        return json($cate_list);
    }
    
}
