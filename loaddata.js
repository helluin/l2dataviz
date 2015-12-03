//DATA LOADING 

var xDomainCeiling;
//var yAxisCeiling=170; 
var IQMax;
var parentList = [];
var allList = [];
var childList = [];
var loggedData=[];


//SIZING
var maxWidth = Math.max(900, Math.min(window.innerHeight, window.innerWidth) - 250);

// figure out where to use the maxWidth var to have the right scale ???? 
var margin = {
    top: 30,
    right: 30,
    bottom: 70,
    left: 50
};
var currentWidth = window.innerWidth;

var height = 450 - margin.top - margin.bottom;
var width = window.innerWidth - margin.left - margin.right;


//LOAD DATA

//  DIDN'T WORK: 
//$("2013beautydata").click(function () {
//    updateData("Beauty_Enterprise_Data_2013.csv"); 
//    alert("yay!");
//}); 
//$("2014beautydata").click(function () {
//    updateData("Beauty_Enterprise_Data_2014.csv"); 
//    alert("yay!");
//}); 
//$("2015beauty data").click(function () {
//    updateData("Beauty_Enterprise_Data_2015.csv"); 
//    alert("yay!");
//}); 



//LOAD FIRST VIEW
updateData("Beauty_Enterprise_Data_2015.csv");
$(".year").css("background", "white");
$(".year").css("color", "black");

document.getElementById("2015beautydata").style.background="black";
document.getElementById("2015beautydata").style.color="white";



//SETTING BUTTON INTERACTIONS
document.getElementById("2013beautydata").addEventListener("click", function () {
    updateData("Beauty_Enterprise_Data_2013.csv");
    console.log(this.class);
    $(".year").css("background", "white");
    $(".year").css("color", "black");
    $(this).css("background", "black");
    $(this).css("color", "white");
})

document.getElementById("2014beautydata").addEventListener("click", function () {
    updateData("Beauty_Enterprise_Data_2014.csv");
    $(".year").css("background", "white");
    $(".year").css("color", "black");
    $(this).css("background", "black");
    $(this).css("color", "white");
})
document.getElementById("2015beautydata").addEventListener("click", function () {
    updateData("Beauty_Enterprise_Data_2015.csv");
    $(".year").css("background", "white");
    $(".year").css("color", "black");
    $(this).css("background", "black");
    $(this).css("color", "white");
})


// UPDATE DATA ON BUTTON-CLICK
function updateData(data) {

    // clear list so graphy can be re-drawn
    parentList = [];
    allList = [];
    childList = [];

    //retrieve data 
    d3.csv(data, function (d) {
        console.log(d);
        loggedData = d;
        var count = 0;
        var tempMax = 0;


        var nodeNum = loggedData.length;
        var thisYear = loggedData[0].Year;

        console.log(nodeNum);
        console.log(loggedData[0].Year);
        $("#cat").text("Beauty Brands, " + thisYear + ", n=" + nodeNum);
        console.log("TEXT");

        //get Parent and Child List
        for (var i = 0; i < d.length; i++) {
            if (d[i].ParentorChild == "Parent") {
                count += 1;
                parentList.push(d[i]);
            } else if (d[i].ParentorChild !== "Parent") {
                childList.push(d[i]);
            }
            allList.push(d[i]);
        }
        xDomainCeiling = count;
        console.log(count);

        IQMax = Math.max.apply(Math, d.map(function (o) {
            return o.MaxDigitalIQ;
        }));
        console.log(IQMax);
        console.log(xDomainCeiling);
        console.log(parentList);

        //set initial sizing
        if (currentWidth > 900) {
            width = (900 - margin.left - margin.right) * 0.9;
            document.getElementById("chart").innerHTML = "";
            initialize();
        } else if (currentWidth < 700) {
            width = (700 - margin.left - margin.right) * 0.9;
            document.getElementById("chart").innerHTML = "";
            initialize();
        } else {
            width = (window.innerWidth - margin.left - margin.right) * 0.9;
            document.getElementById("chart").innerHTML = "";
            initialize();
        }
    });
}


// SET GRAPH SIZE TO DYNAMIC
$(window).resize(function () {
    currentWidth = window.innerWidth
    width = window.innerWidth - margin.left - margin.right;
    console.log(currentWidth);

    if (currentWidth > 900) {
        width = (900 - margin.left - margin.right) * 0.9;
        document.getElementById("chart").innerHTML = "";
        initialize();
    } else if (currentWidth < 700) {
        width = (700 - margin.left - margin.right) * 0.9;
        document.getElementById("chart").innerHTML = "";
        initialize();
    } else {
        width = (window.innerWidth - margin.left - margin.right) * 0.9;
        document.getElementById("chart").innerHTML = "";
        initialize();
    }


});




// DRAW LEGEND
// Legend Data
var legendData = [{
        "category": "Genius",
        "fill": "rgb(62,165,72)",
        "floor": "140",
        "ceiling": "170"
        },
    {
        "category": "Gifted",
        "fill": "rgb(0,176,158)",
        "floor": "110",
        "ceiling": "140"

        },
    {
        "category": "Average",
        "fill": "rgb(137,113,179)",
        "floor": "90",
        "ceiling": "110"

        },

    {
        "category": "Challenged",
        "fill": "rgb(223,196,35)",
        "floor": "70",
        "ceiling": "90"
        },
    {
        "category": "Feeble",
        "fill": "rgb(231,67,65)",
        "floor": "0",
        "ceiling": "70"
        }];


function drawLegend() {

    var charLength = 0;

    var legend = d3.select("#legend")
        .append("svg").attr("width", 500).attr("id", "legendSVG")
        .attr("height", 50)
        .selectAll("rect")
        .data(legendData)
        .enter();
    var colorBar = legend.append("rect")
        .attr("width", 3)
        .attr("height", 12)
        .attr("fill", function (d) {
            return d.fill;
        })
        .attr("x", function (d, i) {
            //count character length in one word to get sizing data and set "x" value
            if (i == 0) {
                return 0;
            } else {
                charLength += legendData[i - 1].category.length;

                console.log(charLength);
                return charLength * 9;
            }
        })
        .attr("y", 10);
    charLength = 0;

    var legendText = legend.append("text")
        .style("text-anchor", "left")
        .style("font-family", "Helvetica Neue LT Std")
        .style("fill", function () {

            return "rgb(128,128,128)";
        })
        .style("font-size", 11)
        .text(function (d) {
            return d.category;
        })
        .style("pointer-events", "none")
        .attr("y", 20)
        .attr("x", function (d, i) {
            //var charLength = 0;

            if (i == 0) {
                return 10;
            } else {
                charLength += legendData[i - 1].category.length;

                console.log(charLength);
                return charLength * 9 + 10;
            }
        });

}

drawLegend();