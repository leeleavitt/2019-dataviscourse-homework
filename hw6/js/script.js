d3.json('/data/words.json').then(data =>{
    console.log(data)

    let bChart = new bubbleChart(data)

    bChart.createChart()



})