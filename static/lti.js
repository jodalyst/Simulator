

var xc = [0,0,0];
var Ec = [[1, 0.01, 0],[0,0.5,0.1],[0,0,0.1]];
var Ac = [[1, 0.01, 0],[0,0.5,0.1],[0,0,0.1]];
var Bc = [0,0,1];
var Cc = [1,0,0];

var u = 1;
var y = [0];

var x_next = [0,0,0];
var x = [0,0,0];
var Ad = [[1, 0.01, 0],[0,0.5,0.1],[0,0,0.1]];
var Bd = [0,0,1];
var Cd = [1,0,0];
/*
console.log("start");
for(var i=0;i<100;i++){ 
    console.log('loop');
    var first = numeric.dot(Ad,x);
    var second = numeric.dot(Bd,u);
    console.log(first);
    console.log(second);
    x_next = numeric.add(first,second);
    y = numeric.dot(C,x);
    x = x_next;
    console.log(y);
}
*/


/*Javascript continuous-to-discrete time state space converter
Attempts to automatically find timescale appropriate/sufficient for discrete simulation
Based off of  eigenvalues of normalized A matrix
Matrix Exponential for Bd calculated using series...order of sum can be specified...set to 5 for default.
*/

function c2d(var A,var B,var C,var D,var E,var Ts=null,var order=5){
    var Einv = numeric.inv(E);
    var Aeff = numeric.dot(E,A);
    var Beff = numeric.dot(E,B);
    var ev = numeric.eig(A);
    console.log(ev);
    var min_ev = min(ev);
    console.log(min_ev);
    if (Ts==null){
        Ts = 0.1*min_ev;
    }
    var Ad = numeric.dot(Aeff,Ts);
    var Bd = numeric.dot(Beff,Ts);
    var dim = numeric.dim(Ad)[0];
    var mT = numeric.dot(numeric.identity(dim),-1)
    Ad = numeric.add(Ad,mT);
    var total = numeric.identity(dim);
    for (var i=1; i<order; i++){
        var top = 1;
        for (var j=0; j<i; i++){
            top = numeric.dot(numeric.dot(Aeff,Ts),top);
        }
        numeric.add(numeric.dot(top,1.0/factorial(i+1)),total);
    }
    precal = numeric.dot(Ts,total);
    Bd = numeric.dot(precal,Beff);
    return {'Ad':Ad,'Bd':Bd,'Cd':C,'Dd': D, 'Ts':Ts}
};

function factorial(var x){
    total = x;
    for (var i = x-1; i>0; i--){
        total*=i;
    }
    return total;
}

