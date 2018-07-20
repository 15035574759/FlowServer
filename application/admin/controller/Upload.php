<?php

namespace app\admin\controller;
use think\Controller;
use think\File;
use think\Request;
class Upload extends Base
{

    /*
     * 上传焦点图图片
     */
    public function uploadAdImage(){
        $file = request()->file('file');
        $info = $file->move(ROOT_PATH . 'public' . DS . 'upload/testfile');
        if($info){
            $res['status'] = 1;
            $res['image_name'] = $info->getSaveName();
            return json($res);

        }else{

            $res['status']=0;
            $res['error_info']=$file->getError();
            return json($res);
        }
    }

    /**
     * [uploadProjectImage 添加项目上传图片]
     * @return [type] [description]
     * @author [qinlh] [15035574759@163.com]
     */
    public function uploadProjectImage()
    {
        $file = request()->file('file');
        // print_r($file);die;
        $info = $file->move(ROOT_PATH . 'public' . DS . 'upload/testfile');//先移动到临时文件
        if($info)
        {
            $res['status'] = 1;
            $res['image_name'] = $info->getSaveName();
            return json($res);

        }
        else
        {

            $res['status']=0;
            $res['error_info'] = $file->getError();
            return json($res);
        }
    }


    /**
     * [UploadExcel 上传Excel文件]
     * @return [type] [description]
     * @author [qinlh] [15035574759@163.com]
     */
    public function UploadExcel()
    {
        $file = request()->file('file');
        // print_r($file);die;
        $info = $file->move(ROOT_PATH . 'public' . DS . 'UploadFiles/excel');
        if($info)
        {
            $res['status'] = 1;
            $res['image_name'] = $info->getSaveName();
            return json($res);

        }
        else
        {

            $res['status']=0;
            $res['error_info'] = $file->getError();
            return json($res);
        }
    }

    /**
     * 删除原来上传文件
     * @param [type] $imgurl [源文件]
     */
    public function DelUpdate($imgurl)
    {
        if(strpos($imgurl,"tong.jpg"))
        {
            return true;
        }
        else
        {
            //删除文件
            unlink($imgurl);
            return true;
        }
    }













//*********************************************未启用*********************************************//
    /*
     * 编辑器图片上传接口
     */
    public function uploadImage(){
        $file = request()->file('file');
        $info = $file->move(ROOT_PATH . 'public' . DS . 'upload/editor');
        if($info){
            $res['src']="http://www.93admin.com/public/statisc/img/tong.jpg";
            $result=array('code'=>0,'data'=>$res,'msg'=>'上传成功');

            return json($result);

        }else{

            $result=array('code'=>-1,'data'=>'','msg'=>$file->getError());

            return json($result);
        }
    }


	//图片上传
    public function upload(){
       $file = request()->file('file');
       $info = $file->move(ROOT_PATH . 'public' . DS . 'upload/image/article');
       if($info){
           $res['status']=1;
           $res['image_name']=$info->getSaveName();
           return json($res);
        }else{
           $res['status']=0;
           $res['error_info']=$file->getError();
           return json($res);
        }
    }

    //文件上传
    public function uploadFile(){
        $file = request()->file('file');
        $info = $file->move(ROOT_PATH . 'public' . DS . 'upload/file/down');
        if($info){

            $res['status']=1;
            $res['file_name']=$info->getFilename();
            $res['file_path']="/upload/file/down/".$info->getSaveName();
            return json($res);

        }else{
            $res['status']=0;
            $res['error_info']=$file->getError();
            return json($res);
        }
    }

    //会员头像上传
    public function uploadface(){
       $file = request()->file('file');
       $info = $file->move(ROOT_PATH . 'public' . DS . 'uploads/face');
       if($info){
            echo $info->getSaveName();
        }else{
            echo $file->getError();
        }
    }
//*********************************************结束*********************************************//




}
