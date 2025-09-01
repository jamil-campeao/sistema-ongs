import Header from "@/components/header";
import ProjectHeader from "@/components/projects/projectHeader";
import AboutSection from "@/components/projects/aboutSection";
import ContributeSection from "@/components/projects/contributeSection";
import AdditionalInfoSection from "@/components/projects/additionalInfoSection";
import GallerySection from "@/components/projects/gallerySection";
import ContactSection from "@/components/projects/contactSection";
import Footer from "@/components/footer";

export default async function RootLayout({children, params }: { children: React.ReactNode; params: Promise<{ slug: number }> }) {
    const { slug } = await params;
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="container px-4 py-6 mx-auto">
        <ProjectHeader id={slug}/>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-2 space-y-6">
            <AboutSection id={slug} />
            <ContributeSection id={slug} />
            <AdditionalInfoSection id={slug} />
            <GallerySection id={slug} />
          </div>

          <div className="space-y-6">
            <ContactSection id={slug} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}