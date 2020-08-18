Stripe.setPublishableKey("pk_test_51HBgT3G0e64EkmvjfHz0nfdIWUPgbs9kaeQx7A3x3jad9JklWDg5F5ZBSMb1lgpLxC2G0S6P19eQPp7XYz1bOPlF006efjDKQW");

var $form = $('#checkout-form');

$form.submit(function(event){
  $('#charge-error').addClass('invisible');
  $form.find('button').prop('disabled', true);
  Stripe.card.createToken({
    number: $('#card-number').val(),
    cvc: $('#card-cvc').val(),
    exp_month: $('#card-expiry-month').val(),
    exp_year: $('#card-expiry-year').val(),
    name: $('#card-name').val()
  }, stripeResponseHandler);
  return false;
});

function stripeResponseHandler(status, response){
  if(response.error){
    $('#charge-error').text(response.error.message);
    $('#charge-error').removeClass('invisible');
    $form.find('button').prop('disabled', false);
  }
  else{
    var token = response.id;
    $('#stripe_token').val(token);
    $form.get(0).submit();
  }
}
