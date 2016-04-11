<script id="queryItemsTemplate" type="text/template">

	<% _.each(models, function(model, index) { %>
		<div href="#" class="item" data-index="<%= index %>">
			<div class="label">
				<%= model.get('queryValue') %>

				<a class="remove-button"><span class="icon-close"></span></a>
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
							
								<% _.each(parties, function(party) { 
									if (party.name != '') { %>

									<label><input type="checkbox" name="query-parties" value="<%= party.letter %>" <%= model.get('parties').indexOf(party.letter.toUpperCase()) > -1 ? 'checked' : '' %>><%= party.name %> (<strong><%= party.letter.toUpperCase() %></strong>)</label>

									<% }
								}) %>

							</div>
						</div>
					</div>
					<div class="row form-footer">
						<div class="twelve columns">
							<a class="button button-primary form-save-button">Update</a>
							<a class="button remove-button">Remove</a>
							<a class="button form-cancel-button u-pull-right">Cancel</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	<% }) %>
</script>