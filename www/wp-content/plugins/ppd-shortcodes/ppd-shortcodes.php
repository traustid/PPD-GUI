<?php
/*
* Plugin Name: PPD Shortcodes
* Description: Display inline ngrams in text blocks.
* Version: 1.0
* Author: Trausti Dagsson
* Author URI: https://traustidagsson.com
*/

function ngram_display($attributes) {
	if (!function_exists( 'get_home_path' )) {
		require_once( ABSPATH.'wp-admin/includes/file.php');
	}

	include get_home_path()."view-templates/ngramViewTemplate.php";
	include get_home_path()."view-templates/ngramInfoTemplate.php";

	return '<div class="sc-ngram-container ngram-container" data-query="'.$attributes['query'].'">'.
		'	<div class="view-container"></div>'.
		'</div>';
}

add_shortcode('ppd:ngram', 'ngram_display');

?>