<?php
defined( '_SHM_ENABLED_' ) or die( 'Restricted access' );

$clents_list = Client::getClientsList();
?>

<link rel="stylesheet" type="text/css" href="/assets/vendors/custom/datatables/datatables.bundle.css">
<script src="/assets/vendors/custom/datatables/datatables.bundle.js"></script>


<div class="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor">
	<!-- begin:: Subheader -->
	<div class="kt-subheader   kt-grid__item" id="kt_subheader">
		<div class="kt-subheader__main">
			<h3 class="kt-subheader__title"><? et("Clients"); ?></h3>
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
											<? et("List clients"); ?>
										</h3>
									</div>
									<div class="kt-portlet__head-toolbar">
										<div class="kt-portlet__head-wrapper">

											<div class="dropdown dropdown-inline">
												<button type="button" class="btn btn-brand btn-icon-sm " id="btn_create_user" >
													<i class="flaticon2-plus"></i> <? et("Create client"); ?>
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
															<input type="text" class="form-control" placeholder="<? et("Search..."); ?>" id="generalSearch">
															<span class="kt-input-icon__icon kt-input-icon__icon--left">
																<span><i class="la la-search"></i></span>
															</span>
														</div>
													</div>
													<div class="col-md-4 kt-margin-b-20-tablet-and-mobile">
														<div class="kt-form__group kt-form__group--inline">
															<div class="kt-form__label">
																<label><? et("Status"); ?>:</label>
															</div>
															<div class="kt-form__control">
																<select class="form-control bootstrap-select" id="client_status_select">
																	<option value="0" selected><? et("Active only"); ?></option>
																	<option value=""><? et("All"); ?></option>
																	<option value="1"><? et("Not active"); ?></option>
																</select>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>

									<!--end: Search Form -->

									<!--begin: Datatable -->
									<!--< table class="table table-striped- table-bordered table-hover table-checkable" id="list_clients">
										<thead>
											<th class="kt-align-center"><i class="la la-gear edit_client"></i></th>
											<th><?et("Clent name");?></th>
										</thead>
										<tbody>
											<?php foreach ($clents_list as $key => $clent) {?>
											<tr data-id="<?= $clent["id"] ?>" data-name="<?= $clent["name"] ?>">
												<td class="kt-align-center">
													<span class="dropdown">
													    <a href="#" class="btn btn-sm btn-clean btn-icon btn-icon-md" data-toggle="dropdown" aria-expanded="true">
													      <i class="la la-ellipsis-h"></i>
													    </a>
													    <div class="dropdown-menu dropdown-menu-left">
													        <a class="dropdown-item edit_client" href="#"><i class="la la-edit "></i> Edit Details</a>
													        <a class="dropdown-item" href="#"><i class="la la-trash hide_client"></i> Set inactive</a>
													    </div>
													</span>
													<a href="#" class="btn btn-sm btn-clean btn-icon btn-icon-md edit_client kt-hidden-tablet-and-mobile" title="Edit" >
													  <i class="la la-edit"></i>
													</a>													
												</td>
												<td><?= $clent["name"] ?></td>
											</tr>
											<? } ?>
										</tbody>
									</table> -->
									<table id="testdt" class="table table-striped- table-bordered table-hover table-checkable">
										<thead>
											<th class="kt-align-center"><i class="la la-gear edit_client"></i></th>
											<th><?et("Clent name");?></th>
											<th><?et("Site name");?></th>
											<th><?et("Email");?></th>
											<th></th>
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
<div class="modal fade" id="edit_modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="updateTitle"><?et('Edit client')?></h5>
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
					<input type="hidden" id="upd_client_id" name="upd_client_id" value="0">
					<div class="kt-portlet__body">
						<div class="form-group">
							<label for="upd_name"><?et('Client name')?></label>
							<input type="text" class="form-control" placeholder="<?et('Enter client name')?>" id="upd_name" name="upd_name" />
							<span class="form-text alert-danger " id="name_error"></span>
						</div>						
						<div class="form-group">
							<label for="upd_site_name"><?et('Site name')?></label>
							<input type="text" class="form-control" placeholder="<?et('Enter site name')?>" id="upd_site_name" name="upd_site_name" />
						</div>						
						<div class="form-group">
							<label for="upd_site_url"><?et('Site URL')?></label>
							<input type="text" class="form-control" placeholder="<?et('Enter site URL')?>" id="upd_site_url" name="upd_site_url" />
						</div>						
						<div class="form-group">
							<label for="upd_email"><?et('Email address')?></label>
							<input type="email" class="form-control" placeholder="<?et('Enter email')?>" id="upd_email" name="upd_email" />
							<span class="form-text alert-danger " id="email_error"></span>
						</div>	
						<div class="form-group">
							<label for="upd_password"><?et('Password')?></label>
							<input type="text" class="form-control" id="upd_password" name="upd_password" placeholder="<?et('Password')?>" />
						</div>					
					</div>
				</form>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
				<button type="button" class="btn btn-primary" id="save_btn">Save changes</button>
			</div>
		</div>
	</div>
</div>

<!-- Delete dialog -->
<div class="modal fade" id="delete_modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="updateTitle"><?et('Delete client')?> <span class="del_client_name"></span></h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
				</button>
			</div>
			<div class="modal-body kt-font-danger">
				<?et('This will delete all client data permanently and can not be undone !')?>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
				<button type="button" class="btn btn-danger" id="delete_btn"><?et('Delete client !!!')?></button>
			</div>
		</div>
	</div>
</div>


<?php load_style("/components/clients/assets/clients.css"); ?>
<?php load_script("/components/clients/assets/clients.js"); ?>
