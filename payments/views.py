import stripe
import os
from django.conf import settings
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from bookings.models import Booking
from .models import Payment

stripe.api_key = os.getenv('STRIPE_API_KEY')

class CreateStripeSessionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        booking_id = request.data.get('booking_id')
        try:
            booking = Booking.objects.get(id=booking_id, user=request.user)
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)

        try:
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[
                    {
                        'price_data': {
                            'currency': 'eur',
                            'product_data': {
                                'name': f"Animation Funkidz - {booking.service.name}",
                            },
                            'unit_amount': int(booking.final_price * 100),
                        },
                        'quantity': 1,
                    },
                ],
                mode='payment',
                success_url=request.build_absolute_uri('/payment-success/') + '?session_id={CHECKOUT_SESSION_ID}',
                cancel_url=request.build_absolute_uri('/payment-cancelled/'),
                metadata={
                    'booking_id': booking.id
                }
            )

            Payment.objects.create(
                booking=booking,
                stripe_session_id=checkout_session.id,
                amount=booking.final_price
            )

            return Response({'session_id': checkout_session.id, 'url': checkout_session.url})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    endpoint_secret = os.getenv('STRIPE_WEBHOOK_SECRET')

    event = None

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError as e:
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        return HttpResponse(status=400)

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        booking_id = session.get('metadata', {}).get('booking_id')
        
        if booking_id:
            try:
                payment = Payment.objects.get(stripe_session_id=session.id)
                payment.status = Payment.Status.SUCCEEDED
                payment.stripe_payment_intent = session.payment_intent
                payment.save()
                
                booking = payment.booking
                booking.status = Booking.Status.CONFIRMED
                booking.save()
            except Payment.DoesNotExist:
                pass

    return HttpResponse(status=200)
