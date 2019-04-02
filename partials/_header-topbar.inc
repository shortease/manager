<?php defined( '_SHM_ENABLED_' ) or die( 'Restricted access' ); ?>
<!-- begin:: Header Topbar -->
<div class="kt-header__topbar">
    <!--begin: Search -->
    <div class="kt-header__topbar-item kt-header__topbar-item--search dropdown" id="kt_quick_search_toggle">
        <div class="kt-header__topbar-wrapper" data-toggle="dropdown" data-offset="10px,0px">
            <span class="kt-header__topbar-icon" ><i class="flaticon2-search-1"></i></span>
        </div>
        <div class="dropdown-menu dropdown-menu-fit dropdown-menu-right dropdown-menu-top-unround dropdown-menu-anim dropdown-menu-lg">
            <?php include("partials/_dropdown-search-inline.inc"); ?>
        </div>
    </div>
    <!--end: Search -->
    <!--begin: Notifications -->
    <div class="kt-header__topbar-item dropdown">
        <div class="kt-header__topbar-wrapper" data-toggle="dropdown" data-offset="10px,0px" aria-expanded="true">
            <span class="kt-header__topbar-icon"><i class="flaticon2-bell-alarm-symbol"></i></span>
            <span class="kt-hidden kt-badge kt-badge--dot kt-badge--notify kt-badge--sm"></span> 
        </div>
        <div class="dropdown-menu dropdown-menu-fit dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround dropdown-menu-lg">
            <form>
                <?php include("partials/_dropdown-notifications.inc"); ?>
            </form>
        </div>
    </div>
    <!--end: Notifications -->
    <!--begin: Quick Actions -->
    <div class="kt-header__topbar-item dropdown">
        <div class="kt-header__topbar-wrapper" data-toggle="dropdown" data-offset="10px,0px" aria-expanded="true">
            <span class="kt-header__topbar-icon"><i class="flaticon2-gear"></i></span>
        </div>
        <div class="dropdown-menu dropdown-menu-fit dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround dropdown-menu-xl">
            <form>
                <?php include("partials/_dropdown-quick-actions.inc"); ?>
            </form>
        </div>
    </div>
    <!--end: Quick Actions -->
    <!--begin: Cart -->
    <div class="kt-header__topbar-item dropdown">
        <div class="kt-header__topbar-wrapper" data-toggle="dropdown" data-offset="10px,0px">
            <span class="kt-header__topbar-icon"><i class="flaticon2-shopping-cart-1"></i></span>
        </div>
        <div class="dropdown-menu dropdown-menu-fit dropdown-menu-right dropdown-menu-anim dropdown-menu-xl">
            <form>
                <?php include("partials/_dropdown-my-cart.inc"); ?>
            </form>
        </div>
    </div>
    <!--end: Cart-->
    <!--begin: Quick panel -->
    <div class="kt-header__topbar-item kt-header__topbar-item--quick-panel" data-toggle="kt-tooltip" title="Quick panel" data-placement="right">
        <span class="kt-header__topbar-icon" id="kt_quick_panel_toggler_btn"><i class="flaticon2-cube-1"></i></span>
    </div>
    <!--end: Quick panel -->
    <!--begin: Language bar -->
    <div class="kt-header__topbar-item kt-header__topbar-item--langs">
        <div class="kt-header__topbar-wrapper" data-toggle="dropdown" data-offset="10px,0px">
            <span class="kt-header__topbar-icon">
                <img class="" src="./assets/media/flags/012-uk.svg" alt="" />
            </span>
        </div>
        <div class="dropdown-menu dropdown-menu-fit dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround">
            <?php include("partials/_dropdown-languages.inc"); ?>
        </div>
    </div>
    <!--end: Language bar -->
    <!--begin: User Bar -->
    <div class="kt-header__topbar-item kt-header__topbar-item--user">
        <div class="kt-header__topbar-wrapper" data-toggle="dropdown" data-offset="10px,0px">
            <div class="kt-header__topbar-user">
                <span class="kt-hidden kt-header__topbar-welcome kt-hidden-mobile">Hi,</span> <span class="kt-hidden kt-header__topbar-username kt-hidden-mobile">Sean</span> 
                <img alt="Pic" class="kt-radius-100" src="./assets/media/users/300_25.jpg" />
                <!--use below badge element instead the user avatar to display username's first letter(remove kt-hidden class to display it) -->
                <span class="kt-badge kt-badge--username kt-badge--unified-success kt-badge--lg kt-badge--rounded kt-badge--bold kt-hidden">S</span> 
            </div>
        </div>
        <div class="dropdown-menu dropdown-menu-fit dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround dropdown-menu-xl">
            <?php include("partials/_dropdown-user.inc"); ?>
        </div>
    </div>
    <!--end: User Bar -->
</div>
<!-- end:: Header Topbar -->