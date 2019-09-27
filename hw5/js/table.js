/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(teamData, treeObject) {
        console.log(teamData)
        // Maintain reference to the tree object
        this.tree = treeObject;

        /**List of all elements that will populate the table.*/
        // Initially, the tableElements will be identical to the teamData
        this.tableElements = teamData;

        ///** Store all match data for the 2018 Fifa cup */
        this.teamData = teamData;

        this.tableHeaders = ["Delta Goals", "Result", "Wins", "Losses", "TotalGames"];

        /** letiables to be used when sizing the svgs in the table cells.*/
        this.cell = {
            "width": 70,
            "height": 20,
            "buffer": 15
        };

        this.bar = {
            "height": 20
        };

        /** Set variables for commonly accessed data columns*/
        this.goalsMadeHeader = 'Goals Made';
        this.goalsConcededHeader = 'Goals Conceded';

        /** Setup the scales*/
        var goalScaleMax = Math.max(...this.teamData.map(d=>d.value['Goals Made']));
        this.goalScale = d3
            .scaleLinear()
            .domain([0,goalScaleMax])
            .range([0,150-(this.cell.buffer)]);


        /** Used for games/wins/losses*/
        var gameScaleMax = Math.max(...this.teamData.map(d=>d.value['TotalGames']))
        this.gameScale = d3
            .scaleLinear()
            .domain([0,gameScaleMax])
            .range([0, this.cell.width]);

        /**Color scales*/
        /**For aggregate columns*/
        /** Use colors '#feebe2' and '#690000' for the range*/
        this.aggregateColorScale = d3
            .scaleLinear()
            .domain([0,gameScaleMax])
            .range(['#feebe2','#690000']);


        /**For goal Column*/
        /** Use colors '#cb181d' and '#034e7b' for the range */
        var goalDeltaMin = Math.min(...this.teamData.map(d=>d.value['Delta Goals']))
        var goalDeltaMax = Math.max(...this.teamData.map(d=>d.value['Delta Goals']))
        this.goalColorScale = d3
            .scaleThreshold()
            .domain([-1,0,1])
            .range(['#cb181d','gray','#034e7b']);
    }


    /**
     * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
     * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
     *
     */
    createTable() {

        // ******* TODO: PART II *******

        //Update Scale Domains
        var goalXAxis = d3.axisTop(this.goalScale)
        goalXAxis.scale(this.goalScale)
    
        // Create the axes
        d3.select('#goalHeader')
            .append('svg')
            .attr('width', 150)
            .attr('height', this.cell.height + this.cell.buffer)
            //.attr('transform', 'translate(0,'+(this.cell.height - this.cell.buffer)+')')
            .attr('id','goalHeaderAxis');
        d3.select('#goalHeaderAxis')
            .append('g')
            //REMEBER TO TRANFORM THE GROUPING ELEMENT NOT THE SVG
            .attr('transform','translate(0,'+this.cell.height+')')
            .attr('id', 'goalAxis')
            .call(goalXAxis)

        //add GoalAxis to header of col 1.
        d3.select('#goalAxis')
            .call(goalXAxis);
            
        // ******* TODO: PART V *******

        // Set sorting callback for clicking on headers
        

        //Set sorting callback for clicking on Team header
        //Clicking on headers should also trigger collapseList() and updateTable().

    }


    /**
     * Updates the table contents with a row for each element in the global variable tableElements.
     */
    updateTable() {
        // ******* TODO: PART III *******
        //Create table rows
        //FIND WHERE I AM AND APPEND THE DATA
        var tableRows = d3.select('#matchTable')
            .select('tbody')
            .selectAll('tr')
            .data(this.tableElements)
            .append('tr');
        //ENTER AND APPEND TABLE ROWS
        var tableRowsEnter = tableRows.enter()
            .append('tr')
            .on('click',(d,i)=>this.updateList(i))
        //REMOVE ITEMS TO DISAPPEAR

        //Append th elements for the Team Names
        //MERGE THE ENTER AND THE ORIGINAL NOW THAT EXIT IS GONE
        tableRows = tableRowsEnter.merge(tableRows)

        //NOW LETS ADD SOME FUN STUFF
        tableRows
            .append('th')
            .text(d=>d.key)
            .classed('aggregate',true)
        //Append td elements for the remaining columns. 
        //Data for each cell is of the type: {'type':<'game' or 'aggregate'>, 'vis' :<'bar', 'goals', or 'text'>, 'value':<[array of 1 or two elements]>}

        var tableCollumns = tableRows.selectAll('td')
            .data(d=>{
                var Goals={
                    'type':d.value.type,
                    'vis':'goals',
                    'value':{
                        'Delta Goals':d.value['Delta Goals'],
                        'Goals Conceded':d.value['Goals Conceded'],
                        'Goals Made':d.value['Goals Made']
                    }
                }
                
                var Round= {
                    'type':d.value.type,
                    'vis':'text',
                    'value': d.value.Result.label
                }
                
                var Wins = {
                    'type':d.value.type,
                    'vis':'bars',
                    'value':d.value.Wins
                }

                var Losses={
                    'type':d.value.type,
                    'vis':'bars',
                    'value':d.value.Losses
                }
                
                var TotalGames={
                    'type':d.value.type,
                    'vis':'bars',
                    "value":d.value.TotalGames
                }

                return [Goals, Round, Wins, Losses, TotalGames]

            })


        var tableCollumnsEnter = tableCollumns.enter().append('td')
        //tableCollumns.exit().remove()

        tableCollumns = tableCollumnsEnter.merge(tableCollumns)
        console.log(tableCollumns)

        tableCollumns
            .filter(d=> d.vis == 'bars'&& d.type=='aggregate')
            .append('svg')
            .attr('width',this.cell.width)
            .attr('height', this.cell.height)
            .append('rect')
            .attr('width', d => this.gameScale(d.value))
            .attr('height', this.bar.height)
            .attr('fill',d=>this.aggregateColorScale(d.value));
            
        tableCollumns
            .filter(d=> d.vis == 'bars'&& d.type=='aggregate')
            .selectAll('svg')
            .append('text')
            .attr('x',d=>this.gameScale(d.value)-10 )
            .attr('y',this.cell.buffer)
            .text(d=>d.value)
            .classed('label',true);
        
        tableCollumns
            .filter(d=> d.vis=='text')
            .append('svg')
            .attr('width',140)
            .attr('height', this.cell.height)
            .append('text')
            .attr('font-weight','bold')
            .attr('x',this.cell.buffer)
            .attr('y',this.cell.buffer)
            .text(d=>d.value)
            //.attr()
        
        //Add scores as title property to appear on hover

        //Populate cells (do one type of cell at a time )

        //Create diagrams in the goals column
        tableCollumns
            .filter(d => d.vis=='goals')
            .append('svg')
            .attr('width', 150)
            .attr('height', this.cell.height)
            .append('rect')
            .attr('x', d => this.goalScale(Math.min(d.value['Goals Conceded'],d.value['Goals Made'])))
            .attr('y',this.cell.buffer-5)
            .attr('width', d=>this.goalScale(Math.abs(d.value['Delta Goals'])))
            .attr('height', 15)
            .classed('goalBar', true)
            .attr('fill',d=>this.goalColorScale(d.value['Delta Goals']))
        
        tableCollumns
            .filter(d => d.vis=='goals')
            .select('svg')
            .append('circle')
            .classed('goalCircle', true)
            .attr('cx',d=>this.goalScale(d.value['Goals Conceded']))
            .attr('cy', this.cell.buffer)
            .attr('fill',d=>d.value['Delta Goals']===0?'lightgray':'red')

        tableCollumns
            .filter(d => d.vis=='goals')
            .select('svg')
            .append('circle')
            .classed('goalCircle', true)
            .attr('cx',d=>this.goalScale(d.value['Goals Made']))
            .attr('cy', this.cell.buffer)
            .attr('fill',d=>d.value['Delta Goals']===0?'lightgray':'blue')

        //Set the color of all games that tied to light gray
 
    };

    /**
     * Updates the global tableElements variable, with a row for each row to be rendered in the table.
     *
     */
    updateList(i) {
        console.log(i)
        // ******* TODO: PART IV *******
        console.log(this.tableElements)
        this.tableElements[i].value.games.map(
            (d,i)=>this.tableElements.splice((i+1),0,d))
        console.log(this.tableElements.filter(d=>d.value.type=='game').map(d=>d.key='x'+d.key))
       //Only update list for aggregate clicks, not game clicks
        console.log(this.teamData)
        this.updateTable()
        
    }

    /**
     * Collapses all expanded countries, leaving only rows for aggregate values per country.
     *
     */
    collapseList() {
        
        // ******* TODO: PART IV *******

    }


}
