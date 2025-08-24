import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      <div className="container px-4 mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <Badge variant="secondary" className="w-fit">
              Trusted by 500+ liquor shops across India
            </Badge>

            <div className="space-y-6">
              <h1 className="font-montserrat font-black text-4xl lg:text-6xl leading-tight text-foreground">
                Take Control of Your Liquor Business with <span className="text-primary">Data-Driven Insights</span>
              </h1>

              <p className="font-open-sans text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl">
                Track sales, expenses, inventory & profits in one simple dashboard. Get real-time insights that help you
                make smarter business decisions.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Free Trial
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
                See Demo
              </Button>
            </div>

            <div className="flex items-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-secondary rounded-full"></div>
                <span>No setup fees</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-secondary rounded-full"></div>
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-secondary rounded-full"></div>
                <span>24/7 support</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 bg-card rounded-2xl shadow-2xl border p-6">
              <Image src="/performance.jpg" alt="BrewBalance Dashboard" width={800} height={600} className=" rounded-lg" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-3xl transform translate-x-4 translate-y-4"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
