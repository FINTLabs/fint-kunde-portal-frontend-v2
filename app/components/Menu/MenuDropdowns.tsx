import { Button, Dropdown } from '@navikt/ds-react';
import { useState } from 'react';
import { MenuDropDown } from '~/types/MenuDropDown';
import { NavLinkView } from './NavLinkView';

export const MenuDropdowns = ({ renderItems }: { renderItems: MenuDropDown[] }) => {
    const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);

    const handleOpenChange = (index: number) => {
        setOpenMenuIndex(openMenuIndex === index ? null : index);
    };

    return renderItems.map((item, index) => (
        <RenderMenuItem
            key={`menu-item-${index}`}
            item={item}
            index={index}
            isOpen={openMenuIndex === index}
            onOpenChange={() => handleOpenChange(index)}
        />
    ));
};

const RenderMenuItem = ({
    item,
    index,
    isOpen,
    onOpenChange,
}: {
    item: MenuDropDown;
    index: number;
    isOpen: boolean;
    onOpenChange: () => void;
}) => {
    return (
        <Dropdown
            key={`key-${index}`}
            defaultOpen={false}
            open={isOpen}
            onOpenChange={onOpenChange}>
            <Button variant="tertiary-neutral" as={Dropdown.Toggle}>
                {item.title}
            </Button>
            <Dropdown.Menu className="!border-0 !rounded-none !p-0" placement="bottom-start">
                <Dropdown.Menu.List>
                    {item.subMenus.map((subMenu, subIndex) => (
                        <Dropdown.Menu.List.Item
                            className="!p-0"
                            key={`sub-item-${subIndex}`}
                            onClick={onOpenChange}>
                            <NavLinkView item={subMenu} />
                        </Dropdown.Menu.List.Item>
                    ))}
                </Dropdown.Menu.List>
            </Dropdown.Menu>
        </Dropdown>
    );
};
