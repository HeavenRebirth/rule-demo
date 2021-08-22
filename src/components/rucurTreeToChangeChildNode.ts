import { assign, cloneDeep, forEach, get, isEmpty, uniqueId } from 'lodash';

/**
 * 根据父节点id修改对应children属性
 * @param regularTreeData - 原始结构树
 * @param parentId - 父节点id
 * @param newChildren - 要修改的children
 */
function modifyChildrenByParentId(
  regularTreeData: any,
  parentId: string,
  newChildren: any
) {
  // 输入数据为空，返回
  if (isEmpty(regularTreeData)) {
    return;
  }
  // 要修改的子条件为空，返回
  if (isEmpty(newChildren)) {
    return;
  }
  forEach(regularTreeData, (item: any) => {
    if (item.id === parentId) {
      // 找到输入的父节点
      // 合并当前项并替换子节点
      assign(item, { children: newChildren });
    } else if (!isEmpty(get(item, ['children'], []))) {
      modifyChildrenByParentId(
        get(item, ['children'], []),
        parentId,
        newChildren
      );
    }
  });
}

/**
 * 点击添加节点，通过递归寻找匹配字段的对应对象数据并插入
 * @param treeData - 树结构
 * @param condition - 条件
 * @param value - 属性值
 * @returns - 返回所属对象
 */
export default function rucurTreeToChangeChildNode(
  originTreeData: any,
  treeData: any,
  condition: string,
  value: any,
  parentCondition: string = '',
  needChangeChildId: string = ''
) {
  // 进入遍历的结构为空，则返回
  if (isEmpty(treeData)) {
    return;
  }
  console.log('tree data', treeData);
  let newChildrenNode: any;
  // let parentId: string = '';
  forEach(treeData, (item: any, index: number) => {
    // 不存在 children 字段
    if (isEmpty(get(item, ['children'], []))) {
      console.log('tree item');
      // 比较id与选中的行id是否一致
      if (get(item, 'id', '') === value) {
        // 比较父节点的条件与子节点条件是否一致
        if (parentCondition === condition) {
          newChildrenNode = cloneDeep(treeData);
          // 在找到的行数据后插入一个新节点
          newChildrenNode.splice(index + 1, 0, {
            id: uniqueId('node')
          });
          console.log('same condition', newChildrenNode);
          // 修改树结构
          modifyChildrenByParentId(
            originTreeData,
            needChangeChildId,
            newChildrenNode
          );
        } else {
          // 条件不同时
          console.log('different condition');
          // 将该节点与要插入的节点进行条件重组
          const newNode = {
            id: uniqueId(condition),
            condition,
            children: [
              cloneDeep(item),
              {
                id: uniqueId('node')
              }
            ]
          };
          newChildrenNode = cloneDeep(treeData);
          // 删除当前节点并将新条件节点替换上去
          newChildrenNode.splice(index, 1, newNode);
          modifyChildrenByParentId(
            originTreeData,
            needChangeChildId,
            newChildrenNode
          );
        }
      }
      // parentId = needChangeChildId;
    } else if (!isEmpty(get(item, 'children', []))) {
      console.log('has children');
      rucurTreeToChangeChildNode(
        originTreeData,
        get(item, 'children', []),
        condition,
        value,
        get(item, 'condition', ''),
        get(item, ['id'], '')
      );
    }
    // console.log('parent id', parentId, newChildrenNode);
  });
  console.log('originTreeData', originTreeData);
}
