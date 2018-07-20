<?php
/**
 * 极客之家 高端PHP - 特价车管理
 * @copyright  Copyright (c) 2018 QIN TEAM (http://www.qlh.com)
 * @license    GUN  General Public License 2.0
 * @version    Id:  Speciact.php 2018-1-23 16:36:52
 */
namespace app\admin\controller;
use think\Config;
use think\Db;
use think\Session;
use think\Request;
class Speciact extends Base
{
    /**
     * [index] [特价车活动列表]
     * @param [param] [description]
     * @return [type] [description]
     * @author [qinlh] [WeChat QinLinHui0706]
     */
    public function index() {
      return $this->fetch();
    }
}
