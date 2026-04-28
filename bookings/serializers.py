from rest_framework import serializers
from .models import Booking, BookingOption, BookingAssignment
from services.models import Service, Option
from services.serializers import ServiceSerializer, OptionSerializer
from decimal import Decimal

class BookingOptionSerializer(serializers.ModelSerializer):
    option_details = OptionSerializer(source='option', read_only=True)
    
    class Meta:
        model = BookingOption
        fields = ('id', 'option', 'option_details', 'quantity', 'price_at_time')
        read_only_fields = ('price_at_time',)

class BookingSerializer(serializers.ModelSerializer):
    selected_options = BookingOptionSerializer(many=True, required=False)
    service_details = ServiceSerializer(source='service', read_only=True)
    
    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ('user', 'estimated_price', 'final_price', 'status')

    def create(self, validated_data):
        options_data = validated_data.pop('selected_options', [])
        user = self.context['request'].user
        
        # Initial booking creation
        booking = Booking.objects.create(user=user, **validated_data)
        
        # Calculate price
        total_price = booking.service.base_price
        
        for opt_data in options_data:
            option = opt_data['option']
            quantity = opt_data.get('quantity', 1)
            
            # Price calculation logic
            price_at_time = option.price
            option_total = Decimal('0.00')
            
            if option.pricing_type == 'FIXED':
                option_total = price_at_time * quantity
            elif option.pricing_type == 'PER_CHILD':
                option_total = price_at_time * booking.nb_children * quantity
            elif option.pricing_type == 'PER_HOUR':
                duration_hours = Decimal(booking.service.duration_minutes) / Decimal('60')
                option_total = price_at_time * duration_hours * quantity
            
            BookingOption.objects.create(
                booking=booking,
                option=option,
                quantity=quantity,
                price_at_time=price_at_time
            )
            total_price += option_total
            
        booking.estimated_price = total_price
        booking.final_price = total_price
        booking.save()
        
        return booking
