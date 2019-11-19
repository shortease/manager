<?php
defined( '_SHM_ENABLED_' ) or die( 'Restricted access' );


/**
 * 
 */
class Group extends ErateGroup
{
	const 	ROOT_GROUP		= 1, 
			MANAGER_GROUP 	= 2, 
			REPORTS_GROUP 	= 4, 
			USERS_GROIUP 	= 8; 
}
