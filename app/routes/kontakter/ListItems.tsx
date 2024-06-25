import React from "react";

import { PersonSuitIcon } from "@navikt/aksel-icons";
import { Button } from "@navikt/ds-react";
import { WrenchIcon } from "@navikt/aksel-icons";
import { PersonIcon } from "@navikt/aksel-icons";

const ListItems = () => {
  const elements = Array.from({ length: 5 }, (_, index) => (
    <div
      key={index}
      className="flex justify-between w-3/4 bg-white pl-3 border-black border-x-2 border-b-2"
    >
      <div className="flex items-center">
        {/* <PersonIcon /> */}
        <p className="pl-2">Ola Nordmann</p>
      </div>
      <Button icon={<WrenchIcon title="vis tilganger" />} variant="tertiary" />
    </div>
  ));

  return <div>{elements}</div>;
};

export default ListItems;
