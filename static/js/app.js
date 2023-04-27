
let queryUrl = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

let sel = d3.select("#selDataset");
let tab = d3.select("#table_DemoInfo");

let currentValue = 0;

let otu_ids;
let dataIds = [];
let dataIds2 = [];

let initial_index = 940;

// Perform a GET request to the query URL.
d3.json(queryUrl).then(function (dataReaded) {


    let listNames = dataReaded.names;

    // fill the list --> selDataset object

    listNames.forEach((name) => {

        sel.append("option").text(name).property("value", name);

    })

    /* 
                    ----------- BAR GRAPH CODE
    */

    // collection : id and otu_ids

    for (let i = 0; i < dataReaded.samples.length; i++) {
        id = dataReaded.samples[i].id;
        otu_ids = dataReaded.samples[i].otu_ids.length;
        dataIds.push([id, otu_ids]);
        dataIds2.push([id, otu_ids]);

    } // for */

    // loop through each element in the 2d-array, and get the nth column.

    function getCol(matrix, col) {
        var column = [];
        for (var i = 0; i < matrix.length; i++) {
            column.push(matrix[i][col]);
        }
        return column;
    } // getCol

    // sortedData - pdte.1, no funciona (creo que ordena por columna de ID)   


    let sortedData = dataIds2.sort((a, b) => b[1] - a[1]);

    /*     console.log("sortedData");
        console.log(sortedData);
     */
    let slicedData = sortedData.slice(0, 10);

    // trace
    let trace = {
        x: slicedData.map(row => row[1]).reverse(),
        y: slicedData.map(row => "Id " + row[0]).reverse(),
        type: 'bar',
        name: "Bar chart",
        orientation: 'h'
    }

    // Data array
    let traceData = [trace];

    // Apply a title to the layout
    let layout = {
        title: "Top 10"
    };

    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("bar", traceData, layout);

    // Find the correct index base on Id, 
    //    Second parameter: 0 --> find the value in samples column 
    //    Second parameter: 1 --> find the value in metadata column 

    function find_IdRow(id_toFind, column) {

        let found = false;

        switch (column) {
            case 0: {

                for (let i = 0; i < dataReaded.samples.length; i++) {

                    if (dataReaded.samples[i].id == id_toFind) {
                        found = true;
                        return i;
                    } // if
                } // for
            } // case 0:
            case 1: {

                for (let i = 0; i < dataReaded.samples.length; i++) {

                    if (dataReaded.metadata[i].id == id_toFind) {
                        found = true;
                        return i;
                    } // if
                } // for

            } // case 1:


                if (found == false)
                    return -1

        } // switch 

    }// find_IdRow()

    /*
                    ----------- INFORMATION TABLE
    */

    function print_DemoInfo(index) {

        // find the number of row in metadata Section
        let row = find_IdRow(index, 1);

        // errase info of the table
        tab.selectAll("tr").text("");

        tab.append("tr").append("td").text(" Id: " + dataReaded.metadata[row].id);
        tab.append("tr").append("td").text(" Ethnicity: " + dataReaded.metadata[row].ethnicity);
        tab.append("tr").append("td").text(" Gender: " + dataReaded.metadata[row].gender);
        tab.append("tr").append("td").text(" Age: " + dataReaded.metadata[row].age);
        tab.append("tr").append("td").text(" Location: " + dataReaded.metadata[row].location);
        tab.append("tr").append("td").text(" Bbtype: " + dataReaded.metadata[row].bbtype);
        tab.append("tr").append("td").text(" Wfreq: " + dataReaded.metadata[row].wfreq);

    } // print_DemoInfo


    /* 
                    ----------- BUBBLE GRAPH CODE
    */

    function show_BubbleGraph(id, type) {


        let x_data = dataReaded.samples[find_IdRow(id, 0)].otu_ids;
        let y_data = dataReaded.samples[find_IdRow(id, 0)].sample_values;


        let trace1 = [{
            x: x_data,
            y: y_data,
            text: "",
            mode: 'markers',
            marker: {
                size: x_data,
                sizeref: x_data,
                sizemode: 'area',
                color: colorBubbles(x_data)
            }
        }];

        let layout = {
            title: 'Bubble Chart',
            showlegend: false,
            height: 1200,
            width: 1200,
            colorscale: 'Blackbody'
        };

        //var data = [trace1];

        if (type == 0) // show for the very first time the Bubble Graph
            Plotly.newPlot("bubble", trace1, layout);
        else if (type == 1) {// update the Bubble Graph

            //myPlot.relayout("bubble", trace1);
            Plotly.purge("bubble");
            Plotly.newPlot("bubble", trace1, layout);

        } // else


    } // show_BubbleGraph()

    d3.selectAll("#selDataset").on("change", optionChanged);
    // d3.selectAll("#selDataset").on("change", updateChart);

    function optionChanged() {

        let dropdownMenu = d3.select("#selDataset");

        // take the value selected 
        current_id = dropdownMenu.property("value");

        updateDashBoard(current_id);
    }

    function updateDashBoard(newData) {

        // update the Bubble Graph --> (second parameter : 1)

        show_BubbleGraph(newData, 1);
        print_DemoInfo(newData);

    }

    function colorBubbles(array) {

        colors = [];

        for (let i = 0; i < array.length; i++) {

            let value = array[i];

            if (value >= 0 && value <= 500) {
                colors.push('#ff6961');
            } else if (value > 500 && value <= 1000) {
                colors.push('#77dd77');
            } else if (value > 1000 && value <= 2000) {
                colors.push('#fdfd96');
            } else if (value > 2000 && value <= 2800) {
                colors.push('#84b6f4');
            } else if (value > 2800 && value <= 4000) {
                colors.push('#e79eff');
            } else {
                colors.push('r#fdcae1');
            }

        } // for

        return colors;

    } // function


    // show for the very first time the Bubble Graph --> (second parameter : 0)
    show_BubbleGraph(initial_index, 0);
    // show for the very first time the Demographic Information
    print_DemoInfo(initial_index);

});



