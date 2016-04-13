<?php
/**
 * The main template file.
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package Riksdagens_motioner
 */

get_header(); ?>

<div id="appViewContainer">

	<div class="container search-container">
		<div id="searchInput"></div>
	</div>

	<hr class="offset" />

	<div class="results-container wrapper results-component">

		<div class="container top-margins bottom-margins top-offset-border">
			<div class="row">

				<div class="twelve columns">
					<div id="ngramContianer" class="ngram-container"></div>

					<div id="regeringViewContainer" class="regering-chart-container">
						<svg id="regeringChartContainer" width="100%" height="30"></svg>
						<div class="regering-legends">
							<div class="item">
								<span class="color" style="background-color: #ffcf72"></span> Socialdemokratisk
							</div>
							<div class="item">
								<span class="color" style="background-color: #d2ff72"></span> Center
							</div>
							<div class="item">
								<span class="color" style="background-color: #adcdee"></span> Liberal
							</div>
							<div class="item">
								<span class="color" style="background-color: #f49df1"></span> Moderat
							</div>
							<a href="https://sv.wikipedia.org/wiki/Sveriges_regering" target="_blank">Wikipedia: Sveriges regering</a>
						</div>
					</div>

					<div id="sliderContainer" class="slider-container"></div>

				</div>

			</div>
		</div>
	
	</div>

	<div id="hitlistContainer" class="results-component"></div>

	<div id="pageContent" class="container default-margins page-content">
		<div class="row">
			<div class="twelve columns">

				<?php
				if ( have_posts() ) :

					if ( is_home() && ! is_front_page() ) : ?>
						<header>
							<h1 class="page-title screen-reader-text"><?php single_post_title(); ?></h1>
						</header>

					<?php
					endif;

					/* Start the Loop */
					while ( have_posts() ) : the_post();

						/*
						 * Include the Post-Format-specific template for the content.
						 * If you want to override this in a child theme, then include a file
						 * called content-___.php (where ___ is the Post Format name) and that will be used instead.
						 */
						get_template_part( 'template-parts/content', get_post_format() );

					endwhile;

					the_posts_navigation();

				else :

					get_template_part( 'template-parts/content', 'none' );

				endif; ?>

			</div>
		</div>

		<div class="row">
			<div class="twelve columns">

				<?php dynamic_sidebar( 'front-page-top' ); ?>

			</div>
		</div>
	</div>

	<div class="top-border wrapper bg-gray top-border bottom-border page-content">

		<div class="container default-margins extra-top-margins extra-bottom-margins">
			
			<div class="row">
				<div class="<?php echo is_active_sidebar('front-page-1') && is_active_sidebar('front-page-2') ? 'six' : 'twelve' ?> columns">				

					<?php if (is_active_sidebar('front-page-1')) {
						dynamic_sidebar( 'front-page-1' );
					} ?>

				</div>
				<div class="<?php echo is_active_sidebar('front-page-1') && is_active_sidebar('front-page-2') ? 'six' : 'twelve' ?> columns">				

					<?php if (is_active_sidebar('front-page-2')) {
						dynamic_sidebar( 'front-page-2' );
					} ?>

				</div>
			</div>

		</div>
	</div>

	<div id="textViewer" class="text-viewer"></div>

</div>

<?php

	if (!function_exists( 'get_home_path' )) {
		require_once( ABSPATH.'wp-admin/includes/file.php');
	}

	include get_home_path()."view-templates/textViewerTemplate.php";
	include get_home_path()."view-templates/hitlistUiTemplate.php";
	include get_home_path()."view-templates/listItemTemplate.php";
	include get_home_path()."view-templates/searchInputTemplate.php";
	include get_home_path()."view-templates/queryItemsTemplate.php";
	include get_home_path()."view-templates/ngramViewTemplate.php";
	include get_home_path()."view-templates/ngramInfoTemplate.php";

get_sidebar();
get_footer();
