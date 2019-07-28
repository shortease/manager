<?php
defined( '_SHM_ENABLED_' ) or die( 'Restricted access' );

class Coupon {

	private $id, $site_id, $name, $code, $weight;

	public function __construct($id){
		if (!$id) return null;
		$this->id = $id;
		$this->getData();
	}

	private function getData(){
		$query = "select id, site_id, name, code, weight from coupons where id = ".$this->id ;
		$coupon = Factory::getDB()->getAssoc($query);
		$this->name = $coupon['name'];
		$this->site_id = $coupon['site_id'];
		$this->code = $coupon['code'];
		$this->weight = $coupon['weight'];
	}
	public static function add($site_id, $name, $code, $weight)
	{
		$name = Utils::checkSQLParameter($name);
		$code = Utils::checkSQLParameter($code);
		$query = "insert into coupons (site_id, name, code, weight) values (".$site_id.", '".$name."', '".$code."', ".$weight.")";
		Factory::getDB()->execute($query);		
		Channel::setLastUpdate(0,$site_id);
	}

	public static function listCoupons ( $site_id){
		$query = "select id, name, code, weight from coupons where site_id = ".$site_id;
		$query = $query ." ORDER BY name";
		$coupons = Factory::getDB()->getAssocList("id", $query);
		return $coupons;		
	}
	public function delete()
	{
		$query = "delete from coupons where id = ".$this->id;
		Factory::getDB()->execute($query);		
		Channel::setLastUpdate(0,$this->site_id);
	}

}