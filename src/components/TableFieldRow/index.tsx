import { Component } from 'react';
import classnames from 'classnames';
import { Button, Icon } from 'antd';
import { get, isFunction } from 'lodash';

import FieldSelect from '../FieldSelect/index';

interface TableFieldRowProps {
  className: string;
  isSelect: boolean;
  field: any;
  onRegularItemSelected: any;
  onRegularItemDelete?: any;
}

interface TableFieldRowStates {}

class TableFieldRow extends Component<TableFieldRowProps, TableFieldRowStates> {
  private constructor(props: TableFieldRowProps) {
    super(props);
    this.state = {};
  }

  public handleRowDelete(rowId: string, e: any) {
    const { onRegularItemDelete } = this.props;
    if (isFunction(onRegularItemDelete)) {
      onRegularItemDelete(rowId, e);
    }
  }

  // 选中行事件
  public handleRowSelected(rowId: string, e: any) {
    const { onRegularItemSelected } = this.props;
    if (isFunction(onRegularItemSelected)) {
      onRegularItemSelected(rowId, e);
    }
  }

  public render() {
    const { className, isSelect, field } = this.props;
    return (
      <div
        // className={classnames(className, styles['table-row'])}
        style={{ border: '1px solid #000' }}
        onClick={(e: any) => this.handleRowSelected(get(field, 'id', ''), e)}
      >
        {isSelect ? (
          <div key={get(field, 'id', '')}>
            {get(field, 'name', '')}
            <Button
              type="link"
              style={{ float: 'right', padding: '0', height: '100%' }}
              onClick={(e: any) =>
                this.handleRowDelete(get(field, 'id', ''), e)
              }
            >
              <Icon type="delete" />
            </Button>
          </div>
        ) : (
          <FieldSelect>
            <Button type="link">请选择字段</Button>
          </FieldSelect>
        )}
      </div>
    );
  }
}

export default TableFieldRow;
