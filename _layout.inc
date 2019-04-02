<!-- begin:: Page -->
<?php include("partials/_header-base-mobile.inc"); ?>
<div class="kt-grid kt-grid--hor kt-grid--root">
    <div class="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--ver kt-page">
        <?php include("partials/_aside-base.inc"); ?>
        <div class="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor kt-wrapper" id="kt_wrapper">
            <?php include("partials/_header-base.inc"); ?>
            <div class="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor">
                <!-- begin:: Content -->
                <?php   Route::includeComponent(); ?>
                <!-- end:: Content -->
            </div>
            <?php include("partials/_footer-base.inc"); ?>
        </div>
    </div>
</div>
<!-- end:: Page -->
<?php include("partials/_layout-quick-panel.inc"); ?>
<?php include("partials/_layout-scrolltop.inc"); ?>
<?php include("partials/_layout-toolbar.inc"); ?>
<?php include("partials/_layout-demo-panel.inc"); ?>