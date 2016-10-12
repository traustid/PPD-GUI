<script id="queryItemsTemplate" type="text/template">

	<% _.each(models, function(model, index) { %>
		<div href="#" class="item popup-controller" data-index="<%= index %>">
			<div class="label">
				<%= model.get('queryValue') %>

				<a class="remove-button"><span class="icon-close"></span></a>
			</div>

			<div class="query-form popup-container">
				<div class="form-content">
					<div class="overlay"></div>
					<div class="row">
						<div class="six columns">

							<label>Söksträng:</label>
							<input type="text" class="query-form-input u-full-width" value="<%= model.get('queryString') %>"/>

							<label>Mediatyp:</label>
							<div class="query-types check-list">
							
								<% _.each(mediaTypes, function(type) {
									if (type.label != '') { %>
										<label><input type="checkbox" name="query-types" value="<%= type.label %>" <%= model.get('mediaTypes').indexOf(type.label.toLowerCase()) > -1 ? 'checked' : '' %>><%= type.label %></label>
									<% }
								}) %>

							</div>

						</div>
						<div class="six columns">

							<label>Författare:</label>
							<input type="text" class="query-author u-full-width" value="<%= model.get('authorString') %>"/>

							<label>Kön:</label>
							<div class="query-gender check-list">
							
								<label><input type="checkbox" name="query-gender" value="kvinna" <%= model.get('gender').indexOf('kvinna') > -1 ? 'checked' : '' %>>Kvinna</label>
								<label><input type="checkbox" name="query-gender" value="man" <%= model.get('gender').indexOf('man') > -1 ? 'checked' : '' %>>Man</label>
								<label><input type="checkbox" name="query-gender" value="okänt" <%= model.get('gender').indexOf('okänt') > -1 ? 'checked' : '' %>>Okänt</label>

							</div>

						</div>
					</div>
					<div class="row form-footer">
						<div class="twelve columns">
							<a class="button button-primary form-save-button">Uppdatera</a>
							<a class="button remove-button">Ta bort</a>
							<a class="button form-cancel-button u-pull-right">Avbryt</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	<% }) %>
</script>