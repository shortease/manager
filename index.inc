<?php
defined( '_SHM_ENABLED_' ) or die( 'Restricted access' );
?>
<!DOCTYPE html>
<html lang="en" >
    <!-- begin::Head -->
    <head>
        <meta charset="utf-8"/>
        <title>Metronic | Dashboard</title>
        <meta name="description" content="Latest updates and statistic charts">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <!--begin::Fonts -->
        <script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.16/webfont.js"></script>
        <script>            WebFont.load({
                google: {
					"families":[
					"Poppins:300,400,500,600,700",
					"Roboto:300,400,500,600,700"]},
                active: function() {
                    sessionStorage.fonts = true;                }            });        </script>
        <!--end::Fonts -->
        <!--begin::Page Vendors Styles(used by this page) -->
        <link href="./assets/vendors/custom/fullcalendar/fullcalendar.bundle.css" rel="stylesheet" type="text/css" />
        <!--end::Page Vendors Styles -->
        <!--begin::Global Theme Styles(used by all pages) -->
        <link href="./assets/vendors/base/vendors.bundle.css" rel="stylesheet" type="text/css" />
        <link href="./assets/demo/demo12/base/style.bundle.css" rel="stylesheet" type="text/css" />
        <!--end::Global Theme Styles -->
        <!--begin::Layout Skins(used by all pages) -->
        <!--end::Layout Skins -->
        <link rel="shortcut icon" href="./assets/media/logos/favicon.ico" />

    </head>
    <!-- end::Head -->
    <!-- begin::Body -->
    <body class="kt-header--fixed kt-header-mobile--fixed kt-subheader--light kt-aside--enabled kt-aside--fixed kt-page--loading" >
        <?php include("_layout.inc"); ?>
        <!-- begin::Global Config(global config for global JS sciprts) -->
        <script>            var KTAppOptions = {
"colors":{
"state":{
"brand":"#2c77f4",
"light":"#ffffff",
"dark":"#282a3c",
"primary":"#5867dd",
"success":"#34bfa3",
"info":"#36a3f7",
"warning":"#ffb822",
"danger":"#fd3995"},
"base":{
"label":[
"#c5cbe3",
"#a1a8c3",
"#3d4465",
"#3e4466"],
"shape":[
"#f0f3ff",
"#d9dffa",
"#afb4d4",
"#646c9a"]}}};        </script>
        <!-- end::Global Config -->
        <!--begin::Global Theme Bundle(used by all pages) -->
        <script src="./assets/vendors/base/vendors.bundle.js" type="text/javascript"></script>
        <script src="./assets/demo/demo12/base/scripts.bundle.js" type="text/javascript"></script>
        <!--end::Global Theme Bundle -->
        <!--begin::Page Vendors(used by this page) -->
        <!-- <script src="./assets/vendors/custom/fullcalendar/fullcalendar.bundle.js" type="text/javascript"></script> -->
        <!-- <script src="//maps.google.com/maps/api/js?key=AIzaSyBTGnKT7dt597vo9QgeQ7BFhvSRP4eiMSM" type="text/javascript"></script> -->
        <!-- <script src="./assets/vendors/custom/gmaps/gmaps.js" type="text/javascript"></script> -->
        <!--end::Page Vendors -->
        <!--begin::Page Scripts(used by this page) -->
        <!-- <script src="./assets/app/custom/general/dashboard.js" type="text/javascript"></script> -->
        <!--end::Page Scripts -->
        <!--begin::Global App Bundle(used by all pages) -->
        <script src="./assets/app/bundle/app.bundle.js" type="text/javascript"></script>
        <!--end::Global App Bundle -->
    </body>
    <!-- end::Body -->
</html>