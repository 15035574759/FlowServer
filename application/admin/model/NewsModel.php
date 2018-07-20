<?php
/**
 * 极客之家 高端PHP - 新闻Model模块
 * @copyright  Copyright (c) 2016 QIN TEAM (http://www.qlh.com)
 * @license    GUN  General Public License 2.0
 * @version    Id:  Type_model.php 2016-6-12 16:36:52
 */
namespace app\admin\model;
use think\Model;
use think\Db;

class NewsModel extends Model
{

    protected $table = "news";

    /**
     * 查询所有新闻
     * @return [type] [description]
     */
    public function showAll($page)
    {
      $where = 1;
      $limits = 15;// 获取总条数
      $count = Db::name($this->table)->where($where)->count();//计算总页面
      $allpage = intval(ceil($count / $limits));
      $lists = Db::name($this->table)
                      ->alias("p")
                      //->join("flow_news_class pc","p.class_id=pc.c_id")
                      // ->join("flow_news_label pl","p.label_id=pl.b_id")
                      ->page($page, $limits)
                      ->order("id desc")
                      ->select();
        foreach ($lists as $key => $val) {
          $lists[$key]['class_name'] = DB::name("news_class")->where("c_id",$val['class_id'])->find()['class_name'];
          $lists[$key]['time'] = date("Y-m-d H:i:s",$val['time']);
        }
        return ['count'=>$count,'allpage'=>$allpage,'lists'=>$lists];
    }

    /**
     * 添加新闻
     * @param  [type] $data [description]
     * @return [type]       [description]
     */
    public function news_add($data)
    {
        try{
            $result = DB::name($this->table)->insert($data);
            if(false === $result){
                return ['code' => 0, 'data' => '', 'msg' => $this->getError()];
            }else{
                return ['code' => 1, 'data' => '', 'msg' => '添加新闻成功'];
            }
        }catch( PDOException $e){
            return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
        } 
    }

 

    /**
     * 新闻修改 查询单条数据
     * @param [type] $id [description]
     */
    public function NewsUpdateshow($id)
    {   
       return DB::name($this->table)->where("id",$id)->find();
    }

    /**
     * 新闻修改
     * @return [type] [description]
     */
    public function news_update($data,$id)
    {
        try{
            //修改数据之前先删除原来新闻文件
            $imgurl = DB::name($this->table)->where("id",$id)->field("img")->find()['img'];

            $result = DB::name($this->table)->where("id",$id)->update($data);
            if(false === $result){
                return ['code' => 0, 'data' => '', 'msg' => $this->getError()];
            }else{
                @unlink(substr($imgurl,1)); //删除原来文件
                return ['code' => 1, 'data' => '', 'msg' => '修改成功'];
            }
        }catch( PDOException $e){
            return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
        } 
    }

     /**
     * 删除新闻详情 列表
     * @param [type] $id [description]
     */
    public function news_delete($id)
    {
        try{
            Db::name($this->table)->where('id', $id)->delete();
            writelog(session('admin_uid'),session('username'),'用户【'.session('admin_username').'】删除新闻成功(ID='.$id.')',1);
            return ['code' => 1, 'data' => '', 'msg' => '删除新闻成功'];
        }
        catch( PDOException $e)
        {
            return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
        }
    }

    //********************************************新闻分类管理*********************************************//

    /**
     * 添加项目分类
     * @param [type] $data [数据]
     */
    public function add_newsClass($data)
    {
        try{
            if($data['status'] == 'on'){$data['status'] = 0;}
            $result = DB::name("news_class")->insert($data);
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
    public function del_newsClass($id)
    {
        try{
            $result = DB::name("news_class")->where('c_id', $id)->delete();
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
    public function edit_newsClass($param)
    {
        try{
            if($param['status'] == 'on'){$param['status'] = 0;}
            $result = DB::name("news_class")->update($param, ['id' => $param['c_id']]);
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
     * 查询新闻所有分类
     * @param [type] [description]
     */
    public function ShowClass($class_id='')
    {
        try
        {
            $data = Db::name("news_class")->field("c_id,class_name,status")->select();
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
            return $data;
        }
        catch( PDOException $e)
        {
            return ['code' => 0, 'data' => '', 'msg' => $e->getMessage()];
        }
    }


}