import { CustomerEditScreen } from "@/features/customers";

type EditCustomerPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCustomerPage({ params }: EditCustomerPageProps) {
  const { id } = await params;

  return <CustomerEditScreen customerId={id} />;
}
