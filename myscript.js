//-----------------------------------------SVG-------------------------------------------

var height = 400;


var svg = d3.select("body")
    .append("div")
    .attr("id", "div_svg")
	.append("svg")
	.attr("width", "100%")
	.attr("height", height);
	
var width = parseInt(svg.style("width"));

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
  
d3.select(".links").attr("transform", d3.event.transform);
d3.select(".node_list").attr("transform", d3.event.transform);
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
        
        var div1 = d3.select("#div_svg").append("div");
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
                .attr('refX', "17")
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
	                            .attr("class", "node_list")
	                            .selectAll("g")
	                            .data(nodes)
	                            .enter().append("g")
	                            .attr("class", "nodes")
	                            .attr("id" , function(d) {return "node"+ d.node;})
	                            .call(d3.drag()
	                            .on("start", dragstarted)
	                            .on("drag", dragged)
	                            .on("end", dragended));

	                            
	                      node.append("path")
	                          .attr("d", d3.symbol()
	                                    .size(100)
                                        .type(function(d) { return choisirType(d);}));

                                        
          function choisirType(d) {
                    switch (d.kind) {
                        case "init": return d3.symbolStar;
                        case "dead": return d3.symbolSquare;
                        case "scc" : return d3.symbolCircle;
                        case "basin": return d3.symbolDiamond;
                        case "init+scc": return d3.symbolTriangle;
                        case "dead+basin": return d3.symbolWye;
                        case "dead+init": return d3.symbolCross;
                        default: console.log("le type de la node "+ d.node + " n'est pas reconnu (kind)");
                            }
                        }

     

          

