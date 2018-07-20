<?php
/**
 * 极客之家 高端PHP - 微信、支付宝支付接口
 * @copyright  Copyright (c) 2016 QIN TEAM (http://www.qlh.cn)
 * @license    GUN  General Public License 2.0
 * @version    Id:  Type_model.php 2017-7-18 13:58:52
 */
namespace app\admin\controller;
use think\Controller;
use think\Config;
use think\Db;
use think\Session;
use think\Request;
use think\Loader;
use think\Cache;
use app\admin\model\PayModel;
class Pay extends Controller
{
	public  function pay()
	{
			return $this->fetch('index');
	}
	/**
	 * 电脑端唤醒 支付宝扫码支付接口【PC端】
 	 * @return [type] [description]
	 * @author [qinlh] [WeChat QinLinHui0706]
	 */
	public function alipay()
	{
		if(input("param."))
		{
					$aliConfig = config('ALIPAY_CONFIG');
					$out_trade_no = '2017PC'.time();
			    $order_amount = '0.01';
			    $proName = "测试0.01";
					Loader::import('alipay.aop.AopClient', EXTEND_PATH);
					Loader::import('alipay.aop.request.AlipayTradePagePayRequest', EXTEND_PATH);

	        //构造参数
	        $aop = new \AopClient();
	        $aop->gatewayUrl = $aliConfig['gatewayUrl'];
	        $aop->appId = $aliConfig['appId'];
	        $aop->rsaPrivateKey = $aliConfig['rsaPrivateKey'];

	        $aop->apiVersion = '1.0';
	        $aop->signType = 'RSA2';
	        $aop->postCharset = 'utf-8';
	        $aop->format = 'json';
	        $request = new \AlipayTradePagePayRequest();
	        $request->setReturnUrl($aliConfig['returnPcUrl']);
	        $request->setNotifyUrl($aliConfig['notifyUrl']);
	        $request->setBizContent(
	            "{" .
	            "    \"product_code\":\"FAST_INSTANT_TRADE_PAY\"," .
	            "    \"subject\":\"$proName\"," .
	            "    \"out_trade_no\":\"$out_trade_no\"," .
	            "    \"total_amount\":$order_amount," .
	            "    \"body\":\"Iphone6 16G\"" .
	            "  }");
	        //请求
	        $result = $aop->pageExecute ($request);
	        //输出
	        echo $result;
		}
		else
		{
			return $this->fetch('index');
		}
	}

	/**
	 * WAP手机端 支付宝接口【移动端】
	 * @return [type] [description]
	 * @author [qinlh] [WeChat QinLinHui0706]
	 */
	public function wap_alipay()
	{
		if(input("param."))
		{
			$aliConfig = config('ALIPAY_CONFIG');
			Loader::import('alipay.aop.AopClient', EXTEND_PATH);
			Loader::import('alipay.aop.request.AlipayTradeWapPayRequest', EXTEND_PATH);
	        $out_trade_no = '2017WAP'.time();
            $body = '欢迎购买商品，愿您购物愉快';
            $subject = '你好';
            $order_amount = '0.01';
            $aop = new \AopClient();
            $aop->gatewayUrl = $aliConfig['gatewayUrl'];
            $aop->appId = $aliConfig['appId'];
            $aop->rsaPrivateKey = $aliConfig['rsaPrivateKey'];
            $aop->alipayrsaPublicKey=$aliConfig['alipayrsaPublicKey'];
            $aop->apiVersion = '1.0';
            $aop->postCharset='UTF-8';
            $aop->format='json';
            $aop->signType='RSA2';
            $request = new \AlipayTradeWapPayRequest ();
            $bizContent = "{" .
                "    \"body\":\"$body.\"," .
                "    \"subject\":\"$subject\"," .
                "    \"out_trade_no\":\"$out_trade_no\"," .
                "    \"timeout_express\":\"90m\"," .
                "    \"total_amount\":$order_amount," .
                "    \"product_code\":\"QUICK_WAP_WAY\"" .
                "  }";
            $request->setBizContent($bizContent);
            $request->setNotifyUrl($aliConfig['notifyUrl']);
            $request->setReturnUrl($aliConfig['returnUrl']);
            $result = $aop->pageExecute ( $request);
            echo $result;
		}
		else
		{
			return $this->fetch('index');
		}
	}

