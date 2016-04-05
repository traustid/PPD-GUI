<?php
/*
Plugin Name: ES Searches
Description: Displays latest search terms from Elasticsearch.
Version: 1.0
Author: Trausti Dagsson
Author URI: http://www.traustidagsson.com/
*/

class es_searches extends WP_Widget {

	// constructor
	function es_searches() {
		parent::WP_Widget(false, $name = __('ES Searches', 'es_searches') );
	}

	// widget form creation
	function form($instance) {

	// Check values
	if( $instance) {
	     $es_list_type = esc_attr($instance['es_list_type']);
	     $es_widget_title = esc_attr($instance['es_widget_title']);
	} else {
	     $es_list_type = '';
	     $es_widget_title = '';
	}
	?>

	<p>
		<label for="<?php echo $this->get_field_id('es_widget_title'); ?>"><?php _e('Widget title', 'es_searches'); ?></label>
		<input class="widefat" id="<?php echo $this->get_field_id('es_widget_title'); ?>" name="<?php echo $this->get_field_name('es_widget_title'); ?>" type="text" value="<?php echo $es_widget_title; ?>" />
	</p>

	<p>
		<label for="<?php echo $this->get_field_id('es_list_type'); ?>"><?php _e('Widget type ("top" or "latest")', 'es_searches'); ?></label>
		<input class="widefat" id="<?php echo $this->get_field_id('es_list_type'); ?>" name="<?php echo $this->get_field_name('es_list_type'); ?>" type="text" value="<?php echo $es_list_type; ?>" />
	</p>

	<?php
	}

	// update widget
	function update($new_instance, $old_instance) {
	      $instance = $old_instance;
	      // Fields
	      $instance['es_list_type'] = strip_tags($new_instance['es_list_type']);
	      $instance['es_widget_title'] = strip_tags($new_instance['es_widget_title']);
	     return $instance;
	}

	// widget display
	function widget($args, $instance) {
		$top_url = 'http://cdh-vir-1.it.gu.se:8900/queries/top';
		$latest_url = 'http://cdh-vir-1.it.gu.se:8900/queries/latest';
	
		$es_list_type = strtolower($instance['es_list_type']);
		$es_widget_title = $instance['es_widget_title'];

		?>

			<h3><?php echo $es_widget_title; ?></h3>

		<?php
		$json_url = $top_url;

		if ($es_list_type == 'top') {
			$json_url = $top_url;
		}
		if ($es_list_type == 'latest') {
			$json_url = $latest_url;
		}

		$json = file_get_contents($json_url);
		$data = json_decode($json);

		echo '<ul class="es-searches-list">';
		foreach ($data as $item) {
			if ($es_list_type == 'top') {
				echo '<li><a class="button button-primary button-blue button-small" href="#search/'.$item->key.'">'.$item->key.'</a></li>';
			}
			if ($es_list_type == 'latest') {
				echo '<li><a class="button button-primary button-blue button-small" href="#search/'.$item->term.'">'.$item->term.'</a></li>';
			}
		}
		echo '</ul>';
	}
}

// register widget
add_action('widgets_init', create_function('', 'return register_widget("es_searches");'));

?>