

var x_next = [0,0,0];
var x = [0,0,0];
var A = [[1, 0.01, 0],[0,0.5,0.1],[0,0,0.1]];
var B = [0,0,1];
var C = [1,0,0];
var u = 1;
var y = [0];
console.log("start");
for(var i=0;i<100;i++){ 
    console.log('loop');
    var first = numeric.dot(A,x);
    var second = numeric.dot(B,u);
    console.log(first);
    console.log(second);
    x_next = numeric.add(first,second);
    y = numeric.dot(C,x);
    x = x_next;
    console.log(y);
}

