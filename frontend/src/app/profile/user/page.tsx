import Header from "@/components/header"
import ProfileHeaderUser from "@/components/profile/user/profileHeaderUser"
import ProfileAboutUser from "@/components/profile/user/profileAboutUser"
import ProfileContributionUser from "@/components/profile/user/profileContributionUser"
import ProfileUserSugestionOng from "@/components/profile/user/profileUserSugestionOng"
import ProfileVolunteerProjects from "@/components/profile/user/profileVolunteerProjects" 
import Footer from "@/components/footer"


export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header />
      <main className="container px-4 py-6 mx-auto">
        {/* Profile Header */}
        < ProfileHeaderUser />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* About Section */}
            < ProfileAboutUser />

            {/* Projects Volunteer Section */}
            < ProfileVolunteerProjects />

            {/* Contribution Section */}
            < ProfileContributionUser />
          </div>

          <div className="space-y-6">
            {/* Sugestões de ONGs */}
            <ProfileUserSugestionOng/>
          </div>
        </div>
      </main>
      {/* Footer */}
      <Footer />
    </div>
  )
}

