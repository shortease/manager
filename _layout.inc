<!-- begin:: Page -->
<?php include("layout/_header-base-mobile.inc"); ?>
<div class="kt-grid kt-grid--hor kt-grid--root">
    <div class="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--ver kt-page">
        <?php include("layout/_aside-base.inc"); ?>
        <div class="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor kt-wrapper" id="kt_wrapper">
            <?php include("layout/_header-base.inc"); ?>
            <div class="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor">
                <!-- begin:: Content -->
                <?php   Route::includeComponent(); ?>
                <!-- end:: Content -->
            </div>
            <?php include("layout/_footer-base.inc"); ?>
        </div>
    </div>
</div>
<!-- end:: Page -->
<?php include("layout/_layout-quick-panel.inc"); ?>
<?php include("layout/_layout-scrolltop.inc"); ?>
<?php include("layout/_layout-demo-panel.inc"); ?>