	/**
	 * [GetRefund] 支付宝退款
	 * @param  [string] [接受信息描述]
	 * @return [type] [返回参数描述]
	 * @author [qinlh] [WeChat QinLinHui0706]
	 */
	public function GetRefund()
	{
		$aliConfig = config('ALIPAY_CONFIG');
		Loader::import('alipay.pagepay.service.AlipayTradeService', EXTEND_PATH);
		Loader::import('alipay.buildermodel.AlipayTradeRefundContentBuilder', EXTEND_PATH);

		//商户订单号，商户网站订单系统中唯一订单号
	    $out_trade_no = trim($_POST['WIDTRout_trade_no']);

	    //支付宝交易号
	    $trade_no = trim($_POST['WIDTRtrade_no']);
	    //请二选一设置

	    //需要退款的金额，该金额不能大于订单金额，必填
	    $refund_amount = trim($_POST['WIDTRrefund_amount']);

	    //退款的原因说明
	    $refund_reason = trim($_POST['WIDTRrefund_reason']);

	    //标识一次退款请求，同一笔交易多次退款需要保证唯一，如需部分退款，则此参数必传
	    $out_request_no = trim($_POST['WIDTRout_request_no']);

	    //构造参数
		$RequestBuilder=new AlipayTradeRefundContentBuilder();
		$RequestBuilder->setOutTradeNo($out_trade_no);
		$RequestBuilder->setTradeNo($trade_no);
		$RequestBuilder->setRefundAmount($refund_amount);
		$RequestBuilder->setOutRequestNo($out_request_no);
		$RequestBuilder->setRefundReason($refund_reason);

		$aop = new AlipayTradeService($config);

		/**
		 * alipay.trade.refund (统一收单交易退款接口)
		 * @param $builder 业务参数，使用buildmodel中的对象生成。
		 * @return $response 支付宝返回的信息
		 */
		$response = $aop->Refund($RequestBuilder);
		var_dump($response);
	}


	/**
	 * return_url 【支付宝同步地址跳转页面】
	 * @param [out_trade_no] [商户订单号]
	 * @param [trade_no] [支付宝交易号]
	 * @author [qinlh] [WeChat QinLinHui0706]
	 */
	public function return_url()
	{
		$config = config('ALIPAY_CONFIG');
		Loader::import('alipay.aop.AopClient', EXTEND_PATH);
		Loader::import('alipay.pagepay.service.AlipayTradeService', EXTEND_PATH);
		$data = input("param.");

		$alipaySevice = new \AlipayTradeService($config);
		// $alipaySevice->writeLog(var_export(input("param."),true));
		$result = $alipaySevice->check($data);

		/* 实际验证过程建议商户添加以下校验。
		  1、商户需要验证该通知数据中的out_trade_no是否为商户系统中创建的订单号，
		  2、判断total_amount是否确实为该订单的实际金额（即商户订单创建时的金额），
		  3、校验通知中的seller_id（或者seller_email)是否为out_trade_no这笔单据的对应的操作方（有的时候，一个商户可能有多个seller_id/seller_email）
		  4、验证app_id是否为该商户本身。
		*/
		if($result)
		{
			//商户订单号
			$out_trade_no = htmlspecialchars(input("post.out_trade_no"));

			//支付宝交易号
			$trade_no = htmlspecialchars(input("post.trade_no"));

			//验证成功
			/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			//请在这里加上商户的业务逻辑程序代码

			//跳转到支付成功页面
			echo "验证成功<br />支付宝交易号：".$trade_no;
		}
		else
		{
			echo "Validation failure";
		}
	}

	/**
	 * notify_url 【支付宝异步地址 主要处理业务逻辑】
	 * @param [data] [异步通知参数]
	 * @param [out_trade_no] [商户订单号]
	 * @param [trade_no] [支付宝交易号]
	 * @param [trade_status] [交易状态码]
	 * @author [qinlh] [WeChat QinLinHui0706]
	 */
	public function notify_url()
	{
		$config = config('ALIPAY_CONFIG');
		Loader::import('alipay.aop.AopClient', EXTEND_PATH);
		Loader::import('alipay.pagepay.service.AlipayTradeService', EXTEND_PATH);
		$data = input("post.");

		$alipaySevice = new \AlipayTradeService($config);
		$alipaySevice->writeLog(var_export(input("param."),true));
		$result = $alipaySevice->check($data);
		if($result)
		{
			//商户订单号
			$out_trade_no = input("post.out_trade_no");

			//支付宝交易号
			$trade_no = input("post.trade_no");

			//交易状态
			$trade_status = input("post.trade_status");
			// Cache::set('pay01',$trade_status,3600);

			//判断该笔订单是否在商户网站中已经做过处理
			//如果没有做过处理，根据订单号（out_trade_no）在商户网站的订单系统中查到该笔订单的详细，并执行商户的业务程序
			//请务必判断请求时的total_amount与通知时获取的total_fee为一致的
			//如果有做过处理，不执行商户的业务程序
			switch ($trade_status)
			{
				case 'TRADE_SUCCESS':
					//注意：
					//付款完成后，支付宝系统发送该交易状态通知
					//交易支付成功

					//**************************处理业务逻辑*************************
				  break;
				case 'WAIT_BUYER_PAY':
					//交易创建，等待买家付款

					//**************************处理业务逻辑*************************
				  break;
				case 'TRADE_CLOSED':
					//未付款交易超时关闭，或支付完成后全额退款

					//**************************处理业务逻辑*************************
				  break;
				case 'TRADE_FINISHED':
					//交易结束，不可退款

					//**************************处理业务逻辑*************************
				  break;
				default:
					echo "transaction error";
				  break;
			}

		}
		else
		{
			echo "Validation failure";
		}
	}


