/**Class to implement the Bubble chart */
class bubbleChart{
    /**
     * Creates the bubble chart object
     */
    constructor(govData, tableObject){
        /**All Phrases the Govenors Use */
        this.govData = govData;
        this.table = tableObject;

        // a container for selected data to live
        this.selectedGov = []

        this.margin = { top: 20, right: 20, bottom: 60, left: 10 };
        this.width = 1000 - this.margin.left - this.margin.right;
        this.height = 1000 - this.margin.top - this.margin.bottom;
        this.storyCounter = 0;

        console.log(govData)


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
            .attr('data-toggle', 'toggle')
            .attr('data-size', 'mini')
            .on('click',d=>this.updateBubbleChart())
            .append('span')

        d3.select('#switchContainer')
            .append('input')
            .attr('type', 'button')
            .attr('value', 'Show Extremes Click Twice')
            .on('click', d=> this.story())

        d3.select('#switchContainer')
            //.append('text')
            .append('input')
            .attr('type', 'button')
            .attr('value','Reset the table')
            .attr('id', 'tableReset')
            .on('click', d=> this.tableReset())


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
            .attr('transform',`translate(${this.margin.left - 10},${this.margin.top})`)
        
        //Add the xaxis to the plot
        var xMax = Math.max(...this.govData.map(d=>d.position))
        var xMin = Math.min(...this.govData.map(d=>d.position))
        this.xScale = d3
            .scaleLinear()
            .domain([xMin,xMax])
            .range([this.margin.left,950])
            .nice();
        
        var xAxis = d3.axisTop(this.xScale)
        var xAxisValues = [50,40,30,20,10,0,10,20,30,40,50,60]
        xAxis.scale(this.xScale).ticks(12).tickFormat((d,i)=>xAxisValues[i])

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
        this.uniqueLabs = this.govData.map(d=>d.category).filter(unique)
        this.uniqueCats = this.govData.map(d=>d.category.replace('/','_').split(' ')[0]).filter(unique)
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

        //brush container
        d3.select('#bubbleChart-svg')
            .append('g')
            .attr('id', 'brushContainer');

        //story



        //Brush object
        this.brushes = []

        //this.createBrush()

        this.bubbleChart('sourceX', 'sourceY')

    }


    createBrush(){
        //Brushes
        var brushGroups = []
        for(var i=0; i<this.uniqueCats.length; i++){
            //BRUSH CONTAINER
            brushGroups[i] = d3.select('#brushContainer')
                .append('g')
                .attr('id',`${this.uniqueCats[i]}brush`)
                .attr('transform', `translate(${this.margin.left},0)`)
                .attr('class','brush');1
            
            //BRUSH
            var brushID = this.uniqueCats[i]
            this[`${this.uniqueCats[i]}Brush`] = d3.brushX()
                .extent([[0, (i*135)+38], [this.width,(i*135)+170]])
                .on('end',()=>{
                    this.updateBubbles(i)
                })

            //CALL BRUSH from the brush container
            brushGroups[i].call(this[`${this.uniqueCats[i]}Brush`])
        }
    }

    createBrushv2(){
        var that =this
        var brushContainer = d3.select('#brushContainer')
            .selectAll('g')
            .data(this.uniqueCats)
        
        var brushContainerEnter = brushContainer
            .enter()
            .append('g')
            //.append(this);

        brushContainer = brushContainerEnter.merge(brushContainer)
            .attr('transform', `translate(${this.margin.left},0)`)
            .attr('class','brush')
            .attr('id',(d,i)=>`${this.uniqueCats[i]}brush`)
            .transition()
            .each( function(d,i){
                var there = this
                d3.brushX()
                    .extent([[0,(i*135)+38], [that.width,(i*135)+170]])
                    .on('end',that.updateBubbles.bind(that))(d3.select(this))
            })
    
    }
    

    populateBrush(){}


