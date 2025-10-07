import { InternalHeader, Search, Spacer, Switch } from '@navikt/ds-react';

const SearchHeader = () => {
    return (
        <InternalHeader>
            <form
                className="self-center px-5"
                onSubmit={(e) => {
                    e.preventDefault();
                }}>
                <Search
                    label="InternalHeader søk"
                    size="small"
                    variant="simple"
                    placeholder="Filtrer på tjenste"
                    data-cy="search-input"
                />
            </form>
            <Spacer />
            <Switch>Vis inaktive behandling</Switch>
        </InternalHeader>
    );
};

export default SearchHeader;
