import { NavLink } from "@remix-run/react";
import { Button, Dropdown } from "@navikt/ds-react";
import { useState } from "react";

type NavLinkItemType = {
  title: string;
  path: string;
};

const NavLinkItem = ({ item }: { item: NavLinkItemType }) => {
  return (
    <NavLink
      to={item.path}
      className={({ isActive, isPending }) =>
        `text-[--a-gray-600] hover:text-[--a-gray-200] w-full ${
          isPending ? "pending" : isActive ? "active" : ""
        }`
      }
    >
      <div className="p-[--a-spacing-3] hover:bg-[--a-lightblue-600] hover:text-[--a-gray-50] w-full">
        {item.title}
      </div>
    </NavLink>
  );
};

export default function Menu({}: {}) {
  return (
    <>
      {MENU_ITEMS.map((item, index) => {
        const [isOpen, setIsOpen] = useState(false);

        return (
          <Dropdown
            key={`key-${index}`}
            defaultOpen={false}
            open={isOpen}
            onOpenChange={() => setIsOpen(!isOpen)}
          >
            <Button
              style={{
                backgroundColor: isOpen ? "var(--a-lightblue-700)" : "none",
                color: isOpen ? "var(--a-gray-50)" : "none",
              }}
              variant="tertiary"
              as={Dropdown.Toggle}
            >
              {item.title}
            </Button>
            <Dropdown.Menu
              style={{
                border: "var(--a-spacing-0)",
                borderRadius: "var(--a-spacing-0)",
                padding: "var(--a-spacing-0)",
              }}
              placement="bottom-start"
            >
              <Dropdown.Menu.List>
                {item.subMenu.map((subMenuItem, index) => (
                  <Dropdown.Menu.List.Item
                    key={`key-${index}`}
                    style={{
                      padding: "var(--a-spacing-0)",
                    }}
                  >
                    <NavLinkItem item={subMenuItem}></NavLinkItem>
                  </Dropdown.Menu.List.Item>
                ))}
              </Dropdown.Menu.List>
            </Dropdown.Menu>
          </Dropdown>
        );
      })}
    </>
  );
}

const MENU_ITEMS = [
  {
    title: "TILGANGER",
    subMenu: [
      {
        title: "Kontakter",
        path: "/kontakter",
      },
      {
        title: "Komponenter",
        path: "/komponenter",
      },
      {
        title: "Adapter",
        path: "/adapter",
      },
      {
        title: "Klienter",
        path: "/klienter",
      },
      {
        title: "Ressurser",
        path: "/ressurser",
      },
    ],
  },
  {
    title: "HELSE",
    subMenu: [
      {
        title: "Basistest",
        path: "/basistest",
      },
      {
        title: "Relasjonstest",
        path: "/relasjonstest",
      },
    ],
  },
];
