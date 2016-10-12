<script id="ngramInfoTemplate" type="text/template">

	<p><strong><%= data.year %></strong><br/>
		<%= data.totalLabelText %>: <%= data.total %></p>
		<% _.each(data.legends, function(item, index) { %>
		<div class="item" data-index="<%= index %>">
			<div class="color" style="background-color: <%= item.color %>"></div>
			<div class="label">
				<strong><%= item.key+' '+item.filterString %></strong>: 
				<%= item.data[data.graphValueKey] %> 
				<span class="text-light">
					(<%= isNaN(Math.round((item.data[data.graphValueKey]/data.total)*1000)/1000) ? 0 : Math.round((item.data[data.graphValueKey]/data.total)*1000)/1000 %>%)
				</span>
			</div>
		</div>
	<% }) %>
	
</script>