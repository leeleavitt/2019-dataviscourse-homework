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
            .range([this.cell.buffer,this.cell.width+(this.cell.buffer)*2]);


        /** Used for games/wins/losses*/
        var gameScaleMax = Math.max(...this.teamData.map(d=>d['TotalGames']))
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
        this.goalColorScale = null;
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
            .attr('width', this.cell.width+(this.cell.buffer*3))
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

        //Append th elements for the Team Names

        //Append td elements for the remaining columns. 
        //Data for each cell is of the type: {'type':<'game' or 'aggregate'>, 'vis' :<'bar', 'goals', or 'text'>, 'value':<[array of 1 or two elements]>}
        
        //Add scores as title property to appear on hover

        //Populate cells (do one type of cell at a time )

        //Create diagrams in the goals column

        //Set the color of all games that tied to light gray

    };

    /**
     * Updates the global tableElements variable, with a row for each row to be rendered in the table.
     *
     */
    updateList(i) {
        // ******* TODO: PART IV *******
       
        //Only update list for aggregate clicks, not game clicks
        
    }

    /**
     * Collapses all expanded countries, leaving only rows for aggregate values per country.
     *
     */
    collapseList() {
        
        // ******* TODO: PART IV *******

    }


}
