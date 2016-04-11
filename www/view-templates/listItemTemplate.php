<script id="listItemTemplate" type="text/template">

	<div class="list-item">

		<a class="item-title">

			<div class="title"><strong><%= model.get('_source').dokument.titel %></strong> <%= model.get('_source').dokument.subtitel %></div>
			<div class="title-attribs">
				<%= partyLetters %>
				<%= model.get('_source').dokument.dateFormatted %>
			</div>
		</a>

		<div class="item-content">

			<div class="row">


				<div class="eight columns">
					<p><%= shortText %></p>
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