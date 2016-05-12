<?php
/**
 * The header for our theme.
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package Riksdagens_motioner
 */

?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="profile" href="http://gmpg.org/xfn/11">
<link href="https://fonts.googleapis.com/css?family=Lora" rel="stylesheet" type="text/css">
<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">
<meta property="og:title" content="Riksdags Motioner" /> 
<meta property="og:image" content="http://riksdagsmotioner.nu/wp-content/themes/riksdagens-motioner/img/share-img.jpg" /> 
<meta property="og:description" content="Hitta och läs riksdagsmotioner" /> 
<meta property="og:url" content="http://riksdagsmotioner.nu/">
<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>

<header class="header header-background-<?php echo rand(1, 2); ?>">
	
	<div class="container">
		
		<div class="row">
			<div class="six columns">
				<div class="site-name">
					<h1><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></h1>

					<?php

					$description = get_bloginfo( 'description', 'display' );
					if ( $description || is_customize_preview() ) : ?>
						<div class="sub"><?php echo $description; /* WPCS: xss ok. */ ?></div>
					<?php
					endif; ?>

				</div>
			</div>

			<div class="six columns">

				<nav id="site-navigation" class="main-navigation" role="navigation">
					<?php wp_nav_menu( array( 'theme_location' => 'primary', 'menu_id' => 'primary-menu' ) ); ?>
				</nav>

			</div>

		</div>

	</div>

	<div class="img-credit">Foto: Melker Dahlstran/<a href="http://riksdagen.se/sv/press/pressbilder/" target="_blank">Riksdagsförvaltningen</a></div>

</header>
