<?php
/**
 * 极客之家 高端PHP - 优惠券管理、半成品
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
use think\Loader;
use app\admin\model\ThorprojectModel;
use app\admin\model\UploadModel;
use app\admin\model\DrawModel;
use app\admin\model\BaseModel;
use app\admin\model\LeaveModel;
use aes\crycurl\CryCurl;
class Coupon extends Base
{

  /**
   * [SendCoupon] [发送优惠券]
   * @return [type] [description]
   * @author [qinlh] [WeChat QinLinHui0706]
   */
  public function SendCoupon() {
    exit(json_encode(['code'=>1001,'data'=>'','msg'=>'发送成功']));
    $order_id = input('param.order_id') ? input('param.order_id') : '';//订单ID
    $activity_id = input('param.activity_id') ? input('param.activity_id') : '';//活动ID
    // $data = DB::name("order")->where("id",$order_id)->find();
    $data = [
       'order_id' => 1
      ,'order_number' => 'QL_123456789'
      ,'name' => '张三'
      ,'phone' => '15110220301'
      ,'city' => '北京市'
      ,'dealer' => '经销商'
      ,'activity' => '活动名称'
      ,'models' => '车型'
      ,'order_time' => '下单时间'
      ,'order_start' => '订单状态'
      ,'sms_start' => '短信状态'
      ,'write_start' => '核销状态'
    ];
    Loader::import('aes.crycurl.CryCurl', EXTEND_PATH);
    $crycurl = new \CryCurl();
    $url = 'http://api.xingyuanauto.com/CouponCenter/GetActivityDealerList';
    $data = ['activityId'=>$ActivityId]; //活动ID
    $res = $CryCurl->curl_get($url,$data); //获取经销商ID
    $JsonArr = json_decode($res,true);
    if($JsonArr['Success'] == true){
        $DealerID = $JsonArr['Data'][0]['DealerID'];//经销商id
    }
    $SerialId = $this->getSerialId($ActivityId); //获取车型ID
    $SerialArr = json_decode($SerialId,true);
    //dump($SerialId);die;
    $id = array_keys($SerialArr)[0];
    $SerialName = $SerialArr[$id]['name'];
    //dump($SerialName);die;
    $url1 = 'Http://api.xingyuanauto.com/CouponCenter/GetActivityOrder';
    $data1 = array(
        'ActivityId'=>$ActivityId,
        'CouponCreateRuleID'=>$CouponCreateRuleID,
        'McOrderId'=>$result['McOrderId'],
        'SerialId'=>$id, //车型id
        'DealerId'=>$DealerID,
        'SerialName'=>$SerialName,//车型文本
        'UserPhone'=>$result['UserPhone'],
        'UserName'=>$result['UserName'],
        'UserId'=>$result['UserId'],
        'OrderTime'=>$result['OrderTime'],
        'OrderStatus'=>0,
        'OrderStatusTxt'=>'',
        'DasAccountId'=>0,
        'OrderSourceType'=>2,
    );
    //dump($data1);die;
    $res1 = $CryCurl->curl_post($url1,$data1); //传递数据到外部门，返回优惠券
    $jsonRes1 = json_decode($res1,true);
    //dump($jsonRes1);die;
    if($jsonRes1['Success'] == true) {
        $CouponCode = $jsonRes1['Data']['CouponCode']; //购车优惠券码
        $couponid = $jsonRes1['Data']['CouponID']; //优惠券ID
        $VerifiedUrl = $jsonRes1['Data']['VerifiedUrl']; //优惠券二维码地址
        $StartTime = date('Y-m-d',strtotime($jsonRes1['Data']['StartTime'])); //优惠券有效期 开始日期
        $EndTime = date('Y-m-d',strtotime($jsonRes1['Data']['EndTime'])); //优惠券有效期 结束日期
    }else{
        $ErrorMessage = $jsonRes1['ErrorMessage'];
        $this->error($ErrorMessage);
    }
    $arrData = [];
    $arrData['CouponCode'] = $CouponCode;
    $arrData['couponid'] = $couponid;
    $arrData['VerifiedUrl'] = $VerifiedUrl;
    $arrData['DealerId'] = $DealerID;
    $arrData['SerialId'] = $id;
    $arrData['begintime'] = $StartTime;
    $arrData['endtime'] = $EndTime;

    $arrDatares = Db::name('suning')->where('McOrderId',$McOrderId)->update($arrData); //修改用户获取的优惠券信息
    //dump($arrDatares);die;
    if($arrDatares){ //发送短信
        $curtime = time(); //获取当前时间戳
        $appidnum = 2;

        //【汽车大全】您好，您的购车优惠券码为(XX)（优惠券二维码地址：xx），请妥善保存。
        //车型为(待替换的车型名称)，请在（xx日至x日）到店购车。咨询热线：95078886  活动详情：xxxx（请放主会场 链接）
        $content = '您好，您的购车优惠券码为'.'('.$CouponCode.')'.'(优惠券二维码地址:'.$VerifiedUrl.'),请妥善保存。'.'车型为('.$result['car_name'].'),'.'请在('.$StartTime.'至'.$EndTime.')'.'到店购车。咨询热线：95078886  活动详情：xxxx';
        //dump($ret);
        $data = array(
            'msg_status'=>1,
        );
        $res = Db::name('suning')->where('McOrderId',$McOrderId)->update($data);
        //dump($res);die;
        if($res) {
            $sms = new \sms\Sms();//实例化微信授权类
            $ret = $sms->sms($data['phone'],$content);
            if($phoneSms['code'] == 4201) {
      				exit(json_encode(['code'=>4201,'data'=>'','msg'=>'发送短信异常']));
      			}
              exit(json_encode(['code'=>1001,'data'=>'','msg'=>'发送成功']));
        } else {
            $this->error('请不要重复发送短信');
        }
      }
    // $params = [ //接口请求参数
    //     "params01" => "",
    //     "params02" => "",
    //     "params03" => "",
    // ];

    // $paramstring = http_build_query($params);
    // $content = file_get_contents($url.'?'.$paramstring);
    // $result = json_decode($content,true);
    // exit(json_encode(['code'=>1001,'data'=>'','msg'=>'']));
  }

  /**
   * [getSerialId]  [订单车型ID]
   * @return [type] [description]
   * @author [qinlh] [WeChat QinLinHui0706]
   */
  private function getSerialId($ActivityId) {
        $CryCurl = new CryCurl();
        $url2 = 'http://api.xingyuanauto.com/CouponCenter/GetActivityDetail'; //调用活动详情获取订单车型id
        $data = array(
            'activityId'=>$ActivityId,
        );
        $rest = $CryCurl->curl_get($url2,$data);
        $JsonArrt = json_decode($rest,true);
        //dump($JsonArrt);die;
        if($JsonArrt['Success'] == true){
            $BrandRule = $JsonArrt['Data']['ActivityCouponDetail'][0]['BrandRule'];
            $jsonArr = json_decode($BrandRule,true);
            //dump($jsonArr);die;
            $SerialInfo = $jsonArr['carserials'];
            return json_encode($SerialInfo); //订单车型id
        }
    }

  /**
   * [_getCouponCreateRuleID] [获取外部门优惠券规则ID]
   * @return [type] [description]
   * @author [qinlh] [WeChat QinLinHui0706]
   */
   private function _getCouponCreateRuleID($activityId) {
    $url = "http://api.xingyuanauto.com/CouponCenter/GetActivityDetail";  //接口URL地址
    Loader::import('aes.crycurl.CryCurl', EXTEND_PATH);
    $crycurl = new \CryCurl();

    $data['activityId'] = $activityId; //接收到的活动ID
    $res = $crycurl->curl_get($url,$data);
    var_dump($res);
    $jsonArr = json_decode($res,true);
    //dump($jsonArr);die;
    if($jsonArr['Success'] == true){
        $ary['CouponCreateRuleID'] = $jsonArr['Data']['ActivityCouponDetail'][0]['CouponCreateRuleID']; //优惠券ID
        //dump($ary);
        $ary['code'] = 1;
        return json_encode($ary);
    }else{
        $arr['msg'] = $jsonArr['ErrorMessage'];
        $arr['code'] = 0;
        return json_encode($arr);
    }
  }

}
