

var x_next = math.matrix([[0],[0],[0]]);
var x = math.matrix([[0],[0],[0]]);
var A = math.matrix([[1, 0.01, 0],[0,0.5,0.1],[0,0,0.1]]);
var B = math.matrix([[0],[0],[1]]);
var C = math.matrix([1,0,0]);
var u = 1;
var y = 0;
console.log("start");
for(var i=0;i<100;i++){ 
    x_next = math.multiply(A,x) + math.multiply(B,u);
    y = math.multiply(C,x);
    x = x_next;
    console.log(math.index(y);
}

