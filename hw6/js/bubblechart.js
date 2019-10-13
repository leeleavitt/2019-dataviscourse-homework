/**Class to implement the Bubble chart */
class bubbleChart{
    /**
     * Creates the bubble chart object
     */
    constructor(govData){
        /**All Phrases the Govenors Use */
        this.govData = govData;
        this.margin = { top: 20, right: 20, bottom: 60, left: 10 };
        this.width = 1000 - this.margin.left - this.margin.right;
        this.height = 1000 - this.margin.top - this.margin.bottom;

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
            .attr('id', 'topicCheck')
            // .attr('data-toggle', 'toggle')
            // .attr('data-size', 'mini')
            .on('click',d=>this.updateBubble())

            //.on('click',this.updateBubble())

        d3.select('#switchContainer')
            .append('input')
            .attr('type', 'button')
            .attr('value', 'Show Extremes')

        //SVG to plot on
        d3.select('#bubbleChart')
            .append('div')
            .attr('id', 'bChartWrap')

        //tooltip div
        d3.select('#bChartWrap')
            .append('div')
            .attr('class','tooltip')
            .style('opacity',0)
        
        //Plot svg
        d3.select('#bChartWrap')
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
        
        //Add the xaxis to the plot
        var xMax = Math.max(...this.govData.map(d=>d.position))
        var xMin = Math.min(...this.govData.map(d=>d.position))
        this.xScale = d3
            .scaleLinear()
            .domain([xMin,xMax])
            .range([this.margin.left,950])
            .nice();
        
        var xAxis = d3.axisTop(this.xScale)
        xAxis.scale(this.xScale)

        d3.select('#x-axis')
            .classed('axis',true)
            .call(xAxis)

        //bubbleChart circel radius scale
        var bubbleMax = Math.max(...this.govData.map(d=>d.total))
        var bubbleMin = Math.min(...this.govData.map(d=>d.total))
        this.bubbleScale = d3
            .scaleLinear()
            .domain([bubbleMin,bubbleMax])
            .range([3,12])
            .nice();
        
        //bubbleChart color values scale
        const unique = (value, index, self) => {
            return self.indexOf(value) === index
        }
        //unique categories
        var uniqueCats = this.govData.map(d=>d.category).filter(unique)
        var colors = ["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d","#666666"]
        this.bubbleColors = d3.scaleOrdinal()
            .domain(uniqueCats)        
            .range(colors)

        

        this.bubbleChart('sourceX', 'sourceY')


    }

    bubbleChart(xValuePointer, yValuePointer){
        
        this.xVal = xValuePointer
        this.yVal = yValuePointer

        //Add the 0 line
        
        var bubbles = d3.select('#bubbleChart-svg').selectAll('circle').data(this.govData)
            

        var bubblesEnter = bubbles
            .enter()
            .append('circle')


        bubbles.exit().remove()

        bubbles = bubblesEnter.merge(bubbles)
            .attr('transform',`translate(${this.margin.left},100)`)
            .attr('cx', d=>d[this.xVal])
            .attr('cy', d=> d[this.yVal])
            .attr('r', d=>this.bubbleScale(d.total))
            .attr('fill',d=>this.bubbleColors(d.category))
            .attr('stroke','black')
            .attr('stroke-width',1)
            .on('mouseover', function(d){
                var tooltip = d3.select('.tooltip')
                tooltip.transition().duration(100).style('opacity',.9);
                tooltip.html(
                    d.phrase + '<br/>'
                    + "R+" + Math.abs(d.percent_of_d_speeches - d.percent_of_r_speeches) + '<br/>'
                    +"In "+ (d.total/50)+ "of speeches")
                    .style('left', (d3.event.pageX)+'px')
                    .style('top', (d3.event.pageY-28)+'px');
            })
            .on('mouseout', function(d){
                var tooltip = d3.select('.tooltip')
                tooltip.transition().duration(500).style('opacity')
            })

        
        bubbles.transition().duration(500)

        
    }

    updateBubble(){
        if(document.getElementById('topicCheck').checked){
            this.bubbleChart('moveX','moveY')
        }else{
            this.bubbleChart('sourceX','sourceY')
        }
    }

    toolTipRender(d){
        let text = '<h2>' + (d.phrase.charAt(0).toUpperCase() + d.phrase.substring(1)) + '</h2>'
        // d.phrase + '<br/>'
        // + "R+" + Math.abs(d.percent_of_d_speeches - d.percent_of_r_speeches) + '<br/>'
        // +"In "+ (d.total/50)+ "of speeches")
        // .style('left', (d3.event.pageX)+'px')
        // .style('top', (d3.event.pageY-28)+'px');

    }

}