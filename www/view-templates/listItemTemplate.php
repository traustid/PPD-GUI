<script id="listItemTemplate" type="text/template">

	<div class="list-item">

		<a class="item-title">

			<div class="title"><strong><%= model.get('_source').meta_info.shorttitle %></strong> <%= authorNames.join(', ') %></div>
			<div class="title-attribs">
				<%= year  %>
			</div>
			<%= '<div class="author-image" style="background-image: url(img/'+authorIDs.join('_face.jpeg)"></div><div class="author-image" style="background-image: url(img/')+'_face.jpeg)"></div>'  %>
		</a>

		<div class="item-content">

			<div class="row">


				<div class="eight columns">
					<p></p>
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

					<p><strong>Förlag</strong><br/>
						<%= model.get('_source').meta_info.publisher.name+', '+model.get('_source').meta_info.publisher.place %></p>

					
				</div>
			</div>

		</div>

	</div>

</script>