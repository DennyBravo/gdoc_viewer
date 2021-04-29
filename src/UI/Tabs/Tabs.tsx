import { omit } from 'App/App.helpers';
import { Button } from 'mx-ui';
import { Link } from "react-router-dom";

import S from './Tabs.styl';
import * as T from './Tabs.types';

function Tabs({ className, items, active, onChange, size = 'm' }: T.Props) {
  function renderTab({ id, title, component: Elem, link, ...itemProps }: T.Item) {
    const isActive = active === id;
    const props = {
      className: [ S.item, isActive && S.active ].join(' '),
      key: id,
      size,
      onClick: e => onChange(e, id),
    };

    if (Elem) return <Elem {...props} isActive={isActive} />;

    const inner = link ? <Link to={link}>{title}</Link> : title;
    
    return <Button {...omit(props, ['isLoading', 'render'])}>{inner}</Button>;
  }

  return <div className={[ S.root, className ].join(' ')}>{items.map(renderTab)}</div>;
}

export default Tabs;
export * as TabsTypes from './Tabs.types';
