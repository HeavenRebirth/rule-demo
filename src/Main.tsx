import { Component, createRef } from 'react';
import { Dropdown, Menu, Icon, Form, Button } from 'antd';
import { WrappedFormUtils } from 'antd/es/form/Form';
import { cloneDeep, get, isEmpty, map, uniqueId } from 'lodash';

import rucurTreeToChangeChildNode from './components/rucurTreeToChangeChildNode';

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
  isSelectRow: boolean; // 是否选中某一行进行添加
  ruleTreeData: any[]; // 规则树数据
  selectedRowId: string; // 选中行id
}

class Main extends Component<MainProps, MainState> {
  public mainContent = createRef<HTMLDivElement>();

  public constructor(props: MainProps) {
    super(props);
    this.state = {
      condition: 'and', // 且 / 或条件
      variableDrawerVisible: true, // 变量表格所在抽屉， 默认展示
      isSelectRow: false, // 是否选中某一行进行添加
      ruleTreeData: [], // 规则树数据
      selectedRowId: '' // 选中行id
    };

    this.handleChangeCondition = this.handleChangeCondition.bind(this);
    this.toggleVariableDrawerVisible = this.toggleVariableDrawerVisible.bind(
      this
    );
    this.handleRegularTreeNodeAdd = this.handleRegularTreeNodeAdd.bind(this);
  }

  // 根据选中的条件关联按钮切换要添加的条件
  handleChangeCondition(e: any) {
    this.setState({
      condition: e.key
    });
  }

  // 添加规则节点事件
  handleRegularTreeNodeAdd() {
    const { isSelectRow, condition, ruleTreeData } = this.state;
    // 如果树节点为空，则直接向其中插入一行数据
    if (isEmpty(ruleTreeData)) {
      const newTreeData = [
        {
          id: uniqueId(condition),
          name: condition,
          condition,
          children: [
            get(ruleTreeData, 0, {}),
            {
              id: uniqueId('node')
            }
          ]
        }
      ];
      this.setState({
        ruleTreeData: newTreeData
      });
    } else {
      // 未选中任意一行
      if (isSelectRow) {
        // 当前仅有一棵树，之后根据选中的条件树找到对应更改的树

        // 新加入的节点条件与现有顶部条件相同
        if (get(ruleTreeData, [0, 'condition'], '') === condition) {
          // 创建一个仅包含id的子节点
          const newRowData = {
            id: uniqueId('node')
          };
          const newTreeData = cloneDeep(ruleTreeData);
          // 向树结构顶层的最后插入
          get(newTreeData, [0, 'children'], []).push(newRowData);
          console.log('top last node', newTreeData);
          this.setState({
            ruleTreeData: newTreeData
          });
        } else {
          const newTreeData = [
            {
              id: uniqueId(condition),
              name: condition,
              condition,
              children: [
                get(ruleTreeData, 0, {}),
                {
                  id: uniqueId('node')
                }
              ]
            }
          ];
          // 将现有的条件树整个向下降级，与新的节点同属于新的条件节点
          console.log('top different condition', newTreeData);
          this.setState({
            ruleTreeData: newTreeData
          });
        }
      } else {
        // 向选中行插入新条件
        const { selectedRowId } = this.state;
        const originTreeData = cloneDeep(ruleTreeData);
        // 遍历树结构以添加内容
        rucurTreeToChangeChildNode(
          originTreeData,
          cloneDeep(ruleTreeData),
          condition,
          selectedRowId
        );
        this.setState({
          ruleTreeData: originTreeData,
          selectedRowId: '',
          isSelectRow: false
        });
      }
    }
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

  // 渲染规则表达式结构树
  private getRuleTree = (treeData: any) => {
    if (isEmpty(treeData)) {
      return null;
    }
    return map(treeData, (item: any, index: number) => {
      if (!isEmpty(get(item, 'children', []))) {
        return (
          <div
            key={`${get(item, 'id', '')}_${index}`}
            style={{
              position: 'relative',
              display: 'table',
              width: '100%',
              height: '100%',
              whiteSpace: 'nowrap'
            }}
          >
            <div style={{ width: '50px' }} key={`${get(item, 'id', '')}`}>
              <div>
                <Button>
                  <Icon />
                </Button>
                <div>{get(item, 'id', '')}</div>
              </div>
            </div>
            {this.getRuleTree(get(item, 'children', []))}
          </div>
        );
      }
      return (
        <TableFieldRow
          key={`${get(item, 'id', '')}_${index}`}
          isSelect
          field={item}
          onRegularItemSelected={this.handleRegularItemSelect}
          onRegularItemDelete={this.handleRegularItemDelete}
        />
      );
    });
  };

  //  点击展开变量表格抽屉
  toggleVariableDrawerVisible(visible: boolean) {
    this.setState({
      variableDrawerVisible: visible
    });
  }

  public render() {
    const { condition, variableDrawerVisible, ruleTreeData } = this.state;

    const { form } = this.props;

    return (
      <div className="content" ref={this.mainContent}>
        <div className="ruleContent">
          <div className="header">
            <DropdownButton
              style={{ paddingLeft: '10px' }}
              overlay={this.conditionMenu}
              onClick={this.handleRegularExpressionTreeNodeAdd}
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
          <div className="content">{this.getRuleTree(ruleTreeData)}</div>
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
