import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "Is my data safe with BrewBalance?",
    answer:
      "Yes, absolutely. We use bank-level encryption and store all data securely in India. Your business data is never shared with third parties and we comply with all data protection regulations.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees. You can downgrade or cancel directly from your account settings.",
  },
  {
    question: "Do I need technical skills to use BrewBalance?",
    answer:
      "Not at all! BrewBalance is designed to be user-friendly for shop owners of all technical backgrounds. We provide free onboarding and training to help you get started quickly.",
  },
  {
    question: "What happens during the free trial?",
    answer:
      "You get full access to all features for 14 days, no credit card required. You can add your inventory, track sales, and explore all features. Our support team is available to help you set up.",
  },
  {
    question: "Can I manage multiple shops?",
    answer:
      "Yes, with our Professional and Enterprise plans, you can manage multiple shop locations from a single dashboard. Each location can have its own inventory and sales tracking.",
  },
  {
    question: "Do you provide customer support?",
    answer:
      "Yes, we provide email support for all plans, with priority support for Professional and Enterprise customers. Enterprise customers also get dedicated phone support.",
  },
]

export function FAQSection() {
  return (
    <section id="faq" className="py-20 bg-muted/50">
      <div className="container px-4 mx-auto max-w-4xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="font-montserrat font-bold text-3xl lg:text-4xl text-foreground">Frequently Asked Questions</h2>
          <p className="font-open-sans text-lg text-muted-foreground">
            Got questions? We&apos;ve got answers. If you can&apos;t find what you&apos;re looking for, contact our support team.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="bg-background rounded-lg border px-6">
              <AccordionTrigger className="font-montserrat font-semibold text-left hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="font-open-sans text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
