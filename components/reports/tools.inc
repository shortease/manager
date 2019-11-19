<?php
defined( '_SHM_ENABLED_' ) or die( 'Restricted access' );


$channel_id = Request::getInt("channel_id");;
?>
<link rel="stylesheet" type="text/css" href="/assets/vendors/custom/datatables/datatables.bundle.css">
<script src="/assets/vendors/custom/datatables/datatables.bundle.js"></script>
<script>var channel_id = <?php echo($channel_id);?></script>;

<div class="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor">
	<!-- begin:: Subheader -->
	<div class="kt-subheader   kt-grid__item" id="kt_subheader">
		<div class="kt-subheader__main">
			<h3 class="kt-subheader__title"><?php et("Reports"); ?></h3>
		</div>
	</div>
	<!-- begin:: Content -->
	<div class="kt-content  kt-grid__item kt-grid__item--fluid" id="kt_content">
		<div class="kt-portlet kt-portlet--mobile">
			<div class="kt-portlet__head kt-portlet__head--lg">
				<div class="kt-portlet__head-label">
					<span class="kt-portlet__head-icon">
						<i class="kt-font-brand flaticon2-line-chart"></i>
					</span>
					<h3 class="kt-portlet__head-title">
						<?php 
							et("Products report"); 
						?>
					</h3>
				</div>
				<div class="kt-portlet__head-toolbar">
					<div class="kt-portlet__head-wrapper">

						<div class="dropdown dropdown-inline">
							<button type="button" class="btn btn-brand btn-icon-sm " id="btn_create_user" >
								<i class="flaticon2-plus"></i> <?php et("CHANNELS"); ?>
							</button>
						</div>
					</div>
				</div>
			</div>
			<div class="kt-portlet__body">

				<!--begin: Search Form -->
				<div class="kt-form kt-form--label-right kt-margin-t-20 kt-margin-b-10">
					<div class="row align-items-center">
						<div class="col-xl-8 order-2 order-xl-1">
							<div class="row align-items-center">
								<div class="col-md-4 kt-margin-b-20-tablet-and-mobile">
									<div class="kt-input-icon kt-input-icon--left">
										<input type="text" class="form-control" placeholder="<?php et("Search..."); ?>" id="generalSearch">
										<span class="kt-input-icon__icon kt-input-icon__icon--left">
											<span><i class="la la-search"></i></span>
										</span>
									</div>
								</div>
								<div class="col-md-4 kt-margin-b-20-tablet-and-mobile">
									<div class="kt-form__group kt-form__group--inline">
										<div class="kt-form__label">
											<label><?php et("Status"); ?>:</label>
										</div>
										<div class="kt-form__control">
											<select class="form-control bootstrap-select" id="dates_name_select">
												<option value="all" selected><?php et("All dates"); ?></option>
												<option value="today"><?php et("Today"); ?></option>
												<option value="yesterday"><?php et("Yesterday"); ?></option>
												<option value="cur_week"><?php et("Current week"); ?></option>
												<option value="cur_month"><?php et("Current month"); ?></option>
												<option value="prev_month"><?php et("Previous month"); ?></option>
											</select> 
										</div> 
									</div>
								</div>
								<div class="col-md-3 kt-margin-b-20-tablet-and-mobile">
									<input type="text" class="form-control" name="daterange" id="daterange" value="" />
								</div>

							</div>
						</div>
					</div>
				</div>
				<!--end: Search Form -->	
				<table id="reportdt" class="table table-striped- table-bordered table-hover table-checkable">
					<thead>
						<th><?php et("Product name");?></th>
						<th><?php et("Interest rate");?></th>
						<th><?php et("Widget loaded");?></th>
						<th><?php et("Widget opened");?></th>
						<th><?php et("Purchase clicked");?></th>
						<th><?php et("Pause time (min)");?></th>
						<th><?php et("View time (min)");?></th>
						<th><?php et("Quick swipe");?></th>
						<th><?php et("Description clicked");?></th>
						<th><?php et("Products viewed");?></th>
						<th><?php et("Coupons clicked");?></th>
					</thead>
					<tbody>
					</tbody>	
				</table>
				<!--end: Datatable -->
			</div>
		</div>
	</div>

</div>

<!-- <?php load_style("/components/clients/assets/clients.css"); ?> -->
<?php load_script("/components/reports/assets/tools.js"); ?>
<script type="text/javascript">
	$('.reports_item').addClass('kt-menu__item--active')
</script>