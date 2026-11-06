import { notFound } from "next/navigation";
import PropertyDetails from "@/components/properties/PropertyDetails";
import { getPropertyById } from "@/lib/api/properties/properties";


export async function generateMetadata({ params }) {
  const { id } = await params;
  const property = await getPropertyById(id);
  return { title: property ? `${property.title} | Rentora` : "Not found | Rentora" };
}

export default async function PropertyDetailsPage({ params }) {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) notFound();

  return <PropertyDetails property={property} />;
}