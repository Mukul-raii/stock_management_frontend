import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="py-20 bg-primary">
      <div className="container px-4 mx-auto max-w-4xl text-center">
        <div className="space-y-8">
          <h2 className="font-montserrat font-bold text-3xl lg:text-5xl text-primary-foreground">
            Run Your Shop Smarter with BrewBalance
          </h2>
          <p className="font-open-sans text-lg lg:text-xl text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
            Join hundreds of liquor shop owners who are already using BrewBalance to track sales, manage inventory, and
            boost profits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Start Free Trial Today
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
            >
              Schedule Demo
            </Button>
          </div>
          <p className="font-open-sans text-sm text-primary-foreground/80">
            14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  )
}
