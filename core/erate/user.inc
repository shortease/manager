<?php
defined( '_SHM_ENABLED_' ) or die( 'Restricted access' );


/**
 * 
 */
class User extends ErateUser
{

	public function __construct($id){
		parent::__construct();
		$this->setId($id);
		$this->syncFromDb();
	}

	public function update($email, $passwd, $group, $fullname, $disabled=0){
		// check
		if(!preg_match(EMAIL_FORMAT, $email)) return ErateUser::WRONG_FORMAT_EMAIL;
		if (strlen($passwd) > 0)
			if(!preg_match(PASSWORD_FORMAT, $passwd)) return ErateUser::WRONG_FORMAT_PASSWORD;
		if($this->checkEmailExists($email)) return ErateUser::EMAIL_EXISTS;
		if(!Factory::getUser()->canSetGroup($group)) return ErateUser::CANT_ASSIGN_GROUP;
		
		$this->setEmail($email);
		if (strlen($passwd) > 0)
			$this->setPass($passwd);
		$this->setGroup($group);
		$this->setDisabled($disabled);
		$this->setFullName($fullname);
		$res = $this->syncToDb();
		return $res;
	}

	public function checkEmailExists($email){
		$user_id = $this->getId();
		$email_user_id = ErateUser::getUserIdByMail($email);
		return $email_user_id > 0 && $user_id != $email_user_id;
	}

	public function disable($disabled = 1){
		$disabled = $disabled ? 1 : 0;
		$this->setDisabled($disabled);
		$this->syncToDb();	
	}
}