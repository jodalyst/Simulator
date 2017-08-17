

/*Specify inputs to create these on the fly
div_id: specifies the dom div to attach inputs and renders to
sso: the ss or dss object which you are connecting this input set to
ctdt: 
*/

//MUST ADD DESCRIPTOR CHECKER ON TYPE!!!
function ssmi(div_id,sso,spec_iso=false, ctdt = "CT",type='ss'){
    if (ctdt=="DT" && type=="dss"){
        console.log("cannot have discrete time system with E matrix!");
        return false;
    }
    var sso = sso;
    this.element = document.getElementById(div_id);
    this.element.className += "eq_input_area";
    var inputs="";

    var ssmio = this;

    inputs +="<center>"
    inputs+= `\\(\\textbf{A}\\): <input type="text" size="50" value="[[1,0,2],[5,4,2],[0,0,1]]" name="A_${div_id}" id="A_${div_id}" class="matrix_input_${div_id}" maxlength="100" /><br></br>
    \\(\\textbf{B}\\): <input type="text" size="50" value="[1,2,3]" name="B_${div_id}" id="B_${div_id}" class="matrix_input_${div_id}" maxlength="100" /><br></br>
    \\(\\textbf{C}\\): <input type="text" size="50" value="[1,2,3]" name="C_${div_id}" id="C_${div_id}" class="matrix_input_${div_id}" maxlength="100" /><br></br>
    \\(\\textbf{D}\\): <input type="text" size="50" value="[0]" name="D_${div_id}" id="D_${div_id}" class="matrix_input_${div_id}" maxlength="100" /><br></br>
    </p>`;
    if (sso.type=='dss')inputs += `\\(\\textbf{E}\\): <input type="text" size="50" value="[[1,0,0],[0,1,0],[0,0,1]]" name="E_${div_id}" id="E_${div_id}" class="matrix_input_${div_id}" maxlength="100" /><br></br>`;


    if (spec_iso){
        inputs += `<p>\\(\\textbf{x}\\): <input type="text" size="50" value="[x_1,x_2,x_3]" name="x_${div_id}" id="x_${div_id}" class="matrix_input_${div_id}" maxlength="100" /><br></br>
        \\(\\textbf{y}\\): <input type="text" size="50" value="[\\theta]" name="y_${div_id}" id="y_${div_id}" class="matrix_input_${div_id}" maxlength="100" /><br></br>
        \\(\\textbf{u}\\): <input type="text" size="50" value="[v_i]" name="u_${div_id}" id="u_${div_id}" class="matrix_input_${div_id}" maxlength="100" /><br></br>
        </p><p>`;
    }
    inputs+=`<button type="button" id="update_${div_id}">Check & Update</button></p>`;
    inputs+=`<div id="error_text_${div_id}"></div>`;
    inputs+="</center>";

    var displays = `<div class="eq_display_area" style="display:block;"><center><p id="displayed_eq1_${div_id}" class="matrix_to_render"></p><p id="displayed_eq2_${div_id}"class="matrix_to_render"></p></center></div>`;

    this.element.innerHTML = inputs+displays;

    var process = function(){
        var matrix = this.id[0];
        vals = this.value;
        vals = vals.replace(' ', '');
        if (matrix ==="x" || matrix==="y" || matrix==="u"){
            vals = vals.replace('[','').replace(']','').split(',');
            var tempm = [];
            for(var i =0; i<vals.length;i++){
                tempm.push(vals[i]);
            }
            sso.update(matrix,tempm);
        }else{
            try{
                mat = eval(vals);
                console.log("new mtarix");
                sso.update(matrix,mat);
            }catch(err){
                console.log("not a full matrix");
                sso.update(matrix,[]);
            }
        }
        var top = "$$";
        if(type==='dss') top +=render_matrix(sso.E,sso.E.length,sso.E[0].length);
        top+=render_matrix(sso.x_repn,"x");
        if(ctdt==="CT") top += "\\cdot\\frac{d}{dt}";
        top += "=";
        top+=render_matrix(sso.A,"A");
        top+=render_matrix(sso.x_rep,"x");
        top += "+";
        top+=render_matrix(sso.B,"B");
        top+=render_matrix(sso.u_rep,"u");
        top +="$$";
        var bottom = "$$";
        bottom += render_matrix(sso.y_rep,"y");
        bottom += "=";
        bottom += render_matrix(sso.C,"C");
        bottom+=render_matrix(sso.x_rep,"x");
        bottom += "+";
        bottom += render_matrix(sso.D,"D");
        bottom += render_matrix(sso.u_rep,"u");
        bottom+="$$";

        if (matrix=="A"||matrix=="B"||matrix=="x"||matrix=="u"){
            document.getElementById('displayed_eq1_'+div_id).innerHTML = top;
            MathJax.Hub.Queue(["Typeset",MathJax.Hub,`#displayed_eq1_${div_id}`]);
        }if(matrix=="C"||matrix=="D"||matrix=="x"||matrix=="y"||matrix=="u"){
            document.getElementById('displayed_eq2_'+div_id).innerHTML = bottom;
            MathJax.Hub.Queue(["Typeset",MathJax.Hub,`#displayed_eq2_${div_id}`]);
        }

    };

    var grab_input = function(input_obj){
        var matrix = input_obj.id[0];
        vals = input_obj.value;
        vals = vals.replace(' ', '');
        if (matrix ==="x" || matrix==="y" || matrix==="u"){
            vals = vals.replace('[','').replace(']','').split(',');
            var tempm = [];
            for(var i =0; i<vals.length;i++){
                tempm.push(vals[i]);
            }
            sso.update(matrix,tempm);
        }else{
            try{
                mat = eval(vals);
                console.log("new mtarix");
                sso.update(matrix,mat);
            }catch(err){
                console.log("not a full matrix");
                sso.update(matrix,[]);
            }
        }
    }


    ssmio.ourinputs = document.getElementsByClassName(`matrix_input_${div_id}`);

    var process_all_inputs = function(){
        for (var i=0; i<ssmio.ourinputs.length;i++){
            grab_input(ssmio.ourinputs[i]);
        }
        var top = "$$";
        if(type==='dss') top +=render_matrix(sso.E,sso.E.length,sso.E[0].length);
        top+=render_matrix(sso.x_repn,"x");
        if(ctdt==="CT") top += "\\cdot\\frac{d}{dt}";
        top += "=";
        top+=render_matrix(sso.A,"A");
        top+=render_matrix(sso.x_rep,"x");
        top += "+";
        top+=render_matrix(sso.B,"B");
        top+=render_matrix(sso.u_rep,"u");
        top +="$$";
        var bottom = "$$";
        bottom += render_matrix(sso.y_rep,"y");
        bottom += "=";
        bottom += render_matrix(sso.C,"C");
        bottom+=render_matrix(sso.x_rep,"x");
        bottom += "+";
        bottom += render_matrix(sso.D,"D");
        bottom += render_matrix(sso.u_rep,"u");
        bottom+="$$";
        document.getElementById('displayed_eq1_'+div_id).innerHTML = top;
        MathJax.Hub.Queue(["Typeset",MathJax.Hub,`#displayed_eq1_${div_id}`]);
        document.getElementById('displayed_eq2_'+div_id).innerHTML = bottom;
        MathJax.Hub.Queue(["Typeset",MathJax.Hub,`#displayed_eq2_${div_id}`]);
    }
    //var initial = new Event('keyup');

    document.getElementById(`update_${div_id}`).addEventListener('click',process_all_inputs)
    // for (var i = 0; i< ssmio.ourinputs.length; i++){
    //     ssmio.ourinputs[i].addEventListener('keyup', process);
    //     ssmio.ourinputs[i].dispatchEvent(initial);
    // }
};


