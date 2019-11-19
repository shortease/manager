<?php defined( '_SHM_ENABLED_' ) or die( 'Restricted access' ); ?>
<!-- begin: Header Menu -->
<button class="kt-header-menu-wrapper-close" id="kt_header_menu_mobile_close_btn"><i class="la la-close"></i></button>
<div class="kt-header-menu-wrapper" id="kt_header_menu_wrapper">
    <div id="kt_header_menu" class="kt-header-menu kt-header-menu-mobile kt-header-menu--layout-default " >
        <ul class="kt-menu__nav ">
            <li class="kt-menu__item kt-menu__item--active " aria-haspopup="true">
                <a href="?page=index" class="kt-menu__link "><span class="kt-menu__link-text"><?php et("Manager")?></span></a>
            </li>
            <?php if (Factory::getUser()->canEditUsers()) {?>
            <li class="kt-menu__item users_item" aria-haspopup="true">
                <a href="?com=users" class="kt-menu__link "><span class="kt-menu__link-text"><?php et("Users")?></span></a>
            </li>
            <?php } ?>
        </ul>
    </div>
</div>
<!-- end: Header Menu -->