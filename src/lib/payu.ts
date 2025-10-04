export function payuCheckout(order: any) {
  // Create a form element
  const form = document.createElement("form");
  form.method = "POST";
  form.action = order.paymentUrl; // e.g. "https://test.payu.in/_payment"
  // Add all required fields as hidden inputs
  const fields = {
    key: order.key,
    txnid: order.txnId,
    amount: order.amount,
    productinfo: order.productinfo,
    firstname: order.firstname,
    email: order.email,
    phone: order.phone,
    surl: order.surl,
    furl: order.furl,
    hash: order.hash,
  };
  for (let field in fields) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = field;
    input.value = (fields as Record<string, any>)[field];
    form.appendChild(input);
  }
  document.body.appendChild(form);
  console.log("Submitting form to PayU:", form);
  form.submit(); // auto-submit the form, redirecting to PayU
}
