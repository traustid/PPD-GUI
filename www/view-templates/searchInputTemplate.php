<script id="searchInputTemplate" type="text/template">

	<div class="row">
		<div class="ten columns">
		
			<div class="search-wrapper">

				<div class="query-items">
				</div>

				<input type="text" class="query-input">

				<a href="#" class="clear-input" style="display: none"><span class="icon-close"></span></a>

				<select class="search-query-mode">
					<option value="exact">Exakt matchning</option>
					<option value="spanNear">Orden nära varandra</option>
					<option value="spanNearOrdinal">Orden nära och i ordning</option>
					<option value="anywhere">Orden var som helst i dokumentet</option>
				</select>
			</div>

		</div>
		<div class="two columns">
			<button class="button button-primary search-button u-full-width">Sök</button>
		</div>
	</div>
	
</script>