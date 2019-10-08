/** Class implementing the tree view. */
class Tree {
    /**
     * Creates a Tree Object
     */
    constructor() {
        
    }

    /**
     * Creates a node/edge structure and renders a tree layout based on the input data
     *
     * @param treeData an array of objects that contain parent/child information.
     */
    createTree(treeData) {
        //console.log(treeData)
        // ******* TODO: PART VI *******

        //Create a tree and give it a size() of 800 by 300. 
        const treeMap = d3.tree().size([800,300]);

        //Create a root for the tree using d3.stratify();
        const treeStrat = d3.stratify()
            .id((d,i) => { return i; })
            .parentId((d,i) => { return d.ParentGame; })
            (treeData);

        const hData = d3.hierarchy(treeStrat, d=>d.children)
        const nodes = treeMap(hData)
        //console.log(nodes)
        

        d3.select("#tree")
            .attr('transform',`translate(${100},0)`)
            .selectAll('.link')
            .data(nodes.descendants().slice(1))
            .join('path')
            .attr('class',d=>`link ${d.data.data.Team} ${d.data.data.Team}Team ${d.data.data.Opponent}`)
            //.attr('class', d=>console.log(d.data.data.Team))
            .attr("d",
                d=> `M ${d.y}, ${d.x} C ${(d.y + d.parent.y) / 2}, ${d.x} ${(d.y + d.parent.y)/2}, ${d.parent.x} ${d.parent.y}, ${d.parent.x}`
            );
        
        var node = d3.select("#tree")
            .selectAll('.node')
            .data(nodes.descendants())
            .join('g')
            .attr('transform', d=> `translate(${d.y},${d.x})`)
            .attr('class',d=>d.data.data.Wins==='1'?'winner':'node');

        node
            .append('circle')
            .attr('r',5)
            .attr('class', d=> d.Wins===1 ? 'winner':'');
        
        node
            .append('text')
            .attr('dy','0.35em')
            .attr('x', d=>(d.children? -60:13))
            .attr('class',d=>`text${d.data.data.Team} text${d.data.data.Team}Team text${d.data.data.Opponent}` )
            //.classed('node',true)
            .text(d=>d.data.data.Team)
        //Add nodes and links to the tree. 
    }

    /**
     * Updates the highlighting in the tree based on the selected team.
     * Highlights the appropriate team nodes and labels.
     *
     * @param row a string specifying which team was selected in the table.
     */
    updateTree(row) {
        //console.log(row.value.type)
        if(row.value.type==='aggregate'){
            d3.select("#tree").selectAll(`.${row.key}Team`).classed('selected', true)
            d3.select("#tree").selectAll(`.text${row.key}Team`).classed('selectedLabel', true)
        }else{
            //console.log(row)
            d3.selectAll(`.${row.key.substring(1)}`).filter(`.${row.value.Opponent}`).classed('selected', true)
            d3.selectAll(`.text${row.key.substring(1)}`).filter(`.text${row.value.Opponent}`).classed('selectedLabel', true)
        }
        
        // ******* TODO: PART VII *******
    }

    /**
     * Removes all highlighting from the tree.
     */
    clearTree() {
        //console.log('hi')
        d3.select("#tree").selectAll('.selected').classed('selected',false)
        d3.select("#tree").selectAll('.selectedLabel').classed('selectedLabel',false)
        // ******* TODO: PART VII *******

        // You only need two lines of code for this! No loops! 
    }
}
