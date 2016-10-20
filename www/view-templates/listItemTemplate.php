<script id="listItemTemplate" type="text/template">

	<div class="list-item">

		<a class="item-title">

			<div class="title">
				<%= authorNames.join(', ') != '' ? authorNames.join(', ')+', ' : authorNames.join(', ') %> 
				<strong><%= model.get('_source').meta_info.shorttitle == null ? model.get('_source').meta_info.title : model.get('_source').meta_info.shorttitle %></strong>, 
				<%= model.get('_source').page_idx %>
			</div>
			<div class="title-attribs">
				<%= year  %>
			</div>
			<%= showAuthorImage ? '<div class="author-image" style="background-image: url(img/'+authorIDs.join('_face.jpeg)"></div><div class="author-image" style="background-image: url(img/')+'_face.jpeg)"></div>' : '' %>
		</a>

		<div class="item-content">

			<div class="row">

				<div class="eight columns">
					<%= model.get('_source').meta_info.title.length > 100 ? '<h2 title="'+model.get('_source').meta_info.title+'">'+model.get('_source').meta_info.title.substr(0, 100)+'...</h2>' : '<h2>'+model.get('_source').meta_info.title+'</h2>' %></h2>

						<% if (model.get('_source').meta_info.part_info) { %>
							<h3><%= model.get('_source').meta_info.part_info.title %><br/>
								<span class="text-light"><%= model.get('_source').meta_info.part_info.startpagename %>-<%= model.get('_source').meta_info.part_info.endpagename %></span>
							</h3>
							<p style="display:none"><strong>Texttyp:</strong> <%= model.get('_source').meta_info.part_info.texttype %></p>

						<% } %>
					</p>

					<p>
						<strong>Sida</strong> <%= model.get('_source').page_idx %>.
						<% if (model.get('_source').meta_info && model.get('_source').meta_info.texttype) { %>
							<strong>Texttyp:</strong> <%= model.get('_source').meta_info.texttype %>.
						<% } %>
					</p>

					<blockquote class="text-frame">
						<%= model.get('highlight') && model.get('highlight').page_content_original ? model.get('highlight').page_content_original : model.get('_source').page_content_original %>
						<div class="page-number"><%= model.get('_source').page_idx %></div>
					</blockquote>


					<% if (pageUrl != '') { %>
						<a href="<%= pageUrl %>" target="_blank" class="button"><span class="icon-up-arrow"></span> Läs på Litteraturbanken</a>
					<% } %>

				</div>

				<div class="four columns">
					<% if (model.get('_source').meta_info.authorid.authors && model.get('_source').meta_info.authorid.authors.length > 0) { %>
						<% _.each(model.get('_source').meta_info.authorid.authors, function(author) { %>
							<% if (author.name.toLowerCase() != 'saknas') { %>
								<h3><%= author.name %>
									<% if (author.birth || author.death) { %>
										<br/><span class="text-light">
										<%= author.birth && author.birth != '0000' ? author.birth+(author.death ? '-'+author.death : '') : '' %>
										</span>
									<% } %>
								</h3>
							<% } %>
						<% }) %>
					<% } %>

					<p>
						<strong>Förlag</strong><br/>
						<%= model.get('_source').meta_info.publisher.name+', '+model.get('_source').meta_info.publisher.place %>
					</p>

					<% if (model.get('_source').meta_info.authorid.editors && model.get('_source').meta_info.authorid.editors.length > 0) { %>
						<p>
							<strong>Redaktör</strong><br/>
							<% _.each(model.get('_source').meta_info.authorid.editors, function(editor, index) { %>
								<%= editor.name %>
								<% if (editor.birth || editor.death) { %> (<%= editor.birth && editor.birth != '0000' ? editor.birth+(editor.death ? '-'+editor.death : '') : '' %>)<% } %>
								<%= index < model.get('_source').meta_info.authorid.editors.length-1 ? ', ' : '' %>
							<% }) %>
						</p>
					<% } %>

					<% if (model.get('_source').meta_info.authorid.translators && model.get('_source').meta_info.authorid.translators.length > 0) { %>
						<p>
							<strong>Översättare</strong><br/>
							<% _.each(model.get('_source').meta_info.authorid.translators, function(translator, index) { %>
								<%= translator.name %>
								<% if (translator.birth || translator.death) { %> (<%= translator.birth && translator.birth != '0000' ? translator.birth+(translator.death ? '-'+translator.death : '') : '' %>)<% } %>
								<%= index < model.get('_source').meta_info.authorid.translators.length-1 ? ', ' : '' %>
							<% }) %>
						</p>
					<% } %>

				</div>
			</div>

		</div>

	</div>

</script>