<?php
/**
 * Template part for displaying page content in page.php.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package Riksdagens_motioner
 */

?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

	<div class="entry-header-wrapper">
		<div class="container default-margins">
			<div class="row">
				<div class="twelve columns">

					<header class="entry-header">
						<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
					</header><!-- .entry-header -->
					
				</div>
			</div>
		</div>
	</div>

	<div class="container default-margins page-content">
		<div class="row">
			<div class="twelve columns">		


				<div class="entry-content">
					<?php
						the_content();

						wp_link_pages( array(
							'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'riksdagens-motioner' ),
							'after'  => '</div>',
						) );
					?>
				</div><!-- .entry-content -->

				<footer class="entry-footer">
					<?php
						edit_post_link(
							sprintf(
								/* translators: %s: Name of current post */
								esc_html__( 'Edit %s', 'riksdagens-motioner' ),
								the_title( '<span class="screen-reader-text">"', '"</span>', false )
							),
							'<span class="edit-link">',
							'</span>'
						);
					?>
				</footer><!-- .entry-footer -->

			</div>
		</div>
	</div>

</article>