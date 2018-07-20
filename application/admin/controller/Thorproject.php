<?php
/**
 * 极客之家 高端PHP - 其他项目管理
 * 附加的一些项目功能控制器
 * @copyright  Copyright (c) 2016 QIN TEAM (http://www.qlh.com)
 * @license    GUN  General Public License 2.0
 * @version    Id:  Type_model.php 2016-6-12 16:36:52
 */
namespace app\admin\controller;
use think\Config;
use think\Db;
use think\Session;
use think\Request;
use app\admin\model\ThorprojectModel;
use app\admin\model\BaseModel;
class Thorproject extends Base
{

    /**
     * 项目列表
     * @return [type] [description]
     */
    public function project_list() {
        $page = input('get.page') ? input('get.page') : 1;//当前页
        $project  = new ThorprojectModel;
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
     * [order_list] [项目订单列表]
     * @return [type] [description]
     * @author [qinlh] [WeChat QinLinHui0706]
     */
    public function order_list() {
      return $this->fetch();
    }

}
