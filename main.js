// FLOW 
// FIRST DRAW THE AXIS : X - PARENT COMPANY ID/VALUE 
//                       Y - SCORES
// THEN DRAW THE NODES: X - MATCHING COMPANY&PARENT COMPANY WITH PARENT COMPANY ID
//                      Y - MATCHING SCORES 
// Notes: 1. every company(parent and child) should have a unique ID specifying their parent company(Y-axis)
//        2. data should be nested- hierarchical 
//        3. Ordinal scale should be used : http://bost.ocks.org/mike/bar/3/ 
//
// SAMPLE CODE: http://bl.ocks.org/mbostock/4062085 
//              http://bl.ocks.org/Caged/6476579


//-------------------//
// Sorting Data     // 
//------------------//

//THIS PART IS PASTED TO LOADDATA.JS FILE. 

//var yDomainCeiling;
//var IQMax;
//var parentList = [];
//var allData= d3.csv("EditedData.csv", function (d) {
//    console.log(d);
//    var loggedData = d;
//    var count = 0;
//    var tempMax = 0;
//    for (var i = 0; i < d.length; i++) {
//        if (d[i].ParentorChild == "Parent") {
//            count += 1;
//            parentList.push(d[i]);
//        }
//    }
//    yDomainCeiling = count;
//    console.log(count);
//
//    IQMax = Math.max.apply(Math, d.map(function (o) {
//        return o.MaxDigitalIQ;
//    }));
//    console.log(IQMax);
//    console.log(parentList);
//    
//    drawChart(); // have this function here so that everything is done after the data is completely loaded. 
//});



// --------------------------- //
//  Creating Globals & Initializing
// ----------------------------//