//function difference_equation_input(div_id, sso, spec=false)


function render_matrix(matrix,type){
    // if (c==1 && matrix.length != r) return "";
    // if (r==1 && matrix.length != c) return "";
    var display_string = "\\begin{bmatrix}";
    if (type==="x" || type==="y" || type==="u"){
        for (var i=0; i<matrix.length; i++){
            display_string += matrix[i];
            if (i < matrix.length-1){
                display_string +="\\\\";
            }
        }
    }else if (type === "B" && numeric.dim(matrix).length==1){
        for (var i=0; i<matrix.length; i++){
            display_string += String(matrix[i]);
            if (i < matrix.length-1){
                display_string +="\\\\";
            }
        }
    }else if (type === "C" && numeric.dim(matrix).length==1){
        for (var i=0; i<matrix.length; i++){
            display_string += String(matrix[i]);
            if (i < matrix.length-1){
                display_string +="&";
            }
        }
    }else{
        if (numeric.dim(matrix).length==1 && numeric.dim(matrix)[0]==1){
            display_string+=String(matrix[0]);
        }else{
            for (var i=0; i<matrix.length; i++){
                for (var j=0; j<matrix[i].length;j++){
                    display_string += String(matrix[i][j]);
                    if (j < matrix[i].length-1){
                        display_string +="&";
                    }
                }
                if (i < matrix.length-1){
                    display_string +="\\\\";
                }
            }
        }
    }
    display_string += "\\end{bmatrix}";
    return display_string;
}

