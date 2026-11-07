
import Banner from "@/components/home/Banner";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import TopLocations from "@/components/home/TopLocations";
import BrowseByType from "@/components/home/BrowseByType";
import CustomerReviews from "@/components/home/CustomerReviews";
import WhyChooseUs from "@/components/home/WhyChooseUs";

export default function Home() {
  return (
    <>
      <Banner />
      <FeaturedProperties />
      <TopLocations />
      <BrowseByType />
      <WhyChooseUs />
      <CustomerReviews />
    </>
  );
}

