<?php
defined( '_SHM_ENABLED_' ) or die( 'Restricted access' );

$user = Factory::getUser();
if ($user->isRoot()) {
	$clients_list = Client::getClientsList();
} else {
	$clients_list = array("id"=>$user->getClientId());
}

?>
<link rel="stylesheet" type="text/css" href="/assets/vendors/custom/datatables/datatables.bundle.css">
<script src="/assets/vendors/custom/datatables/datatables.bundle.js"></script>
<script> 
	var man_group = <?php echo($user->getGroup()); ?>;
	var clients = <?php echo(json_encode($clients_list)); ?>;
</script>

<div class="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor">
	<!-- begin:: Subheader -->
	<div class="kt-subheader   kt-grid__item" id="kt_subheader">
		<div class="kt-subheader__main">
			<h3 class="kt-subheader__title"><?php et("Users"); ?></h3>
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
						<?php et("List users"); ?>
					</h3>
				</div>
				<div class="kt-portlet__head-toolbar">
					<div class="kt-portlet__head-wrapper">

						<div class="dropdown dropdown-inline">
							<button type="button" class="btn btn-brand btn-icon-sm " id="btn_create_user" >
								<i class="flaticon2-plus"></i> <?php et("Create user"); ?>
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
							</div>
						</div>
					</div>
				</div>

				<!--end: Search Form -->

				<!--begin: Datatable -->
				<table id="users_dt" class="table table-striped- table-bordered table-hover table-checkable">
					<thead>
						<th class="kt-align-center"><i class="la la-gear edit_user"></i></th>
						<th><?php et("Client name");?></th>
						<th><?php et("User name");?></th>
						<th><?php et("Email");?></th>
						<th><?php et("Groups");?></th>
					</thead>
					<tbody>
					</tbody>	
				</table>
				<!--end: Datatable -->
			</div>
		</div>
	</div>
</div>

<!-- Edit dialog -->
<div class="modal fade" id="add_modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="updateTitle"><?php et('Update user')?></h5>
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
					<input type="hidden" id="upd_user_id" name="upd_user_id" value="0">
					<input type="hidden" id="upd_group" name="upd_group" value="">
					<input type="hidden" id="upd_client_id" name="upd_client_id" value="">
					<div class="kt-portlet__body">
						<div class="form-group" id="client_select_holder">
							<label for="upd_name"><?php et('Client name')?></label>
							<select name="client_select" id="client_select" placeholer="sdsdsd">
							</select>
							<span class="form-text alert-danger " id="client_error"></span>
						</div>	
						<div class="form-group">
							<label for="upd_name"><?php et('User name')?></label>
							<input type="text" class="form-control" placeholder="<?php et('Enter user name')?>" id="upd_name" name="upd_name" />
							<span class="form-text alert-danger " id="name_error"></span>
						</div>	
						<div class="form-group">
							<label for="upd_email"><?php et('User email')?></label>
							<input type="text" class="form-control" placeholder="<?php et('Enter email')?>" id="upd_email" name="upd_email" />
							<span class="form-text alert-danger " id="email_error"></span>
						</div>						
						<div class="form-group">
							<label for="upd_pass"><?php et('Password')?></label>
							<input type="text" class="form-control" placeholder="<?php et('Enter password')?>" id="upd_pass" name="upd_pass" />
							<span class="form-text alert-danger " id="email_error"></span>
						</div>						
						<div class="form-group">
							<label for=""><?php et('Groups')?></label>
							<div class="groups_holder">
								<?php if ($user->isRoot()) { ?>
								<span>
									<label for="upd_group_root"><?php et('Root')?></label> 
									<input type="checkbox" name="upd_group_root" id="upd_group_root" class="group_check" data-groupix="1"/>
								</span>
							<?php } ?>
								<span>
									<label for="upd_group_clients"><?php et('Manager')?></label> 
									<input type="checkbox" name="upd_group_clients" id="upd_group_clients"  class="group_check" data-groupix="2"/>
								</span>
								<span>
								<label for="upd_group_reports"><?php et('Reports')?></label> 
								<input type="checkbox" name="upd_group_reports" id="upd_group_reports"  class="group_check" data-groupix="4"/>
								</span>
								<span>
									<label for="upd_group_users"><?php et('Users')?></label> 
									<input type="checkbox" name="upd_group_users" id="upd_group_users"  class="group_check" data-groupix="8"/>
								</span>
							</div>
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
<div class="modal fade" id="delete_modal" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="updateTitle"><?php et('Delete user')?> <span class="del_user_name"></span></h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
				</button>
			</div>
			<div class="modal-body kt-font-danger">
				<?php et('This will delete user permanently and can not be undone !')?>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
				<button type="button" class="btn btn-danger" id="delete_btn"><?php et('Delete user !!!')?></button>
			</div>
		</div>
	</div>
</div>



<?php load_style("/components/users/assets/users.css"); ?>
<?php load_script("/components/users/assets/users.js"); ?>

<?php load_style("/assets/app/custom/general/selectize/selectize.css"); ?>
<?php load_script("/assets/app/custom/general/selectize/selectize.js"); ?>

<script type="text/javascript">
	$('.kt-menu__item').removeClass('kt-menu__item--active');
	$('.users_item').addClass('kt-menu__item--active');
</script>