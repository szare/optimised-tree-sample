import React, {Component} from 'react';
import DragAndDropTreeTable from './DragAndDropTreeTable.js';
import TreeTable from './TreeTable';

export default class App extends Component {
  constructor(props){
    super(props);
    console.log('App => constructor called');
    this.state={id:1234}
  }

  componentDidMount(){
    this.setState({id:5678});
  }
  render() {
    // const DragAndDrop = DragDropContext(HTML5Backend)(DragAndDropTreeTable);
    return (
      <div>
        <DragAndDropTreeTable key={this.state.id}/>
        {/*<TreeTable/>*/}
      </div>
    );
  }
}
