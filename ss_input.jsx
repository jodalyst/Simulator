
class SS_Input extends React.Component {
   constructor() {
    super();
    this.state = {
      x: ['x_1','x_2','x_3'],
      y: ['\\theta'],
      u: ['v_i'],
      A: [[1,0,2],[5,4,2],[0,0,1]],
      E: [[1,0,0],[0,4,0],[0,0,1]],
      B: [[1],[5],[6]],
      C: [[1,0,3]],
      D: [[0]],
    };
  }
  render() {
    return (
    \(\textbf{x}\): <input type="text" size="50" value="" name="x_input" id="x_input" class="matrix" maxlength="100" /><br></br>
    \(\textbf{y}\): <input type="text" size="50" value="" name="y_input" id="y_input" class="matrix" maxlength="100" /><br></br>
    \(\textbf{u}\): <input type="text" size="50" value="" name="u_input" id="u_input" class="matrix" maxlength="100" /><br></br>
    <center>
    \(\textbf{E}\): <input type="text" size="50" value="" name="E_input" id="E_input" class="matrix" maxlength="100" /><br></br>
    \(\textbf{A}\): <input type="text" size="50" value="" name="A_input" id="A_input" class="matrix" maxlength="100" /><br></br>
    \(\textbf{B}\): <input type="text" size="50" value="" name="B_input" id="B_input" class="matrix" maxlength="100" /><br></br>
    \(\textbf{C}\): <input type="text" size="50" value="" name="C_input" id="C_input" class="matrix" maxlength="100" /><br></br>
    \(\textbf{D}\): <input type="text" size="50" value="" name="D_input" id="D_input" class="matrix" maxlength="100" /><br></br>
    </center>
      <div className="shopping-list">
        <h1>Shopping List for {this.props.name}</h1>
        <ul>
          <li>Instagram</li>
          <li>WhatsApp</li>
          <li>Oculus</li>
        </ul>
      </div>
    );
  }
}

React.render(<SS_Input/>,document.getElementbyId("root")); 
