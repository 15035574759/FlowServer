<?php
/**
 * 极客之家 高端PHP - 苏宁项目封装接口请求类库、临时的、后续不作为参考使用
 * @copyright  Copyright (c) 2000-2017 QIN TEAM (http://www.qlh.com)
 * @version    GUN  General Public License 10.0.0
 * @license    Id:  .php 2017-11-21 23:59:59
 * @author     Qinlh WeChat QinLinHui0706
 */
class CryCurl {
    private $ua; // 请求来源
    private $Appkey='ActivityCoupon';
    private $appsecret = 'A084F89B-C74D-4E14-8CCE-CF3B8CDBD339';  //正式
    // private $appsecret = 'AEAE70D9-8510-4BB4-9BD6-276D34FFF276'; //测试
    // private $appsecret = 'A084F89B-C74D-4E14-8CCE-CF3B8CDBD339'; //仿真测试
    private $header; //curl请求头信息
    private $timeout; //请求等待时间
    private $time; //最大请求时间(针对请求超时的时候开业设置更大描述防止请求超时)
    private $timestamp; //生成签名需要的时间字符

    function __construct()
    {
        $this->ua        = '';
        $this->timeout   = 20;
        $this->time      = 40;
        $this->timestamp = date('YmdHi');
    }
    /**
     * curl post request
     * @param $url
     * @param $file
     * @param $data
     */
    public function curl_post($url,$data=null)
    {
        # Get signature, stitching url
        $sign = $this->encrySign($data,1);
        if($sign['code'] == -1) return ['code' => -1, 'msg' => '签名生成失败'];

        # Process the transferred data
        $url .= '?'.http_build_query(array(
                'appkey'    => $this->Appkey,
                'signature' => trim($sign['data']),
                'timestamp' => $this->timestamp
            ));

        # Curl request
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL,$url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $this->timeout);//连接等待秒数
        if($this->ua)curl_setopt($ch, CURLOPT_USERAGENT, $this->ua);
        if(is_array($this->header))curl_setopt($ch, CURLOPT_HTTPHEADER, $this->header);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
        curl_setopt($ch, CURLOPT_TIMEOUT,$this->time);   //超时秒数
        $output = curl_exec($ch);
        //dump($output);
        curl_close($ch);

        if($output === false){
            return json(['code'=>-1,'msg'=>'请求失败','data'=>$ch]);
        }

        return  $output;
    }

    /**
     * curl post request
     * @param $url
     * @param $file
     * @param $data
     */
    public function curl_get($url,$data=null)
    {
        # Get signature, stitching url
        $sign = $this->encrySign($data,2);
        if($sign['code'] == -1) return json(['code'=>-1,'msg'=>'签名生成失败']);
        // echo $this->Appkey;die;
        # Process the transferred data
        $data['appkey']    = $this->Appkey;
        $data['signature'] = trim($sign['data']);
        $data['timestamp'] = $this->timestamp;
        $url .= '?'.http_build_query($data);
        # Curl request
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL,$url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $this->timeout);//连接等待秒数
        if($this->ua)curl_setopt($ch, CURLOPT_USERAGENT, $this->ua);
        if(is_array($this->header))curl_setopt($ch, CURLOPT_HTTPHEADER, $this->header);
        curl_setopt($ch, CURLOPT_TIMEOUT,$this->time);   //超时秒数
        $output = curl_exec($ch);
        curl_close($ch);

        if($output === false)
            // return "{'code':-1,'msg':'请求失败','data':curl_error($ch)}";
            return json(['code'=>-1,'msg'=>'请求失败','data'=>$ch]);

        //return "{'code':0,'msg':'请求成功','data':$output}";
        return $output;
    }
    /**
     * Get the signature
     * 加密方式
     * @param $data
     * @param $type 1:post 2:get
     */
    private function encrySign($data=array(),$type = 1)
    {
        # Verify the parameters
        $res = '';
        switch($type)
        {
            case 1:
                $res = $this->encrySignPost($data);
                break;
            case 2:
                $res = $this->encrySignGet();
                break;
            default:
                $res = $this->encrySignGet();
                break;
        }

        if($res === false) return ['code'=> -1, 'msg'=> '获取签名失败'];

        return ['code'=> 0, 'msg'=> '获取签名成功', 'data'=> $res];
    }

    /**
     * @return bool|string
     * @desc Get请求加密方式
     */
    private function encrySignGet(){
        try {
            // Encrypt the string
            $enceyStr = mb_convert_encoding($this->Appkey.$this->appsecret.$this->timestamp,'UTF-8');
            //dump($enceyStr);die;
            // Sha1 encryption
            return base64_encode(hex2bin(sha1($enceyStr)));
        } catch (Exception $e){
            return false;
        }
    }

    /**
     * @param $data
     * @desc  POST请求加密方式
     * 1:post 2:get
     */
    private function encrySignPost($data)
    {
        try {
            // Sort the pre-encrypted string
            $data['Timestamp'] = $this->timestamp;
            $data['Appkey'] = $this->Appkey;
            $data['Appsecret'] = $this->appsecret;
            ksort ($data);

            $enceyArr = array_values($data);
            //dump($data);die;
            $enceyStr = implode('', $enceyArr);
            //dump($enceyStr);die;
            // Sha1 encryption
           return base64_encode(hex2bin(sha1($enceyStr)));
        } catch (Exception $e){
            return false;
        }
    }
}
