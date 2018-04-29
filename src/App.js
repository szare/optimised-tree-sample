import React, {Component} from 'react';
import DragAndDropTreeTable from './DragAndDropTreeTable.js';
import TreeTable from './TreeTable';

export default class App extends Component {
  render() {
    // const DragAndDrop = DragDropContext(HTML5Backend)(DragAndDropTreeTable);
    return (
      <div>
        <DragAndDropTreeTable/>
        {/*<TreeTable/>*/}
      </div>
    );
  }
}
