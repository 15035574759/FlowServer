<?php
/**
 * 极客之家 高端PHP - 公用控制器
 * @copyright  Copyright (c) 2016 QIN TEAM (http://www.qlh.com)
 * @license    GUN  General Public License 2.0
 * @version    Id:  Type_model.php 2016-6-12 16:36:52
 */
namespace app\admin\model;
use think\Db;
use think\Model;
class BaseModel extends Model
{
    protected $name = 'table';


    /**
     * 分页 没有两表联查
     * @param  [type] $table [表名]
     * @param  [type] $where [查询条件]
     * @param  [type] $where [当前页]
     * @param  [type] $ID [自增ID]
     * @return [type] array
     */
    public function GetPage($table,$where,$page,$id)
    {
        try{
            $limits = 15;// 获取总条数
            $count = Db::name($table)->where($where)->count();//计算总页面
            $allpage = intval(ceil($count / $limits));
            $lists = Db::name($table)->where($where)->page($page, $limits)->order(''.$id.' desc')->select();
            if(false == $lists)
            {
                return ['code'=>-1,'data'=>'','msg'=>'查询分页数据失败'];
            }
            return ['count'=>$count,'allpage'=>$allpage,'lists'=>$lists];

        }catch( PDOException $e){
            return ['code' => -1, 'data' => '', 'msg' => $e->getMessage()];
        }
    }

    /**
     * 移动文件到正式目录
     * @param [type] $file [临时文件路径]
     * @param [type] $file [临时文件路径]
     */
    public function MoveFile($file,$url)
    {
        try{
            //新文件地址
            $NewFile = "upload/".$file."/".date('Ymd',time())."/";
            // echo $NewFile;die;
            if(!file_exists($NewFile))
            {
                //检查是否有该文件夹，如果没有就创建，并给予最高权限
                mkdir($NewFile);
                chmod($NewFile,0777);
            }

            $new_file = $NewFile.basename($url);

            @rename(substr($url,1),$new_file); //移动到新目录  第一个参数为临时文件  第二个参数为新文件
            // @unlink($url); //删除旧目录下的文件
            return ['code' => 1, 'data' => "/".$new_file, 'msg' => 'Move File Success'];
        }catch( PDOException $e){
            return ['code' => -1, 'data' => '', 'msg' => $e->getMessage()];
        }
    }

    /**
		 * [SourceStatistics]  [查询项目来源地址]
		 * @return [type] [description]
		 * @author [qinlh] [WeChat QinLinHui0706]
		 */
		public function SourceStatistics($project_id,$source)
		{
			$data = DB::name("source_config")->where("project_id",$project_id)->find();
			$SourceData = explode("\n",$data['source_config']);
			$source_name = "未选择";
			foreach ($SourceData as $key => $val)
			{
					$num = explode(":",$val);
					// print_r($num);
					if(in_array($source,$num))
					{
							$source_name = $num[1];
					}
			}
			return $source_name;
		}
}
