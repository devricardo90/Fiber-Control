import { CustomerDetailsScreen } from "@/features/customers";

type CustomerDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CustomerDetailsPage({ params }: CustomerDetailsPageProps) {
  const { id } = await params;

  return <CustomerDetailsScreen customerId={id} />;
}
