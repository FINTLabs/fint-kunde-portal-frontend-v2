import {MetaFunction} from "@remix-run/node";
import Breadcrumbs from "~/components/breadcrumbs";
import InternalHeader from "~/components/InternalHeader";
import {InformationSquareIcon} from '@navikt/aksel-icons';
import {Accordion, Box} from "@navikt/ds-react";
import {helpData, HelpDataItem} from "~/routes/help/HelpData";


export const meta: MetaFunction = () => {
  return [
    { title: "Adapter" },
    { name: "description", content: "Liste over adapter" },
  ];
};

export default function Index() {
  const breadcrumbs = [
    { name: 'Support', link: '/support' },
  ];


    return (
      <>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <InternalHeader title={"Mer Informasjon"} icon={InformationSquareIcon}/>
        <Box
            // background="surface-alt-4-moderate"
            padding="8"
            paddingBlock="16"
        >

            <Accordion>
                {helpData.map((item: HelpDataItem) => (
                    <Accordion.Item key={item.id}>
                        <Accordion.Header>{item.title}</Accordion.Header>
                        <Accordion.Content>{item.description}</Accordion.Content>
                    </Accordion.Item>
                ))}
            </Accordion>

        </Box>
      </>
    );
}
