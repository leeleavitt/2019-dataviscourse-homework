d3.json('/data/words.json').then(data =>{
    console.log(data)
    const unique = (value, index, self) => {
        return self.indexOf(value) === index
    }

    var uniqueCats = data.map(d=>d.category).filter(unique);

    var colors = ["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d","#666666"];
    
    var bubbleColors = d3.scaleOrdinal()
        .domain(uniqueCats)        
        .range(colors)

    console.log(bubbleColors)


    let table = new Table(data, bubbleColors)
    
    let bChart = new bubbleChart(data, table)
    bChart.createChart()
    table.createTable(data)
    table.updateTable(data)

    // This clears a selection by listening for a click
    document.addEventListener("click", function(e) {
        console.log('you clicked')
        bChart.brushClear()
        //TODO - Your code goes here - 
		// call clear highight methods
    }, true);

})