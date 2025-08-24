import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "Owner, Kumar Wine Shop",
    location: "Mumbai",
    content:
      "BrewBalance transformed how I manage my shop. I can now track everything in real-time and make better decisions.",
    avatar: "/professional-indian-businessman-headshot.png",
  },
  {
    name: "Priya Sharma",
    role: "Manager, City Liquors",
    location: "Delhi",
    content:
      "The inventory alerts saved me from stockouts during festival season. This tool is a game-changer for our business.",
    avatar: "/indian-businesswoman-headshot.png",
  },
  {
    name: "Amit Patel",
    role: "Owner, Patel Beverages",
    location: "Ahmedabad",
    content:
      "Finally, I can see where my money is going. The expense tracking feature helped me cut costs by 15% in just 3 months.",
    avatar: "/professional-indian-businessman-headshot.png",
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 bg-muted/50">
      <div className="container px-4 mx-auto max-w-7xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="font-montserrat font-bold text-3xl lg:text-4xl text-foreground">
            Trusted by Liquor Shops Across India
          </h2>
          <p className="font-open-sans text-lg text-muted-foreground max-w-2xl mx-auto">
            See what shop owners are saying about BrewBalance and how it&quot;s helping them grow their business.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 space-y-4">
                <p className="font-open-sans text-muted-foreground italic leading-relaxed">&quot;{testimonial.content}&quot;</p>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-montserrat font-semibold text-foreground">{testimonial.name}</p>
                    <p className="font-open-sans text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="font-open-sans text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
