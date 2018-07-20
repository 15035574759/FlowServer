<?php
/**
 * 极客之家 高端PHP - Excel导出数据 Model
 * @copyright  Copyright (c) 2016 QIN TEAM (http://www.qlh.com)
 * @license    GUN  General Public License 2.0
 * @version    Id:  Type_model.php 2016-6-12 16:36:52
 */

namespace app\admin\model;
use think\Db;
use think\Model;
class ExcelModel extends Model
{
	protected $name = 'table';

	/**
	 * 查询宝沃表数据
	 * @param  [type] $table 表名
	 * @return [type]       array
	 */
	public function user_baowo($table)
	{
		$lists = DB::name($table)->order("dealer_id asc")->select();
		foreach ($lists as $kk => $vv) {
        	$lists[$kk]['time'] = date("Y-m-d H:i:s",$vv['time']);
            //查询用户获得的奖品
            $lotterArray = DB::name("user_baowo")->alias("b")->join("flow_lotuser l","l.userid=b.dealer_id")->field("b.dealer_id,l.lotid,l.userid")->where("b.dealer_id",$vv['dealer_id'])->select();
            $lists[$kk]['lotter'] = 0;
            foreach ($lotterArray as $k => $v) {
                $res = DB::name("lottery")->where("id",$v['lotid'])->field("name,id")->select();
                foreach ($res as $kkk => $vvv) {
                    $lists[$kk]['lotter'] = $vvv['name'];
                }
            }
        }
        return $lists;
	}


	/**
	 * 查询东标表数据
	 * @param  [type] $table 表名
	 * @return [type]       array
	 */
	public function user_dongbiao($table,$lottery_table,$lotuser_table)
	{
		$lists = DB::name($table)->order("user_id asc")->select();
		//查询经销商
        foreach ($lists as $key => $val) {
            $array = Db::name("dealer_dongbiao")->where("dealer_id",'in',$val['dealer_name'])->select();
            $arr = array();
            foreach ($array as $kk => $vv) {
                $arr[] = $vv['dealer_name'];
            }
            $string = join(",",$arr);
            $lists[$key]['dealer'] = $string;
    		$lists[$key]['time'] = date("Y-m-d",$val['time']);

            //查询用户获得的奖品
            $lotterArray = DB::name($table)->alias("d")->join("flow_".$lotuser_table." l","l.userid=d.user_id")->field("d.user_id,l.lotid,l.userid")->where("d.user_id",$val['user_id'])->select();
            $lists[$key]['lotter'] = "未抽奖";
            foreach ($lotterArray as $k => $v) {
                $res = DB::name($lottery_table)->where("id",$v['lotid'])->field("name,id")->select();
                foreach ($res as $kkk => $vvv) {
                    $lists[$key]['lotter'] = $vvv['name'];
                }
            }

			//查询车型
			$ModelCar = DB::name("car_series")->where("car_id",$val['models'])->field("car_id,car_name")->find();
			$lists[$key]['models'] = $ModelCar['car_name'];
		}
        // print_r($lists);die;
        return $lists;
	}

     /**
      * 根据名称检测zt_dealer_list 经销商 表是否存在此信息，存在返回id，不存在返回null
      * @param [type] $name [description]
      */
    public function ExistDealer($name,$table="")
    {
				$where['dealer_name'] = $name;
				$where['start'] = 0;
        return DB::connect("db_flowuser")->name($table)->field("dealer_id")->where($where)->find();
    }

    /**
     * 批量插入经销商信息
     * @param [type] $info [description]
     */
    public function InsertDealerInfodb($info,$table="")
    {
        $data = [
            'dealer_name' => $info['dlname'],
            'pid' => $info['pid'],
            'pro_id' => $info['pro_id'],
            ];
        return DB::connect("db_flowuser")->name($table)->insertGetId($data);
    }

    /**
     * 批量插入经销商信息 【通用】
     * @param [type] $info [description]
     */
    public function DealerAddInstall($info,$table="")
    {
        $data = [
            'dealer_name' => $info['dlname'],
            'pid' => $info['pid'],
            'code' => isset($info['code']) ? $info['code'] : '',
						'start' => 0,
            ];
        return DB::connect("db_flowuser")->name($table)->insertGetId($data);
    }

