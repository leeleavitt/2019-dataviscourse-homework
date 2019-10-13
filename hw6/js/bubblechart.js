/**Class to implement the Bubble chart */
class bubbleChart{
    /**
     * Creates the bubble chart object
     */
    constructor(govData){
        /**All Phrases the Govenors Use */
        this.govData = govData;
        this.margin = { top: 20, right: 20, bottom: 60, left: 80 };
        this.width = 900 - this.margin.left - this.margin.right;
        this.height = 700 - this.margin.top - this.margin.bottom;

        console.log(govData)
        console.log(Math.max(...this.govData.map(d=>d.position) ) )
        console.log(Math.min(...this.govData.map(d=>d.position) ) )

        console.log(Math.max(...this.govData.map(d=>d.moveY) ) )
        console.log(Math.max(...this.govData.map(d=>d.sourceY) ) )


    }

    createChart(){
        //Make container for the switches
        d3.select("#header-wrap")
            .append('div')
            .attr('id', 'bubbleChart')
            .append('div')
            .attr('id', 'switchContainer')
        
        d3.select('#switchContainer')
            .text('Grouped by Topic')
            .append('input')
            .attr('type', 'checkbox')
            .attr('data-toggle', 'toggle')
            .attr('data-size', 'mini')

        d3.select('#switchContainer')
            .append('input')
            .attr('type', 'button')
            .attr('value', 'Show Extremes')

        //SVG to plot on
        d3.select('#bubbleChart')
            .append('div')
            .append('svg')
            .attr('id', 'bubbleChart-svg')
            .attr('width', this.width)
            .attr('height', this.height)

        //The svg group to transform and translate
        d3.select('#bubbleChart-svg')
            .append('g')
            .attr('transfrom', `translate(${this.margin.left}, ${this.margin.top})`)
            .classed('wrapper-group', true)
        
        //xaxis
        d3.select('#bubbleChart-svg')
            .select('.wrapper-group')
            .append('g')
            .attr('id','x-axis')
            .attr('transform',`translate(${this.margin.left},${this.margin.top})`)
        
        //x axis scale
        


        var bubbleEnter = d3.select('#bubbleChart-svg').selectAll('circle')
            //.select('.wrapper-group')
            .data(this.govData)
            .enter()
            .append('circle')
        
            .attr('transform',`translate(${this.margin.left},100)`)
            .attr('cx', d=>d.sourceX)
            .attr('cy', d=> d.sourceY)
            .attr('r', d=>d.total/10)
            .attr('fill',null)

    }
}