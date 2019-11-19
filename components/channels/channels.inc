<?php
defined( '_SHM_ENABLED_' ) or die( 'Restricted access' );

$site_id = $_SESSION["site_id"];

$channels = Channel::listChannels($site_id);
echo ("<script>var site_id = $site_id</script>");
?>

<link rel="stylesheet" type="text/css" href="/assets/vendors/custom/datatables/datatables.bundle.css">
<script src="/assets/vendors/custom/datatables/datatables.bundle.js"></script>



<div class="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor">
	<!-- begin:: Subheader -->
	<div class="kt-subheader   kt-grid__item" id="kt_subheader">
		<div class="kt-subheader__main">
			<h3 class="kt-subheader__title"><?php et("Channels"); ?></h3>
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
						<?php et("List channels"); ?>
					</h3>
				</div>
				<div class="kt-portlet__head-toolbar">
					<div class="kt-portlet__head-wrapper">

						<div class="dropdown dropdown-inline">
							<button type="button" class="btn btn-brand btn-icon-sm " id="btn_add_bulk" >
								<i class="flaticon2-plus"></i> <?php et("Add bulk"); ?>
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
											<select class="form-control bootstrap-select" id="client_status_select">
												<option value="0" selected><?php et("Active only"); ?></option>
												<option value=""><?php et("All"); ?></option>
												<option value="1"><?php et("Not active"); ?></option>
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
				<table id="channels_dt" class="table table-striped- table-bordered table-hover table-checkable">
					<thead>
						<th class="kt-align-center"><i class="la la-gear edit_channel"></i></th>
						<th class="kt-align-center"></th>
						<th><?php et("Channel name");?></th>
						<th><?php et("Url");?></th>
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
				<h5 class="modal-title" id="updateTitle"><?php et('Update channel')?></h5>
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
					<input type="hidden" id="upd_channel_id" name="upd_channel_id" value="0">
					<div class="kt-portlet__body">
						<div class="form-group">
							<label for="upd_name"><?php et('Channel name')?></label>
							<input type="text" class="form-control" placeholder="<?php et('Enter channel name')?>" id="upd_name" name="upd_name" />
							<span class="form-text alert-danger " id="name_error"></span>
						</div>						
						<div class="form-group">
							<label for="upd_channel_url"><?php et('Channel URL')?></label>
							<input type="text" class="form-control" placeholder="<?php et('Enter channel URL')?>" id="upd_channel_url" name="upd_channel_url" />
						</div>						
						<div class="form-group">
							<label class="mt-checkbox mt-checkbox-outline">
								<label for="to_crawl"><?php et('Crawled channel')?></label>
		                        <input type="checkbox" name="to_crawl" id="to_crawl" checked="1" /> 
		                    </label>
						</div>						
						<div class="form-group channels_select">
							<label for="channels_display_list"><?php et('Channel will display:')?></label>
							<div  class="form-control " placeholder="<?php et('Select channels to display')?>" id="channels_display_list" name="channels_display_list"></div>
							<div class="select_holder">
								<input type="hidden" name="display_type" id="display_type" />
								<input type="hidden" name="display_channels_list" id="display_channels_list" />
								<div class="btn-group btn-group-sm" role="group" aria-label="...">
									<button type="button" class="btn btn-primary display_type_btn" data-dtype="0"><?php et('Self items')?></button>
									<button type="button" class="btn btn-outline-info display_type_btn" data-dtype="1"><?php et('Site items')?></button>
									<button type="button" class="btn btn-outline-info display_type_btn" data-dtype="2"><?php et('Self and descendants')?></button>
									<button type="button" class="btn btn-outline-info display_type_btn" data-dtype="5"><?php et('Selected channels')?></button>
								</div>
								<!--begin: SELECT channels datatable -->
								<table id="channels_select_dt" class="table table-striped- table-bordered table-hover table-checkable">
									<thead>
										<th class="kt-align-center"><i class="la la-check-square-o"></i></th>
										<th><?php et("Channel name");?></th>
									</thead>
									<tbody>
									</tbody>	
								</table>
								<!--end: SELECT channels datatable -->
							</div>
						</div>						
						<div class="form-group">
						</div>						
						<div class="form-group">
			        		<ul class="nav nav-tabs  nav-tabs-line template_tabs" role="tablist">
			                    <li class="nav-item">
			                        <a class="nav-link active" data-toggle="tab" href="#kt_tabs_1_1" role="tab"><?php et('Links template')?></a>
			                    </li>
			                    <li class="nav-item">
			                        <a class="nav-link" data-toggle="tab" href="#kt_tabs_1_2" role="tab"><?php et('Article template')?></a>
			                    </li>
			                </ul>                        
			                <div class="tab-content kt-hidden template_tabs_content">
			                    <div class="tab-pane active" id="kt_tabs_1_1" role="tabpanel">
			                        <textarea id="crawl_links_template_upd"></textarea>
			                    </div>
			                    <div class="tab-pane" id="kt_tabs_1_2" role="tabpanel">
			                        <textarea id="crawl_article_template_upd"></textarea>
			                    </div>
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
<div class="modal fade" id="delete_modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="updateTitle"><?php et('Delete channel')?> <span class="del_name"></span></h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
				</button>
			</div>
			<div class="modal-body kt-font-danger">
				<?php et('This will delete all channel an his successors data permanently and can not be undone !')?>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-primary" data-dismiss="modal"><?php et('Close')?></button>
				<button type="button" class="btn btn-danger" id="delete_btn"><?php et('Delete channel')?> !!!</button>
			</div>
		</div>
	</div>
</div>


<?php load_style("/components/channels/assets/channels.css"); ?>
<?php load_script("/components/channels/assets/channels.js"); ?>
<?php load_script("/components/crawler/assets/crawler.js"); ?>
<script type="text/javascript">
	$('.channels_item').addClass('kt-menu__item--active')
</script>