		/**
     * 导出数据列表方法
     * @param  [type]  $header [description]
     * @param  [type]  $data   [description]
     * @param  boolean $name   [description]
     * @param  integer $type   [description]
     * @return [type]          [description]
     */
    static function writer($header, $data,$name=false,$type = 0) {
        //导出
        $result = import("PHPExcel",EXTEND_PATH.'PHPExcel');
        if(!$name){$name=date("Y-m-d-H-i-s",time());}
        $objPHPExcel = new \PHPExcel();
        $objProps = $objPHPExcel->getProperties();
        //设置表头
        $key = ord("A");
        foreach($header as $v){
            $colum = chr($key);
            $objPHPExcel->getActiveSheet()->getColumnDimension($colum)->setWidth(15);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue($colum.'1', $v);
            $key += 1;
        }
        $column = 2;
        $objActSheet = $objPHPExcel->getActiveSheet();
        $objActSheet->getRowDimension(1)->setRowHeight(20);
        foreach($data as $key => $rows){ //行写入
            $span = ord("A");
            foreach($rows as $keyName=>$value) {// 列写入
                $j = chr($span);
                $objActSheet->getRowDimension($column)->setRowHeight(20);
                $objActSheet->setCellValue($j.$column, $value);
                $span++;
            }
            $column++;
        }
        $objPHPExcel->getActiveSheet()->setTitle('chen.data');
        $objPHPExcel->setActiveSheetIndex(0);
        $fileName = iconv("utf-8", "gb2312", './Data/excel/'.date('Y-m-d_', time()).time().'.xls');
        $saveName = iconv("utf-8", "gb2312", $name.'.xls');
        $objWriter = \PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        if ($type == 0) {
            header('Content-Type: application/vnd.ms-excel');
            header("Content-Disposition: attachment;filename=\"$saveName\"");
            header('Cache-Control: max-age=0');
            $objWriter->save('php://output');
        } else {
            $objWriter->save($fileName);
            return $fileName;
        }
				// return true;
    }

		/**
		 * 移动文件到正式目录
		 * @param [type] $file [临时文件路径]
		 * @param [type] $file [临时文件路径]
		 */
		public function MoveFilePublic($NewFile,$url)
		{
				try{
						//新文件地址
						// $NewFile = $file."/";
						// echo $NewFile;die;
						if(!file_exists($NewFile))
						{
								//检查是否有该文件夹，如果没有就创建，并给予最高权限
								mkdir($NewFile);
								chmod($NewFile,0777);
						}

						$new_file = $NewFile.basename($url);
						// echo $new_file;die;
						@rename(substr($url,1),$new_file); //移动到新目录  第一个参数为临时文件  第二个参数为新文件
						// @unlink($url); //删除旧目录下的文件
						return ['code' => 1, 'data' => $new_file, 'msg' => 'Move File Success'];
				}catch( PDOException $e){
						return ['code' => -1, 'data' => '', 'msg' => $e->getMessage()];
				}
		}

		/**
		 * [_getExt] [检测文件是什么格式]
		 * @return [type] [description]
		 * @author [qinlh] [WeChat QinLinHui0706]
		 */
		private static function _getExt($file) {
        return pathinfo($file, PATHINFO_EXTENSION);
    }

		/**
		 * [ExcelLead] [转换为数组格式]
		 * @return [type] [description]
		 * @author [qinlh] [WeChat QinLinHui0706]
		 */
		public function ExcelLead($file='') {
			ini_set('max_execution_time', '0');
			if (self::_getExt($file) == 'xls') {
					$result = import("Excel5",EXTEND_PATH.'PHPExcel/PHPExcel/Reader');
					$PHPReader = new \PHPExcel_Reader_Excel5();
			} elseif (self::_getExt($file) == 'xlsx') {
					$result = import("Excel2007",EXTEND_PATH.'PHPExcel/PHPExcel/Reader');
					$PHPReader = new \PHPExcel_Reader_Excel2007();
			} else {
					return ['code' => 0, 'data' => '', 'msg' => '路径出错'];
			}

			$PHPExcel     = $PHPReader->load($file);
			$currentSheet = $PHPExcel->getSheet(0);
			$allColumn    = $currentSheet->getHighestColumn();
			$allRow       = $currentSheet->getHighestRow();
			$allColumn ='L';
			for($currentRow = 2; $currentRow <= $allRow; $currentRow++)
			{
					for($currentColumn = 'A'; $currentColumn <= $allColumn; $currentColumn ++ )
					{
							$address = $currentColumn.$currentRow;
                            $cell = $currentSheet->getCell($address)->getValue();
                            if(is_object($cell))  $cell= $cell->__toString();
							$arr[$currentRow][$currentColumn] = $cell;
					}
			}
			return $arr;
		}

