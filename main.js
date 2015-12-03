// FLOW 
// FIRST DRAW THE AXIS : X - PARENT COMPANY ID/VALUE 
//                       Y - SCORES
// THEN DRAW THE NODES: X - MATCHING COMPANY&PARENT COMPANY WITH PARENT COMPANY ID
//                      Y - MATCHING SCORES 
// Notes: 1. every company(parent and child) should have a unique ID specifying their parent company(Y-axis)
//        2. Ordinal scale should be used : http://bost.ocks.org/mike/bar/3/ 
//
// SAMPLE CODE: http://bl.ocks.org/mbostock/4062085 
//              http://bl.ocks.org/Caged/6476579




// --------------------------- //
//  Creating Globals & Initializing
// ----------------------------//




function initialize() {

    // CHART
    var chartSVG = d3.select("#chart")
        .append("svg")
        .attr("id", "chartSVG")
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

    var vGuideScale = d3.scale.linear()
        .domain([0, 170])
        .range([height, 0]);

    var vAxis = d3.svg.axis()
        .scale(vGuideScale)
        .orient('right')
        .tickSize(width)
        .ticks(20);
    var vGuide = chartSVG.append('g').attr("class", "vGuide").call(vAxis);


    //drawing dotted lines
    vGuide.append("line")
        .attr("class", "dotted")
        .attr("x1", 0)
        .attr("y1", function (d) {
            return height - yScale(70);
        })
        .attr("x2", width)
        .attr("y2", function (d) {
            return height - yScale(70);
        })
        .attr("stroke", "#808080")
        .attr("stroke-width", 1)
        .style("stroke-dasharray", ("3,4 "));

    vGuide.append("line")
        .attr("class", "dotted")
        .attr("x1", 0)
        .attr("y1", function (d) {
            return height - yScale(90);
        })
        .attr("x2", width)
        .attr("y2", function (d) {
            return height - yScale(90);
        })
        .attr("stroke", "#808080")
        .attr("stroke-width", 1)
        .style("stroke-dasharray", ("3,4 "));

    vGuide.append("line")
        .attr("class", "dotted")
        .attr("x1", 0)
        .attr("y1", function (d) {
            return height - yScale(110);
        })
        .attr("x2", width)
        .attr("y2", function (d) {
            return height - yScale(110);
        })
        .attr("stroke", "#808080")
        .attr("stroke-width", 1)
        .style("stroke-dasharray", ("3,4 "));

    vGuide.append("line")
        .attr("class", "dotted")
        .attr("x1", 0)
        .attr("y1", function (d) {
            return height - yScale(140);
        })
        .attr("x2", width)
        .attr("y2", function (d) {
            return height - yScale(140);
        })
        .attr("stroke", "#808080")
        .attr("stroke-width", 1)
        .style("stroke-dasharray", ("3,4 "));



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
            //.attr("width", xScale.rangeBand() * 0.3)
            .attr("width", "28px")
            .attr("x", function (d, i) {
                console.log(xScale(i));
                //X: HAVING RECT WIDTH FIXED AND THE POSITION IS NOT OFF COLUMN-CENTER:
                return xScale(i) + (xScale.rangeBand() - 28) / 2;
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
            .attr("fill", "rgb(233,233,233)");
            
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
            .attr("id", function (d) {

                return d.ParentCompany + "P";
            })
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
            }
                 
                 )

        .on("mouseover", function (d, i) {
                console.log(i);
                var thisProject = d;

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

                        return thisProject.Brands;
                    })
                    .style("font-family",  "Helvetica Neue LT Std")
                    .style("font-size", "12");

                //                d3.select(document.getElementById(d.ParentCompany + "P")).transition().duration(500)
                //                    .attr("cx", function (d) {
                //
                //                        thisNodeX = xScale(i) + xScale.rangeBand() * 0.4;
                //                        console.log(thisNodeX);
                //                        return thisNodeX;
                //
                //                    })
                //                    .attr("fill", function (d) {
                //                        console.log(d);
                //                        console.log(thisProject.DigitalIQ);
                //                        if (thisProject.DigitalIQ > 140) {
                //                            return "rgb(62,165,72)";
                //                        } else if (thisProject.AvgDigitalIQ > 110 && thisProject.AvgDigitalIQ <= 140) {
                //                            return "rgb(0,176,158)";
                //                        } else if (thisProject.AvgDigitalIQ > 90 && thisProject.AvgDigitalIQ <= 110) {
                //                            return "rgb(138,113,179)";
                //                        } else if (thisProject.AvgDigitalIQ > 70 && thisProject.AvgDigitalIQ <= 90) {
                //                            return "rgb(223,196,35)";
                //                        } else if (thisProject.AvgDigitalIQ < 70) {
                //                            return "rgb(231,67,65)";
                //                        }
                //                    })
                //                    .attr("opacity", "0.5");

                toolTip.transition()
                    .duration(200)
                    .style("opacity", 0.8)
                    .style("position", "absolute")
                    .style("left", (d3.event.pageX + 15) + "px")
                    .style("top", (d3.event.pageY - 25) + "px")
                    .style("width", function () {
                        return xScale.rangeBand();
                    })
                    .style("height", function () {

                        var tempObj = document.getElementById("Index" + thisProject.Brands);
                        var lineNum = tempObj.childElementCount;
                        console.log(tempObj.childElementCount);
                        return 17 + 22 * lineNum;
                    });

            })
            .on("mouseout", function (d, i) {


                d3.select(document.getElementById(d.ParentCompany + "P")).transition().duration(500)
                    .attr("cx", function (d) {

                        thisNodeX = xScale(i) + xScale.rangeBand() * 0.5;
                        return thisNodeX;

                    })
                    .attr("fill", function (d) {
                        var thisProject = d;
                        if (thisProject.DigitalIQ > 140) {
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

                    }).attr("opacity", "1");

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
            .attr("id", function (d) {
                return d.Brands;
            })
            .attr("cx", function (d, i) {
                var parentIndex = _.findIndex(parentList, {
                    "Brands": d.ParentCompany
                });
                return xScale(parentIndex) + xScale.rangeBand() * 0.5;
            })
            .attr("cy", function (d, i) {
                console.log(d)
                return height - yScale(d.DigitalIQ);
            })
            .attr("r", function (d, i) {
                return xScale.rangeBand() * 0.03;
            })
            .attr("stroke", "false")
            .attr("fill", function (d, i) {
                return "rgb(69,69,69)";
            }).on("mouseover", function (d) {
                var thisProject = d;
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

                //                d3.select(document.getElementById(d.Brands)).transition().duration(500)
                //                    .attr("cx", function (d, i) {
                //                        var parentIndex = _.findIndex(parentList, {
                //                            "Brands": d.ParentCompany
                //                        });
                //                        return xScale(parentIndex) + xScale.rangeBand() * 0.4;
                //
                //                    })
                //                    .attr("fill", function (d, i) {
                //                        if (thisProject.DigitalIQ > 140) {
                //                            return "rgb(62,165,72)";
                //                        } else if (thisProject.DigitalIQ > 110 && thisProject.DigitalIQ <= 140) {
                //                            return "rgb(0,176,158)";
                //                        } else if (thisProject.DigitalIQ > 90 && thisProject.DigitalIQ <= 110) {
                //                            return "rgb(138,113,179)";
                //                        } else if (thisProject.DigitalIQ > 70 && thisProject.DigitalIQ <= 90) {
                //                            return "rgb(223,196,35)";
                //                        } else if (thisProject.DigitalIQ < 70) {
                //                            return "rgb(231,67,65)";
                //                        }
                //                    })
                //                    .attr("opacity", "0.5");


                // console.log(d.Brands);

                toolTip.transition()
                    .duration(200)
                    .style("opacity", 0.8)
                    .style("position", "absolute")
                    .style("left", (d3.event.pageX + 15) + "px")
                    .style("top", (d3.event.pageY - 25) + "px")
                    .style("width", function () {
                        return xScale.rangeBand();
                    })
                    .style("height", function () {

                        var tempObj = document.getElementById("Index" + thisProject.Brands);
                        var lineNum = tempObj.childElementCount;
                        console.log(tempObj.childElementCount);
                        return 17 + 22 * lineNum;
                    });

            })
            .on("mouseout", function (d) {
                d3.select(document.getElementById(d.Brands)).transition().duration(500)
                    .attr("cx", function (d, i) {

                        var parentIndex = _.findIndex(parentList, {
                            "Brands": d.ParentCompany
                        });
                        return xScale(parentIndex) + xScale.rangeBand() * 0.5;

                    })
                    .attr("fill", "black").attr("opacity", "1");
                //   console.log(d.Brands);

                toolTip.transition()
                    .duration(500)
                    .style("opacity", "0");

            });


    }


    drawChart();
    drawNodes();

    // DRAWING VGUIDE



    vGuide.selectAll("g").filter(function (d) {
            return d;
        })
        .classed("minor", true);

    vGuide.selectAll("text").style("text-anchor", "end")
        .attr("x", -10)
        .attr("dy", 0);
    // vAxis(vGuide); // this line is equal to ".call(vAxis)"
    vGuide.attr("transform", "translate(" + margin.left + ", " + margin.top + ")"); // the 30 comes from the "margin" obj
    vGuide.selectAll('path')
        .style({
            fill: 'none',
            stroke: false
        });

    vGuide.selectAll("rect").data(legendData).enter().append("rect")
        .attr("x", 0)
        .attr("y", function (d) {
            return height - yScale(d.ceiling);

        })
        .attr("width", 2.5)
        .attr("height", function (d) {
            return yScale(d.ceiling) - yScale(d.floor) - yScale(1.5);
        })
        .attr("fill", function (d) {
            return d.fill;
        });

    //console.log(parentList);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .ticks(1)
        .tickSize(height)
        .orient("bottom");

    //console.log(xScale.rangeBand());
    xAxisOffset = margin.left + xScale.rangeBand() * 0.5;
    var xGuide = chartSVG.append("g")
        .attr("class", "xGuide")
        .call(xAxis)
        .attr("transform", "translate(" + xAxisOffset + ", " + margin.top + ")")
        .selectAll('path')
        .style({
            fill: "none",
            opacity: 0.1
        })
        .style("stroke", "none")
        .style("stroke-width", "1px")

    xGuide.selectAll("text").remove();




    //drawing lines - horizontal (from top to bottom, undotted)
    vGuide.append("line")
        .attr("x1", 0)
        .attr("y1", function (d) {
            return -yScale(15);
        })
        .attr("x2", width)
        .attr("y2", function (d) {
            return -yScale(15);
        })
        .attr("stroke", "#cccccc")
        .attr("stroke-width", 1);
    vGuide.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", width)
        .attr("y2", 0)
        .attr("stroke", "#cccccc")
        .attr("stroke-width", 1);
    vGuide.append("line")
        .attr("x1", 0)
        .attr("y1", height)
        .attr("x2", width)
        .attr("y2", height)
        .attr("stroke", "#cccccc")
        .attr("stroke-width", 1);
    vGuide.append("line")
        .attr("x1", 0)
        .attr("y1", function (d) {
            return height + yScale(35);
        })
        .attr("x2", width)
        .attr("y2", function (d) {
            return height + yScale(35);
        })
        .attr("stroke", "#cccccc")
        .attr("stroke-width", 1);


    // drawing two extra lines for enclosure 
    vGuide.append("line")
        .attr("x1", 0)
        .attr("y1", function (d) {
            return height;
        })
        .attr("x2", 0)
        .attr("y2", function (d) {
            return height + yScale(35);
        })
        .attr("stroke", "#cccccc")
        .attr("stroke-width", 1);

    vGuide.append("line")
        .attr("x1", 0)
        .attr("y1", function (d) {
            return 0;
        })
        .attr("x2", 0)
        .attr("y2", function (d) {
            return -yScale(15);
        })
        .attr("stroke", "#cccccc")
        .attr("stroke-width", 1);


    //TEXT ON TOP of GRAPHY  : RANGE
    vGuide.append("g").selectAll("text").data(parentList).enter()
        .append("text")
        .text(function (d) {
            var range = d.MaxDigitalIQ - d.MinDigitalIQ;
            return "Range: " + range;
        }).attr("x", function (d, i) {
            return i * width / parentList.length + xScale.rangeBand() / 2;
        }).attr("y", -yScale(15) / 2)
        .attr("font-size", "12")
        .attr("font-family", "HelveticaNeueLTStd-Cn")
        .attr("fill", "rgb(128,128,128)")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle");



    // Drawing lines to seperate RANGE values
    vGuide.append("g").selectAll("line").data(parentList).enter()
        .append("line")
        .attr("x1", function (d, i) {
            return (i + 1) * width / parentList.length;
        })
        .attr("y1", function (d, i) {
            return -yScale(15);
        })
        .attr("x2", function (d, i) {
            return (i + 1) * width / parentList.length;
        })
        .attr("y2", function (d, i) {
            return 0;
        })
        .attr("stroke", "#cccccc")
        .attr("stroke-width", 1);


    // Drawing lines to seperate company names
    vGuide.append("g").selectAll("line").data(parentList).enter()
        .append("line")
        .attr("x1", function (d, i) {
            return (i + 1) * width / parentList.length;
        })
        .attr("y1", function (d, i) {
            return height;
        })
        .attr("x2", function (d, i) {
            return (i + 1) * width / parentList.length;
        })
        .attr("y2", function (d, i) {
            return height + yScale(35);
        })
        .attr("stroke", "#cccccc")
        .attr("stroke-width", 1);


    //TEXT ON BOTTOM
    //writing parent company names
    vGuide.append("g")
        .attr("transform", "translate(4,0)")
        .selectAll("text").data(parentList).enter()
        .append("text")
        .attr("id", function (d, i) {
            return "Index" + d.Brands;

        })
        .text(function (d) {

            return d.Brands;
        }).call(wrap)
        .attr("y", height + yScale(17))
        .attr("x", function (d, i) {
            return i * width / parentList.length;
        })
        .attr("transform", function (d, i) {


            return "translate(" + xScale.rangeBand() * i + ",0)";
        })
        .attr("font-size", "12")
        .attr("font-family", "HelveticaNeueLTStd-Cn")
        .attr("fill", "black")
        .attr("text-anchor", "left")
        .attr("alignment-baseline", "middle");


    // IN ORDER TO GET COMPUTED LENGTH OF CHILD COMPANY NAMES...
    vGuide.append("g")
        .attr("transform", "translate(4,0)")
        .selectAll("text").data(childList).enter()
        .append("text")
        .attr("id", function (d, i) {
            return "Index" + d.Brands;

        })
        .text(function (d) {

            return d.Brands;
        }).call(wrap)
        .attr("y", height + yScale(17))
        .attr("x", function (d, i) {
            return i * width / parentList.length;
        })
        .attr("transform", function (d, i) {


            return "translate(" + xScale.rangeBand() * i + ",0)";
        })
        .attr("font-size", "12")
        .attr("font-family", "HelveticaNeueLTStd-Cn")
        .attr("fill", "black")
        .attr("text-anchor", "left")
        .attr("alignment-baseline", "middle")
        .style("display", "none");


    // writing number of child companies 
    vGuide.append("g")
        .attr("transform", "translate(4,0)")
        .selectAll("text").data(parentList).enter()
        .append("text")
        .text(function (d) {
            var temp = d;
            var count = -1;
            for (i = 0; i < loggedData.length; i++) {
                //console.log(temp.Brands); 
                //console.log(loggedData[i].Brands);
                if (temp.Brands == loggedData[i].ParentCompany) {
                    count += 1;
                    //console.log(count);
                }
            }

            return "n=" + count;
        }).call(wrap)
        .attr("y", height + yScale(15) / 2)
        .attr("x", function (d, i) {
            return i * width / parentList.length;
        })
        .attr("transform", function (d, i) {


            return "translate(" + xScale.rangeBand() * i + ",0)";
        })
        .attr("font-size", "12")
        .attr("font-family", "HelveticaNeueLTStd-Cn")
        .attr("fill", "grey")
        .attr("text-anchor", "left")
        .attr("alignment-baseline", "middle");






    //DRAWING ROTATED GRAPH TITLE 
    vGuide.append("g")
        .append("text")
        .text(function (d) {

            return "DIGITAL IQ SCORE";
        })
        .attr("transform", function (d, i) {


            return "translate(" + xScale.rangeBand() * i + ",0)";
        })
        //   .attr("transform", "translate(20," +   height + ")")
        .attr("transform", "translate(-40,250) rotate(-90)")
        .attr("font-size", "12")
        .attr("font-family", "Helvetica")
        .attr("fill", "black")
        .attr("text-anchor", "left")
        .attr("alignment-baseline", "middle");



    function wrap(text, width) {
        width = xScale.rangeBand();
        console.log(xScale.rangeBand());
        text.each(function () {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 14, // ems
                y = text.attr("y"),
                dy = parseFloat(text.attr("dy")),
                i = parentList.indexOf(text)
            tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", 0 + "px");
            ++lineNumber
            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width * 1.3) { // tweaked width*1 to *1.5/1.3 since labels are off by 0.5*rangebandWidth 
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", function () {
                        return lineNumber * lineHeight + "px";
                    }).text(word);
                }
            }
        });
    }
}