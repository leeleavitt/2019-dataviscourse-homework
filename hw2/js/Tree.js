/** Class representing a Tree. */
class Tree {
    /**
     * Creates a Tree Object
     * Populates a single attribute that contains a list (array) of Node objects to be used by the other functions in this class
     * note: Node objects will have a name, parentNode, parentName, children, level, and position
     * @param {json[]} json - array of json objects with name and parent fields
     */
    constructor(json) {
        //This automatically populates my nodeArray
        this.nodeArray = json.map(d => {
            var newNode = new Node(d.name, d.parent);
            return newNode;
        })
        this.positionInitial = 0;
    }
    

    /**
     * Function that builds a tree from a list of nodes with parent refs
     */
    buildTree() {
        //ASSIGN CHILDREN
        function onlyUnique(value, index, self) { 
            return self.indexOf(value) === index;
        }
        //Find all Unique Parent names
        var parentNames = []
        for(var i=0; i<this.nodeArray.length; i++){
            parentNames.push(this.nodeArray[i].parentName)
        }
        //Now for each unique parent name i will find all the children associated with it
        //and then add it to the children arry within the node class    
        var uniqueParents = parentNames.filter(onlyUnique);    
        for(var i=0; i < uniqueParents.length; i++){
            if(this.nodeArray[i].parentName !== 'root'){
                    this.nodeArray.filter( parent => parent.name === uniqueParents[i])[0]
                    .children =
                    this.nodeArray.filter( parent => parent.parentName === uniqueParents[i])
                ;
            }
        }
        
        //FILL PARENTNODE
        for(var i=0; i < uniqueParents.length; i++){
            if(this.nodeArray[i].parentName !== 'root'){
                //Find the parent node to add
                var parentsToAppend = this.nodeArray.find( parent => parent.name === uniqueParents[i]);
                var nodesToappend = this.nodeArray.filter( parent => parent.parentName === uniqueParents[i])

                for(var j=0; j<nodesToappend.length; j++){
                    nodesToappend[j].parentNode = parentsToAppend;
                }

            }
        }

        //ASSIGN LEVEL
        //To start this we will look at the parentNode class that is equal to NULL
        //This will be the input to the function
        var rootNode = this.nodeArray.filter(parent => parent.parentNode === null);
        //ASSIGN LEVEL
        this.assignLevel(rootNode[0], 0);
        //ASSIGN POSITION
        this.assignPosition(rootNode[0], this.positionInitial);
        console.log(this.nodeArray)
    }

    /**
     * Recursive function that assign levels to each node
     */
    assignLevel(node, level) {
        //assign the level!
        node.level = level;
        let childLogic = node.children.length;
        while(childLogic !== 0 ){
            level += 1;
            for(let j=0; j<childLogic; ++j){6
                this.assignLevel(node.children[j], level);
            }
        break
        }
    } 


    /**
     * Recursive function that assign positions to each node
     */
    assignPosition(node, position) {
        this.positionInitial = position;
        //ASSIGN POSITION
        node.position = position
        //DETERMINE HOW MANY CHILDREN IN THIS NODE
        let numOfChilds = node.children.length;
        //ONLY PROCEED IF THERE ARE CHILDREN
        while(numOfChilds > 0){
            //FOR EACH CHILD
            for( let i=0; i<numOfChilds; i++){
                //IF IT IS THE FRIST CHILD ASSIGN THE SAME POSITION
                if(i !== 0){
                    position = this.positionInitial + 1;
                }
                this.assignPosition(node.children[i], position);
            }
        break
        }
    }

    /**
     * Function that renders the tree
     */
    renderTree() {
        //Add the svg template to the html
        var svg = d3.select("body")
            .append('svg')
            .attr('width', 1200)
            .attr('height', 1200)
            .attr('background-color','black');
            //.attr('transform', 'scale(200)');

        //NOW APPEND DATA TO 
        var tree = svg.selectAll('nodeGroup')
                    .data(this.nodeArray);
        var treeEnter = tree.enter()
                        
        treeEnter.exit().remove();

        tree = treeEnter.merge(tree);
        
        var locationAttr = 100;
        var lineGroups = tree.append('line')
            .attr('transform', 'translate(50,50)')
            .attr('x1', d => d.parentNode === null ? 0 : d.parentNode.level * locationAttr)
            .attr('x2', d => d.level * locationAttr)
            .attr('y1', d => d.parentNode === null ? 0 : d.parentNode.position * locationAttr)
            .attr('y2', d => d.position * locationAttr);

        var nodeGroup = tree.append('g')
            .attr('class', 'nodeGroup')
            .attr('transform', 'translate(50, 50)');
        nodeGroup            
            .append('circle')
            .attr('r', 40)
            .attr('cx', d => d.level * locationAttr)
            .attr('cy', d => d.position * locationAttr);
        nodeGroup
            .append('text')
            .attr('x', d => d.level * locationAttr)
            .attr('y', d => d.position * locationAttr)
            .attr('class', 'label')
            .text(d => d.name);


    }

}