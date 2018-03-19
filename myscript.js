<<<<<<< HEAD
//-----------------------------------------SVG-------------------------------------------




var width = 960;
var height = 600;


var svg = d3.select("body")
	.append("svg")
	.attr("width", width)
	.attr("height", height);

//------------------------------------------------------zoom-----------------------------------------------------


svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "none")
    .style("pointer-events", "all")
    .call(d3.zoom()
        .scaleExtent([1 / 2, 4])
        .on("zoom", zoomed));

function zoomed() {
    d3.selectAll("g").attr("transform", d3.event.transform);
}



//---------------------------------------------------------------------------------------


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
	             
	             
	        var rows_nodes = tbody.selectAll('tr')
	                        .data(nodes)
	                        .enter()
	                        .append('tr')
	                        .attr("id", function(d) { return "row_node" + d.node;});
	                        

	        var cells = rows_nodes.selectAll('td')
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
            rows_nodes.attr("class", "rows");
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
	             
	             
	        var rows_links = tbody.selectAll('tr')
	                        .data(edges)
	                        .enter()
	                        .append('tr')
	                        .attr("id" , function(d) {return "row_link" + d.source + d.target;});

	        var cells = rows_links.selectAll('td')
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
            rows_links.attr("class", "rows");
            div2.attr("id", "div2");
            thead.attr("class", "thead");



//--------------------------------------------------------------arrow-----------------------------------------------------------


           var defs = svg.append('svg:defs');
                defs.append('svg:marker')
                 .attr('id', 'end-arrow')
                 .attr('viewBox', '0 -5 10 10')
                .attr('refX', "21")
                 .attr('markerWidth', 5)
                 .attr('markerHeight', 5)
                .attr('orient', 'auto')
                .append('svg:path')
                 .attr('d', 'M0,-5L10,0L0,5');

     
        
        
        //-------------------------------------link------------------------------------
                
       var link = svg.append("g")
                     .attr("class", "links")
                     .selectAll("line")
                     .data(edges)
                     .enter().append("line")
                     .attr("id" , function(d) {return "link" + d.source + d.target;})
                     .attr('marker-end','url(#end-arrow)');
                     

	

//----------------------------------------node-----------------------------------



        var node = svg.append("g")
                      .attr("class", "nodes")
                      .selectAll("circle")
                      .data(nodes)
                      .enter().append("circle")
                      .attr("r", 5)
                      .attr("id" , function(d) {return "node"+ d.node;})
                      .call(d3.drag()
                      .on("start", dragstarted)
                      .on("drag", dragged)
                      .on("end", dragended));

          

