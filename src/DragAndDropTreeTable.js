import React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { compose } from 'redux';
import { cloneDeep, findIndex } from 'lodash';
import * as Table from 'reactabular-table';
import * as resolve from 'table-resolver';
import * as tree from 'treetabular';
import * as dnd from 'reactabular-dnd';
import * as Virtualized from 'reactabular-virtualized';
import * as Sticky from 'reactabular-sticky';

import './main.css';
import './style.css';
import {
  generateParents, generateRows
} from './helpers';

const schema = {
  type: 'object',
  properties: {
    id: {
      type: 'string'
    },
    name: {
      type: 'string'
    },
    age: {
      type: 'integer'
    }
  },
  required: ['id', 'name', 'age']
};

const k0 = performance.now();

class DragAndDropTreeTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: this.getColumns(),
      rows:[]
    };

    this.onRow = this.onRow.bind(this);
    this.onMoveRow = this.onMoveRow.bind(this);
  }

  generateRows(){
    const t0 = performance.now();
    const rows=generateParents(generateRows(50000, schema));
    console.log('rows=', rows);
    this.setState({rows});
    const t1 = performance.now();
    console.log("generateRows took " + (t1 - t0) + " milliseconds.")
  }

  componentWillMount(){
    this.generateRows();
  }

  componentDidMount(){
    const k1 = performance.now();
    console.log("Whole project took " + (k1 - k0) + " milliseconds.")
  }

  getColumns() {
    return [
      {
        property: 'name',
        props: {
          style: { width: 200 }
        },
        header: {
          label: 'Name'
        },
        cell: {
          formatters: [
            tree.toggleChildren({
              getRows: () => this.state.rows,
              getShowingChildren: ({ rowData }) => rowData.showingChildren,
              toggleShowingChildren: rowIndex => {
                const rows = cloneDeep(this.state.rows);

                rows[rowIndex].showingChildren = !rows[rowIndex].showingChildren;

                this.setState({ rows });
              }
            })
          ]
        }
      },
      {
        property: 'age',
        props: {
          style: { width: 300 }
        },
        header: {
          label: 'Age'
        }
      }
    ];
  }
  render() {
    const renderers = {
      header: {
        cell: dnd.Header
      },
      body: {
        row: dnd.Row
      }
    };
    const { columns } = this.state;
    const rows = compose(
      tree.filter({ fieldName: 'showingChildren' }),
      resolve.resolve({ columns, method: resolve.index })
    )(this.state.rows);

    return (
      <Table.Provider
        //renderers={renderers}
        columns={columns}
        renderers={{
          body: {
            wrapper: Virtualized.BodyWrapper,
            row: Virtualized.BodyRow
          }
        }}
      >
        <Sticky.Header
          style={{
            maxWidth: 800
          }}
          ref={tableHeader => {
            this.tableHeader = tableHeader && tableHeader.getRef();
          }}
          tableBody={this.tableBody}
        />

        <Virtualized.Body
          rows={rows}
          rowKey="id"
          style={{
            maxWidth: 800,
            maxHeight: 400
          }}
          ref={tableBody => {
            this.tableBody = tableBody && tableBody.getRef();
          }}
          tableHeader={this.tableHeader}
        />
      </Table.Provider>
    );
  }
  onRow(row) {
    return {
      rowId: row.id,
      onMove: o => this.onMoveRow(o)
    };
  }
  onMoveRow({ sourceRowId, targetRowId }) {
    const rows = tree.moveRows({
      operation: dnd.moveRows({ sourceRowId, targetRowId }),
      retain: ['showingChildren']
    })(this.state.rows);

    if (rows) {
      this.setState({ rows });
    }
  }
}

// Set up drag and drop context
export default DragDropContext(HTML5Backend)(DragAndDropTreeTable);