/*Input is a giant box with multiline rather than other stuff*/

function SS_Matrix_Input_Box(div_id,discrete = "CT",type='ss'){
}

/* 
Basic object to contain/house/represent a state space object
This does not handle simulation, which is a different thing entirely...this lists attributes of the system itself
*/

function feedback(sso,gain= null){

}

function dss(Ain,Bin, Cin,Din=null,Ein=null,typein = "CT"){
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
        var Einv = numeric.inv(this.E);
        var Aeff = numeric.dot(this.E,this.A);
        return numeric.eig(Aeff);
    } 

    this.zeros = function(){
    }
    this.ctrb = function(){
        var n = this.A.length;
        var builder = [];
        for (var i = 0; i<n; i++){
            if (i==0){
                builder.push(this.B);
            }else{
                var starter = numeric.clone(this.A);
                for (var j = 0; j< i; j++){
                    starter = numeric.dot(starter,this.A);
                }
                starter = numeric.dot(starter,this.B);
                //should we clone here?
                builder.push(numeric.clone(starter));
            }
        }
        var C = numeric.transpose(builder);
        return rank(C)===n;

    }
    this.obsv = function(){
        var n = this.A.length;
        var O = [];
        for (var i = 0; i<n; i++){
            if (i==0){
                builder.push(this.C);
            }else{
                var starter = numeric.clone(this.C);
                for (var j = 0; j< i; j++){
                    starter = numeric.dot(starter,this.A);
                }
                builder.push(starter);
            }
        }
        //should not need to transpose here.
        var O = numeric.transpose(builder);
        return rank(O)===n;
    }
    this.display = function(matrix){
        switch(matrix){
            case "A":
                var x=5;
                break;
            case "B":
                break;
            case "C":
                break;
            case "D":
                break;
            case "E":
                break;
            case "x":
                break;
            case "y":
                break;
            case "u":
                break;
        }

    }
    this.display_all = function(mode=ss){
        var A = this.display("A");
        var B = this.display("B");
        var C = this.display("C");
        var D = this.display("D");
        var x = this.display("x");
        var y = this.display("y");
        var u = this.display("u");
    }
}


