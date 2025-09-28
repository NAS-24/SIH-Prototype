const Footer = ({ variant = 'default' }) => {
  if (variant === 'login') {
    return (
      <footer className="bg-white/80 backdrop-blur-md border-t border-ocean-200/50 mt-16">
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-4xl mb-4 float-animation">🐚</div>
            <h1 className="text-3xl font-bold ocean-text mb-4">
              About the Platform (BluShell)
            </h1>
            <p className="text-ocean-700 text-lg leading-relaxed max-w-3xl mx-auto">
              BluShell is a community-driven platform dedicated to monitoring, reporting, and mitigating coastal hazards along India's coastline. Our mission is to empower citizens, researchers, and authorities to collaboratively protect marine environments and ensure the safety of coastal communities.
            </p>
          </div>
        </div>
      </footer>
    )
  }

  if (variant === 'support') {
    return (
      <footer className="bg-white/80 backdrop-blur-md border-t border-ocean-200/50 mt-16">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-ocean-600 text-lg">
            🆘 Need help? Contact support
          </p>
        </div>
      </footer>
    )
  }

  return (
    <footer className="bg-white/80 backdrop-blur-md border-t border-ocean-200/50 mt-16">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-ocean-600 text-lg">
          © 2024 INCOIS Hazard Platform. All rights reserved. 🌊
        </p>
      </div>
    </footer>
  )
}

export default Footer
