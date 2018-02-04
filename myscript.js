//-----------------------------------------SVG-------------------------------------------

var svg = d3.select("body")
					.append("svg")
					.attr("width", 960)
					.attr("height", 600);
					
var width = svg.attr("width");
var height = svg.attr("height");
   
//---------------------------------------------------------------------------------------

var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.node; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));
    

//----------------------------------------variables-------------------------------------

var nodes;
var edges;

							
//----------------------------------------extraction données------------------------------
	d3.csv("nodes.csv", function(data1) {
	    d3.csv("edges.csv", function(data2) {
	
		nodes = data1;
		edges = data2;
		
		//tableau nodes
        
        var div1 = d3.select("body").append("div");
	        var table = div1.append("table");
	        var thead = table.append('thead');
	        var tbody = table.append('tbody');

	        thead.append('tr')
	             .selectAll('th')
	             .data(nodes.columns)
	             .enter()
	             .append('th')
	             .text(function (d) { return d });
	             
	             
	        var rows = tbody.selectAll('tr')
	                        .data(nodes)
	                        .enter()
	                        .append('tr');

	        var cells = rows.selectAll('td')
	                        .data(function(row) {
	    	                        return nodes.columns.map(function (column) {
	    		                                            return { column: column, value: row[column] }
	                                           })
                                     })
                            .enter()
                            .append('td')
                            .text(function (d) { return d.value });
                            
            table.attr("class", "table");
            cells.attr("class", "cells");
            thead.attr("class", "thead");
            rows.attr("class", "rows");
            div1.attr("id", "div1");
            
       //tableau edges 
       
       var div2 = d3.select("body").append("div");
	        var table = div2.append("table");
	        var thead = table.append('thead');
	        var tbody = table.append('tbody');

	        thead.append('tr')
	             .selectAll('th')
	             .data(edges.columns)
	             .enter()
	             .append('th')
	             .text(function (d) { return d });
	             
	             
	        var rows = tbody.selectAll('tr')
	                        .data(edges)
	                        .enter()
	                        .append('tr');

	        var cells = rows.selectAll('td')
	                        .data(function(row) {
	    	                        return edges.columns.map(function (column) {
	    		                                            return { column: column, value: row[column] }
	                                           })
                                     })
                            .enter()
                            .append('td')
                            .text(function (d) { return d.value });
                            
            table.attr("class", "table");
            cells.attr("class", "cells");
            rows.attr("class", "rows");
            div2.attr("id", "div2");
            thead.attr("class", "thead");
            
       
        
        
        //-------------------------------------link------------------------------------
                
       var link = svg.append("g")
                     .attr("class", "links")
                     .selectAll("line")
                     .data(edges)
                     .enter().append("line")
                     .attr("stroke-width", "1");
	

	

//----------------------------------------node-----------------------------------



        var node = svg.append("g")
                      .attr("class", "nodes")
                      .selectAll("circle")
                      .data(nodes)
                      .enter().append("circle")
                      .attr("r", 5)
                      .call(d3.drag()
                      .on("start", dragstarted)
                      .on("drag", dragged)
                      .on("end", dragended));

          

//--------------------------------------------------------------------------------------------


 node.append("title")

      .text(function(d) {return d.node; });


  simulation
      .nodes(nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(edges);
      console.log(edges);
      
       function ticked() {
       
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  }

	
	});//sortie edges
	});//sortie nodes
			
           
                
  

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

