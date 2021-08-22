import React, { useCallback } from 'react';
import { Popover, List, Input } from 'antd';
import { get, isNil } from 'lodash';

import filterFieldsList from '../../../mock/filterFiledsList';

interface FieldSelectProps {
  children: any;
}

const FieldSelect = (props: FieldSelectProps) => {
  const { children } = props;
  const handleFieldSelected = useCallback(() => {}, []);

  const fieldDropdown = (
    <div>
      <Input />
      <List
        dataSource={filterFieldsList}
        renderItem={(item) => (
          <div key={get(item, 'id', '')} onClick={handleFieldSelected}>
            {get(item, 'customName', '')}
          </div>
        )}
      />
    </div>
  );

  return (
    <Popover content={fieldDropdown} placement="bottomLeft" trigger="click">
      {!isNil(children) && React.Children.toArray(children)}
    </Popover>
  );
};

export default FieldSelect;
