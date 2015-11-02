//DATA LOADING 

var xDomainCeiling;
//var yAxisCeiling=170; 
var IQMax;
var parentList = [];
var allList=[]; 
var childList=[]; 
var allData= d3.csv("EditedData.csv", function (d) {
    console.log(d);
    var loggedData = d;
    var count = 0;
    var tempMax = 0;
    for (var i = 0; i < d.length; i++) {
        if (d[i].ParentorChild == "Parent") {
            count += 1;
            parentList.push(d[i]);
        } else if (d[i].ParentorChild == "Child"){ 
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
    
    initialize();  // have this function here so that everything is done after the data is completely loaded. 
});