//------------------------------------liaison node/edges--------------------------------------------------------


 node.append("title")

      .text(function(d) {return d.node; });


  simulation
      .nodes(nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(edges);
      
       function ticked() {
       
    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
       
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
        
  }
  
  //---------------------------------------------click---------------------------------------------------
    
    svg.on("click", deselectAll);
    
    function deselectAll() {
        if (!d3.event.ctrlKey) {
            d3.selectAll(".NodeRowSelected").each(function(d) {
                                                     d3.select(this).classed("NodeRowSelected", false);
                                                     decolorLinkWithNodeSource(d);
                                                     decolorLinkWithNodeTarget(d);
                                                     d3.select("#node" + d.node).classed( "nodeSelected", false);
                                                      });
            d3.selectAll(".nodeSelected").each(function(d) {
                                                     d3.select(this).classed("nodeSelected", false);
                                                     decolorLinkWithNodeSource(d);
                                                     decolorLinkWithNodeTarget(d);
                                                     d3.select("#row_node" + d.node).classed("NodeRowSelected",false);
                                                     });
            d3.selectAll(".EdgeRowSelected").each(function(d) {
                                                     d3.select(this).classed("EdgeRowSelected", false);
                                                     decolorNodeWithEdgeSource(d);
                                                     decolorNodeWithEdgeTarget(d);
                                                     d3.select("#link" + d.source.node + d.target.node).classed( "linkSelected", false);
                                                     });    
            d3.selectAll(".linkSelected").each(function(d) {
                                                     d3.select(this).classed("linkSelected", false);
                                                     decolorNodeWithEdgeSource(d);
                                                     decolorNodeWithEdgeTarget(d);
                                                     d3.select("#row_link" + d.source.node + d.target.node).classed("EdgeRowSelected",false);
                                                     });
            }
    }
        
  
  //----------------------------------------------on click node----------------------------------------------


    rows_nodes.on("click", clickRowsNode);
    node.on("click", clickNode);
    
        
    function clickRowsNode(d, i) {
        if (d3.select(this).classed("NodeRowSelected")) {
            d3.select(this).classed("NodeRowSelected", false);
            decolorLinkWithNodeSource(d);
            decolorLinkWithNodeTarget(d);
            d3.select("#node" + d.node).classed( "nodeSelected", false);
            } 
            else 
            {
            d3.select(this).classed("NodeRowSelected", true);
            colorLinkWithNodeSource(d);
            colorLinkWithNodeTarget(d);
            d3.select("#node" + d.node).classed( "nodeSelected", true);
            }
    }

 function clickNode(d, i) {
    if (d3.event.ctrlKey) {
        if (d3.select(this).classed("nodeSelected")) {
            d3.select(this).classed("nodeSelected", false);
            decolorLinkWithNodeSource(d);
            decolorLinkWithNodeTarget(d);
            d3.select("#row_node" + d.node).classed("NodeRowSelected",false);
            } 
            else 
            {
            d3.select(this).classed("nodeSelected", true);
            colorLinkWithNodeSource(d);
            colorLinkWithNodeTarget(d);
            d3.select("#row_node" + d.node).classed("NodeRowSelected",true);
            }
       }
    }

//------------------------------------color les link quand on clic sur leurs sources et target-------------------

   function colorLinkWithNodeSource(d, i) {
      var dot = d;
      link.filter(function(d) {return d.source.node == dot.node;}).classed("linkSelectedByNodeSource", true);
      //color les rows
      rows_links.filter(function(d) {return d.source.node == dot.node;}).classed("EdgeRowSelectedByNodeSource", true);
   }

   function decolorLinkWithNodeSource(d, i) {
      var dot = d;
      link.filter(function(d) {return d.source.node == dot.node;}).classed("linkSelectedByNodeSource", false);
      //decolore les rows
      rows_links.filter(function(d) {return d.source.node == dot.node;}).classed("EdgeRowSelectedByNodeSource", false);
   }


    function colorLinkWithNodeTarget(d, i) {
      var dot = d;
      link.filter(function(d) {return d.target.node == dot.node;}).classed("linkSelectedByNodeTarget", true);
      //color les rows
      rows_links.filter(function(d) {return d.target.node == dot.node;}).classed("EdgeRowSelectedByNodeTarget", true);
   }

   function decolorLinkWithNodeTarget(d, i) {
      var dot = d;
      link.filter(function(d) {return d.target.node == dot.node;}).classed("linkSelectedByNodeTarget", false);
      //decolore les rows
      rows_links.filter(function(d) {return d.target.node == dot.node;}).classed("EdgeRowSelectedByNodeTarget", false);
   }
    
    
    //-----------------------------------------on click edges-----------------------------------
    
    rows_links.on("click", clickRowsLink);
    link.on("click", clickLink);
    
    function clickRowsLink(d, i) {
        if (d3.select(this).classed("EdgeRowSelected")) {
            d3.select(this).classed("EdgeRowSelected", false);
            decolorNodeWithEdgeSource(d);
            decolorNodeWithEdgeTarget(d);
            d3.select("#link" + d.source.node + d.target.node).classed( "linkSelected", false);
            } 
            else 
            {
            d3.select(this).classed("EdgeRowSelected", true);
            colorNodeWithEdgeSource(d);
            colorNodeWithEdgeTarget(d);
            d3.select("#link" + d.source.node + d.target.node).classed( "linkSelected", true);
            }
    }
    
     function clickLink(d, i) {
        if (d3.event.ctrlKey) {
            if (d3.select(this).classed("linkSelected")) {
                d3.select(this).classed("linkSelected", false);
                decolorNodeWithEdgeSource(d);
                decolorNodeWithEdgeTarget(d);
                d3.select("#row_link" + d.source.node + d.target.node).classed("EdgeRowSelected",false);
                } 
                else 
                {
                d3.select(this).classed("linkSelected", true);
                colorNodeWithEdgeSource(d);
                colorNodeWithEdgeTarget(d);
                d3.select("#row_link" + d.source.node + d.target.node).classed("EdgeRowSelected",true);
                }
            }
        }
    
  //-----------------------------------color les nodes quand on clic sur leurs edges---------------
  
  
  function colorNodeWithEdgeSource(d, i) {
      var edg = d;
      node.filter(function(d) {return d.node == edg.source.node;}).classed("NodeSelectedByEdgeSource", true);
      //color les rows
      rows_nodes.filter(function(d) {return d.node == edg.source.node;}).classed("NodeRowSelectedByEdgeSource", true);
   }

   function decolorNodeWithEdgeSource(d, i) {
      var edg = d;
      node.filter(function(d) {return d.node == edg.source.node;}).classed("NodeSelectedByEdgeSource", false);
      //decolore les rows
      rows_nodes.filter(function(d) {return d.node == edg.source.node;}).classed("NodeRowSelectedByEdgeSource", false);
   }
   
    function colorNodeWithEdgeTarget(d, i) {
      var edg = d;
      node.filter(function(d) {return d.node == edg.target.node;}).classed("NodeSelectedByEdgeTarget", true);
      //color les rows
      rows_nodes.filter(function(d) {return d.node == edg.target.node;}).classed("NodeRowSelectedByEdgeTarget", true);
   }

   function decolorNodeWithEdgeTarget(d, i) {
      var edg = d;
      node.filter(function(d) {return d.node == edg.target.node;}).classed("NodeSelectedByEdgeTarget", false);
      //decolore les rows
      rows_nodes.filter(function(d) {return d.node == edg.target.node;}).classed("NodeRowSelectedByEdgeTarget", false);
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





