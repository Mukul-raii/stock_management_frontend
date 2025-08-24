
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const plans = [
  {
    name: "Starter",
    price: "₹999",
    period: "/month",
    description: "Perfect for single shop owners",
    features: [
      "Single shop management",
      "Basic sales tracking",
      "Inventory alerts",
      "Monthly reports",
      "Email support",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: "₹2,499",
    period: "/month",
    description: "Most popular for growing businesses",
    features: [
      "Multi-shop management",
      "Advanced analytics",
      "Real-time alerts",
      "Custom reports",
      "Priority support",
      "Bank reconciliation",
      "Breakage tracking",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large businesses with custom needs",
    features: [
      "Unlimited shops",
      "Custom integrations",
      "Dedicated support",
      "Advanced security",
      "Custom training",
      "API access",
    ],
    popular: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-20">
      <div className="container px-4 mx-auto max-w-7xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="font-montserrat font-bold text-3xl lg:text-4xl text-foreground">
            Simple, Transparent Pricing
          </h2>
          <p className="font-open-sans text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your business size. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative hover:shadow-lg transition-shadow duration-300 ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center space-y-4">
                <CardTitle className="font-montserrat font-bold text-2xl text-foreground">{plan.name}</CardTitle>
                <div className="space-y-2">
                  <div className="flex items-baseline justify-center">
                    <span className="font-montserrat font-bold text-4xl text-foreground">{plan.price}</span>
                    <span className="font-open-sans text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="font-open-sans text-sm text-muted-foreground">{plan.description}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-secondary rounded-full flex-shrink-0"></div>
                      <span className="font-open-sans text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={plan.popular ? "default" : "outline"} size="lg">
                  {plan.name === "Enterprise" ? "Contact Sales" : "Start Free Trial"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
