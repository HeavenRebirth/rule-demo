import { Component } from 'react';
import {
  Drawer,
  Table,
  Tooltip,
  Form,
  Button,
  Icon,
  Select,
  Input,
  InputNumber
} from 'antd';
import { size, get } from 'lodash';
import { nanoid } from 'nanoid';

import { WrappedFormUtils } from 'antd/lib/form/Form';
import './styles.less';

const FormItem = Form.Item;
const { Option } = Select;

interface VariableDrawerProps {
  visible: boolean;
  onClose: (visible: boolean) => void;
  form: WrappedFormUtils;
}
interface VariableDrawerStates {
  variableList: any[]; // 自定义变量列表
}

class VariableDrawer extends Component<
  VariableDrawerProps,
  VariableDrawerStates
> {
  public constructor(props: VariableDrawerProps) {
    super(props);
    this.state = {
      variableList: [] // 变量列表
    };

    this.handleDrawerClose = this.handleDrawerClose.bind(this);
    this.handleNewTableRowAdd = this.handleNewTableRowAdd.bind(this);
  }

  handleDrawerClose() {
    const { onClose } = this.props;
    onClose(false);
  }

  // 为表格添加一行数据
  handleNewTableRowAdd() {
    const { variableList } = this.state;
    const listSize = size(variableList);
    const newVariable = {
      id: nanoid(),
      name: `var${listSize + 1}`,
      description: '',
      defaultValue: undefined
    };
    this.setState({
      variableList: [...variableList, newVariable]
    });
  }

  private variableDrawerTitle = () => {
    return (
      <>
        <Button
          type="link"
          className="drawer_header-button"
          onClick={this.handleDrawerClose}
        >
          <Icon type="menu-unfold" />
        </Button>
        <span>变量表</span>
      </>
    );
  };

  public addNewTableRow = () => {
    return (
      <Button
        className="table_row-add"
        block
        type="dashed"
        onClick={() => this.handleNewTableRowAdd()}
      >
        + 新增
      </Button>
    );
  };

  public defaultValueNode = (dataType: string) => {
    switch (dataType) {
      case 'string':
        return <Input />;
      case 'number':
        return <InputNumber />;
      case 'boolean':
        return (
          <Select>
            <Option key={0}>true</Option>
            <Option key={1}>false</Option>
          </Select>
        );
      default:
        return <div />;
    }
  };

  public render() {
    const {
      visible,
      form: { getFieldError, getFieldDecorator }
    } = this.props;

    const { variableList } = this.state;

    console.log('variableList', variableList);

    const variableTableColumns = [
      {
        title: '变量名',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
        width: '150px',
        render: (text: string, record: any) => (
          <Tooltip
            title={getFieldError(`${record.id}_description`)}
            trigger="hover"
          >
            <div>
              <FormItem>
                {getFieldDecorator(`${record.id}_description`, {})(<Input />)}
              </FormItem>
            </div>
          </Tooltip>
        )
      },
      {
        title: '类型',
        dataIndex: 'dataType',
        key: 'dataType',
        width: '150px',
        render: (text: string, record: any) => (
          <Tooltip
            title={getFieldError(`${record.id}_dataType`)}
            trigger="hover"
          >
            <div>
              <FormItem>
                {getFieldDecorator(
                  `${record.id}_dataType`,
                  {}
                )(
                  <Select style={{ width: '120px' }}>
                    <Option key="string">字符型</Option>
                    <Option key="number">数值型</Option>
                    <Option key="boolean">布尔型</Option>
                  </Select>
                )}
              </FormItem>
            </div>
          </Tooltip>
        )
      },
      {
        title: '默认值',
        dataIndex: 'defaultValue',
        key: 'defaultValue',
        width: '150px',
        render: (text: string, record: any) => (
          <Tooltip
            title={getFieldError(`${record.id}_defaultValue`)}
            trigger="hover"
          >
            <div>
              <FormItem>
                {getFieldDecorator(
                  `${record.id}_defaultValue`,
                  {}
                )(this.defaultValueNode(get(record, 'dataType', '')))}
              </FormItem>
            </div>
          </Tooltip>
        )
      }
    ];

    return (
      <>
        <Drawer
          style={{ top: '10px', right: '10px', bottom: '10px' }}
          className="variable_drawer"
          width="600"
          title={this.variableDrawerTitle()}
          visible={visible}
          getContainer={false}
          mask={false}
          maskClosable={false}
          closable={false}
        >
          <div>
            <Input placeholder="search" />
            <Table
              className="table_form-edit"
              columns={variableTableColumns}
              footer={this.addNewTableRow}
              dataSource={variableList}
              rowKey={(record) => record.id}
              pagination={false}
              scroll={{ y: size(variableList) > 15 ? 660 : false }}
            />
          </div>
        </Drawer>
      </>
    );
  }
}

export default VariableDrawer;
