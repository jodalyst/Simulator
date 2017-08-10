
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


function SS(Ain,Bin, Cin,Din=null,Ein=null,typein = "CT"){
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
    console.log(typein);
    if (typein != "CT" && typein != "DT"){
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
    	var size = numeric.dim(this.A)[0];
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
    if (numeric.dim(this.A)[0] != numeric.dim(this.B)[0]){
        console.log("Number of A rows and B rows must agree!");
        return false;
    }
    //x (state vector) setup:
    //x vector filled in based on A matrix dimensions...not B.
    this.x = [];
    for (var i=0; i<numeric.dim(this.A)[0]; i++){
    	this.x.push(0);
    }
    //u (input) setup:
    if (numeric.dim(this.B).length==1){
    	this.u = [0];
    }else{
    	for (var i=0; i<numeric.dim(this.B)[1];i++){
    		this.u.push(0);
    	}
    }
    //y (output) setup:
    if (numeric.dim(this.C).length==1){
    	this.y = [0];
        console.log(numeric.dim(this.C)[0]);
        console.log(numeric.dim(this.x)[0]);
    	if (numeric.dim(this.C)[0] !== numeric.dim(this.x)[0]){
    		console.log("Number of C cols must agree with number of states");
    		return false;
    	}
    }else{
    	if (numeric.dim(this.C).length[1] != numeric.dim(this.x)[0]){
    		console.log("Number of C cols must agree with number of states");
    		return false;
    	}
    	for (var i=0; i<numeric.dim(this.C)[0]; i++){
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
    console.log('setup!');
    console.log(this.A);
    console.log(this.B);
    console.log(this.C);
    console.log(this.D);
    this.isCT = function(){
    	return this.type == "CT";
    }
    this.isStable = function(){
    	setup = this.poles();
    	for (var i = 0; i<setup.length; i++){
    		if (this.isCT()){
    			if (setup[i]>0){
    				return false;
    			}
    		}else{
    			if (abs(setup[i])>1){
    				return false;
    			}
    		}
    	}
    	//survived the gauntlet
    	return true;
    }

    this.poles = function(){
        var Einv = numeric.inv(E);
        var Aeff = numeric.dot(E,A);
        return numeric.eig(Aeff);
    } 

    this.zeros = function(){
    }
    this.ctrb = function(){
    	var dim = numeric.dim()

    }
    this.obsv = function(){
    	var dim = numeric.dim()

    }
}


/* Rank function is needed for:
    Observability Calculation
    Controlability Calculation
    Calculation of Zeros (There is rank loss at precisely the location of the zeros)

Rank is of course the list of the maximum number of linearly independent vectors in a matrix

The zeros of the system match the zeros of (for CT):

[[sI-A, -B],
[C, D]]

Step 1 in all of this is converting to reduced row echelon form/row canonical form...then we can see how many 

So an ideal usage for zero calculation will be to calculate this combined matrix manually out for the user and then feed
that into the rank function below.

Where there is rank loss tells us where zeros are...how to search for that?  Not sure...need to look into.

*/ 

function isZero(element, index, array) { 
  return element == 0; 
} 
function rank(M){

/* pseudo-code:

Get in a n by m matrix M:
Set j to 1:
For each row i from 1 to n do the following:
    While column j has all zero elements, if j>m return M else j=j+1
    If element a_{ij} is zero, then interchange row i with a row x>i that has a_{xj} != 0
    Divide each element of row i by a_{ij}, (to make the pivot a_{ij} equal to one).
    For each row k from 1 to n, with k !=i, subtract row i multiplied by a_{kj} from row k.
    Return transformed matrix R


*/
//R is RREF
    var R = rref(M);
    console.log(R);
    var cols = R[0].length;
    var rows = R.length;
    var count = cols;
    for (var i = 0; i < rows; i++){
        if (R[i].every(isZero)){
            count -=1;
        }
    }
    return count;
     
}

//version 2:
//based on implementation here: https://github.com/substack/rref
function rref(Y){
    var R = numeric.clone(Y); //deep copy to avoide messing up input matrix.
    var rows = R.length;
    var columns = R[0].length;
    var lead = 0;
    for (var k = 0; k < rows; k++) {
        if (columns <= lead) return R;
        var i = k;
        while (R[i][lead] === 0) {
            i++;
            if (rows === i) {
                i = k;
                lead++;
                if (columns === lead) return R;
            }
        }
        var irow = R[i], krow = R[k];
        R[i] = krow, R[k] = irow;
        var val = R[k][lead];
        for (var j = 0; j < columns; j++) {
            R[k][j] /= val;
        }
        for (var i = 0; i < rows; i++) {
            if (i === k) continue;
            val = R[i][lead];
            for (var j = 0; j < columns; j++) {
                R[i][j] -= val * R[k][j];
            }
        }
        lead++;
    }
    return R;
};

function SysSim (sso, Ts, state_out = false){
    console.log(sso);
	var output = c2d(sso.A,sso.B,sso.C,sso.D,sso.E,Ts);
    console.log(output);
	this.A = numeric.clone(output['Ad']);
	this.B = numeric.clone(output['Bd']);
	this.C = numeric.clone(output['Cd']);
	this.D = numeric.clone(output['Dd']);
	this.Ts = Ts;
	this.x = numeric.clone(sso.x);
	this.y = numeric.clone(sso.y);
	this.u = numeric.clone(sso.u);
	this.state_out = state_out;
	this.step = function(u){
        var first = numeric.dot(this.A,this.x);
        var second = numeric.dot(this.B,u);
        this.x = numeric.add(first,second);
        this.y = numeric.dot(C,x);
        if (this.state_out){
        	return [y,x]; //first output, then states
        }else{
        	return y;
        }
    }
    this.set = function(start_x,start_y){
        this.x = numeric.clone(start_x);
        this.y = numeric.clone(start_y);
    } 
    this.reset = function(start_state){
    	for (var i = 0; i<numeric.dim(x)[0]; i++){
    		this.x[i]=0;
    	}
    	for (var i = 0; i<numeric.dim(y)[0]; i++){
    		this.y[i] = 0;
    	}
    }
}


function controllability(A, B){

}

function observability(A,B){


}

function acker(A, B, E= null, lambda){


}




/*Javascript continuous-to-discrete time state space converter
Attempts to automatically find timescale appropriate/sufficient for discrete simulation
Based off of  eigenvalues of normalized A matrix
Matrix Exponential for Bd calculated using series...order of sum can be specified...set to 5 for default.
Order = length of series when doing matrix exponential
*/

function c2d(A,B,C,D,E,Ts=null,order=5){
    console.log("starting c2d");
    var Einv = numeric.inv(E);
    console.log(Einv);
    var Aeff = numeric.dot(Einv,A);
    var Beff = numeric.dot(Einv,B);
    var ev = numeric.eig(Aeff);
    console.log(ev);
    var min_ev = Math.min.apply(null,ev); //find fastest eigenvalue
    console.log(min_ev);
    if (Ts==null){
        Ts = 0.1*min_ev;  //set timestep to be 0.1 of fastest time step
    }
    console.log(Aeff);
    console.log(Beff);
    console.log(Ts);
    console.log("starting to build A");
    var Ad = numeric.mul(Aeff,Ts);
    var Bd = numeric.mul(Beff,Ts);
    var dim = numeric.dim(Ad)[0];
    var mT = numeric.mul(numeric.identity(dim),-1)
    Ad = numeric.add(Ad,mT);
    var total = numeric.identity(dim);
    console.log(order);
    for (var i=1; i<order; i++){
        var top = 1;
        for (var j=0; j<i; j++){
            top = numeric.mul(numeric.mul(Aeff,Ts),top);
        }
        numeric.add(numeric.mul(top,1.0/factorial(i+1)),total);
    }
    precal = numeric.mul(Ts,total);
    Bd = numeric.dot(precal,Beff);
    return {'Ad':Ad,'Bd':Bd,'Cd':C,'Dd': D, 'Ts':Ts}
};

function factorial(x){
    total = x;
    for (var i = x-1; i>0; i--){
        total*=i;
    }
    return total;
}