//------------------------------------liaison node/edges--------------------------------------------------------


 node.append("title")

      .text(function(d) {return d.node; });


  simulation
      .nodes(nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(edges);
      
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
  
  //----------------------------------------------on click node----------------------------------------------


    rows_nodes.on("click", clickRowsNode);
    node.on("click", clickNode);
    
        
    function clickRowsNode(d, i) {
    if (d3.select(this).classed("rowSelected")) {
        d3.select(this).classed("rowSelected", false);
        decolorLinkWithNode(d);
        d3.select("#node" + d.node).classed( "nodeSelected", false);
        } 
        else 
        {
        d3.select(this).classed("rowSelected", true);
        colorLinkWithNode(d);
        d3.select("#node" + d.node).classed( "nodeSelected", true);
        }
    }

 function clickNode(d, i) {
    
    if (d3.select(this).classed("nodeSelected")) {
        d3.select(this).classed("nodeSelected", false);
        decolorLinkWithNode(d);
        d3.select("#row_node" + d.node).classed("rowSelected",false);
        } 
        else 
        {
        d3.select(this).classed("nodeSelected", true);
        colorLinkWithNode(d);
        d3.select("#row_node" + d.node).classed("rowSelected",true);
        }
    }

//------------------------------------color les link quand on clic sur leurs sources-------------------

   function colorLinkWithNode(d, i) {
      var dot = d;
      link.filter(function(d) {return d.source.node == dot.node;}).classed("linkSelectedByNode", true);
      //color les rows
      rows_links.filter(function(d) {return d.source.node == dot.node;}).classed("rowSelectedByNode", true);
   }

   function decolorLinkWithNode(d, i) {
      var dot = d;
      link.filter(function(d) {return d.source.node == dot.node;}).classed("linkSelectedByNode", false);
      //decolore les rows
      rows_links.filter(function(d) {return d.source.node == dot.node;}).classed("rowSelectedByNode", false);
   }
    
    
    //-----------------------------------------on click edges-----------------------------------
    
    rows_links.on("click", clickRowsLink);
    link.on("click", clickLink);
    
    function clickRowsLink(d, i) {
    if (d3.select(this).classed("rowSelected")) {
        d3.select(this).classed("rowSelected", false);
        d3.select("#link" + d.source.node + d.target.node).classed( "linkSelected", false);
        } 
        else 
        {
        d3.select(this).classed("rowSelected", true);
        d3.select("#link" + d.source.node + d.target.node).classed( "linkSelected", true);
        }
    }
    
     function clickLink(d, i) {
    
    if (d3.select(this).classed("linkSelected")) {
        d3.select(this).classed("linkSelected", false);
        d3.select("#row_link" + d.source.node + d.target.node).classed("rowSelected",false);
        } 
        else 
        {
        d3.select(this).classed("linkSelected", true);
        d3.select("#row_link" + d.source.node + d.target.node).classed("rowSelected",true);
        }
    }
    
    
   //faire un bouton pour tout deselectionner
    
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





=======
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
	             
	             
	        var rows_nodes = tbody.selectAll('tr')
	                        .data(nodes)
	                        .enter()
	                        .append('tr')
	                        .attr("id", function(d) { return "row_node" + d.node;});
	                        

	        var cells = rows_nodes.selectAll('td')
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
            rows_nodes.attr("class", "rows");
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
	             
	             
	        var rows_links = tbody.selectAll('tr')
	                        .data(edges)
	                        .enter()
	                        .append('tr')
	                        .attr("id" , function(d) {return "row_link" + d.source + d.target;});

	        var cells = rows_links.selectAll('td')
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
            rows_links.attr("class", "rows");
            div2.attr("id", "div2");
            thead.attr("class", "thead");
            
            
       
        
        
        //-------------------------------------link------------------------------------
                
       var link = svg.append("g")
                     .attr("class", "links")
                     .selectAll("line")
                     .data(edges)
                     .enter().append("line")
                     .attr("id" , function(d) {return "link" + d.source + d.target;});
                     

	

//----------------------------------------node-----------------------------------



        var node = svg.append("g")
                      .attr("class", "nodes")
                      .selectAll("circle")
                      .data(nodes)
                      .enter().append("circle")
                      .attr("r", 5)
                      .attr("id" , function(d) {return "node"+ d.node;})
                      .call(d3.drag()
                      .on("start", dragstarted)
                      .on("drag", dragged)
                      .on("end", dragended));

          

//------------------------------------liaison node/edges--------------------------------------------------------


 node.append("title")

      .text(function(d) {return d.node; });


  simulation
      .nodes(nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(edges);
      
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
  
  //----------------------------------------------on click node----------------------------------------------


    rows_nodes.on("click", clickRowsNode);
    node.on("click", clickNode);
    
        
    function clickRowsNode(d, i) {
    if (d3.select(this).classed("rowSelected")) {
        d3.select(this).classed("rowSelected", false);
        d3.select("#node" + d.node).classed( "nodeSelected", false);
        } 
        else 
        {
        d3.select(this).classed("rowSelected", true);
        d3.select("#node" + d.node).classed( "nodeSelected", true);
        }
    }
    
    
    function clickNode(d, i) {
    
    if (d3.select(this).classed("nodeSelected")) {
        d3.select(this).classed("nodeSelected", false);
        d3.select("#row_node" + d.node).classed("rowSelected",false);
        } 
        else 
        {
        d3.select(this).classed("nodeSelected", true);
        d3.select("#row_node" + d.node).classed("rowSelected",true);
        }
    }
    
    //-----------------------------------------on click edges-----------------------------------
    
    rows_links.on("click", clickRowsLink);
    link.on("click", clickLink);
    
    function clickRowsLink(d, i) {
    if (d3.select(this).classed("rowSelected")) {
        d3.select(this).classed("rowSelected", false);
        d3.select("#link" + d.source.node + d.target.node).classed( "linkSelected", false);
        } 
        else 
        {
        d3.select(this).classed("rowSelected", true);
        d3.select("#link" + d.source.node + d.target.node).classed( "linkSelected", true);
        }
    }
    
     function clickLink(d, i) {
    
    if (d3.select(this).classed("linkSelected")) {
        d3.select(this).classed("linkSelected", false);
        d3.select("#row_link" + d.source.node + d.target.node).classed("rowSelected",false);
        } 
        else 
        {
        d3.select(this).classed("linkSelected", true);
        d3.select("#row_link" + d.source.node + d.target.node).classed("rowSelected",true);
        }
    }
    
    
   //faire un bouton pour tout deselectionner
    
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

>>>>>>> master
