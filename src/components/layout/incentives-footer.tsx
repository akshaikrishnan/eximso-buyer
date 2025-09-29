import Container from "./container";

/* This example requires Tailwind CSS v2.0+ */
const incentives = [
  {
    name: "We’re Here for You – Anytime, Anywhere! ",
    description:
      "At Eximso, your global shopping journey never sleeps.Our dedicated 24×7 customer support team is always just a click away — ready to assist you with orders, shipments, payments, or any query Because global trade needs global care .",
    imageSrc: "/images/common/shopping.ico",
  },
  {
    name: "Shop Globally, Pay Locally!",
    description:
     "Pay in Local Currency. With Eximso, enjoy the comfort of buying in your own local currency — no hidden charges, no confusion. Browse products worldwide,pay in your preferred currency, transparent pricing, hassle-free checkout. Because global shopping should feel as easy as local shopping.",
     imageSrc: "/images/common/Global-Finance-Icon.ico",
  },
  {
    name: "No Surprises, Just Clarity!",
    description:
      "At Eximso, we show you the import duty upfront-before you place your order,Shop with confidence,Know the exact landed cost,100% transparency, no hidden charges,Because global shopping should never come with guesswork.",
    imageSrc: "/images/common/Upfront-Duty-Calculation-Icon.ico",
  },
  {
    name: "From Anywhere to Your Doorstep, Faster!",
    description:
      "Fastest door to door delivery,Eximso ensures the fastest door-to-door delivery for your global orders. Pick from worldwide sellers.Get it delivered straight to your home.Speed + Reliability = Hassle-free shopping",
    imageSrc: "/images/common/Fast-Delivery.ico",
  },
];

export default function IncentivesFooter() {
  return (
    <div className="bg-gray-50 mt-4">
      <Container>
        <div className=" mx-auto py-8 sm:px-6 sm:py-4  lg:px-2">
          <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8 text-justify">
            {incentives.map((incentive) => (
              <div key={incentive.name}>
                <img src={incentive.imageSrc} alt="" className="h-14 w-auto" />
                <h3 className="mt-6 text-sm font-medium text-gray-900">
                  {incentive.name}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {incentive.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
