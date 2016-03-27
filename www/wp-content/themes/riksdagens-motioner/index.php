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

	<div class="container search-container">
		<div id="searchInput"></div>
	</div>

	<hr class="offset" />

	<div class="results-container wrapper results-component">

		<div class="container default-margins top-offset-border">
			<div class="row">

				<div class="twelve columns">
					<div id="ngramContianer" class="ngram-container"></div>

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
	</div>

	<div class="top-border wrapper bg-gray top-border bottom-border page-content">

		<div class="container default-margins extra-top-margins extra-bottom-margins">
			
			<div class="row">
				<div class="six columns">				

					<?php dynamic_sidebar( 'front-page-1' ); ?>

				</div>
				<div class="six columns">				

					<?php dynamic_sidebar( 'front-page-2' ); ?>

				</div>
			</div>

		</div>
	</div>

	<div id="textViewer" class="text-viewer"></div>

<script id="textViewerTemplate" type="text/template">

	<div class="overlay"></div>

	<div class="text-content">
		<div class="container">
			<div class="row">
				<div class="twelve columns">
					<h2><%= title %></h2>
					<p><%= html %></p>
				</div>
			</div>
		</div>
	</div>

	<a class="close-button"><span class="icon-close"></span></a>

</script>

<script id="hitlistUiTemplate" type="text/template">
	<div class="hitlist-container wrapper bg-gray">

		<hr class="top-border">

		<div class="arrow"></div>

		<div class="container default-margins extra-top-margins narrow-bottom-margins">
			<div class="row">
				<div class="twelve columns">
					<h2 class="text-center">Search results</h2>
					<p class="text-center list-header-label"></p>
				</div>
			</div>
		</div>

		<div class="container default-margins">
			<div class="row">

				<div class="twelve columns doc-list list-container"></div>

				<div class="loading-overlay"></div>
			
			</div>
		</div>

	</div>	
</script>

<script id="listItemTemplate" type="text/template">

	<div class="list-item">

		<a class="item-title">

			<div class="title"><strong><%= model.get('_source').dokument.titel %></strong> <%= model.get('_source').dokument.subtitel %></div>
			<div class="title-attribs">
				<% if (model.get('parties').length > 0) { %>
					<% _.each(model.get('parties'), function(party) { %>
						<div class="party-letter"><%= party %></div>
					<% }); %>
				<% } %>
				<%= model.get('_source').dokument.dateFormatted %>
			</div>
		</a>

		<div class="item-content">

			<div class="row">


				<div class="eight columns">
					<p><%= model.get('_source').dokument.text ? model.get('_source').dokument.text.substr(0, 1000)+'<br/>...' : '' %></p>
				</div>

				<div class="four columns">
					<a href="" class="button u-full-width full-text-button"><span class="icon-sheet"></span> Läs hela</a><br/>
					<a href="<%= model.get('_source').dokument.dokument_url_html %>" target="_blank" class="button u-full-width"><span class="icon-up-arrow"></span> Dokument (html)</a>

					<% if (model.get('_source').dokbilaga && model.get('_source').dokbilaga.length) { %>
						<% _.each(model.get('_source').dokbilaga.bilaga, function(file) { %>
							<a href="<%= file.fil_url %>" target="_blank" class="button u-full-width"><span class="icon-up-arrow"></span> Dokument (<%= file.filtyp %>)</a>	
						<% }) %>
					<% } %>

					<% if (model.get('_source').dokbilaga && model.get('_source').dokbilaga.bilaga) { %>
						<a href="<%= model.get('_source').dokbilaga.bilaga.fil_url %>" target="_blank" class="button u-full-width"><span class="icon-up-arrow"></span> Dokument (<%= model.get('_source').dokbilaga.bilaga.filtyp %>)</a>	
					<% } %>

				</div>
			</div>

		</div>

	</div>

</script>

<script id="searchInputTemplate" type="text/template">

	<div class="row">
		<div class="ten columns">
		
			<div class="search-wrapper">

				<div class="query-items">
				</div>

				<input type="text" class="query-input">
			</div>

		</div>
		<div class="two columns">
			<button class="button button-primary u-full-width search-button">Sök</button>
		</div>
	</div>
	
