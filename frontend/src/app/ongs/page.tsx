import Header from "@/components/header"
import OngsInteresting from "@/components/ongs/ongsInteresting"
import OngsProjectsSidebar from "@/components/ongsProjectsSidebar"
import Footer from "@/components/footer"

export default function OngsPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header />

      <main className="container px-4 py-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <OngsProjectsSidebar />

          {/* Main Content */}
          <div className="md:col-span-3 space-y-6">

            {/* ONG's interessantes */}
            <OngsInteresting />
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <Footer />        
    </div>
  )
}
