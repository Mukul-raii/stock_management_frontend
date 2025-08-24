import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

const features = [
  {
    title: "Smart Dashboard",
    description: "Track revenue, margin, and cash flow in real time with intuitive charts and graphs.",
    image: "/performance.jpg",
  },
  {
    title: "Stock Management",
    description: "Dead stock analysis, turnover rates, and automated alerts to optimize your inventory.",
    image: "/360_F_670004228_4EFH6zZn8kjVhc5q7FyXuAHn3PtSwpwy.jpg",
  },
  {
    title: "Bank & Cash Reconciliation",
    description: "Auto-match UPI, cash, and deposits to keep your books balanced effortlessly.",
    image: "/istockphoto-2078490118-612x612.jpg",
  },
  {
    title: "Breakage Tracking",
    description: "Monitor shrinkage & losses with precision to protect your profit margins.",
    image: "/Sales-Tracking-Presentation-Templates-Bundle.png"
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20">
      <div className="container px-4 mx-auto max-w-7xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="font-montserrat font-bold text-3xl lg:text-4xl text-foreground">
            Powerful Features Built for Liquor Shops
          </h2>
          <p className="font-open-sans text-lg text-muted-foreground max-w-2xl mx-auto">
            Every feature is designed with liquor shop owners in mind, helping you manage your business more
            effectively.
          </p>
        </div>

        <div className="space-y-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "lg:grid-flow-col-dense" : ""}`}
            >
              <div className={`space-y-6 ${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                <h3 className="font-montserrat font-bold text-2xl lg:text-3xl text-foreground">{feature.title}</h3>
                <p className="font-open-sans text-lg text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
              <div className={`${index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}`}>
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <Image src={feature.image || "/placeholder.svg"} alt={feature.title} width={800} height={600} className="w-full h-auto" />
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
