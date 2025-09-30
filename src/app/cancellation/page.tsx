import React from "react";

export default function RefundPolicy() {
  return (
    <div className="bg-white scroll-smooth md:scroll-auto">
      {/* Header Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center">
          <div className="inline-block bg-indigo-100 px-3 py-1 rounded-full text-indigo-700 font-medium text-sm mb-4">
            Cancellation & Return policy
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            Eximso Cancellation & Return policy
          </h1>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            PLEASE READ THIS REFUND AND RETURN POLICY CAREFULLY BEFORE MAKING A PURCHASE ON EXIMSO. 
            BY PLACING AN ORDER THROUGH OUR WEBSITE, YOU AGREE TO THE TERMS OUTLINED IN THIS POLICY.
          </p>
        </div>
      </section>

      {/* Policy Content */}
      <section className="bg-gray-50 py-8 md:py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-gray-700">

          {/* 1. Introduction */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">1. Introduction</h2>
            <p className="text-justify leading-relaxed">
              At Eximso, customer satisfaction is our top priority. We understand that there may be occasions when you 
              need to return a product or request a refund. This Refund and Return Policy outlines the terms and conditions 
              under which returns and refunds are accepted. By making a purchase on our website, you agree to comply with this policy.
            </p>
          </div>

          {/* 2. General Return Policy */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">2. General Return Policy</h2>
            <h3 className="font-medium">2.1 Eligibility for Returns</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Time Frame:</strong> Products can be returned within 7 days from the date of delivery.</li>
              <li><strong>Condition of Items:</strong> Items must be unused, unwashed, and in the same condition as received. All original packaging, tags, manuals, and accessories must be included.</li>
              <li><strong>Proof of Purchase:</strong> A valid receipt or order confirmation is required to process a return.</li>
            </ul>
            <h3 className="font-medium mt-4">2.2 Non-Returnable Items</h3>
            <h2 className="font-medium mt-4">The following items are not eligible for return:</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Perishable Goods:Food items, flowers, and other perishable products.</li>
              <li>Personal Care Items:Cosmetics, personal hygiene products, and undergarments.</li>
              <li>Customized Products:Personalized or custom-made items.</li>
              <li>Digital Goods:Downloadable software, e-books, and online subscriptions.</li>
              <li>Gift Cards and Vouchers</li>
            </ul>
            <h3 className="font-medium mt-4">2.3 Exceptions</h3>
            <p>Defective or Damaged Items: If you receive a defective or damaged product, please refer to Section 4.</p>
          </div>

          {/* 3. Return Process */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">3. Return Process</h2>
            <h3 className="font-medium">3.1 Initiating a Return</h3>
            <p>
              Contact Customer Service: Email us at <a href="mailto:contact@eximso.com"className="text-indigo-600">contact@eximso.com </a> 
              or call our support line within the return window. Provide your order number, reason, and photos if applicable. 
              Upon approval, our team will provide a Return Merchandise Authorization (RMA) and instructions.
            </p>
            <h3 className="font-medium mt-4">3.2 Shipping Returns</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Securely pack the item in its original packaging, including all accessories and documentation.</li>
              <li>You are responsible for printing the shipping label and covering return shipping costs unless the return is due to our error.</li>
              <li>We recommend using a trackable shipping service. We are not responsible for returns lost in transit.</li>
              <li><strong>Return Address:</strong> Eximso International Pvt Ltd, 15/1031 PM Kareem Centre, Wonderla Road, Athani Junction, Kakkanad, Ernakulam-682030, Kerala, India.</li>
            </ul>
           <h3 className="font-medium mt-4">3.3 Return Verification</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Upon receipt, we will inspect the returned item to ensure it meets the return criteria.</li>
              <li>Inspection Time Frame: Please allow up to 5 business days for the inspection process.</li>
            </ul>
          </div>

          {/* 4. Refund Policy */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">4. Refund Policy</h2>
            <h3 className="font-medium">4.1 Refund Eligibility</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Approved Returns: Refunds are issued for items that meet all return criteria after inspection.</li>
              <li>Refunds will be credited to the original payment method used.</li>
              <li>Processing may take 5–10 business days depending on your bank.</li>
            </ul>
            <h3 className="font-medium mt-4">4.2 Partial Refunds</h3>
            <p>Partial refunds may apply if items are not in original condition or if returns are initiated beyond 30 days but within a reasonable time.</p>

            <h3 className="font-medium mt-4">4.3 Non-Refundable Fees</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Shipping Costs:</strong> Original shipping charges are non-refundable unless the return is due to our error.</li>
              <li><strong>Restocking Fee:</strong> A restocking fee of 10% may apply to certain items.</li>
            </ul>

            <h3 className="font-medium mt-4">4.4 Refund Denials</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>The item is returned outside the return window.</li>
              <li>The item is not in its original condition or is missing components.</li>
              <li>There is evidence of misuse or damage not caused by us.</li>
            </ul>
          </div>

          {/* 5. Exchanges */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">5. Exchanges</h2>
            <h3 className="font-medium">5.1 Exchange Eligibility</h3>
            <p>Exchanges are allowed for the same item in a different size or color, subject to availability. To exchange an item, follow the same steps outlined in Section 3.</p>
            <h3 className="font-medium mt-4">5.2 Processing Exchanges</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Time Frame:</strong> Exchanges are processed within 5 business days after the returned item is received and inspected.</li>
              <li><strong>Shipping of Replacement Item:</strong> Standard shipping times apply to exchanged items.</li>
            </ul>
          </div>

          {/* 6. Defective or Damaged Items */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">6. Defective or Damaged Items</h2>
            <h3 className="font-medium">6.1 Reporting Issues</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Time Frame:</strong> Report defective or damaged items within 48 hours of delivery.</li>
              <li><strong>Documentation:</strong> Provide detailed descriptions and photographs of the damage or defect.</li>
            </ul>
            <h3 className="font-medium mt-4">6.2 Resolution Options</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Replacement:</strong> We will replace the item at no additional cost.</li>
              <li><strong>Refund:</strong> If a replacement is not available, a full refund will be issued, including any shipping charges.</li>
            </ul>
          </div>

          {/* 7. Incorrect or Missing Items */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">7. Incorrect or Missing Items</h2>
            <h3 className="font-medium">7.1 Reporting Discrepancies</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Time Frame:</strong> Notify us within 48 hours if your order is incorrect or items are missing.</li>
              <li><strong>Verification:</strong> We may request photographs or additional information to verify the issue.</li>
            </ul>
            <h3 className="font-medium mt-4">7.2 Resolution</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Correcting Orders:</strong> We will ship the correct items or missing items promptly.</li>
              <li><strong>Return Instructions:</strong> If you received incorrect items, we may provide instructions for returning them at our expense.</li>
            </ul>
          </div>

          {/* 8 → 22 continue the same way */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">8. Gift Returns</h2>
            <p>Gift Recipients: Any gift items from Eximso are non-returnable and non-refundable.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">9. Return Shipping Costs</h2>
            <h3 className="font-medium">9.1 Customer Responsibility</h3>
            <p>Customers are responsible for return shipping costs unless the return is due to our error, a defective product, or damage during shipping.</p>
            <h3 className="font-medium mt-4">9.2 Refund of Shipping Costs</h3>
            <p>Original shipping costs will be refunded only if the return is due to our error or a defective product.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">10. International Returns</h2>
            <h3 className="font-medium">10.1 Return Process</h3>
            <p>International customers should follow the same return process outlined in Section 3. Clearly mark the package as "Returned Goods" to avoid additional customs fees.</p>
            <h3 className="font-medium mt-4">10.2 Shipping Costs</h3>
            <p>Customers are responsible for international return shipping costs and any customs duties or taxes.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">11. Late or Missing Refunds</h2>
            <h3 className="font-medium">11.1 Checking Refund Status</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Financial Institution:</strong> First, check with your bank or credit card company; processing times may vary.</li>
              <li><strong>Contact Us:</strong> If you've not received a refund after 10 business days, contact us for assistance.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">12. Cancellations</h2>
            <h3 className="font-medium">12.1 Order Cancellation by Customer</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Before Shipping:</strong> Orders can be cancelled before they are shipped by contacting customer service promptly.</li>
              <li><strong>After Shipping:</strong> Once an order has been shipped, it cannot be cancelled. You may proceed with a return after receiving the item.</li>
            </ul>
            <h3 className="font-medium mt-4">12.2 Order Cancellation by Eximso</h3>
            <p>We reserve the right to cancel orders due to stock unavailability, pricing errors, or suspected fraudulent activity. You will be notified via email, and a full refund will be issued if applicable.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">13. Restocking Fee</h2>
            <p>A restocking fee of 10% may apply to certain returns, particularly for large or high-value items.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">14. Special Promotions and Sale Items</h2>
            <p>Items purchased during special promotions or sales may be final sale and not eligible for returns or refunds. Please refer to the specific promotion details.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">15. Vendor-Specific Return Policies</h2>
            <p>As a multi-vendor platform, some products sold on Eximso may be subject to vendor-specific return policies. These policies will be clearly stated on the product page. In case of discrepancies, the more generous return policy will apply.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">16. Dispute Resolution</h2>
            <p>Contact our customer service team for any issues or disputes. If a resolution cannot be reached, disputes will be handled according to the dispute resolution process outlined in our Terms and Conditions.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">17. Changes to This Policy</h2>
            <p>We reserve the right to modify this Refund and Return Policy at any time. Significant changes will be communicated via email or by posting a notice on our website. Changes are effective immediately upon posting unless stated otherwise.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">18. Contact Information</h2>
            <p>Email: contact@eximso.com</p>
            <p>Customer Service Hours: 365 days 24 hrs</p>
            <p>Phone: +91 90378 50541</p>
            <p>Address: Eximso International Pvt Ltd, 15/1031 PM Kareem Centre, Wonderla Road, Athani Junction, Kakkanad, Ernakulam-682030, Kerala, India</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">19. Frequently Asked Questions (FAQs)</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>19.1 How do I know if my item is eligible for a return?</strong> Check the product page for any specific return policies and ensure your item meets the general return criteria outlined in Section 2.</li>
              <li><strong>19.2 Can I return an item after the 30-day window?</strong> Returns outside the 30-day window are generally not accepted unless exceptional circumstances apply. Contact customer service for assistance.</li>
              <li><strong>19.3 How long does it take to process a refund?</strong> Refunds are processed within 5–10 business days after we receive and inspect your returned item.</li>
              <li><strong>19.5 Can I exchange an item for a different product?</strong> Exchanges are only allowed for the same item in a different size or color. To get a different product, you should return the original item and place a new order. Shipping costs will be charged extra.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">20. Legal Disclaimer</h2>
            <p><strong>Limitation of Liability:</strong> Our liability for any loss or damage arising from issues related to returns or refunds is limited to the total value of the order.</p>
            <p><strong>No Warranty:</strong> We make no warranties regarding the products purchased beyond those provided by the manufacturer or vendor.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">21. Compliance with Laws</h2>
            <p>This policy is governed by the laws of India. Any disputes will be resolved in accordance with the dispute resolution process outlined in our Terms and Conditions.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">22. Privacy Policy</h2>
            <p className="text-justify leading-relaxed">
              Any personal data collected during the return or refund process is handled in accordance with our Privacy Policy.
              By making a purchase on Eximso, you acknowledge that you have read, understood, and agree to this Refund and Return Policy.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}