	//*************************************************** 微信支付 ****************************************************

	/**
	 * [WeChatPay] 微信公众号支付
	 * @param  [string] [接受信息描述]
	 * @return [type] [返回参数描述]
	 * @author [qinlh] [WeChat QinLinHui0706]
	 */
	public function WeChatPay()
	{
		$result = Loader::import('wechatpay.lib.WxPay#Api', EXTEND_PATH);
		$result = Loader::import('wechatpay.example.WxPay#JsApiPay', EXTEND_PATH);
		Loader::import('wechatpay/example/log', EXTEND_PATH);
		//初始化日志
			$logHandler= new \CLogFileHandler("../logs/".date('Y-m-d').'.log');
			$log = \Log::Init($logHandler, 15);

			//①、获取用户openid
			$tools = new \JsApiPay();
			$openId = $tools->GetOpenid();

			//②、统一下单
			$input = new \WxPayUnifiedOrder();
			$input->SetBody("test");
			$input->SetAttach("test");
			$input->SetOut_trade_no(WxPayConfig::MCHID.date("YmdHis"));
			$input->SetTotal_fee("1");
			$input->SetTime_start(date("YmdHis"));
			$input->SetTime_expire(date("YmdHis", time() + 600));
			$input->SetGoods_tag("test");
			$input->SetNotify_url("http://paysdk.weixin.qq.com/example/notify.php");
			$input->SetTrade_type("JSAPI");
			$input->SetOpenid($openId);
			$order = \WxPayApi::unifiedOrder($input);
			echo '<font color="#f00"><b>统一下单支付单信息</b></font><br/>';
			foreach($order as $key=>$value){
			        echo "<font color='#00ff55;'>$key</font> : $value <br/>";
			    }
			$jsApiParameters = $tools->GetJsApiParameters($order);

			//获取共享收货地址js函数参数
			$editAddress = $tools->GetEditAddressParameters();
	}


	/**
	 * [wxh5Request] 微信移动 H5支付 统一下单
	 * @param  [string] [接受信息描述]
	 * @return [type] [返回参数描述]
	 * @author [qinlh] [WeChat QinLinHui0706]
	 */
	public function wxh5Request()
	{
				$aliConfig = config('WEIXINPAY_CONFIG');
				$appid = $aliConfig['APPID'];//公众号APPID
				$mch_id = $aliConfig['MCHID'];//微信官方的MCHID
				$key = $aliConfig['KEY'];//自己设置的微信商家key
        $notify_url = "https://fld.xingyuanauto.com/index.php/admin/pay/wxh5RequestRedirect";//异步通知回调地址
				Loader::import('wechatpay.example.wechatH5Pay', EXTEND_PATH);
        $wechatAppPay = new \wechatAppPay($appid, $mch_id, $notify_url, $key);
				// var_dump($wechatAppPay);die;
        $params['body'] = '估价啦';                       //商品描述
				$rand = rand(00000,99999);
        $params['out_trade_no'] = '20171010'.$rand;    //自定义的订单号
        $params['total_fee'] = '1';                       //订单金额 只能为整数 单位为分
        $params['trade_type'] = 'MWEB';                   //交易类型 JSAPI | NATIVE | APP | WAP
        $params['scene_info'] = '{"h5_info": {"type":"Wap","wap_url": "https://fld.xingyuanauto.com","wap_name": "估价啦"}}';
        $result = $wechatAppPay->unifiedOrder( $params );
				if($result['return_code'] == 'SUCCESS')  {
            if($result['result_code'] == 'SUCCESS'){//如果这两个都为此状态则返回mweb_url，详情看‘统一下单’接口文档
                // return $result['mweb_url'];
                $url = $result['mweb_url'].'&redirect_url=https%3a%2f%2ffld.xingyuanauto.com%2findex.php%2fadmin%2fpay%2fwxh5RequestNotify';//redirect_url 是支付完成后返回的页面;
								$this->assign("url",$url);//返回微信支付收银台的中间页面url地址
				        return $this->fetch('pay');
            }
            if($result['result_code'] == 'FAIL'){
                return $err_code_des = $result['err_code_des'];
            }
        }

	}

	/**
	 * [wxh5RequestNotify] 微信移动 H5支付成功异步地址
	 * @param  [string] [接受信息描述]
	 * @return [type] [返回参数描述]
	 * @author [qinlh] [WeChat QinLinHui0706]
	 */
	public function wxh5RequestNotify()
	{
		//异步跳转地址
		/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//请在这里加上商户的业务逻辑程序代码

	}

	/**
	 * [wxh5RequestRedirect] 微信移动 H5支付成功同步地址
	 * @param  [string] [接受信息描述]
	 * @return [type] [返回参数描述]
	 * @author [qinlh] [WeChat QinLinHui0706]
	 */
	public function wxh5RequestRedirect()
	{
		//同步跳转地址
		/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//请在这里展示需要展示的视图程序

	}
}
