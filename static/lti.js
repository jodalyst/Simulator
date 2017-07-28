
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
Basic object to contain/house/represent a state space object
This does not handle simulation, which is a different thing entirely...this lists attributes of the system itself
*/


function SSObject(var Ain, var Bin, var Cin, var Din=null, var Ein=null, var typein = "CT"){
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
    this.isCT = function(){
    	return this.type == "CT";
    }

    this.poles = function(){
        var Einv = numeric.inv(E);
        var Aeff = numeric.dot(E,A);
        return numeric.eig(
    } 
    
    this.zeros = function(){
    }
}

function SysSim (var sso, var Ts, var state_out = false){
	var output = c2d(sso.A,sso.B,sso.C,sso.D,sso.E,Ts);
	this.A = numeric.clone(output['Ad']);
	this.B = numeric.clone(output['Bd']);
	this.C = numeric.clone(output['Cd']);
	this.D = numeric.clone(output['Dd']);
	this.Ts = Ts;
	this.x = numeric.clone(sso.x);
	this.y = numeric.clone(sso.y);
	this.u = numeric.clone(sso.u);
	this.state_out = state_out;
	this.step = function(var u){
        var first = numeric.dot(this.A,this.x);
        var second = numeric.dot(this.B,u);
        this.x = numeric.add(first,second);
        this.y = numeric.dot(C,x);
        if (this.state_out){
        	return [y,x]; //first output, then states
        }else{}
        	return y;
        }
    }
    this.set = function(var start_x, var start_y){
        this.x = numeric.clone(start_x);
        this.y = numeric.clone(start_y);
    } 
    this.reset = function(var start_state){
    	for (var i = 0; i<numeric.dim(x)[0]; i++){
    		this.x[i]=0;
    	}
    	for (var i = 0; i<numeric.dim(y)[0]; i++){
    		this.y[i] = 0;
    	}
    }
}


function controllability(var A, var B, 

function observability(var A, var B){


}

function acker(var A, var B, var E= null, var lambda){


}




/*Javascript continuous-to-discrete time state space converter
Attempts to automatically find timescale appropriate/sufficient for discrete simulation
Based off of  eigenvalues of normalized A matrix
Matrix Exponential for Bd calculated using series...order of sum can be specified...set to 5 for default.
Order = length of series when doing matrix exponential
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
