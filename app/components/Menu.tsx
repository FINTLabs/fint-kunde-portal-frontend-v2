import { NavLink } from "@remix-run/react";
import { Button, Dropdown } from "@navikt/ds-react";

type NavLinkItemType = {
  title: string;
};
const NavLinkItem = ({ item }: { item: NavLinkItemType }) => {
  return (
    <NavLink
      to="/messages"
      className={({ isActive, isPending }) =>
        isPending ? "pending" : isActive ? "active" : ""
      }
    >
      {item.title}
    </NavLink>
  );
};

const MENU_ITEMS = [
  {
    title: "STYRING",
    subMenu: [
      {
        title: "Kontakter",
      },
      {
        title: "Klienter",
      },
    ],
  },
  {
    title: "HELSE",
    subMenu: [
      {
        title: "Helse sjekk",
      },
      {
        title: "....",
      },
    ],
  },
];

export default function Menu({}: {}) {
  return (
    <>
      {MENU_ITEMS.map((item) => (
        <Dropdown>
          <Button variant="tertiary" as={Dropdown.Toggle}>
            {item.title}
          </Button>
          <Dropdown.Menu placement="bottom-start">
            <Dropdown.Menu.List>
              {item.subMenu.map((subMenuItem) => (
                <Dropdown.Menu.List.Item>
                  <NavLinkItem item={subMenuItem}></NavLinkItem>
                </Dropdown.Menu.List.Item>
              ))}
            </Dropdown.Menu.List>
          </Dropdown.Menu>
        </Dropdown>
      ))}
    </>
  );
}
