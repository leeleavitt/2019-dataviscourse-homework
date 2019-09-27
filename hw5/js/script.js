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
    function rankFinder(dat){
        if(dat==='Group'){
            return 0
        }else if(dat==='Round of Sixteen'){
            return 1
        }else if(dat==='Quarter Finals'){
            return 2
        }else if(dat==='Semi Finals'){
            return 3
        }else if(dat==='Fourth Place'){
            return 4
        }else if(dat==='Third Place'){
            return 5
        }else if(dat==='Runner-Up'){
            return 6
        }else if(dat=='Winner'){
            return 7
        }
    }

    //INVOKE NESTING!
    teamData = d3.nest()
        //NEST BY TEAM
        .key(d=> {
            return d.Team; 
        })
        //NOW USE THIS HANDY FUNCITON TO ROLLUP EACH LEAVE THAT IS CREATED
        .rollup(function(leaves) { return {
            'Delta Goals': d3.sum(leaves, function(l){return l['Delta Goals']}),
            'Goals Conceded': d3.sum(leaves, function(l){return l['Goals Conceded']}),
            "Goals Made": d3.sum(leaves, function(l){return l['Goals Made']}),
            Losses: d3.sum(leaves, function(l){return l.Losses}),
            Wins: d3.sum(leaves, function(l){return l.Wins}),
            TotalGames: leaves.length,
            type: 'aggregate',
            //THIS IS THE WAY TO CREATE GAMES USING A MAP FUNCTION
            //OFF OF LEAVES
            games : leaves.map(function(d){
                //ONCE IN MAP, THIS WILL PERFORM THESE THINGS LIKE A FOR LOOP
                //INITIALIZE A NEW OBJECT
                var rObj = {};
                //NOW INITIALIZE THE KEY
                rObj['key'] = d.Opponent;
                //NOW INITIALZE THE VALUE, WHICH IS NOW A NEW NESTED OBJECT
                rObj['value'] = {
                    'Delta Goals':d['Delta Goals'],
                    'Goals Conceded': d['Goals Conceded'],
                    'Goals Made': d['Goals Made'],
                    Losses: '',
                    Opponent: d.Opponent,
                    Wins:'',
                    type:'game',
                    //THIS IS THE EASY WAY TO INVOKE THE RESULT
                    Result: {
                        label:d.Result,
                        ranking: rankFinder(d.Result)
                    }
                };
                //DONT FORGET TO RETURN THIS NEWLY CREATED OBJECT
                //AS PREVIOUSLY STATED THIS WILL BE A FOR LOOP
                return(rObj)
            }),
            //NOW TO THE HARD PART, THIS IS HOW WE INVOKE THE RESULTS
            Result: {
                label: leaves[
                        //HERE I AM USING THE STRATEGY OF AN IIF (IMMEDIATELY INVOKEABLE FUNCTION)
                        (function(){
                            //I INITIALIZE RANKS
                            var ranks=[];
                            //NOW FOR EACH LEAVES.RESULT, RANKFIND IT AND ADD IT TO THE RANKS
                            leaves.map(function(d){
                                ranks.push(rankFinder(d.Result)); 
                            })
                            //NOW USING THIS HANDY FUNCTION (INDEXOF) I WILL FIND THE INDEX
                            //OF THE MAXIMUM VALUE
                            let ranksMaxVal = ranks.indexOf(Math.max(...ranks));
                            //RETURN THAT
                            return(ranksMaxVal);
                        //THIS IS ESSENTIAL FOR THE IIF
                        })()
                    ].Result,
                ranking: rankFinder(leaves[(function(){
                    var ranks=[];
                    leaves.map(function(d){
                        ranks.push(rankFinder(d.Result)); 
                    })
                    let ranksMaxVal = ranks.indexOf(Math.max(...ranks));
                    return(ranksMaxVal);
                    })()].Result)
            },

                        
        };
        })
        .entries(matchesCSV);
    
    /**
     * Loads in the tree information from fifa-tree-2018.csv and calls createTree(csvData) to render the tree.
     *
     */
    d3.csv("data/fifa-tree-2018.csv").then( treeCSV => {
        //Create a unique "id" field for each game
        treeCSV.forEach( (d, i) => {
            d.id = d.Team + d.Opponent + i;
        });

        //Create Tree Object
        let tree = new Tree();
        tree.createTree(treeCSV);
        
        //Create Table Object and pass in reference to tree object (for hover linking)
        let table = new Table(teamData,tree);

        table.createTable();
        table.updateTable();
    });

});

//********************** END HACKER VERSION ***************************
