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
			<div class="five columns">
				<?php dynamic_sidebar( 'footer' ); ?>
			</div>
			<div class="seven columns logo-area">
				<?php dynamic_sidebar( 'footer-right' ); ?>
			</div>
		</div>
	</div>
</div>

<?php wp_footer(); ?>

<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-77681547-1', 'auto');
  ga('send', 'pageview');

</script>

<script src="<?php echo get_site_url(); ?>/js/app.min.js"></script>

</body>
</html>