    bubbleChart(xValuePointer, yValuePointer){
        var that = this
        this.xVal = xValuePointer
        this.yVal = yValuePointer


        var bubbles = d3.select('#bubbleChart-svg')
            .selectAll('circle').data(this.govData)

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
            .attr('fill',d=>this.bubbleColors(d.category.replace('/','_').split(' ')[0]))
            .attr('stroke','black')
            .attr('stroke-width',1)
            .attr('class', d=>d.category.replace('/','_').split(' ')[0]);
            
        //Add the 0 line
        var y2 =  Math.max(...this.govData.map(d=>d[yValuePointer])) + 150
        d3.select('#backGroundLine')
            .transition().duration(500)
            .attr('x1', that.xScale(0))
            .attr('x2', that.xScale(0))
            .attr('y1',this.margin.top)
            .attr('y2',y2)
            .style('stroke-width',2)
            .style('stroke','black')
        
        this.createBrushv2()


    }

    updateBubbleChart(){
        
        if(document.getElementById('topicCheck').checked){
            //TEXT CATS 
            var txtCats = d3.select('#bubbleChart-svg')
                .selectAll('text.label')
                .data(this.uniqueLabs)
            
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
            
            this.xVal = 'moveX'
            this.yVal = 'moveY'
            this.bubbleChart(this.xVal,this.yVal)

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
            this.xVal = 'sourceX'
            this.yVal = 'sourceY'
            this.bubbleChart(this.xVal,this.yVal)
    
        }
    }

    toolTipRender(d){
        let firstLine = '<h2>' + (d.phrase.charAt(0).toUpperCase() + d.phrase.substring(1)) + '</h2>'

        let secondLine = '<h3>'+ 'R+ '+ (Math.abs(d.percent_of_d_speeches - d.percent_of_r_speeches)*100).toFixed(3)+ '</h3>'

        let thirdLine = '<h3>'+ 'In '+(d.total/50*100).toFixed(0)+'% of speeches'+'</h3>'

        let output = firstLine+secondLine+thirdLine
        return output
    }

    isBrushed(brush_coors, cx){
        var x0 = brush_coors[0],
            x1 = brush_coors[1];
        return cx <= x0 || cx >= x1
    }

    isNotBrushed(brush_coors, cx){
        var x0 = brush_coors[0],
            x1 = brush_coors[1];
        return cx >= x0 && cx <= x1
    }


    updateBubbles(input){
        //var brushSelection =  d3.event.sourceEvent.path[1].id.replace('brush','')
        
        if(typeof(input) === 'object' && typeof(input)[0] !== 'number'){
            var brushSelection = input.category
            var bubbleSelection = input.data
        }else{
            var brushSelection = d3.event.sourceEvent.path[1].id.replace('brush','')
            var bubbleSelection = d3.event.selection
        }
        
        //If selection is not null 
        // see if the topic sep is checked
        if(bubbleSelection!== null){
            var that = this
            //We need to gray out all circles that are not in the selection
            if(document.getElementById('topicCheck').checked){
                //This need to update the table
                //var selectedGov = this.govData.filter(d=>  d[this.xVal] >bubbleSelection[0] &&  d[this.xVal] < bubbleSelection[1] && d.category.replace('/','_')) == brushSelection)
                this.selectedGov = this.selectedGov.concat(this.govData.filter(d=>  d[this.xVal] >bubbleSelection[0] &&  d[this.xVal] < bubbleSelection[1] && d.category.replace('/','_').split(' ')[0] == brushSelection))
                
                this.table.updateTable(this.selectedGov)

                d3.select('#bubbleChart-svg')
                    .selectAll('circle')
                    .classed('unselected', true);
                

                //Do something like
                var allCircles = d3.select('#bubbleChart-svg')
                    .selectAll('circle')
                    .filter(d=> d.category.replace('/','_').split(' ')[0] === brushSelection)

                allCircles.classed('unselected', function(d){
                    return that.isBrushed(bubbleSelection, Number(d[that.xVal]))
                    })
                
                allCircles.classed('selected', d=> that.isNotBrushed(bubbleSelection, Number(d[that.xVal])))

                d3.selectAll('.selected')
                    .classed('unselected', false);


            }else{
                this.selectedGov = this.selectedGov.concat(this.govData.filter(d=>  d[this.xVal] >bubbleSelection[0] &&  d[this.xVal] < bubbleSelection[1]))

                var allCircles = d3.select('#bubbleChart-svg')
                    .selectAll('circle')

                allCircles.classed('unselected', function(d){
                    return that.isBrushed(bubbleSelection, Number(d[that.xVal]))
                    })
                
                this.table.updateTable(this.selectedGov)
            }
        }
    }

