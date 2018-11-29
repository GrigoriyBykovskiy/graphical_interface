var FIELD_HEIGHT=500;
var FIELD_WIDHT=500;
var CANVAS_ID="field_for_graph";
var NODE_RADIUS=10;
var CANVAS_OFFSET=8;   //I dont know library function for finding padding; Offset for Opera
var buff_node_add;    //Need for adding a edge
var buff_node_delete;//Need for deleting a edge
function get_random_color(){
    var colors=["HotPink","DeepPink","MediumVioletRed","Fuchsia","BlueViolet","Purple","Green","Olive","DarkCyan","Blue","DarkBlue","Brown"];
    return colors[Math.floor(Math.random() * 11 )+1];
};
var graph={
    nodes:[],
    edges:[],
    add_node:function(payload,x,y) {
        this.node = {
            node_payload: payload,
            node_x: x,
            node_y: y
        };
        this.nodes.push(this.node);
    },
    delete_node:function(x,y) {
        for (i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].node_x == x && this.nodes[i].node_y == y) {
                this.nodes.splice(i, 1);
            }
        }
    },
    find_node:function(x,y) {//something may be wrong!
        for (i = 0; i < this.nodes.length; i++) {
            if ((Math.abs(x - this.nodes[i].node_x) < NODE_RADIUS) && (Math.abs(y - this.nodes[i].node_y) < NODE_RADIUS)) {
                return this.nodes[i];
            }
        }
        ;
    },
    add_edge:function(payload,parent_node,child_node) {
        this.edge = {
            edge_payload: payload,
            edge_color: get_random_color(),
            edge_parent: parent_node,
            edge_child: child_node,
        }
        this.edges.push(this.edge);
    },
    delete_edge:function(parent_node,child_node) {
        for (i = 0; i < this.edges.length; i++) {
            if (this.edges[i].edge_parent === parent_node && this.edges[i].edge_child === child_node) {
                this.edges.splice(i, 1);
            }
        }
    },
    delete_edges:function(node) {
        for (i = 0; i < this.edges.length; i++) {
            if (this.edges[i].edge_parent === node||this.edges[i].edge_child === node){
                this.edges.splice(i, 1);
                i=i-1;
            }
        }
    }
};
function draw_node(payload,x,y) {
    context = document.getElementById(CANVAS_ID).getContext("2d");
    context.beginPath();
    context.arc(x, y, NODE_RADIUS, 0, 2 * Math.PI);
    context.fillStyle = "Red";
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = "Red";
    context.stroke();
    context.fillStyle = "White";
    context.font = "10px Arial";
    context.fillText(payload, x - NODE_RADIUS / 3, y + NODE_RADIUS / 3);
};
function draw_mark_node(x,y){
    context = document.getElementById(CANVAS_ID).getContext("2d");
    context.beginPath();
    context.arc(x, y, NODE_RADIUS+1, 0, 2 * Math.PI);
    context.lineWidth = 1;
    context.strokeStyle = "Green";
    context.stroke();
};
function draw_edge(payload,color,parent_node,child_node,key) {
    context = document.getElementById(CANVAS_ID).getContext("2d");
    var centre_x = (child_node.node_x + parent_node.node_x) / 2;
    var centre_y = (child_node.node_y + parent_node.node_y) / 2;
    context.beginPath();
    context.lineWidth = 2;
    context.strokeStyle = color;
    context.moveTo(parent_node.node_x, parent_node.node_y);
    context.quadraticCurveTo(2*CANVAS_OFFSET +centre_x,2*CANVAS_OFFSET + centre_y, child_node.node_x, child_node.node_y);
    context.stroke();
    context.fillStyle = "White";
    context.font = "10px Arial";
    context.fillText(payload, centre_x, centre_y);
};
function  view(){
    controller();
    var canvas = document.getElementById(CANVAS_ID);
    canvas.width = FIELD_WIDHT;
    canvas.height = FIELD_HEIGHT;
    context = canvas.getContext("2d");
    context.fillStyle = "Black";
    context.fillRect(0, 0, FIELD_WIDHT, FIELD_HEIGHT);
    context.fill();
    for (var i = 0; i < graph.edges.length; i++) {
        draw_edge(graph.edges[i].edge_payload,graph.edges[i].edge_color,graph.edges[i].edge_parent,graph.edges[i].edge_child);
    }
    for (var k = 0; k < graph.nodes.length; k++) {
        draw_node(graph.nodes[k].node_payload,graph.nodes[k].node_x,graph.nodes[k].node_y);
    }
};
function left_click(event){
    mouse_x = event.pageX-CANVAS_OFFSET;
    mouse_y = event.pageY-CANVAS_OFFSET;
    /*This add node*/
    if (event.ctrlKey) {
        var user_input = prompt("Name of node:");
        if (user_input!==null) {
            graph.add_node(user_input, mouse_x, mouse_y);
            view();
        }
    }
    /*This delete node*/
    if (event.altKey){
        var hit_node=graph.find_node(mouse_x,mouse_y);
        if (hit_node!==undefined){
            graph.delete_node(hit_node.node_x,hit_node.node_y);
            graph.delete_edges(hit_node);
            view();
        }
    }
};
function right_click(event) {
    mouse_x = event.pageX - CANVAS_OFFSET;
    mouse_y = event.pageY - CANVAS_OFFSET;
    /*This add edge*/
    if (event.ctrlKey) {
        var hit_node = graph.find_node(mouse_x, mouse_y);
        if (hit_node !== undefined) {
            if (buff_node_add === undefined) {
                draw_mark_node(hit_node.node_x, hit_node.node_y);
                buff_node_add = hit_node;
            }
            else {
                var user_input = prompt("Weight of edge:");
                if (user_input !== null) {
                    graph.add_edge(user_input, buff_node_add, hit_node);
                    view();
                    buff_node_add = undefined;
                }
            }
        }
    }
    /*This delete edge*/
    if (event.altKey) {
        var hit_node = graph.find_node(mouse_x, mouse_y);
        if (hit_node !== undefined) {
            if (buff_node_delete === undefined) {
                draw_mark_node(hit_node.node_x, hit_node.node_y);
                buff_node_delete = hit_node;
            }
            else {
                graph.delete_edge(buff_node_delete, hit_node);
                view();
                buff_node_delete = undefined;
            }
        }
    }
};
function controller(){
    document.getElementById(CANVAS_ID).addEventListener("click", left_click);
    document.getElementById(CANVAS_ID).addEventListener("contextmenu", right_click);
};
function init(){
    view();
};
init();