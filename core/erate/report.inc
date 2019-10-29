<?php
defined( '_SHM_ENABLED_' ) or die( 'Restricted access' );


/**
 * 
 */
class Report
{
	private $EVENTS = array(
		"1" => "impression",
		"2" => "click",
		"3" => "pause_time",
		"4" => "view_time",
		"5" => "description_opened",
		"6" => "coupon",
		"7" => "quick_swipe",
		"8" => "widget_loaded",
		"9" => "widget_opened",

	);

	public function channels($site_id, $date_from = null, $date_to = null)
	{
		$query_events_str = $this->prepare_query_events();
		$dates_str = "";
		if (isset($date_from)){
			$dates_str .= " and event_date >= '".$date_from."' ";
		}
		if (isset($date_from)){
			$dates_str .= " and event_date < '".$date_to."' ";
		}
		$query = "select channel_id,name as channel_name, ".$query_events_str." from (
			SELECT  channel_id, ch.name, event_id, sum(event_count) as event_count
			FROM sh_day_channel_events as ce
            join channels ch on ch.id = ce.channel_id
            where ch.siteId = $site_id
            $dates_str
			group by channel_id,event_id, ch.name
			) as e
			group by channel_id";
		$channels = Factory::getDB()->getAssocList("id",$query);
		return $channels;
	}

	public function tools($channel_id, $date_from = null, $date_to = null)
	{
			$query_events_str = $this->prepare_query_events();
			$dates_str = "";
			if (isset($date_from)){
				$dates_str .= " and event_date >= '".$date_from."' ";
			}
			if (isset($date_from)){
				$dates_str .= " and event_date < '".$date_to."' ";
			}
			$query = "select tool_id,name as tool_name, ".$query_events_str." from (
				SELECT  tool_id, t.name, event_id, sum(event_count) as event_count
				FROM sh_day_tool_events as te
	            join tools t on t.id = te.tool_id
				join tools_placements tp on tp.toolId = t.id
				join campaign_placements cp on cp.id = tp.placementId
                join placements p on p.id = cp.placementId
				where p.channelId = $channel_id  
				$dates_str         
				group by tool_id,event_id, t.name
				) as e
				group by tool_id";
		$tools = Factory::getDB()->getAssocList("id",$query);
		return $tools;
	}
	private function prepare_query_events (){
		$ev_str = "sum(case when event_id = %d then event_count else 0 end) as %s,";
		$query_events = "";
		foreach ($this->EVENTS as $key => $event_name) {
			$query_events .= sprintf($ev_str, $key, $event_name);
		}
		$query_events = substr($query_events, 0, -1); 
		return $query_events;
	}
}
