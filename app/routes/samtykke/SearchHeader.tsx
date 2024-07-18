import { InternalHeader, Search, Spacer, Switch } from '@navikt/ds-react';
import React from 'react';

const SearchHeader = () => {
    return (
        <InternalHeader>
            <form
                className="self-center px-5"
                onSubmit={(e) => {
                    e.preventDefault();
                    console.log('Search!');
                }}>
                <Search
                    label="InternalHeader søk"
                    size="small"
                    variant="simple"
                    placeholder="Filtrer på tjenste"
                />
            </form>
            <Spacer />
            <Switch>Vis inaktive behandling</Switch>
        </InternalHeader>
    );
};

export default SearchHeader;
