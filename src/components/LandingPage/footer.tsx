export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container px-4 mx-auto max-w-7xl">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">B</span>
              </div>
              <span className="font-montserrat font-bold text-xl">BrewBalance</span>
            </div>
            <p className="font-open-sans text-background/80 leading-relaxed">
              Helping liquor shop owners take control of their business with data-driven insights.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-montserrat font-semibold text-lg">Product</h3>
            <ul className="space-y-2 font-open-sans text-background/80">
              <li>
                <a href="#features" className="hover:text-background transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-background transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Demo
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  API
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-montserrat font-semibold text-lg">Support</h3>
            <ul className="space-y-2 font-open-sans text-background/80">
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Training
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Status
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-montserrat font-semibold text-lg">Company</h3>
            <ul className="space-y-2 font-open-sans text-background/80">
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Privacy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 mt-12 pt-8 text-center">
          <p className="font-open-sans text-background/60">© 2024 BrewBalance. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
