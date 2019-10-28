<?php defined( '_SHM_ENABLED_' ) or die( 'Restricted access' ); 
    
    $site_id = Request::getInt("site_id");
    if (!$site_id)
        $site_id = isset($_SESSION["site_id"]) ? $_SESSION["site_id"] : 0;
    echo ('<script>var site_id = '. $site_id.'</script>');

?>
<!-- begin:: Aside Menu -->
<div class="kt-aside-menu-wrapper kt-grid__item kt-grid__item--fluid" id="kt_aside_menu_wrapper">
    <div id="kt_aside_menu" class="kt-aside-menu " data-ktmenu-vertical="1" data-ktmenu-scroll="1" >
        <ul class="kt-menu__nav">
            <li class="kt-menu__section kt-menu__section--first">
                <h4 class="kt-menu__section-text">
                    Section 1
                </h4>
                <i class="kt-menu__section-icon flaticon-more-v2"></i> 
            </li>   
            <li class="kt-menu__item " aria-haspopup="true" >
                <a href="/" class="kt-menu__link btn disabled">
                    <i class="kt-menu__link-bullet kt-menu__link-bullet--dot"><span></span></i>
                    <span class="kt-menu__link-text"><?php et("Dashboard")?></span>
                </a>
            </li>


           <?php 
                if (Factory::getUser()->isroot()) require_once("_root_menu.inc"); 
                else require_once("_client_menu.inc");
            ?>
            <li class="kt-menu__item " aria-haspopup="true" >
                <a href="/?com=channels" class="kt-menu__link btn  client_req">
                    <i class="kt-menu__link-bullet kt-menu__link-bullet--dot"><span></span></i>
                    <span class="kt-menu__link-text"><?php et("Channels")?></span>
                </a>
            </li>
            <li class="kt-menu__section kt-menu__section--first">
                <h4 class="kt-menu__section-text">
                    Reports
                </h4>
                <i class="kt-menu__section-icon flaticon-more-v2"></i> 
            </li>              
            <li class="kt-menu__item " aria-haspopup="true" >
                <a href="/?com=reports&action=channels" class="kt-menu__link btn client_req">
                    <i class="kt-menu__link-bullet kt-menu__link-bullet--dot"><span></span></i>
                    <span class="kt-menu__link-text"><?php et("Channels report")?></span>
                </a>
            </li>            
        </ul>
