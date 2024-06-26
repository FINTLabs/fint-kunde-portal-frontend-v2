import { Accordion, AccordionContent } from "@navikt/ds-react/Accordion";
import RoleListItems from "./RoleListItems";
import { Button } from "@navikt/ds-react";
import { HospitalIcon, LinkBrokenIcon } from "@navikt/aksel-icons";

const Accordions = () => {
  const elements = Array.from({ length: 5 }, (_, index) => (
    <Accordion.Item
      className="!border-black !bg-white !border-x-2 !border-b-2 w-3/4 "
      key={index}
    >
      <Accordion.Header className="relative !pl-3!hover:bg-slate-100 !shadow-none">
        <p className="pl-2">Adam Accordion</p>
      </Accordion.Header>
      <AccordionContent>
        <div className="flex  flex-col">
          <div>
            <p className="text-3xl pl-2">Kontroll</p>
            <div className="flex flex-col items-start">
              <Button icon={<HospitalIcon size="small" />} variant="tetriary">
                Gjør til juridisk kontakt
              </Button>
              <Button icon={<LinkBrokenIcon size="small" />} variant="tetriary">
                Fjern kontakt
              </Button>
            </div>
          </div>
          <p className="text-3xl pt-2 pl-2">Roller</p>
          <RoleListItems listLength={12} />
        </div>
      </AccordionContent>
    </Accordion.Item>
  ));

  return <div>{elements}</div>;
};

export default Accordions;