    brushClear(){
        d3.selectAll('.brush').remove()
        d3.selectAll('.unselected').classed('unselected',false)
        d3.selectAll('.selected').classed('selected', false)
        //this.selectedGov = this.govData
        // this.table.updateTable(this.selectedGov)
        this.createBrushv2()
        //Brushe
        // for(var i=0; i<this.uniqueCats.length; i++){
        //     this[`${this.uniqueCats[i]}Brush`].clear()
        //     //hazjjkfkj
        //}

    }

    paneClear(){
        d3.select('.pane').remove()
    }

    tableReset(){
            this.storyCounter = 0
            this.selectedGov = [];
            this.table.updateTable(this.govData);
    }

    story(){
        if(this.storyCounter === 0){
            this.tableReset()
            document.getElementById('topicCheck').checked=true;
            this.updateBubbleChart();
            


            var that = this;
            var preSel = [[90,182],[8,(8+95)],[129, 248],[161, (161+34)], [126, (126+76)], [361,(361+54)]];
            
            var brushes = d3.select('#brushContainer')
                .selectAll('g')
                .data(preSel);
            
            var brushesEnter = brushes
                .enter()
                .append('g');
            
            brushes.exit().remove();

            brushes = brushesEnter.merge(brushes);

            brushes
                .each(function(d,i){
                    d3.brushX().move(d3.select(this), d)
                    var newObj = {}
                    newObj['category'] = that.uniqueCats[i]
                    newObj['data'] = d
                    that.updateBubbles(newObj)
                });
            that.storyCounter = 1;
            //CHECK THE TOPIC CHECKBOX


        }else{
            var paneWrap =  d3.select('body').append('div').attr('class','pane')
            var pane = paneWrap.append('svg')
            pane.append('line')
                .transition().duration(500)
                .attr('x1',0)
                .attr('x1',900)
                .attr('y1',0)
                .attr('y2',0)
                .attr('transform','translate(1000,623)')
                .attr('stroke','black')

            pane.append('rect')
                .transition().duration(500)
                .attr('width',320)
                .attr('height',50)
                .attr('transform','translate(1900, 300)')
                .attr('stroke','black')
                .attr('rx',15)
                .attr('fill','pink')

            pane.append('text')
                .transition().duration(500)
                .attr('transform','translate(1910, 327)')
                .attr('font-weight','bold')
                .text('Top 3 Democratic nGrams per Category')

            
            pane.append('rect')
                .transition().duration(500)
                .attr('width',320)
                .attr('height',50)
                .attr('transform','translate(1900, 900)')
                .attr('stroke','black')
                .attr('rx',15)
                .attr('fill','pink')

            pane.append('text')
                .transition().duration(500)
                .attr('transform','translate(1910, 927)')
                .attr('font-weight','bold')
                .text('Top 3 Republican nGrams Per Category')


        
            //Add line to the tab    

            var preSel = [[663, 634+92],[510,510+238],[746, 746+132],[624, (624+50)], [471, (471+66)], [550,(550+95)]]
            var that = this;
            
            var brushes = d3.select('#brushContainer')
                .selectAll('g')
                .data(preSel)
            
            var brushesEnter = brushes
                .enter()
                .append('g')
            
            brushes.exit().remove()

            brushes = brushesEnter.merge(brushes)

            brushes
                .each(function(d,i){
                    d3.brushX().move(d3.select(this), d)
                    var newObj = {}
                    newObj['category'] = that.uniqueCats[i]
                    newObj['data'] = d
                    that.updateBubbles(newObj)
                })
            
            this.storyCounter = 0
        }
    }
    
}