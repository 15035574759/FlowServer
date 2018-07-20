<?php
/**
 * 极客之家 高端PHP - 来源渠道配置文件
 * @copyright  Copyright (c) 2016 QIN TEAM (http://www.qlh.com)
 * @license    GUN  General Public License 2.0
 * @version    Id:  Type_model.php 2016-6-12 16:36:52
 */
namespace app\admin\model;
use think\Model;
use think\Db;
class SourceModel extends Model
{

  /**
   * [Benc]  [奔驰来源渠道配置文件]
   * @return [type] [description]
   * @author [qinlh] [WeChat QinLinHui0706]
   */
  public function Benc($source)
  {
    switch ($source)
    {
        case 'yjbj010':
          $data[$key]['source'] = "遇见北京";
        break;
        case 'jl96618':
          $data[$key]['source'] = "思想聚焦";
        break;
        case 'bblxsy':
          $data[$key]['source'] = "背包旅行摄影";
        break;
        case 'zhanhao':
          $data[$key]['source'] = "占豪";
        break;
        case 'chemm':
          $data[$key]['source'] = "车买买";
        break;
        case 'wxpt':
          $data[$key]['source'] = "微信平台";
        break;
        case 'jrtt':
          $data[$key]['source'] = "今日头条";
        break;
        case 'ydzx':
          $data[$key]['source'] = "一点资讯";
        break;
        case 'wynet':
          $data[$key]['source'] = "网易";
        break;
        case 'uc':
          $data[$key]['source'] = "UC";
        break;
        case 'bj':
          $data[$key]['source'] = "百家";
        break;
        default:
          $data[$key]['source'] = "未选择渠道";
        break;
    }
  }
}
