<script id="ngramInfoTemplate" type="text/template">

	<p><strong><%= data.year %></strong><br/>
		Totalt antal dokument: <%= data.total %></p>
		<% _.each(data.legends, function(item, index) { %>
		<div class="item" data-index="<%= index %>">
			<div class="color" style="background-color: <%= item.color %>"></div>
			<div class="label"><strong><%= item.key+' '+item.filterStrings.join(' ') %></strong>: <%= item.data.doc_count %> <span class="text-light">(<%= Math.round((item.data.doc_count/data.total)*10000)/10000 %>%)</span></div>
		</div>
	<% }) %>
	
</script>