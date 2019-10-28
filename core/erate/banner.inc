<?php
defined( '_SHM_ENABLED_' ) or die( 'Restricted access' );


/**
 * 
 */
class Banner extends ErateBanner
{

	public function updateArticle($article_data, $title)
	{
		$query = "update tools set tool_script = '".$article_data."', name = '".$title."', last_crawled = now() where id = ".$this->get('id');
		Factory::getDB()->execute($query);		
	}


	public function setTrackedTime()
	{
		$query = "update tools set last_crawled = now() where id = ".$this->get('id');
		Factory::getDB()->execute($query);
	}

	public function checkToken($token)
	{
		return (($this->get('token') == $token) && (strtotime(date("Y-m-d H:i:s")) - strtotime($this->get('token_date')) < 30));
	}
}