		/**
		 * [getExcelLead] [导入数据开始处理]
		 * @param [$arr] [A、省份 B、市 C、经销商 D、车型]
		 * @return [type] [description]
		 * @author [qinlh] [WeChat QinLinHui0706]
		 */
		public function getExcelLead($arr,$table) {
			//首先判断当前表是否存在 不存在就创建表
			if(false == @DB::connect("db_flowuser")->query("SHOW TABLES LIKE '%$table%'")) {
				@DB::connect("db_flowuser")->query("
					CREATE TABLE `flow_$table` (
						  `dealer_id` int(11) NOT NULL AUTO_INCREMENT,
						  `dealer_name` varchar(255) DEFAULT NULL COMMENT '经销商名称',
						  `pid` int(11) NOT NULL DEFAULT '0' COMMENT '父 id',
						  `time` int(11) DEFAULT '0' COMMENT '添加时间',
						  `start` int(1) NOT NULL DEFAULT '0' COMMENT '状态',
						  PRIMARY KEY (`dealer_id`)
						) ENGINE=MyISAM AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;
					");
			}
			//先清空数据表
			@DB::connect("db_flowuser")->query('TRUNCATE TABLE flow_'.$table);
			foreach ($arr as $key => $val) {
				//先判断省份是否存在
				$province = $this->ExistDealer($val['A'],$table);
				if(true == $province) {
					//判断城市是否存在
					$city = $this->ExistDealer($val['B'],$table);
					if(true == $city) {
						//检测经销商是否存在
						$dealer_name =  $this->ExistDealer($val['C'],$table);
						if(true == $dealer_name) {
							//检测品牌车型是否存在
							if(isset($val['D']) && $val['D'] !== '') {
								$city_type =  $this->ExistDealer($val['D'],$table);
								if(true == $city_type) {
									//全部导入完毕
									return true;
								} else {
									//在入库品牌车型
									$DealernameData['dlname'] = $val['D']; //品牌车型名称
									$DealernameData['pid'] = $dealer_name['dealer_id']; //经销商id
									$DealernameId = $this->DealerAddInstall($DealernameData,$table);
								}
							}
							// return true;
						} else {
							//在入库经销商
							$DealernameData['dlname'] = $val['C']; //经销商名称
							// $DealernameData['code'] = $val['D']; //经销商编码
							$DealernameData['pid'] = $city['dealer_id']; //父级城市id
							$DealernameId = $this->DealerAddInstall($DealernameData,$table);
							if(isset($val['D']) && $val['D'] !== '') {
								// //在入库品牌车型
								$DealernameData['dlname'] = $val['D']; //品牌车型名称
								$DealernameData['pid'] = $DealernameId; //父级城市id 0
								$DealernameId = $this->DealerAddInstall($DealernameData,$table);
							}
						}
					} else {
						//入库城市
						$DealcityData['dlname'] = $val['B']; //城市名称
						$DealcityData['pid'] = $province['dealer_id']; //父级省份id
						$DealcityId = $this->DealerAddInstall($DealcityData,$table);
						//在入库经销商
						$DealernameData['dlname'] = $val['C']; //经销商名称
						// $DealernameData['code'] = $val['D']; //经销商编码
						$DealernameData['pid'] = $DealcityId; //父级城市id 0
						$DealernameId = $this->DealerAddInstall($DealernameData,$table);
						if(isset($val['D']) && $val['D'] !== '') {
							// //在入库品牌车型
							$DealernameData['dlname'] = $val['D']; //品牌车型名称
							$DealernameData['pid'] = $DealernameId; //父级城市id 0
							$DealernameId = $this->DealerAddInstall($DealernameData,$table);
						}
					}
				} else {
					//入库省份
					$DealprovinceData['dlname'] = $val['A']; //省份名称
					$DealprovinceData['pid'] = 0; //父级id 0
					$dealprovinceId = $this->DealerAddInstall($DealprovinceData,$table);
					//再入库城市
					$DealcityData['dlname'] = $val['B']; //城市名称
					$DealcityData['pid'] = $dealprovinceId; //父级省份id 0
					$DealcityId = $this->DealerAddInstall($DealcityData,$table);
					//在入库经销商
					$DealernameData['dlname'] = $val['C']; //经销商名称
					// $DealernameData['code'] = $val['D']; //经销商编码
					$DealernameData['pid'] = $DealcityId; //父级城市id 0
					$DealernameId = $this->DealerAddInstall($DealernameData,$table);
					if(isset($val['D']) && $val['D'] !== '') {
						// //在入库品牌车型
						$DealernameData['dlname'] = $val['D']; //品牌车型名称
						$DealernameData['pid'] = $DealernameId; //父级城市id 0
						$DealernameId = $this->DealerAddInstall($DealernameData,$table);
					}
				}
			}
			return ['code'=>1,'msg'=>'数据已经全部导入'];
		}


}
