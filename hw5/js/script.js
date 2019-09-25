// /**
// * Loads in the table information from fifa-matches-2018.json
// */
// d3.json('data/fifa-matches-2018.json').then( data => {
//     console.log(data)
//     /**
//      * Loads in the tree information from fifa-tree-2018.csv and calls createTree(csvData) to render the tree.
//      *
//      */
//     d3.csv("data/fifa-tree-2018.csv").then(csvData => {

//         //Create a unique "id" field for each game
//         csvData.forEach( (d, i) => {
//             d.id = d.Team + d.Opponent + i;
//         });

//         //Create Tree Object
//         let tree = new Tree();
//         tree.createTree(csvData);

//         console.log(tree)
//         //Create Table Object and pass in reference to tree object (for hover linking)

//         let table = new Table(data,tree);


//         table.createTable();
//         table.updateTable();
//     });
// });



//********************** HACKER VERSION ***************************
/**
 * Loads in fifa-matches-2018.csv file, aggregates the data into the correct format,
 * then calls the appropriate functions to create and populate the table.
 *
 */

d3.csv("data/fifa-matches-2018.csv").then( matchesCSV => {
    console.log(matchesCSV)
    
    teamData = d3.nest()
        .key(d=> {
            return d.Team; 
        })
        .rollup(function(leaves) { return {
            'Delta Goals': d3.sum(leaves, function(l){return l['Delta Goals']}),
            'Goals Conceded': d3.sum(leaves, function(l){return l['Goals Conceded']}),
            "Goals Made": d3.sum(leaves, function(l){return l['Goals Made']}),
            Losses: d3.sum(leaves, function(l){return l.Losses}),
            Wins: d3.sum(leaves, function(l){return l.Wins}),
            TotalGames: leaves.length,
            type: 'aggregate',
            Result: {
                label: leaves[leaves.length-1].Result,
                ranking: leaves[leaves.length-1].Result==="Quarter Finals" ? 2:''
            },
            games: d3.nest()
                .key(o => {return o.Opponent;
                })
                .rollup(function(d){ return{
                    'Delta Goals':'',
                    'Goals Conceded': d[0]['Goals Conceded'],
                    'Goals Made': d[0]['Goals Made'],
                    Losses: d[0].Losses,
                    Opponent: d[0].Opponent,
                    Wins:'',
                    type:'game',
                    Result: {
                        label:d[0].Result,
                        ranking: d[0].length
                    }
                };
                })
                .entries(leaves)
                
            
        };
        })
        .entries(matchesCSV);
    
        console.log(teamData)

        // .rollup( leaves =>{
        //     return d3.sum(leaves, function(l){return l.Wins});
        // })
        //.entries(allGames);
    /**
     * Loads in the tree information from fifa-tree-2018.csv and calls createTree(csvData) to render the tree.
     *
     */
    console.log(matchesCSV)
   d3.csv("data/fifa-tree-2018.csv").then( treeCSV => {

    // ******* TODO: PART I *******


      });

});

//********************** END HACKER VERSION ***************************
