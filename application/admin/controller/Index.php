<?php
/**
 * 极客之家 高端PHP - 首页模块
 * @copyright  Copyright (c) 2000-2017 QIN TEAM (http://www.qlh.com)
 * @version    GUN  General Public License 10.0.0
 * @license    Id:  Index.php 2017-11-27 10:28:59
 * @author     Qinlh WeChat QinLinHui0706
 */
namespace app\admin\controller;
use think\Db;
class Index extends Base
{
    public function index()
    {
        return $this->fetch();
    }


    /**
     * [indexPage 后台首页]
     * @return [type] [description]
     * @author [jonny] [980218641@qq.com]
     */
    public function indexPage()
    {
        $info = array(
            'web_server' => $_SERVER['SERVER_SOFTWARE'],
            'onload'     => ini_get('upload_max_filesize'),
            'think_v'    => THINK_VERSION,
            'phpversion' => phpversion(),
        );

        $this->assign('info',$info);
        return $this->fetch('main');
    }

    /**
     * [center 中间内容]
     * @return [type] [description]
     * @author [jonny] [980218641@qq.com]
     */
     public function center(){
       $time = date("Y-m-d");
       $ThisMonth = DB::query('SELECT * FROM flow_statisc WHERE DATE_FORMAT( time_up, "%Y%m" ) = DATE_FORMAT( CURDATE( ) , "%Y%m" )'); //查询本月数据统计
       // p($ThisMonth);
       $TodayData = Db::name('statisc')->where('time_up', $time)->field("id,time_up,page_num,user_num,leave_num,activity_num")->find(); //今日数据统计
       if(false == $TodayData) {
         $TodayData = [
           'page_num' => 0
           ,'user_num' => 0
           ,'activity_num' => 0
           ,'leave_num' => 0
         ];
       }
       $TodayData['page_num'] = @number_format($TodayData['page_num']);
       $TodayData['user_num'] = @number_format($TodayData['user_num']);
       $ThisMonth = json_encode($ThisMonth);
       $this->assign('ThisMonth',$ThisMonth);
       $this->assign('TodayData',$TodayData);
       return $this->fetch();
     }
}
