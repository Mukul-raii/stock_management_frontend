import { Card, CardContent } from "@/components/ui/card"

const benefits = [
  {
    icon: "📊",
    title: "Sales Insights",
    description: "See daily, monthly, and yearly sales trends with detailed analytics.",
  },
  {
    icon: "🏪",
    title: "Multi-Shop Tracking",
    description: "Manage multiple outlets with ease from a single dashboard.",
  },
  {
    icon: "📦",
    title: "Inventory Alerts",
    description: "Never run out of stock or let products expire with smart alerts.",
  },
  {
    icon: "💰",
    title: "Profit & Expense Control",
    description: "Know exactly where your money goes with detailed expense tracking.",
  },
]

export function BenefitsSection() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container px-4 mx-auto max-w-7xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="font-montserrat font-bold text-3xl lg:text-4xl text-foreground">
            Everything You Need to Run Your Shop Smarter
          </h2>
          <p className="font-open-sans text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed specifically for liquor shop owners who want better control over their business.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 space-y-4">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="font-montserrat font-semibold text-xl text-foreground">{benefit.title}</h3>
                <p className="font-open-sans text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
