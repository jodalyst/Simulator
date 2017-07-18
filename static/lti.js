

var xc = [0,0,0];
var Ec = [[1, 0.01, 0],[0,0.5,0.1],[0,0,0.1]];
var Ac = [[1, 0.01, 0],[0,0.5,0.1],[0,0,0.1]];
var Bc = [0,0,1];
var Cc = [1,0,0];

console.log(Cc.length);
if (Cc[0].length == null){
    console.log("dimension one");
}

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
function SysSim(var Ain, var Bin, var Cin, var Din, var Ein=null, var Ts=null){
    var A = Ain.slice(0);
    var B = Bin.slice(0);
    var C = Cin.slice(0);
    var D = Din.slice(0);
    var E = Ein.slice(0); 
    var x_num = A.length; //number of states
    var y_num;
    var u_num;
    var A_dimr = A.length;
    var A_dimc = A[0].length;
    var B_dimr = B.length;
    var B_dimc = B[0].length;
    if (B_dimc == null){
        B_dimc = 1;
        u_num = 1; 
    }else{
        u_num = B_dimc;
    }
    var C_dimc = C.length;
    var C_dimr = C[0].length;
    if (C_dimc==null){
        C_dimc = 1;
        y_num = 1; 
    }else{
        y_num = C_dimc;
    {
    var D_dimr = D.length;
    if (D_dimr==null){
        D_dimr = 1;
    } 
    var D_dimc = D[0].length;
    if (D_dimc == null){
        D_dimc = 1;
    }
    
    if (
    if (E==null){
        E = numeric.identity(x_num);
    } 
    var E_dim1 = E.length;
    var E_dim2 = E[0].length;
    
    if(A_dimr != A_dimc){
        console.log("Error: A dimensions must agree! ");

    var x_next;
    var x;

    this.step = function(var input){
        var first = numeric.dot(Ad,x);
        var second = numeric.dot(Bd,u);
        x_next = numeric.add(first,second);
        y = numeric.dot(C,x);
        x = x_next;
        return y;
    }
    this.set = function(var start_state){
        var ss_x_dim = start_state.length;
        var ss_y_dim = start_state[0].length;
    } 
    this.reset = function(var start_state){
        x =         
    }
}




/*Javascript continuous-to-discrete time state space converter
Attempts to automatically find timescale appropriate/sufficient for discrete simulation
Based off of  eigenvalues of normalized A matrix
Matrix Exponential for Bd calculated using series...order of sum can be specified...set to 5 for default.
*/
/*
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
*/
