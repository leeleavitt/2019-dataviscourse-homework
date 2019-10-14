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
        header
            .selectAll('td')
            .data(cols)
            .enter()
            .append('td')
            .text(d=> d)



    }

}