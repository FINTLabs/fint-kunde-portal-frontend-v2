import React from 'react';
import { ChevronDownIcon } from '@navikt/aksel-icons';
import { ActionMenu, Button } from '@navikt/ds-react';
import { MENU_ITEMS_LEFT } from '~/components/Menu/constants';

//TODO: This is in BETA in Aksel, check for uppate and fix
const MenuComponent = () => {
    return (
        <div>
            {MENU_ITEMS_LEFT.dropdowns.map((dropdown) => (
                // <div key={dropdown.title} style={{ marginBottom: '16px' }}>
                <ActionMenu>
                    <ActionMenu.Trigger>
                        <Button
                            variant="tertiary-neutral"
                            icon={<ChevronDownIcon aria-hidden />}
                            iconPosition="right">
                            {dropdown.title}
                        </Button>
                    </ActionMenu.Trigger>
                    <ActionMenu.Content>
                        {/*<ActionMenu.Group label={dropdown.title}>*/}
                        {dropdown.subMenus.map((subMenu) => (
                            <ActionMenu.Item
                                key={subMenu.path}
                                onSelect={() => console.info(subMenu.title)}
                                className={'p-2'}>
                                {subMenu.title}
                            </ActionMenu.Item>
                        ))}
                        {/*</ActionMenu.Group>*/}
                    </ActionMenu.Content>
                </ActionMenu>
                // </div>
            ))}
        </div>
    );
};

export default MenuComponent;
