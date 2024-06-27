import { Dropdown } from '@navikt/ds-react';
import { useState } from 'react';
import { Button } from '@navikt/ds-react';
import { MenuDropDown } from '../../types/MenuDropDown';
import { NavLinkView } from './NavLinkView';

export const renderMenuItem = (item: MenuDropDown, index: number) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dropdown
            key={`key-${index}`}
            defaultOpen={false}
            open={isOpen}
            onOpenChange={() => setIsOpen(!isOpen)}>
            <Button
                style={{
                    backgroundColor: isOpen ? 'var(--a-lightblue-700)' : 'transparent',
                    color: isOpen ? 'var(--a-gray-50)' : 'var(--a-gray-800)',
                }}
                variant="tertiary"
                as={Dropdown.Toggle}>
                {item.title}
            </Button>
            <Dropdown.Menu className="!border-0 !rounded-none !p-0" placement="bottom-start">
                <Dropdown.Menu.List>
                    {item.subMenus.map((subMenu, index) => (
                        <Dropdown.Menu.List.Item
                            className="!p-0"
                            key={`key-${index}`}
                            onClick={() => {
                                if (isOpen) setIsOpen(!isOpen);
                            }}>
                            <NavLinkView item={subMenu}></NavLinkView>
                        </Dropdown.Menu.List.Item>
                    ))}
                </Dropdown.Menu.List>
            </Dropdown.Menu>
        </Dropdown>
    );
};
