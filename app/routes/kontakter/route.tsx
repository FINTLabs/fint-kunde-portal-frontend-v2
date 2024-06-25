/* eslint-disable import/no-duplicates */
import { useRef } from "react";
import type { MetaFunction } from "@remix-run/node";
import ListItems from "./ListItems";
import RoleListItems from "./RoleListItems";
import { XMarkIcon, WrenchIcon, PersonSuitIcon } from "@navikt/aksel-icons";
import { BodyLong, Button, Modal } from "@navikt/ds-react";

export const meta: MetaFunction = () => {
  return [
    { title: "Kontakter" },
    { name: "description", content: "Liste over kontakter" },
  ];
};

export default function Index() {
  const ref = useRef<HTMLDialogElement>(null);

  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">Velkomment til kontakter :)</h1>

      <div className="flex justify-between w-3/4 bg-white pl-3 border-black border-2">
        <div className="flex items-center">
          {/* <PersonSuitIcon /> */}
          <p className="pl-2">Mona Modal (Admin)</p>
        </div>
        <Button
          icon={<WrenchIcon size="small" title="vis tilganger" />}
          variant="tertiary"
          onClick={() => ref.current?.showModal()}
        />
        <Modal
          ref={ref}
          aria-label="Mona Modal Tilganger"
          className="w-3/4 h-3/4"
        >
          <Modal.Body className="w-full h-full">
            <BodyLong className="h-3/4 w-3/4">
              <Button
                type="button"
                variant="tetriary"
                onClick={() => ref.current?.close()}
              >
                <XMarkIcon className="h-8 w-8 absolute right-4 top-4" />
              </Button>
              <div className="flex  flex-col h-3/4 absolute top-4">
                <p className="text-2xl">Mona Modal</p>
                <p className="text-3xl pl-2">Roller</p>
                <div className="">
                  <RoleListItems />
                </div>
              </div>
            </BodyLong>
          </Modal.Body>
        </Modal>
      </div>

      <ListItems />
    </div>
  );
}
