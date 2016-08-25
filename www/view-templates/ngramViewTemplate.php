<script id="ngramViewTemplate" type="text/template">

<!--	<h2 class="text-center">Results by year</h2>-->
<!--	<p class="text-center">Search for: <span class="search-term-label"></span></p>-->


	<div class="ngram-tools ngram-view-mode tabs u-pull-left">
		<a class="tab" data-viewmode="relative">Relativt</a>
		<a class="tab selected" data-viewmode="absolute">Absolut</a>
	</div>

	<div class="ngram-tools ngram-result-mode tabs u-pull-right">
		<a class="tab selected" data-resultmode="doc_count">doc_count</a>
		<a class="tab" data-resultmode="auth_count">auth_count</a>
		<a class="tab" data-resultmode="work_count">work_count</a>
		<a class="tab" data-resultmode="part_count">part_count</a>
	</div>

	<svg class="chart-container" width="100%" height="500"></svg>

	<div class="info-overlay"></div>

	<div class="no-results-overlay"><span class="label">Inga träffar</span></div>

	<div class="loading-overlay"></div>
	
</script>