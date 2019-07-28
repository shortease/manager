<?php
defined( '_SHM_ENABLED_' ) or die( 'Restricted access' );

$site_id = Request::getInt("site_id");

echo ("<script>var site_id = $site_id</script>");

?>


<link rel="stylesheet" type="text/css" href="/assets/vendors/custom/datatables/datatables.bundle.css">
<script src="/assets/vendors/custom/datatables/datatables.bundle.js"></script>

<div class="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor">
	<!-- begin:: Subheader -->
	<div class="kt-subheader   kt-grid__item" id="kt_subheader">
		<div class="kt-subheader__main">
			<h3 class="kt-subheader__title"><?php et("Coupons"); ?></h3>
		</div>
	</div>
	<!-- begin:: Content -->
	<div class="kt-content  kt-grid__item kt-grid__item--fluid" id="kt_content">
		<div class="kt-portlet kt-portlet--mobile">
			<div class="kt-portlet__head kt-portlet__head--lg">
				<div class="kt-portlet__head-label">
					<span class="kt-portlet__head-icon">
						<i class="kt-font-brand flaticon-price-tag"></i>
					</span>
					<h3 class="kt-portlet__head-title">
						<?php et("List coupons for : "); ?>
					</h3>
				</div>
			</div>
			<div class="kt-portlet__body">

				<div class="dropdown dropdown-inline">
					<button type="button" class="btn btn-brand btn-icon-sm " id="btn_add_coupon" >
						<i class="flaticon2-plus"></i> <?php et("New coupon"); ?>
					</button>
				</div>
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
							</div>
						</div>
					</div>
				</div>

				<!--end: Search Form -->
						<!--begin: Datatable -->
		<table id="coupons_dt" class="table table-striped- table-bordered table-hover table-checkable">
			<thead>
				<th class="kt-align-center"></th>
				<th><?php et("Coupon name");?></th>
				<th><?php et("Code");?></th>
				<th><?php et("Weight");?></th>
				<th class=""><?php et("Channels");?></th>
			</thead>
			<tbody>
			</tbody>	
		</table>
		<!--end: Datatable -->

	</div>
</div>

<!-- Edit dialog -->
<div class="modal fade" id="add_modal" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="updateTitle"></h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
				</button>
			</div>
			<div class="modal-body">
				<div class="alert alert-outline-danger" role="alert" id="general_update_alert">
                    <div class="alert-icon"><i class="flaticon-questions-circular-button"></i></div>
                    <div class="alert-text"></div>
                    <div class="alert-close">
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true"><i class="la la-close"></i></span>
                        </button>
                    </div>
                </div>
				<form class="kt-form" id="update_form">
					<div class="kt-portlet__body">
						<div class="form-group">
							<label for="upd_name"><?php et('Coupon name')?></label>
							<input type="text" class="form-control" placeholder="<?php et('Enter coupon name')?>" id="upd_name" name="upd_name" />
							<span class="form-text alert-danger " id="name_error"></span>
						</div>						
						<div class="form-group">
							<label for="upd_channel_url"><?php et('Coupon code')?></label>
							<input type="text" class="form-control" placeholder="<?php et('Enter coupon code')?>" id="upd_coupon_code" name="upd_coupon_code" />
						</div>						
						<div class="form-group">
							<label for="upd_channel_url"><?php et('Coupon weight')?></label>
							<input type="hidden" name="weight_inp" id="weight_inp" value="1">
							<div id="weight_slider"></div>
						</div>						
					</div>
				</form>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-dismiss="modal"><?php et('Close')?></button>
				<button type="button" class="btn btn-primary" id="save_btn"><?php et('Save changes')?></button>
			</div>
		</div>
	</div>
</div>



<!-- Delete dialog -->
<div class="modal fade" id="delete_modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="updateTitle"><?php et('Delete coupon')?> <span class="del_name"></span></h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
				</button>
			</div>
			<div class="modal-body kt-font-danger">
				<?php et('This will delete coupon from all channels !')?>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-primary" data-dismiss="modal"><?php et('Close')?></button>
				<button type="button" class="btn btn-danger" id="modal_delete_btn"><?php et('Delete coupon')?> !!!</button>
			</div>
		</div>
	</div>
</div>



<?php load_style("/components/coupons/assets/coupons.css"); ?>
<?php load_script("/components/coupons/assets/coupons.js"); ?>

<?php load_style("/assets/custom/css/nouislider.css"); ?>
<?php load_script("/assets/custom/js/nouislider.js"); ?>
