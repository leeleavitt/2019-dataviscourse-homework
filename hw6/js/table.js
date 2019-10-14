class Table{
    constructor(govData){
        this.govData;
    }

    createTable(){
        //CREATE TABLE CONTAINER
        d3.select('#header-wrap')
            .append('div')
            .attr('id', 'tableContainer');
        //CREATE TABLE
        d3.select("#tableContainer")
            .append('table')
            .attr('id', 'govTable')
        
        //Create table Header
        var header = d3.select('#govTable')
            .append('thead')
            .append('tr')
            .attr('id', '#govTableHeader')

        var cols = ['Phrase','Frequency','Percentages','Total']
        var headerSvgWidths = [100,200,300,100]

        var headerInfo = []
        for(var i=0; i < cols.length; i++){
            var newobj = {}
            newobj['width'] = headerSvgWidths[i]
            newobj['col'] = cols[i]
            headerInfo[i] = newobj
        }
        console.log(headerInfo)

        header
            .selectAll('td')
            .data(headerInfo)
            .enter()
            .append('td')
            .append('svg')
            .attr('height', 100)
            .attr('width', d=>d.width)
            .append('text')
            .attr('x',d=> d.width/2)
            .attr('y', 50)
            .text(d=> d.col)


            


    }

}