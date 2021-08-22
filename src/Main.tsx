import { Component, createRef } from 'react';
import { Dropdown, Menu, Icon, Form, Button } from 'antd';
import { WrappedFormUtils } from 'antd/es/form/Form';
import { get } from 'lodash';

import VariableDrawer from './components/VariableDrawer';
import './styles.less';

const DropdownButton = Dropdown.Button;
const MenuItem = Menu.Item;

const conditionMap = {
  and: '且',
  or: '或'
};

interface MainProps {
  form: WrappedFormUtils;
}

interface MainState {
  condition: string; // 逻辑表达式基本条件 and - 且 / or - 或
  variableDrawerVisible: boolean; // 变量表格所在抽屉， 默认展示
}

class Main extends Component<MainProps, MainState> {
  public mainContent = createRef<HTMLDivElement>();

  public constructor(props: MainProps) {
    super(props);
    this.state = {
      condition: 'and', // 且 / 或条件
      variableDrawerVisible: true // 变量表格所在抽屉， 默认展示
    };

    this.handleChangeCondition = this.handleChangeCondition.bind(this);
    this.toggleVariableDrawerVisible = this.toggleVariableDrawerVisible.bind(
      this
    );
  }

  // 根据选中的条件关联按钮切换要添加的条件
  handleChangeCondition(e: any) {
    this.setState({
      condition: e.key
    });
  }

  // 添加条件旁边的下拉菜单
  private conditionMenu = () => {
    return (
      <Menu onClick={this.handleChangeCondition}>
        <MenuItem key="and">且条件</MenuItem>
        <MenuItem key="or">或条件</MenuItem>
      </Menu>
    );
  };

  //  点击展开变量表格抽屉
  toggleVariableDrawerVisible(visible: boolean) {
    this.setState({
      variableDrawerVisible: visible
    });
  }

  public render() {
    const { condition, variableDrawerVisible } = this.state;

    const { form } = this.props;

    return (
      <div className="content" ref={this.mainContent}>
        <div className="ruleContent">
          <div className="header">
            <DropdownButton
              style={{ paddingLeft: '10px' }}
              overlay={this.conditionMenu}
            >
              {`添加条件（${get(conditionMap, condition)}）`}
            </DropdownButton>
            <div className="header-title">
              <Button
                type="link"
                onClick={() => this.toggleVariableDrawerVisible(true)}
              >
                <Icon type="menu-fold" />
              </Button>
              <span className="title">变量表</span>
            </div>
          </div>
        </div>
        {/* 变量展示抽屉 默认展开，蒙版层禁止关闭 */}
        <VariableDrawer
          form={form}
          visible={variableDrawerVisible}
          onClose={this.toggleVariableDrawerVisible}
        />
      </div>
    );
  }
}

export default Form.create()(Main);
