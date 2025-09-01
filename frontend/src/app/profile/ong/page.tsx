import Header from "@/components/header"
import ProfileHeaderOng from "@/components/profile/ong/profileHeaderOng"
import ProfileAboutOng from "@/components/profile/ong/profileAboutOng"
import Footer from "@/components/footer"
import ProfileOngProjects from "@/components/profile/ong/profileOngProjects"

export default function OngsPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header />

      <main className="container px-4 py-6 mx-auto space-y-6">
        <ProfileHeaderOng />
        <ProfileAboutOng />
        <ProfileOngProjects />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}