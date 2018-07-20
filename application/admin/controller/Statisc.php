<?php
/**
 * 极客之家 高端PHP - 数据统计管理模块
 * @copyright  Copyright (c) 2016 QIN TEAM (http://www.qlh.com)
 * @license    GUN  General Public License 2.0
 * @version    Id:  Statisc.php 2017-11-28
 */
namespace app\admin\controller;
use think\Config;
use think\Db;
use think\Session;
use think\Request;
use app\admin\model\BaseModel;
class Statisc extends Base
{

    /**
     * [specitra_list] [指定广告跟踪数据统计]
     * @return [type] [description]
     * @author [qinlh] [WeChat QinLinHui0706]
     */
    public function specitra_list() {
        $time = input("param.time") ? input("param.time") : date("Y-m-d");
        //查询今日浏览总PV
        $TodayPv = DB::name('statisc')->where("time_up",$time)->field("page_num")->find()['page_num'];

        //查询今日指定广告跟踪数据
        $TodayAdveData = DB::name("statisc_source")->where("time_up",$time)->field("time_up,source_param,source_url,page_num,time")->select();
        foreach ($TodayAdveData as $k => $v) {
            $TodayAdveData[$k]['source_param'] = strlen($v['source_param']) < 15 ? $v['source_param'] : substr($v['source_param'],0,15)."...";
            $TodayAdveData[$k]['source_url'] = strlen($v['source_url']) < 75 ? $v['source_url'] : substr($v['source_url'],0,75)."...";
        }
        $TodayAdveJsonData = json_encode($TodayAdveData);
        // $TodayAdveJsonData = json_encode(['name'=>'秦林慧','sex'=>'娜娜']);
        // p($TodayAdveJsonData);
        foreach ($TodayAdveData as $key => $val) {
          $TodayAdveData[$key]['page_num'] = number_format($val['page_num']);
        }
        $this->assign('TodayPv',$TodayPv);
        $this->assign('TodayAdveData',$TodayAdveData);
        $this->assign('TodayAdveJsonData',$TodayAdveJsonData);
        $this->assign('time',$time);
        return $this->fetch();
    }
}
