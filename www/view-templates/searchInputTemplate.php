<script id="searchInputTemplate" type="text/template">

	<div class="row">
		<div class="ten columns">
		
			<div class="search-wrapper">

				<div class="query-items">
				</div>

				<input type="text" class="query-input">

				<a href="#" class="clear-input" style="display: none"><span class="icon-close"></span></a>

				<div class="search-query-options popup-controller">
					
					<button class="options-button"></button>

					<div class="options-content popup-container">
						<label>Sökmetod:</label>
						<select class="search-query-mode">
							<option value="exact" selected="selected">Exakt matchning</option>
							<option value="spanNear">Orden nära varandra</option>
							<option value="spanNearOrdinal">Orden nära och i ordning</option>
							<option value="anywhere">Orden var som helst på sidan</option>
						</select>

						<hr/>

						<label>
							<input type="checkbox" class="auto-modern-spelling"/>
							Sök i automatmoderniserad stavning
						</label>
					</div>

				</div>
			</div>

		</div>
		<div class="two columns">
			<button class="button button-primary search-button u-full-width">Sök</button>
		</div>
	</div>
	
</script>