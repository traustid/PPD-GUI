<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package Riksdagens_motioner
 */

?>

<div class="footer">
	<div class="container default-margins">
		<div class="row">
			<div class="six columns">
				<?php dynamic_sidebar( 'footer' ); ?>
			</div>
			<div class="six columns logo-area">
				<?php dynamic_sidebar( 'footer-right' ); ?>
			</div>
		</div>
	</div>
</div>

<?php wp_footer(); ?>

<script src="<?php echo get_site_url(); ?>/js/app.min.js"></script>

</body>
</html>
