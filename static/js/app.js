const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Creating the dropmenu
// Fetch the JSON data and populate the dropdown menu
d3.json(url).then(function(data) {
  const dropdownMenu = d3.select("#selDataset");

  // Get the names from the data
  const names = data.names;

  //https://stackoverflow.com/questions/11903709/adding-drop-down-menu-using-d3-js#11907096
  
  // Populate the dropdown menu with options
  dropdownMenu
    .selectAll("option")
    .data(names)
    .enter()
    .append("option")
    .text(name => name)
    .attr("value", name => name);

  // Call the optionChanged function with the initial value
  optionChanged(names[0]);
});

// On change to the DOM, call optionChanged()
function optionChanged(value) {
  // Get the JSON data again
  d3.json(url).then(function(data) {
    // Find the selected metadata based on the value
    const selectedMetadata = data.metadata.find(item => item.id == value);

    // Clear the existing metadata
    const metadataContainer = d3.select("#sample-metadata");
    metadataContainer.html("");

    // Append new metadata entries
    for (const [key, val] of Object.entries(selectedMetadata)) {
      metadataContainer.append("p").text(`${key}: ${val}`);
    }

    // Call the buildCharts function with the selected value
    buildCharts(value);
  });
}

// Function to generate random colors https://stackoverflow.com/questions/1484506/random-color-generator
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


// // Function to build the charts // Thank you Pooja
function buildCharts(sample) {
  d3.json(url).then((data) => {
    let samples = data.samples;
    let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];

    let otuId = result.otu_ids;
    let otuLabel = result.otu_labels;
    let sampleValue = result.sample_values;

    let yticks = otuId.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    let barData = [
      {
        y: yticks,
        x: sampleValue.slice(0, 10).reverse(),
        text: otuLabel.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h"
      }
    ];
    let layout = {
      margin: { t: 30, l: 150 }
    };
    let colors = otuId.map(id => getRandomColor()); // Generate colors for each OTU ID

    let bubbleData = [
      {
        x: otuId,
        y: sampleValue,
        mode: 'markers',
        marker: {
          size: sampleValue,
          color: colors, // Use the colors array for marker color
        },
        text: otuLabel, // This line to set the text for hover labels
      }
    ];
    const layout1 = {
      title: 'Bubble Chart',
      xaxis: { title: 'OTU ID' },
      yaxis: {title: 'Sample Value'},
      autosize: true // Set autosize not autofit
    };

    // Update the "bar" plot with new data
    Plotly.newPlot("bar", barData, layout);
    Plotly.newPlot("bubble", bubbleData, layout1);
  });
}