function ss(Ain,Bin, Cin,Din=null,ctdt = "CT"){
    //need to make deep copies of input arrays.
    this.ss = "ss"; //will be "this.ss = dss in dss type...will inform outside functions whether or not to normalize with E matrix"
    this.A = numeric.clone(Ain);
    this.B = numeric.clone(Bin);
    this.C = numeric.clone(Cin);
    if (Din == null){
        this.D = null;
    }else{
        this.D = numeric.clone(Din);
    }

    var ssobj = this;
    this.type = ctdt;
    this.y;
    this.x;
    this.u;
    this.x_rep = []; //x representation
    this.x_repn = []; //next x rep
    this.y_rep  = []; //y rep
    this.u_rep = []; //u rep
    if (ctdt != "CT" && ctdt != "DT"){
    	console.log("Type must be either DT or CT!!!");
    	return false;
    }


    //checks on matrices!:
    //used to initialize x, y, and u vectors based off of A, B, and C matrices accordingly
    this.build_numerical_iso = function(){
        //x (state vector) setup:
        //x vector filled in based on A matrix dimensions...not B.
        ssobj.x = [];
        for (var i=0; i<numeric.dim(ssobj.A)[0]; i++){
            ssobj.x.push(0);
        }
        //u (input) setup...based on B matrix dimensions:
        if (numeric.dim(ssobj.B).length==1){
            ssobj.u = [0];
        }else{
            for (var i=0; i<numeric.dim(ssobj.B)[1];i++){
                ssobj.u.push(0);
            }
        }
        //y (output) setup:
        if (numeric.dim(ssobj.C).length==1){
            ssobj.y = [0];
        }else{
            for (var i=0; i<numeric.dim(ssobj.C)[0]; i++){
                y.push(0);
            }
        }
    }
    //checks to make sure that the matrices are internally consistent with one another.
    //also ends up building D if it has not been specified/is a null
    this.check_matrix_sizes = function(){
        //A matrix check
        if (numeric.dim(ssobj.A)[0] != numeric.dim(ssobj.A)[1]){
            console.log("A must be square!");
            return false;
        }

        //A vs. B matrix dimension setup!
        if (numeric.dim(ssobj.A)[0] != numeric.dim(ssobj.B)[0]){
            console.log("Number of A rows and B rows must agree!");
            return false;
        }

        //check C matrix compare against A matrix (source of state vector size)
        if (numeric.dim(ssobj.C).length==1){
        	if (numeric.dim(ssobj.C)[0] !== numeric.dim(ssobj.A)[0]){
        		console.log("Number of C cols must agree with number of states");
        		return false;
        	}
        }else{
        	if (numeric.dim(ssobj.C).length[1] != numeric.dim(ssobj.A)[0]){
        		console.log("Number of C cols must agree with number of states");
        		return false;
        	}
        }
        ssobj.build_numerical_iso(); //set up x, y, and u based off of primary matrices
        //is much easier to based D checks off of iso vectors than do the appropriate checks on A,B, and C
        //D matrix checks...annoyingly complex
        if(ssobj.D === null){
            ssobj.D = [];
            if (ssobj.y.length==1 && ssobj.u.length==1){
                ssobj.D.push(0);
            }else if(ssobj.y.length==1){
                for(var i = 0; i<ssobj.u.length; i++){
                    ssobj.D.push(0);
                }
            }else if(ssobj.u.length==1){
                for (var i = 0; i<ssobj.y.length; i++){
                    ssobj.D.push(0);
                }
            }else{
                for(var i = 0; i<ssobj.y.length; i++){
                    ssobj.D.push([]);
                    for(var j=0; j<ssobj.u.length; j++){
                        ssobj.D[i].push(0);
                    }
                }
            }
        }
    	if (numeric.dim(ssobj.D).length ==1){ //check if a n by 1 or 1 by n matrix
    		if (numeric.dim(ssobj.y)[0]!=1){ //check with y
    			if (numeric.dim(ssobj.y)[0] != numeric.dim(ssobj.D)[0]){
    				console.log("D dimensions not matching with y dimensions");
    				return false;
    			}
    		}else if(numeric.dim(ssobj.u)[0] != 1){ //check with u
    			if (numeric.dim(ssobj.u)[0] != numeric.dim(ssobj.D)[0]){
    				console.log("D dimensions not matching with u dimensions");
    				return false;
    			}
    		}else{
    			if (numeric.dim(ssobj.D)[0] !=1){
    				console.log("Error in D dimensions [should be 1 by 1]");
    				return false;
    			}
    		}
    	}else{
    		if (numeric.dim(ssobj.D)[0] != numeric.dim(ssobj.y)[0]){
    			console.log("Error! D matrix dimensions do not agree with y matrix dimensions");
    			return false;
    		}if (numeric.dim(ssobj.D)[1] != numeric.dim(ssobj.u)[0]){
    			console.log("Error! D matrix dimensions do not agree with u matrix dimensions");
    			return false;
    		}
    	}
        //made it through the gauntlet ! huzzah!
        return true;
    }

    this.standardize_sym_iso = function(){  //iso stands for inputs, states, outputs.
        for(var i=0; i<ssobj.x.length;i++){
            if (ssobj.type=="CT"){
                ssobj.x_rep.push(`x_${i+1}`);
                ssobj.x_repn.push(`x_${i+1}`);
            }else{
                ssobj.x_rep.push(`x_${i+1}[n]`);
                ssobj.x_repn.push(`x_${i+1}[n+1]`);
            }
        }
        if (ssobj.y.length==1){
            ssobj.y_rep.push("y");
        }else{
            for (var i=0; i<ssobj.y.length;i++){
                if (ssobj.type=="CT"){
                    ssobj.y_rep.push(`y_${i+1}`);
                }else{
                    ssobj.y_rep.push(`y_${i+1}[n]`);
                }
            }
        }
        if (ssobj.u.length==1){
            ssobj.u_rep.push("u");
        }else{
            for (var i=0; i<ssobj.u.length;i++){
                if (ssobj.type=="CT"){
                    ssobj.y_rep.push(`u_${i+1}`);
                }else{
                    ssobj.y_rep.push(`u_${i+1}[n]`);
                }
            }
        }
    }
    this.check_sym_iso = function(){
        if (ssobj.x_rep.length != ssobj.x.length){
            console.log("x length off!")
            return false;
        }
        if (ssobj.y_rep.length != ssobj.y.length){
            console.log("y length off!")
            return false;
        }
        if (ssobj.u_rep.length != ssobj.u.length){
            console.log("u length off!")
            return false;
        }
        //all good.!!
        return true;

    }

    //initialization
    this.check_matrix_sizes();
    this.build_numerical_iso();
    this.standardize_sym_iso();

    this.isCT = function(){
    	return ssobj.type == "CT";
    }

    this.isStable = function(){
    	setup = ssobj.poles();
    	for (var i = 0; i<setup.length; i++){
    		if (ssobj.isCT()){
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
        return numeric.eig(ssobj.A);
    } 

    this.zeros = function(){
    }
    this.ctrb = function(){
        var n = ssobj.A.length;
        var builder = [];
        for (var i = 0; i<n; i++){
            if (i==0){
                builder.push(ssobj.B);
            }else{
                var starter = numeric.clone(ssobj.A);
                for (var j = 0; j< i; j++){
                    starter = numeric.dot(starter,ssobj.A);
                }
                starter = numeric.dot(starter,ssobj.B);
                //should we clone here?
                builder.push(numeric.clone(starter));
            }
        }
        var C = numeric.transpose(builder);
        return rank(C)===n;

    }
    this.obsv = function(){
    	var n = ssobj.A.length;
        var O = [];
        for (var i = 0; i<n; i++){
            if (i==0){
                builder.push(ssobj.C);
            }else{
                var starter = numeric.clone(ssobj.C);
                for (var j = 0; j< i; j++){
                    starter = numeric.dot(starter,ssobj.A);
                }
                builder.push(starter);
            }
        }
        //should not need to transpose here.
        var O = numeric.transpose(builder);
        return rank(O)===n;
    }
    this.update = function(matrix,value){
        switch(matrix){
            case "A":
                ssobj.A = numeric.clone(value);
                break;
            case "B":
                ssobj.B = numeric.clone(value);
                break;
            case "C":
                ssobj.C = numeric.clone(value);
                break;
            case "D":
                ssobj.D = numeric.clone(value);
                break;
            case "x":
                if(ssobj.isCT()){
                    ssobj.x_rep = value;
                    ssobj.x_repn = value;
                }else{
                    ssobj.x_rep = [];
                    ssobj.x_repn = [];
                    for (var i=0; i<value.length; i++){
                        ssobj.x_rep.push(value[i]+'[n]');
                        ssobj.x_repn.push(value[i]+'[n+1]');
                    }
                }
                break;
            case "y":
                if(ssobj.isCT()){
                    ssobj.y_rep = value;
                }else{
                    ssobj.y_rep = [];
                    for (var i=0; i<value.length; i++){
                        ssobj.y_rep.push(value[i]+'[n]');
                    }
                }
                break;
            case "u":
                if(ssobj.isCT()){
                    ssobj.u_rep = value;
                }else{
                    ssobj.u_rep = [];
                    for (var i=0; i<value.length; i++){
                        ssobj.u_rep.push(value[i]+'[n]');
                    }
                }
                break;
        }
        var abcd_good = ssobj.check_matrix_sizes();
        var xyu_good = ssobj.check_sym_iso();
        if (abcd_good && xyu_good){
            return true;
        }else{
            console.log("issue!!! with matrix sizes!");
            return false;
        }
    }

    this.display = function(matrix){
        switch(matrix){
            case "A":
                var x=5;
                break;
            case "B":
                break;
            case "C":
                break;
            case "D":
                break;
            case "x":
                break;
            case "y":
                break;
            case "u":
                break;
        }

    }
    this.display_all = function(mode=ss){
        var A = this.display("A");
        var B = this.display("B");
        var C = this.display("C");
        var D = this.display("D");
        var x = this.display("x");
        var y = this.display("y");
        var u = this.display("u");
    }
}

/*render_matrix takes in a matrix and row, column dimensions, which are
mainly used to clarify ambiguity of how row and column vectors are stored
identically in the numeric.js format */


function feedback (sso, K){
    //create a new sso and return it based off of hte feedback
    var new_A = numeric.dot(sso.B,sso.K);
    var new_A = numeric.sub(sso.A - new_A);
    var newss = new SS(new_A, sso.B,sso.C,sso.D,typein=sso.type);
    return newss;
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
    var R = rref(M);
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
    if (sso.type=='CT'){
	   var output = c2d(sso.A,sso.B,sso.C,sso.D,sso.E,Ts);
        this.A = numeric.clone(output['Ad']);
        this.B = numeric.clone(output['Bd']);
        this.C = numeric.clone(output['Cd']);
        this.D = numeric.clone(output['Dd']);
    }else{
        this.A = numeric.clone(sso.A);
        this.B = numeric.clone(sso.B);
        this.C = numeric.clone(sso.C);
        this.D = numeric.clone(sso.D);
    }
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



function acker(A, B, lambda){


}




/*Javascript continuous-to-discrete time state space converter
Attempts to automatically find timescale appropriate/sufficient for discrete simulation
Based off of  eigenvalues of normalized A matrix
Matrix Exponential for Bd calculated using series...order of sum can be specified...set to 5 for default.
Order = length of series when doing matrix exponential
*/

//NEED TO UPDATE AND FIX THIS FUNCTION...IS NOT UP TO DATE RIGHT NOW.

function c2d(A,B,C,D,E,Ts=null,order=5){
    var Einv = numeric.inv(E);
    var Aeff = numeric.dot(Einv,A);
    var Beff = numeric.dot(Einv,B);
    var ev = numeric.eig(Aeff);
    var min_ev = Math.min.apply(null,ev); //find fastest eigenvalue
    if (Ts==null){
        Ts = 0.1*min_ev;  //set timestep to be 0.1 of fastest time step
    }

    var Ad = numeric.mul(Aeff,Ts);
    var Bd = numeric.mul(Beff,Ts);
    var dim = numeric.dim(Ad)[0];
    var mT = numeric.mul(numeric.identity(dim),-1)
    Ad = numeric.add(Ad,mT);
    var total = numeric.identity(dim);
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