<!--         <ul class="kt-menu__nav ">
    <li class="kt-menu__section kt-menu__section--first">
        <h4 class="kt-menu__section-text">
            Departments
        </h4>
        <i class="kt-menu__section-icon flaticon-more-v2"></i> 
    </li>
    <li class="kt-menu__item kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover">
        <a href="javascript:;" class="kt-menu__link kt-menu__toggle">
            <i class="kt-menu__link-bullet kt-menu__link-bullet--dot"><span></span></i>
            <span class="kt-menu__link-text">Resources</span><i class="kt-menu__ver-arrow la la-angle-right"></i>
        </a>
        <div class="kt-menu__submenu ">
            <span class="kt-menu__arrow"></span>
            <ul class="kt-menu__subnav">
                <li class="kt-menu__item kt-menu__item--parent" aria-haspopup="true" >
                    <span class="kt-menu__link"><span class="kt-menu__link-text">Resources</span></span>
                </li>
                <li class="kt-menu__item " aria-haspopup="true" >
                    <a href="#" class="kt-menu__link ">
                        <i class="kt-menu__link-bullet kt-menu__link-bullet--dot"><span></span></i>
                        <span class="kt-menu__link-text">Layout inner</span>
                    </a>
                </li>
                <li class="kt-menu__item " aria-haspopup="true" >
                    <a href="#" class="kt-menu__link ">
                        <i class="kt-menu__link-bullet kt-menu__link-bullet--dot"><span></span></i>
                        <span class="kt-menu__link-text">Timesheet</span>
                    </a>
                </li>
                <li class="kt-menu__item " aria-haspopup="true" >
                    <a href="#" class="kt-menu__link ">
                        <i class="kt-menu__link-bullet kt-menu__link-bullet--dot"><span></span></i>
                        <span class="kt-menu__link-text">Payroll</span>
                    </a>
                </li>
                <li class="kt-menu__item " aria-haspopup="true" >
                    <a href="#" class="kt-menu__link ">
                        <i class="kt-menu__link-bullet kt-menu__link-bullet--dot"><span></span></i>
                        <span class="kt-menu__link-text">Contacts</span>
                    </a>
                </li>
            </ul>
        </div>
    </li>
    <li class="kt-menu__item " aria-haspopup="true" >
        <a href="#" class="kt-menu__link ">
            <i class="kt-menu__link-bullet kt-menu__link-bullet--dot"><span></span></i>
            <span class="kt-menu__link-text">Finance</span>
        </a>
    </li>
    <li class="kt-menu__item kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover">
        <a href="javascript:;" class="kt-menu__link kt-menu__toggle">
            <i class="kt-menu__link-bullet kt-menu__link-bullet--dot"><span></span></i>
            <span class="kt-menu__link-text">Support</span>
            <span class="kt-menu__link-badge"><span class="kt-badge kt-badge--danger">23</span></span>
            <i class="kt-menu__ver-arrow la la-angle-right"></i>
        </a>
        <div class="kt-menu__submenu ">
            <span class="kt-menu__arrow"></span>
            <ul class="kt-menu__subnav">
                <li class="kt-menu__item kt-menu__item--parent" aria-haspopup="true" >
                    <span class="kt-menu__link">
                        <span class="kt-menu__link-text">Support</span>
                        <span class="kt-menu__link-badge"><span class="kt-badge kt-badge--danger">23</span></span>
                    </span>
                </li>
                <li class="kt-menu__item " aria-haspopup="true" data-ktmenu-link-redirect="1">
                    <a href="?page=inner" class="kt-menu__link ">
                        <i class="kt-menu__link-bullet kt-menu__link-bullet--dot"><span></span></i>
                        <span class="kt-menu__link-text">Reports</span>
                    </a>
                </li>
                <li class="kt-menu__item kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover">
                    <a href="javascript:;" class="kt-menu__link kt-menu__toggle">
                        <i class="kt-menu__link-bullet kt-menu__link-bullet--dot"><span></span></i>
                        <span class="kt-menu__link-text">Cases</span><i class="kt-menu__ver-arrow la la-angle-right"></i>
                    </a>
                    <div class="kt-menu__submenu ">
                        <span class="kt-menu__arrow"></span>
                        <ul class="kt-menu__subnav">
                            <li class="kt-menu__item " aria-haspopup="true" >
                                <a href="?page=inner" class="kt-menu__link ">
                                    <i class="kt-menu__link-bullet kt-menu__link-bullet--line"><span></span></i>
                                    <span class="kt-menu__link-text">Pending</span>
                                    <span class="kt-menu__link-badge"><span class="kt-badge kt-badge--warning">10</span></span>
                                </a>
                            </li>
                            <li class="kt-menu__item " aria-haspopup="true" >
                                <a href="?page=inner" class="kt-menu__link ">
                                    <i class="kt-menu__link-bullet kt-menu__link-bullet--line"><span></span></i>
                                    <span class="kt-menu__link-text">Urgent</span>
                                    <span class="kt-menu__link-badge"><span class="kt-badge kt-badge--danger">6</span></span>
                                </a>
                            </li>
                            <li class="kt-menu__item " aria-haspopup="true" >
                                <a href="?page=inner" class="kt-menu__link ">
                                    <i class="kt-menu__link-bullet kt-menu__link-bullet--line"><span></span></i>
                                    <span class="kt-menu__link-text">Done</span>
                                    <span class="kt-menu__link-badge"><span class="kt-badge kt-badge--success">2</span></span>
                                </a>
                            </li>
                            <li class="kt-menu__item " aria-haspopup="true" >
                                <a href="?page=inner" class="kt-menu__link ">
                                    <i class="kt-menu__link-bullet kt-menu__link-bullet--line"><span></span></i>
                                    <span class="kt-menu__link-text">Archive</span>
                                    <span class="kt-menu__link-badge"><span class="kt-badge kt-badge--info kt-badge--wide">245</span></span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </li>
                <li class="kt-menu__item " aria-haspopup="true" >
                    <a href="?page=inner" class="kt-menu__link ">
                        <i class="kt-menu__link-bullet kt-menu__link-bullet--dot"><span></span></i>
                        <span class="kt-menu__link-text">Clients</span>
                    </a>
                </li>
                <li class="kt-menu__item " aria-haspopup="true" >
                    <a href="?page=inner" class="kt-menu__link ">
                        <i class="kt-menu__link-bullet kt-menu__link-bullet--dot"><span></span></i>
                        <span class="kt-menu__link-text">Audit</span>
                    </a>
                </li>
            </ul>
        </div>
    </li>
    <li class="kt-menu__item " aria-haspopup="true" >
        <a href="#" class="kt-menu__link ">
            <i class="kt-menu__link-bullet kt-menu__link-bullet--dot"><span></span></i>
            <span class="kt-menu__link-text">Administration</span>
        </a>
    </li>
    <li class="kt-menu__item " aria-haspopup="true" >
        <a href="#" class="kt-menu__link ">
            <i class="kt-menu__link-bullet kt-menu__link-bullet--dot"><span></span></i>
            <span class="kt-menu__link-text">Management</span>
        </a>
    </li>
    <li class="kt-menu__section ">
        <h4 class="kt-menu__section-text">
            Reports
        </h4>
        <i class="kt-menu__section-icon flaticon-more-v2"></i> 
    </li>
    <li class="kt-menu__item " aria-haspopup="true" >
        <a href="#" class="kt-menu__link ">
            <i class="kt-menu__link-bullet kt-menu__link-bullet--dot"><span></span></i>
            <span class="kt-menu__link-text">Accounting</span>
        </a>
    </li>
    <li class="kt-menu__item " aria-haspopup="true" >
        <a href="#" class="kt-menu__link ">
            <i class="kt-menu__link-bullet kt-menu__link-bullet--dot"><span></span></i>
            <span class="kt-menu__link-text">Products</span>
        </a>
    </li>
    <li class="kt-menu__item " aria-haspopup="true" >
        <a href="#" class="kt-menu__link ">
            <i class="kt-menu__link-bullet kt-menu__link-bullet--dot"><span></span></i>
            <span class="kt-menu__link-text">Sales</span>
        </a>
    </li>
    <li class="kt-menu__item " aria-haspopup="true" data-ktmenu-link-redirect="1">
        <a href="#" class="kt-menu__link ">
            <i class="kt-menu__link-bullet kt-menu__link-bullet--dot"><span></span></i>
            <span class="kt-menu__link-text">IPO</span>
        </a>
    </li>
</ul> -->
    </div>
</div>
<!-- end:: Aside Menu -->

<script>

if (!site_id) {
    $('.client_req').addClass('disabled');
}
</script>