</script>

<script id="queryItemTemplate" type="text/template">
	<a href="#" class="item">
		<div class="label"><%= queryString %></div>

		<div class="remove-button">x</div>
	</a>
</script>

<script id="queryItemsTemplate" type="text/template">

	<% _.each(models, function(model, index) { %>
		<div href="#" class="item" data-index="<%= index %>">
			<div class="label">
				<%= model.get('queryValue') %>

				<!--<div class="remove-button"></div>-->
			</div>

			<div class="query-form">
				<div class="form-content">
					<div class="overlay"></div>
					<div class="row">
						<div class="twelve columns">
							<label>Search string:</label>
							<input type="text" class="query-form-input u-full-width" value="<%= model.get('queryString') %>"/>

							<label>Parties:</label>
							<div class="query-parties check-list">

								<label><input type="checkbox" name="query-parties" value="C" <%= model.get('parties').indexOf('C') > -1 ? 'checked' : '' %>>Centerpartiet (<strong>C</strong>)</label>
								<label><input type="checkbox" name="query-parties" value="KD" <%= model.get('parties').indexOf('KD') > -1 ? 'checked' : '' %>>Kristdemokraterna (<strong>KD</strong>)</label>
								<label><input type="checkbox" name="query-parties" value="L" <%= model.get('parties').indexOf('L') > -1 ? 'checked' : '' %>>Liberalerna (<strong>L</strong>)</label>
								<label><input type="checkbox" name="query-parties" value="MP" <%= model.get('parties').indexOf('MP') > -1 ? 'checked' : '' %>>Miljöpartiet de gröna (<strong>MP</strong>)</label>
								<label><input type="checkbox" name="query-parties" value="M" <%= model.get('parties').indexOf('M') > -1 ? 'checked' : '' %>>Moderata samlingspartiet (<strong>M</strong>)</label>
								<label><input type="checkbox" name="query-parties" value="S" <%= model.get('parties').indexOf('S') > -1 ? 'checked' : '' %>>Socialdemokraterna (<strong>S</strong>)</label>
								<label><input type="checkbox" name="query-parties" value="SD" <%= model.get('parties').indexOf('SD') > -1 ? 'checked' : '' %>>Sverigedemokraterna (<strong>SD</strong>)</label>
								<label><input type="checkbox" name="query-parties" value="V" <%= model.get('parties').indexOf('V') > -1 ? 'checked' : '' %>>Vänsterpartiet (<strong>V</strong>)</label>
							</div>
						</div>
					</div>
					<div class="row form-footer">
						<div class="twelve columns">
							<a class="button button-primary form-save-button">Save</a>
							<a class="button remove-button">Remove</a>
							<a class="button form-cancel-button u-pull-right">Cancel</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	<% }) %>
</script>

<script id="ngramViewTemplate" type="text/template">

<!--	<h2 class="text-center">Results by year</h2>-->
<!--	<p class="text-center">Search for: <span class="search-term-label"></span></p>-->


	<label><input class="include-total-docs" type="checkbox"> Include total documents</label>

	<svg id="chartContainer" width="100%" height="500"></svg>

	<div class="info-overlay"></div>

	<div class="loading-overlay"></div>
	
</script>

<script id="ngramInfoTemplate" type="text/template">

	<p><strong><%= data.year %></strong><br/>
		Total documents: <%= data.total %></p>
		<% _.each(data.legends, function(item, index) { %>
		<div class="item" data-index="<%= index %>">
			<div class="color" style="background-color: <%= item.color %>"></div>
			<div class="label"><strong><%= item.key %></strong>: <%= item.data.doc_count %> <span class="text-light">(<%= Math.round((item.data.doc_count/data.total)*10000)/10000 %>%)</span></div>
		</div>
	<% }) %>
	
</script>

<script src="js/app.min.js"></script>
<?php
get_sidebar();
get_footer();
