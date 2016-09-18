<script id="hitlistUiTemplate" type="text/template">

	<div class="container default-margins">

		<div class="row">
			<div class="ten columns tabs result-tabs"></div>
			<div class="two columns">
				<select class="aggregation-select u-pull-right" style="margin-right: 10px">
					<option value="authors">authors</option>
					<option value="works">works</option>
					<option value="mediatype">mediatype</option>
					<option value="texttype">texttype</option>
					<option value="fraktur">fraktur</option>
					<option value="gender">gender</option>
				</select>
			</div>
		</div>

		<div class="row">
			<div class="barchart-container"></div>
		</div>

		<div class="row">

			<div class="twelve columns doc-list list-container"></div>

			<div class="no-results-overlay">Inga träffar</div>

			<div class="loading-overlay"></div>
		
		</div>

		<div class="row" style="margin-top: 20px">
			<div class="twelve columns text-center">
				<p class="page-info"></p>
				<a class="button button-primary load-more-button">Se fler resultat</a>
			</div>
		</div>

	</div>

</script>