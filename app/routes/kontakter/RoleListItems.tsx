import { Switch } from "@navikt/ds-react";
import React from "react";

interface RoleListItemsProps {
  listLength: number;
  className?: string;
}

const RoleListItems: React.FC<RoleListItemsProps> = ({
  listLength,
  className,
}) => {
  const elements = Array.from({ length: listLength }, (_, index) => (
    <div key={index}>
      <Switch>Admin for ting og greier</Switch>
    </div>
  ));

  return <div className={className}>{elements}</div>;
};

export default RoleListItems;
