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
							<input type="text" class="query-form-input query-form-search-input u-full-width" value="<%= model.get('queryString') %>"/>

							<label>Mediatyp:</label>
							<div class="query-types check-list">
							
								<% _.each(mediaTypes, function(type) {
									if (type.label != '') { %>
										<label><input type="checkbox" name="query-types" value="<%= type.value %>" <%= (model.get('mediaTypes').indexOf(type.value.toLowerCase()) > -1) || model.get('mediaTypes').length == 0 ? 'checked' : '' %>><%= type.label %></label>
									<% }
								}) %>

							</div>

							<label>Moderna utgåvor:</label>
							<div class="check-list">
								<% console.log("model.get('searchModernEditions') = "+model.get('searchModernEditions')) %>
								<label><input type="checkbox" class="query-modern-editions" <%= model.get('searchModernEditions') ? 'checked' : '' %> />Sök bara moderna utgåvor</label>
							</div>

						</div>
						<div class="six columns">

							<label>Författare:</label>
							<input type="text" class="query-form-input query-author u-full-width" value="<%= model.get('authorString') %>"/>

							<label>Kön:</label>
							<div class="query-gender check-list">
							
								<% _.each(genders, function(gender) {
									if (gender.label != '') { %>
										<label><input type="checkbox" name="query-gender" value="<%= gender.value %>" <%= (model.get('gender').indexOf(gender.value.toLowerCase()) > -1) || model.get('gender').length == 0 ? 'checked' : '' %>><%= gender.label %></label>
									<% }
								}) %>

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