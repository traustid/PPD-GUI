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

	</div>

	<div class="footer">
		<div class="container default-margins">
			<div class="row">
				<div class="twelve columns">
					<?php dynamic_sidebar( 'footer' ); ?>
				</div>
			</div>
		</div>
	</div>

<?php wp_footer(); ?>

</body>
</html>
