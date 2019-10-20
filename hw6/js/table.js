class Table{
    constructor(govData){
        this.govData = govData;
        
        
        this.cell = {
                "width": 70,
                "height": 20,
                "buffer": 10
            };
        
        this.bar = {
                "height": 20
            };
    
        //unique categories
        //bubbleChart color values scale
        const unique = (value, index, self) => {
            return self.indexOf(value) === index
        }

        this.uniqueCats = this.govData.map(d=>d.category).filter(unique)
        var colors = ["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d","#666666"]
        this.bubbleColors = d3.scaleOrdinal()
            .domain(this.uniqueCats)        
            .range(colors)

        this.frequencyScale = d3
            .scaleLinear()
            .domain([0, 1])
            .range([this.cell.buffer, 100])
            .nice();

        this.percentagesScale = d3
            .scaleLinear()
            .domain([0, 400])
            .range([this.cell.buffer,270]);

    

    }

    createTable(data){
        //CREATE TABLE CONTAINER
        d3.select('#header-wrap')
            .append('div')
            .attr('id', 'tableContainer')
            .attr('class', 'view');
        //CREATE TABLE
        d3.select("#tableContainer")
            .append('table')
            .attr('id', 'govTable')
        
        //TABLE HEADER
        var header = d3.select('#govTable')
            .append('thead')
            .append('tr')
            .attr('id', 'govTableHeader')

        var cols = ['Phrase','Frequency','Percentages','Total']
        var headerSvgWidths = [200,150,300,100]
        var headerInfo = []
        for(var i=0; i < cols.length; i++){
            var newobj = {}
            newobj['width'] = headerSvgWidths[i]
            newobj['col'] = cols[i]
            headerInfo[i] = newobj
        }
        
        var headerEnter= header
            .selectAll('td')
            .data(headerInfo)
            .enter()
            .append('td')            
            .append('svg')
            .attr('height', 50)
            .attr('width', d=>d.width)
            .attr('id', d=>`header${d.col}`)

        headerEnter
            .append('rect')
            .attr('width', d=>d.width-5)
            .attr('height', 90)
            .attr('fill','Plum')
            .attr('opacity',.7)
        
        headerEnter            
            .append('text')
            .attr('x',5)
            .attr('y', 20)
            .attr('id',d=>`header${d.col}`)
            .text(d=> d.col)
            .attr('font-weight', 'bold')
        
        //add scale for specific headers
        //FREQUENCY HEADER

        var frequencyAxis = d3.axisTop(this.frequencyScale)
        frequencyAxis.scale(this.frequencyScale).ticks(5)

        d3.select('#headerFrequency')
            .append('g')    
            .attr('transform',`translate(${0},${50})`)
            .call(frequencyAxis)
        
        //PERCENTAGE HEADER
        
        var percentagesAxis = d3.axisTop(this.percentagesScale)
        var percetageValues = [100, 50, 0, 50, 100]
        percentagesAxis.scale(this.percentagesScale).ticks(5).tickFormat((d,i)=>percetageValues[i])
        
        d3.select("#headerPercentages")
            .append('g')
            .attr('transform', `translate(0,${50})`)
            .call(percentagesAxis);

        //Now append the table Body
        d3.select('#govTable')
            .append('tbody')

        var sortLogic = [];
        for(var i=0; i<4; i++){
            sortLogic[i]=false;
        }

        var headerToSort = d3.select('#govTableHeader')
            .selectAll('td')
        
        var headerVals = ['phrase', 'total', 'percent', 'total']
        headerToSort.on('click', (d,i)=>{
            if(i==0){
                sortLogic[i] = !sortLogic[i];
                if(sortLogic[i]){
                    this.govData.sort((a,b) => (a[headerVals[i]] > b[headerVals[i]]) ? 1:-1)
                    this.updateTable(data)
                }else{
                    this.govData.sort((a,b) => (a[headerVals[i]] < b[headerVals[i]]) ? 1:-1)
                    this.updateTable(data)                    
                }
            }

            if(i==1){
                sortLogic[i] = !sortLogic[i];
                if(sortLogic[i]){
                    this.govData.sort((a,b) => (Number(a[headerVals[i]]) < Number(b[headerVals[i]])) ? 1:-1)
                    this.updateTable(data)
                }else{
                    this.govData.sort((a,b) => (Number(a[headerVals[i]]) > Number(b[headerVals[i]])) ? 1:-1)
                    this.updateTable(data)                    
                }
            }

            if(i==2){
                sortLogic[i] = !sortLogic[i];
                if(sortLogic[i]){
                    this.govData.sort((a,b) => (
                        (Number(a['percent_of_d_speeches']) + Number(a['percent_of_r_speeches']) ) < 
                        (Number(b['percent_of_d_speeches']) + Number(b['percent_of_r_speeches']) ) ? 1:-1))
                    this.updateTable(data)
                }else{
                    this.govData.sort((a,b) => (
                        (Number(a['percent_of_d_speeches']) + Number(a['percent_of_r_speeches']) ) > 
                        (Number(b['percent_of_d_speeches']) + Number(b['percent_of_r_speeches']) ) ? 1:-1))
                    this.updateTable(data)
                }
            }

            if(i==3){
                sortLogic[i] = !sortLogic[i];
                if(sortLogic[i]){
                    this.govData.sort((a,b) => (Number(a[headerVals[i]]) < Number(b[headerVals[i]])) ? 1:-1)
                    //console.log(this.govData)
                    this.updateTable(data)
                }else{
                    this.govData.sort((a,b) => (Number(a[headerVals[i]]) > Number(b[headerVals[i]])) ? 1:-1)
                    //console.log(this.govData)
                    this.updateTable(data)                    
                }
            }
        })
    

    
        this.updateTable(data)
    }



    updateTable(data){
        
        //console.log(this.govData)
        var tableRows = d3.select('#govTable')
            .select('tbody')
            .selectAll('tr').html(null)
            .data(data)
            .join('tr');

        tableRows
            .append('th')
            .text(d=> d.phrase)


        var tableCollumns = tableRows
            .selectAll('td')
            .data(d =>{
                var frequency = {
                    'value':{
                        'barWidth':(d.total/50),
                        'category':d.category
                    },
                    'vis':'frequency'
                }

                var percentages = {
                    'value':{
                        'd_speech':d.percent_of_d_speeches,
                        'r_speech':d.percent_of_d_speeches
                    },
                    'vis':'percentages'
                }

                var total = {
                    'value':d.total,
                    'vis':'total'
                }
                return [frequency, percentages, total]
            })
            .join('td')

            tableCollumns
                .filter(d=> d.vis == 'frequency')
                .append('svg')
                .attr('width', 150)
                .attr('height', this.cell.height)
                .append('rect')
                .attr('transform', `translate(${this.cell.buffer},0)`)
                .attr('width', d=>this.frequencyScale(d.value.barWidth))
                .attr('height', this.bar.height)
                .attr('fill', d=> this.bubbleColors(d.value.category))
                .attr('stroke', 'black')
                .attr('stroke-width', 1)
            
            var percentageCollumn = tableCollumns
                .filter(d=> d.vis == 'percentages')
                .append('svg')
                .attr('width', 300)
                .attr('height', this.cell.height)
            
            percentageCollumn
                .append('rect')
                .attr('transform', `translate(${this.cell.buffer},0)`)
                .attr('width', d=>this.frequencyScale(d.value.barWidth))
                .attr('height', this.bar.height)
                .attr('fill', d=> this.bubbleColors(d.value.category))
            
            percentageCollumn
                .append('rect')
                .attr('transform', `translate(${this.cell.buffer},0)`)
                .attr('width', d=> this.percentagesScale(d.value.d_speech))
                .attr('height', this.bar.height)
                .attr('x', d=> this.percentagesScale(200) - this.percentagesScale(d.value.d_speech)   )
                .attr('fill', 'SkyBlue')
                .attr('stroke','black')
                .attr('stroke-width',1)

            percentageCollumn
                .append('rect')
                .attr('transform', `translate(${this.cell.buffer},0)`)
                .attr('width', d=> this.percentagesScale(d.value.r_speech))
                .attr('height', this.bar.height)
                .attr('x', this.percentagesScale(200)   )
                .attr('fill', 'FireBrick')
                .attr('stroke','black')
                .attr('stroke-width',1)

            tableCollumns
                .attr('style','text-align: center')
                //.attr('style','vertical-align: middle')
                .filter(d=>d.vis == 'total')
                .append('text')
                .classed('totalText', true)
                .text(d=>d.value)

    }

}