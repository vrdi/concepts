const mapEl = "#interactive-chain";
const histEl = "#chain-hist";
const histBarColor = '#4198c8';
const histBarColorActive = '#d1342b';
const colorScheme = [
    "#0099cd",
    "#ffca5d",
    "#00cd99",
    "#99cd00",
    "#cd0099",
    "#9900cd",
    "#8dd3c7",
    "#bebada",
    "#fb8072",
    "#80b1d3",
    "#fdb462",
    "#b3de69",
    "#fccde5",
    "#bc80bd",
    "#a6cee3",
    "#1f78b4",
    "#fb9a99",
    "#e31a1c",
    "#ff7f00",
];

var mapSvg;
var histSvg;
var path;
var deltas;
var demSeats;
var projection = d3.geoAlbers()
                 .center([0, 40.9])
                 .rotate([77.75, 0])
                 .parallels([36, 46])
                 .scale(9000)
                 .translate([400, 300]);


function histHeights(data, endIdx, maxHeight) {
    /* Generates ticks and scaled counts for statistics over a chain run. */ 
    // We calculate the minimum and maximum values across the
    // entire dataset. That way, the histogram's appearance is
    // consistent as the range of the data expands. 
    var minVal = d3.min(data);
    var maxVal = d3.max(data);
    // For the purposes of this visualization, we assume integer bins.
    var ticks = [];
    var counts = [];
    for(var idx = minVal; idx <= maxVal; idx++){
        ticks.push(idx);
        counts.push(0);
    }
    for(var idx in data.slice(0, endIdx + 1)){
        counts[data[idx] - minVal] += 1;
    }
    var normedCounts = [];
    var countSum = d3.sum(counts);
    for(var idx = 0; idx < counts.length; idx++){
        normedCounts.push({
            seats: ticks[idx],
            height: maxHeight * counts[idx] / countSum
        });
    }
    return normedCounts;
}


var data = [d3.json("PA_vtd.json"), d3.json("runs/pa_run_1.json")]
Promise.all(data).then(function(values){
    var vtd = values[0];
    var run = values[1];
    deltas = run['deltas'];
    demSeats = run['dem_seats'];
    var geojson = topojson.feature(vtd, vtd.objects.PA_vtd_scrubbed);
    mapSvg = d3.select(mapEl).append("svg")
               .attr("width", 800) 
               .attr("height", 600)
               .attr("viewBox", "0 0 800 600")
               .attr("preserveAspectRatio", "xMidYMid meet");
    path = d3.geoPath().projection(projection);
    mapSvg.selectAll("path")
        .data(geojson.features)
        .enter()
        .append("path")
        .attr("id", function(d) { return 'precinct' + d.id; })
        .attr("d", path);

    histSvg = d3.select(histEl).append("svg")
                .attr("width", 160)
                .attr("height", 200);
    var histX = d3.scaleLinear()
                .domain([d3.min(demSeats), d3.max(demSeats) + 1])
                .range([0, 160]);
    var histY = d3.scaleLinear([0, 1]);
    heights = histHeights(demSeats, 0, 200);
    histSvg.append('g')
        .attr('fill', histBarColor)
        .selectAll('rect')
        .data(heights)
        .join('rect')
        .attr('x', function(d) { return histX(d.seats); })
        .attr('y', 0)
        .attr('height', 0)
        .attr('width', 35)
        .attr('id', function(d) { return 'seat' + d.seats; })
        .attr('class', 'hist-bar');
        
            
    
    for(var districtIdx in run.initial){
        for(var precinctIdx in run.initial[districtIdx]){
            var precinctId = run.initial[districtIdx][precinctIdx];
            d3.select("#precinct" + precinctId).style("fill", colorScheme[districtIdx]);
        }
    }

    var deltaIdx = 0;
    d3.interval(function() {
        for(var districtId in deltas[deltaIdx]){
            for(var precinctIdx in deltas[deltaIdx][districtId]){
                var precinctId = deltas[deltaIdx][districtId][precinctIdx];
                d3.select("#precinct" + precinctId).style("fill", colorScheme[districtId]);
            }
        }
        heights = histHeights(demSeats, deltaIdx, 200);
        for(var bar in heights) {
            if(heights[bar].seats == demSeats[deltaIdx]){
                var color = histBarColorActive;
            } else {
                var color = histBarColor;
            }
            d3.select('#seat' + heights[bar].seats)
                .attr('y', 200 - heights[bar].height) 
                .attr('height', heights[bar].height)
                .attr('fill', color);
        }
        // TODO in morning: move this up
        deltaIdx += 1;
    }, 200);

});

