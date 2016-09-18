<script id="listItemTemplate" type="text/template">

	<div class="list-item">

		<a class="item-title">

			<div class="title"><strong><%= model.get('_source').meta_info.shorttitle %></strong> <%= authorNames.join(', ') %></div>
			<div class="title-attribs">
				<%= year  %>
			</div>
			<%= showAuthorImage ? '<div class="author-image" style="background-image: url(img/'+authorIDs.join('_face.jpeg)"></div><div class="author-image" style="background-image: url(img/')+'_face.jpeg)"></div>' : '' %>
		</a>

		<div class="item-content">

			<div class="row">


				<div class="eight columns">
					<%= model.get('_source').meta_info.title.length > 100 ? '<h2 title="'+model.get('_source').meta_info.title+'">'+model.get('_source').meta_info.title.substr(0, 100)+'...</h2>' : '<h2>'+model.get('_source').meta_info.title+'</h2>' %></h2>
					<p><strong>Sidnummer:</strong> <%= model.get('_source').page_idx %></p>
					<blockquote><%= model.get('highlight').page_content_original %></blockquote>

					<% if (pageUrl != '') { %>
						<a href="<%= pageUrl %>" target="_blank" class="button"><span class="icon-up-arrow"></span> Läs på Litteraturbanken</a>
					<% } %>

					<div style="display:none">
						<% if (model.get('_source').meta_info.part_info) { %>
							texttype: <%= model.get('_source').meta_info.texttype %><br/>
							part title: <%= model.get('_source').meta_info.part_info.title %><br/>
							part texttype: <%= model.get('_source').meta_info.part_info.texttype %><br/>
							part startpagename: <%= model.get('_source').meta_info.part_info.startpagename %><br/>
							part endpagename: <%= model.get('_source').meta_info.part_info.endpagename %><br/>
							page_idx: <%= model.get('_source').page_idx %>
						<% } %>
					</div>
				</div>

				<div class="four columns">
					<% _.each(model.get('_source').meta_info.authorid.authors, function(author) { %>
						<h3><%= author.name %>
							<% if (author.birth || author.death) { %>
								<br/><span class="text-light">
								<%= author.birth+(author.death ? '-'+author.death : '') %>
								</span>
							<% } %>
						</h3>
						<p></p>
					<% }) %>

					<hr/>

					<p>
						<strong>Förlag</strong><br/>
						<%= model.get('_source').meta_info.publisher.name+', '+model.get('_source').meta_info.publisher.place %>
					</p>

				</div>
			</div>

		</div>

	</div>

</script>