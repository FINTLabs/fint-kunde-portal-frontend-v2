import { Button, Dropdown } from '@navikt/ds-react';
import { useState } from 'react';
import { MenuDropDown } from '~/types/MenuDropDown';
import { NavLinkView } from './NavLinkView';
import logger from '~/utils/logger';

export const MenuDropdowns = ({
    renderItems,
    selectedOrganization,
    meDataRoles,
}: {
    renderItems: MenuDropDown[];
    selectedOrganization: string;
    meDataRoles: any;
}) => {
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
            selectedOrganization={selectedOrganization}
            meDataRoles={meDataRoles}
        />
    ));
};

const RenderMenuItem = ({
    item,
    index,
    isOpen,
    onOpenChange,
    selectedOrganization,
    meDataRoles,
}: {
    item: MenuDropDown;
    index: number;
    isOpen: boolean;
    onOpenChange: () => void;
    selectedOrganization: string;
    meDataRoles: any;
}) => {
    const hasRole = (roleId: string): boolean => {
        logger.silly('checking for a role: ', selectedOrganization, roleId);
        return meDataRoles.includes(roleId + '@' + selectedOrganization);
    };

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
                            onClick={onOpenChange}
                            disabled={
                                !(
                                    hasRole('ROLE_ADMIN') ||
                                    (!!subMenu.role && hasRole(subMenu.role))
                                )
                            }>
                            <NavLinkView item={subMenu} />
                        </Dropdown.Menu.List.Item>
                    ))}
                </Dropdown.Menu.List>
            </Dropdown.Menu>
        </Dropdown>
    );
};
