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
            .append('span')
            .append('input')
            .attr('type', 'checkbox')
            .attr('id', 'topicCheck')
            // .attr('data-toggle', 'toggle')
            // .attr('data-size', 'mini')
            .on('click',d=>this.updateBubble())
            .append('span')

            //.on('click',this.updateBubble())

        d3.select('#switchContainer')
            .append('input')
            .attr('type', 'button')
            .attr('value', 'Show Extremes')

        //Graph Label
        var graphLabel = d3.select('#bubbleChart')
            .append('div')
            .attr('id', 'axisLabel')
            .append('svg')
            .attr('width', this.width)
            .attr('height', 40);
        graphLabel
            .append('text')
            .classed('axisLabel', true)
            .attr('x', this.width/15)
            .attr('y', 20)
            .text('Democratic Leaning');

        graphLabel
            .append('text')
            .classed('axisLabel', true)
            .attr('x', this.width * (12/15))
            .attr('y', 20)
            .text('Republican Leaning');

    
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
        this.uniqueCats = this.govData.map(d=>d.category).filter(unique)
        var colors = ["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d","#666666"]
        this.bubbleColors = d3.scaleOrdinal()
            .domain(this.uniqueCats)        
            .range(colors)

        //Background Line
        d3.select('#bubbleChart-svg')
            .append('line')
            .attr('id','backGroundLine');

        //Label Text
        d3.select('#bubbleChart-svg')
            .append('text')
            .classed('label',true);

        //Brushes
        for(var i=0; i<this.uniqueCats.length; i++){
            var brushGroup = d3.select('#bubbleChart-svg').append('g').attr('id',`${this.uniqueCats[i]}brush`)
            this[`${this.uniqueCats}Brush`] = d3.brush([this.margin.left, (i*135)+50], [this.width, 135])
            brushGroup.call(this[`${this.uniqueCats}Brush`])
        }


        
        this.bubbleChart('sourceX', 'sourceY')



    }

    bubbleChart(xValuePointer, yValuePointer){
        var that = this
        this.xVal = xValuePointer
        this.yVal = yValuePointer


        var bubbles = d3.select('#bubbleChart-svg').selectAll('circle').data(this.govData)

        // To allow for on transitions, you must bind it to the enter selection
        var bubblesEnter = bubbles
            .enter()
            .append('circle')
            .on('mouseover', function(d){
                var tooltip = d3.select('.tooltip')
                tooltip.transition().duration(100).style('opacity',.9);
                tooltip.html(that.toolTipRender(d))
                    .style('left', (d3.event.pageX)+'px')
                    .style('top', (d3.event.pageY-28)+'px');
            })
            .on('mouseout', function(d){
                var tooltip = d3.select('.tooltip')
                tooltip.transition().duration(500).style('opacity')
            });
        
        bubbles.exit().remove()

        //Now you can use the transition duration effects
        bubbles = bubblesEnter.merge(bubbles)
            .transition().duration(500)
            .attr('transform',`translate(${this.margin.left},100)`)
            .attr('cx', d=>d[this.xVal])
            .attr('cy', d=> d[this.yVal])
            .attr('r', d=>this.bubbleScale(d.total))
            .attr('fill',d=>this.bubbleColors(d.category))
            .attr('stroke','black')
            .attr('stroke-width',1);
            
        //Add the 0 line
        var y2 =  Math.max(...this.govData.map(d=>d[yValuePointer])) + 150
        console.log(y2)
        d3.select('#backGroundLine')
            .transition().duration(500)
            .attr('x1', that.xScale(0))
            .attr('x2', that.xScale(0))
            .attr('y1',this.margin.top)
            .attr('y2',y2)
            .style('stroke-width',2)
            .style('stroke','black')

    }

    updateBubble(){
        if(document.getElementById('topicCheck').checked){
            
            console.log(this.uniqueCats)
            var txtCats = d3.select('#bubbleChart-svg')
                .selectAll('text.label')
                .data(this.uniqueCats)
            
            var txtCatsEnter= txtCats
                .enter()
                .append('text')
                .classed('label', true);
                
            txtCats.exit().remove()
            
            txtCats = txtCatsEnter.merge(txtCats)
                .transition().duration(500)
                .attr('x', d => 50)
                .attr('y', (d,i)=> (i*135)+50)
                .text(d=> (d.charAt(0).toUpperCase()+d.substring(1)) );

            this.bubbleChart('moveX','moveY')

        }else{
            let uniqueCats = []

            var txtCats = d3.select('#bubbleChart-svg')
                .selectAll('text.label')
                .data(uniqueCats)
        
            var txtCatsEnter= txtCats
                .enter()
                .append('text')
                .classed('label', true);
                
            txtCats
                .exit()
                .style('opacity',1)
                .transition()
                .duration(500)
                .style('opacity', 0)
                .remove();
            
            txtCats = txtCatsEnter.merge(txtCats)
                .transition().duration(500)
                .attr('x', d => 50)
                .attr('y', (d,i)=> (i*135)+50)
                .text(d=> (d.charAt(0).toUpperCase()+d.substring(1)) );

                d3.select('#bubbleChart-svg')
                    .selectAll('text.label')

                this.bubbleChart('sourceX','sourceY')
        }
    }

    toolTipRender(d){
        let firstLine = '<h2>' + (d.phrase.charAt(0).toUpperCase() + d.phrase.substring(1)) + '</h2>'

        let secondLine = '<h3>'+ 'R+ '+ (Math.abs(d.percent_of_d_speeches - d.percent_of_r_speeches)*100).toFixed(3)+ '</h3>'

        let thirdLine = '<h3>'+ 'In '+(d.total/50*100).toFixed(0)+'% of speeches'+'</h3>'

        let output = firstLine+secondLine+thirdLine
        return output
    }

}