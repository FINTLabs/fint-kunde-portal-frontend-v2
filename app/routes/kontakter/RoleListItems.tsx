import { Switch } from "@navikt/ds-react";
import React from "react";

const RoleListItems = () => {
  const elements = Array.from({ length: 10 }, (_, index) => (
    <div key={index}>
      <Switch>Admin for ting og greier</Switch>
    </div>
  ));

  return <div>{elements}</div>;
};

export default RoleListItems;
