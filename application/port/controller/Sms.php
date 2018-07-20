<?php
/**
 * 极客之家 高端PHP - 阿里云发送短信接口
 * @copyright  Copyright (c) 2016 QIN TEAM (http://www.qlh.com)
 * @license    GUN  General Public License 2.0
 * @version    Id:  Type_model.php 2016-6-12 16:36:52
 */
namespace app\port\controller;
use think\Controller;
use think\Config;
use think\Db;
use think\Loader;
use think\Session;
use think\Cache;
class Sms extends Controller
{	
	/**
	 * 发送短信接口
	 * @return [type] [description]
	 * @param  [post] [description]
	 * @author [qinlh] [WeChat QinLinHui0706]
	 */
	public function sendSms()
	{
		//引入必要文件
		Loader::import('alisms.api_sdk.aliyun-php-sdk-core.Config', EXTEND_PATH);
		Loader::import('alisms.api_sdk.Dysmsapi.Request.V20170525.SendSmsRequest', EXTEND_PATH);
		Loader::import('alisms.api_sdk.Dysmsapi.Request.V20170525.QuerySendDetailsRequest', EXTEND_PATH);
		//读取配置文件
		$sendsms = config('SEND_SMS');
		//初始化访问的acsCleint
	    $profile = \DefaultProfile::getProfile($sendsms['region'], $sendsms['accessKeyId'], $sendsms['accessKeySecret']);
	    \DefaultProfile::addEndpoint("cn-hangzhou", "cn-hangzhou", $sendsms['product'], $sendsms['domain']);
	    $acsClient = new \DefaultAcsClient($profile);
	    
	    $request = new \Dysmsapi\Request\V20170525\SendSmsRequest;
	    // $code = rand(10000,99999);//随机验证吗
	    //必填-短信接收号码
	    $request->setPhoneNumbers("15110110706");
	    //必填-短信签名
	    $request->setSignName("金牛网");
	    //必填-短信模板Code
	    $request->setTemplateCode("SMS_78830052");
	    //选填-假如模板中存在变量需要替换则为必填(JSON格式)
	    $request->setTemplateParam("{\"code\":\"123456\"}");
	    //选填-发送短信流水号
	    $request->setOutId("45678");
	    
	    //发起访问请求
	    $acsResponse = $acsClient->getAcsResponse($request);
	    $result = json_decode(json_encode($acsResponse),true);
	    if($result['Code'] == "OK")
	    {
	    	exit(json_encode(['code'=>1001,'data'=>'','msg'=>'Send Code Success']));
	    }
	    else
	    {
	    	exit(json_encode(['code'=>1007,'data'=>'','msg'=>'Send Code Error']));
	    }
	}
}