function initialize() {

    var maxWidth = Math.max(800, Math.min(window.innerHeight, window.innerWidth) - 250);

    // figure out where to use the maxWidth var to have the right scale ???? 
    var margin = {
        top: 30,
        right: 30,
        bottom: 40,
        left: 50
    }; 
    
   console.log ($(window).height());
    
    var width = $(window).width() - margin.left - margin.right; 
    
    //height = $(window).height 
    
    var height = 400 - margin.top - margin.bottom;
   // var width = maxWidth - margin.left - margin.right;


    var chartSVG = d3.select("#chart")
        .append("svg")
        .style("background", "white")
        .attr("width", width)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    var xScale = d3.scale.ordinal()
        .domain(d3.range(0, parentList.length))
        .rangeBands([0, width]);

    var yScale = d3.scale.linear()
        .domain([0, 170])
        .range([0, height]);

    //    var xAxis = d3.svg.axis()
    //        .scale(xScale)
    //        .orient("bottom");

    //    var yAxis = d3.svg.axis()
    //        .scale(yScale)
    //        .orient("left").ticks(20);
    //
    //    var yGuide = d3.select("svg").append("g").attr("transform","translate(35,0)");

    //ToolTip
    var toolTip = d3.select(document.getElementById("toolTip"));
    var DIQ = d3.select(document.getElementById("DIQ"));
    var Lable = d3.select(document.getElementById("Label"));
    var NameOfCompany = d3.select(document.getElementById("NameOfCompany"));

    //-------------------//
    //  Drawing         // 
    //------------------//


    //create function to draw grey bars
    function drawChart() {

        var myChart = chartSVG
            .append("g")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
            .selectAll("rect")
            .data(parentList)
            .enter()
            .append("rect")
            .attr("width", xScale.rangeBand() * 0.2)
            .attr("x", function (d, i) {
                console.log(xScale(i));
                return xScale(i) + xScale.rangeBand() * 0.4;
            })
            .attr("height", function (d, i) {
                console.log(yScale(d.MaxDigitalIQ - d.MinDigitalIQ));
                return yScale(d.MaxDigitalIQ - d.MinDigitalIQ) + 10;
            })
            .attr("y", function (d, i) {
                var yPosition = height - yScale(d.MaxDigitalIQ);
                console.log(yPosition);
                return yPosition - 5;
            })
            .attr("fill", "rgb(229,229,229)");
    }


    //create functions to draw nodes 
    function drawNodes() {
        var thisNodeX;
        var parentNodes = chartSVG.append("g")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
            .selectAll("circle")
            .data(parentList)
            .enter()
            .append("circle")
            .attr("cx", function (d, i) {
                console.log(i);
                thisNodeX = xScale(i) + xScale.rangeBand() * 0.5
                return thisNodeX;
            })
            .attr("cy", function (d, i) {
                return height - yScale(d.AvgDigitalIQ);
            })
            .attr("r", function (d, i) {
                console.log(d.AvgDigitalIQ);
                return xScale.rangeBand() * 0.06;
            })
            .attr("stroke", "false")
            .attr("fill", function (d, i) {

                if (d.AvgDigitalIQ > 140) {
                    return "rgb(62,165,72)";
                } else if (d.AvgDigitalIQ > 110 && d.AvgDigitalIQ <= 140) {
                    return "rgb(0,176,158)";
                } else if (d.AvgDigitalIQ > 90 && d.AvgDigitalIQ <= 110) {
                    return "rgb(138,113,179)";
                } else if (d.AvgDigitalIQ > 70 && d.AvgDigitalIQ <= 90) {
                    return "rgb(223,196,35)";
                } else if (d.AvgDigitalIQ < 70) {
                    return "rgb(231,67,65)";
                }
            })

        .on("mouseover", function (d) {
                var thisProject = d;
                toolTip.transition()
                    .duration(200)
                    .style("opacity", 0.8)
                    .style("position", "absolute")
                    .style("left", (d3.event.pageX + 15) + "px")
                    .style("top", (d3.event.pageY - 25) + "px")
                    .style("height", "100px");
                DIQ.text(function () {
                        return "DIQ: " + thisProject.AvgDigitalIQ;
                    })
                    .style("font-family", "Helvetica Neue LT Std")
                    .style("font-size", "11")
                    .style("color", "rgb(128,128,128)");

                Lable.text(function () {

                        if (thisProject.AvgDigitalIQ > 140) {
                            return "Genius";
                        } else if (thisProject.AvgDigitalIQ > 110 && thisProject.AvgDigitalIQ <= 140) {
                            return "Gifted";
                        } else if (thisProject.AvgDigitalIQ > 90 && thisProject.AvgDigitalIQ <= 110) {
                            return "Average";
                        } else if (thisProject.AvgDigitalIQ > 70 && thisProject.AvgDigitalIQ <= 90) {
                            return "Challenged";
                        } else if (thisProject.AvgDigitalIQ < 70) {
                            return "Feeble";
                        }
                    })
                    .style("font-family", "Helvetica Neue LT Std")
                    .style("font-size", "11")
                    .style("color", function (d, i) {
                        if (thisProject.AvgDigitalIQ > 140) {
                            return "rgb(62,165,72)";
                        } else if (thisProject.AvgDigitalIQ > 110 && thisProject.AvgDigitalIQ <= 140) {
                            return "rgb(0,176,158)";
                        } else if (thisProject.AvgDigitalIQ > 90 && thisProject.AvgDigitalIQ <= 110) {
                            return "rgb(138,113,179)";
                        } else if (thisProject.AvgDigitalIQ > 70 && thisProject.AvgDigitalIQ <= 90) {
                            return "rgb(223,196,35)";
                        } else if (thisProject.AvgDigitalIQ < 70) {
                            return "rgb(231,67,65)";
                        }
                    });

                NameOfCompany.text(function () {
                        return thisProject.Brands + "(Parent)";
                    })
                    .style("font-family", "Helvetica Neue LT Std")
                    .style("font-size", "12");

            })
            .on("mouseout", function () {

                toolTip.transition()
                    .duration(500)
                    .style("opacity", "0");

            });

        var childNodes = chartSVG.append("g")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
            .selectAll("circle")
            .data(childList)
            .enter()
            .append("circle")
            .attr("cx", function (d, i) {
                var parentIndex = _.findIndex(parentList, {
                    "Brands": d.ParentCompany
                });
                return xScale(parentIndex) + xScale.rangeBand() * 0.5;
            })
            .attr("cy", function (d, i) {
                return height - yScale(d.DigitalIQ);
            })
            .attr("r", function (d, i) {
                return xScale.rangeBand() * 0.03;
            })
            .attr("stroke", "false")
            .attr("fill", function (d, i) {
                return "rgb(69,69,69)";
            }).on("mouseover", function (d) {
                var thisProject = d
                toolTip.transition()
                    .duration(200)
                    .style("opacity", 0.8)
                    .style("position", "absolute")
                    .style("left", (d3.event.pageX + 15) + "px")
                    .style("top", (d3.event.pageY - 25) + "px")
                    .style("height", "100px");
                DIQ.text(function () {
                        return "DIQ: " + thisProject.DigitalIQ;
                    })
                    .style("font-family", "Helvetica Neue LT Std")
                    .style("font-size", "11")
                    .style("color", "rgb(128,128,128)");

                Lable.text(function () {

                        if (thisProject.DigitalIQ > 140) {
                            return "Genius";
                        } else if (thisProject.DigitalIQ > 110 && thisProject.DigitalIQ <= 140) {
                            return "Gifted";
                        } else if (thisProject.DigitalIQ > 90 && thisProject.DigitalIQ <= 110) {
                            return "Average";
                        } else if (thisProject.DigitalIQ > 70 && thisProject.DigitalIQ <= 90) {
                            return "Challenged";
                        } else if (thisProject.DigitalIQ < 70) {
                            return "Feeble";
                        }
                    })
                    .style("font-family", "Helvetica Neue LT Std")
                    .style("font-size", "11")
                    .style("color", function (d, i) {
                        if (thisProject.DigitalIQ > 140) {
                            return "rgb(62,165,72)";
                        } else if (thisProject.DigitalIQ > 110 && thisProject.DigitalIQ <= 140) {
                            return "rgb(0,176,158)";
                        } else if (thisProject.DigitalIQ > 90 && thisProject.DigitalIQ <= 110) {
                            return "rgb(138,113,179)";
                        } else if (thisProject.DigitalIQ > 70 && thisProject.DigitalIQ <= 90) {
                            return "rgb(223,196,35)";
                        } else if (thisProject.DigitalIQ < 70) {
                            return "rgb(231,67,65)";
                        }
                    });

                NameOfCompany.text(function () {
                        return thisProject.Brands;
                    })
                    .style("font-family", "Helvetica Neue LT Std")
                    .style("font-size", "12");

            })
            .on("mouseout", function () {

                toolTip.transition()
                    .duration(500)
                    .style("opacity", "0");

            });


    }


    drawChart();
    drawNodes();

    // DRAWING VGUIDE
    var vGuideScale = d3.scale.linear()
        .domain([0, 170])
        .range([height, 0]);

    var vAxis = d3.svg.axis()
        .scale(vGuideScale)
        .orient('left')
        .ticks(10);

    var vGuide = chartSVG.append('g').call(vAxis);
    // vAxis(vGuide); // this line is equal to ".call(vAxis)"
    vGuide.attr('transform', 'translate(35, 30)'); // the 30 comes from the "margin" obj
    vGuide.selectAll('path')
        .style({
            fill: 'none',
            stroke: "#000"
        });
    vGuide.selectAll('line')
        .style({
            stroke: "#000"
        });
}