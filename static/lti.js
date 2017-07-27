
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


function SysSim(var Ain, var Bin, var Cin, var Din=null, var Ein=null, var typein = "CT"){
    // # of states dictated by A matrix
    // number of inputs dictated by B matrix
    // number of outputs dictated by C matrix
    // everything else must agree

    //need to make deep copies of input arrays.
    this.A = numeric.clone(Ain);
    this.B = numeric.clone(Bin);
    this.C = numeric.clone(Cin);
    this.D;
    this.type = typein;
    this.y;
    this.x;
    this.u;

    if (typein != "CT" || typein != "DT"){
    	console.log("Type must be either DT or CT!!!");
    	return false;
    }
    //checks on matrices!:  
    if (numeric.dim(this.A)[0] != numeric.dim(this.A)[1]){
        console.log("A must be square!");
        return false;
    }
    //E matrix setup!
    this.E=0;
    if (Ein==null){
    	var size = numeric.dim(A)[0];
        this.E = numeric.identity(size);
    }else{
        this.E = numeric.clone(Ein);
    }
    if (numeric.dim(this.E)[0] != numeric.dim(this.E)[1]){
        console.log("E must be square!");
        return false;
    }
    if (numeric.dim(this.E)[0] != numeric.dim(this.A)[0] || numeric.dim(this.E)[1] != numeric.dim(this.A)[1]){
        console.log("Size of E and A matrices must agree");
        return false;
    }
    //A vs. B matrix dimension setup!
    if (numeric.dim(this.A)[0] != numeric.dim(this.B)[0]{
        console.log("Number of A rows and B rows must agree!");
        return false;
    }
    //x (state vector) setup:
    //x vector filled in based on A matrix dimensions...not B.
    this.x = [];
    for (int i=0; i<numeric.dim(this.A)[0]; i++){
    	this.x.push(0);
    }
    //u (input) setup:
    if (numeric.dim(this.B).length==1){
    	this.u = [0];
    }else{
    	for (int i=0; i<numeric.dim(this.B)[1];i++){
    		this.u.push(0);
    	}
    }
    //y (output) setup:
    if (numeric.dim(this.C).length==1){
    	this.y = [0];
    	if (numeric.dim(this.C).length[0] != numeric.dim(this.x)[0]){
    		console.log("Number of C cols must agree with number of states");
    		return false;
    	}
    }else{
    	if (numeric.dim(this.C).length[1] != numeric.dim(this.x)[0]){
    		console.log("Number of C cols must agree with number of states");
    		return false;
    	}
    	for (int i=0; i<numeric.dim(this.C)[0]){
    		y.push(0);
    	}
    }
    //D matrix checks...annoyingly complex
    if (Din == null){
    	this.D = numeric.diag(this.u);
    }else{
    	this.D = numeric.clone(Din);
    	if (numeric.dim(this.D).length ==1){ //check if a n by 1 or 1 by n matrix
    		if (numeric.dim(this.y)[0]!=1){ //check with y
    			if (numeric.dim(this.y)[0] != numeric.dim(this.D)[0]){
    				console.log("D dimensions not matching with y dimensions");
    				return false;
    			}
    		}else if(numeric.dim(this.u)[0] != 1){ //check with u
    			if (numeric.dim(this.u)[0] != numeric.dim(this.D)[0]){
    				console.log("D dimensions not matching with u dimensions");
    				return false;
    			}
    		}else{
    			if (numeric.dim(this.D)[0] !=1){
    				console.log("Error in D dimensions [should be 1 by 1]");
    				return false;
    			}
    		}
    	}else{
    		if (numeric.dim(this.D)[0] != numeric.dim(this.y)[0]){
    			console.log("Error! D matrix dimensions do not agree with y matrix dimensions");
    			return false;
    		}if (numeric.dim(this.D)[1] != numeric.dim(this.u)[0]){
    			console.log("Error! D matrix dimensions do not agree with u matrix dimensions");
    			return false;
    		}
    	}
    }

    this.step = function(var input){
		var first = A.multiply(x);
        var second = B.multiply(u);
        x = first.add(second); 
        y = C.multiply(x);
        x = x_next;
        return y;
    }
    this.set = function(var start_state){
        var ss_x_dim = start_state.length;
        var ss_y_dim = start_state[0].length;
    } 
    this.reset = function(var start_state){
        this.set(start_state);
    }
    this.poles = function(){
        var Einv = numeric.inv(E);
        var Aeff = numeric.dot(E,A);
        return numeric.eig(
    } 
    this.zeros = function(){
    }

    this.simulator = function(var Ts){
    	var output = c2d(this.A,this.B,this.C,this.D,this.E,thisTs=null,var order=5)
    }
}

/*
function SysSim(var Ain, var Bin, var Cin, var Din, var Ein=null, var Ts=null){
    // # of states dictated by A matrix
    // number of inputs dictated by B matrix
    // number of outputs dictated by C matrix
    // everything else must agree
    var A = $M(Ain.slice(0));
    var B =$M( Bin.slice(0));
    var C = $M(Cin.slice(0));
    var D = $M(Din.slice(0));
    var E;
    if (Ein==null){
        E = $M(Matrix.I(A.row());
    }else{
        E = $M(Ein.slice(0));
    }
    if (!A.isSquare()){
        console.log("A must be square!");
        return false;
    }
    if (A.rows() != E.rows() || A.cols() != E.cols()){
        console.log("Size of E and A matrices must agree");
        return false;
    }
    if (A.rows() != B.rows(){
        console.log("Number of A and B rows must agree!");
        return false;
    }
    var x = Matrix.Zero(A.rows(),1);
    var Ts = Ts;
    if (C.cols() != x.rows()){
        console.log("Number of C cols must agree with number of states");
        return false;
    }
    var y = Matrix.Zero(C.rows(),1);
    var u = Matrix.zero(B.cols(),1);
    this.step = function(var input){
		var first = A.multiply(x);
        var second = B.multiply(u);
        x = first.add(second); 
        y = C.multiply(x);
        x = x_next;
        return y;
    }
    this.set = function(var start_state){
        var ss_x_dim = start_state.length;
        var ss_y_dim = start_state[0].length;
    } 
    this.reset = function(var start_state){
        this.set(start_state);
    }
    this.poles = function(){
        var Einv = numeric.inv(E);
        var Aeff = numeric.dot(E,A);
        return numeric.eig(
    } 
    this.zeros = function(){
    }
}


function rank(var matrix){

}
*/


function controllability(var A, var B, 

function observability(var A, var B){


}

function acker(var A, var B, var E= null, var lambda){


}




/*Javascript continuous-to-discrete time state space converter
Attempts to automatically find timescale appropriate/sufficient for discrete simulation
Based off of  eigenvalues of normalized A matrix
Matrix Exponential for Bd calculated using series...order of sum can be specified...set to 5 for default.
*/

function c2d(var A,var B,var C,var D,var E,var Ts=null,var order=5){
    var Einv = numeric.inv(E);
    var Aeff = numeric.dot(Einv,A);
    var Beff = numeric.dot(Einv,B);
    var ev = numeric.eig(Aeff);
    console.log(ev);
    var min_ev = min(ev); //find fastest eigenvalue
    console.log(min_ev);
    if (Ts==null){
        Ts = 0.1*min_ev;  //set timestep to be 0.1 of fastest time step
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


/* old version:
function c2d(var A,var B,var C,var D,var E,var Ts=null,var order=5){
    var Einv = numeric.inv(E);
    var Aeff = numeric.dot(Einv,A);
    var Beff = numeric.dot(Einv,B);
    var ev = numeric.eig(Aeff);
    console.log(ev);
    var min_ev = min(ev); //find fastest eigenvalue
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



// // Warn if overriding existing method
// if(Array.prototype.equals)
//     console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// // attach the .equals method to Array's prototype to call it on any array
// Array.prototype.equals = function (array) {
//     // if the other array is a falsy value, return
//     if (!array)
//         return false;

//     // compare lengths - can save a lot of time 
//     if (this.length != array.length)
//         return false;

//     for (var i = 0, l=this.length; i < l; i++) {
//         // Check if we have nested arrays
//         if (this[i] instanceof Array && array[i] instanceof Array) {
//             // recurse into the nested arrays
//             if (!this[i].equals(array[i]))
//                 return false;       
//         }           
//         else if (this[i] != array[i]) { 
//             // Warning - two different object instances will never be equal: {x:20} != {x:20}
//             return false;   
//         }           
//     }       
//     return true;
// }
// // Hide method from for-in loops
// Object.defineProperty(Array.prototype, "equals", {enumerable: false});
