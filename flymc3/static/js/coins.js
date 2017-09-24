var coinData = [];

drawCoins = function() {
  if (coinData.length === 0) {
    return;
  }

	var formatCount = d3.format(",.0f");


	var svg = d3.select("#coinPlot"),
			margin = {top: 10, right: 30, bottom: 30, left: 30},
			width = +svg.attr("width") - margin.left - margin.right,
			height = +svg.attr("height") - margin.top - margin.bottom;

  svg.select('g').remove();

  var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var x = d3.scaleLinear()
			.rangeRound([0, width]);

	var bins = d3.histogram()
			.domain(x.domain())
			.thresholds(x.ticks($('#plotBins').val()))
			(coinData.map(function(d) { return d.p; }));

	var y = d3.scaleLinear()
			.domain([0, d3.max(bins, function(d) { return d.length; })])
			.range([height, 0]);

	var bar = g.selectAll(".bar")
		.data(bins)
		.enter().append("g")
			.attr("class", "bar")
			.attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });

	bar.append("rect")
			.attr("x", 1)
			.attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
			.attr("height", function(d) { return height - y(d.length); });

	bar.append("text")
			.attr("dy", ".75em")
			.attr("y", 6)
			.attr("x", (x(bins[0].x1) - x(bins[0].x0)) / 2)
			.attr("text-anchor", "middle")
			.text(function(d) { return formatCount(d.length); });

	g.append("g")
			.attr("class", "axis axis--x")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x));
};

getCurrentInput = function() {
    return {
      draws: $('#coinDraws').val(),
      alpha: $('#coinAlpha').val(),
      beta: $('#coinBeta').val(),
      heads: $('#coinHeads').val(),
      tails: $('#coinTails').val(),
    };
};

drawSamples = function() {
    $('#coinButton').addClass('disabled');
    $.getJSON('/flip_coins', getCurrentInput(), function(data) {
      coinData = data;
      drawCoins();
      sampling = false;
      $('#coinButton').removeClass('disabled');
    });
};

$('#plotBins').on('change',drawCoins);

$("#coinButton").on("click", drawSamples);

$(document).ready(drawSamples);
