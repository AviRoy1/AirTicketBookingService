const { BookingRepository } = require('../repository/index');
const axios = require('axios');
const { FLIGHT_SERVICE_PATH } = require('../config/server-config');
const { ServiceError } = require('../utils/error');

class BookingService {
    constructor(){
        this.bookingRepository = new BookingRepository();
    }
 
    async createBooking(data) {
        try {
            const flightId = data.flightId;
            const getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            const response = await axios.get(getFlightRequestURL);
            // console.log(flight.data.body);
            const flightData =  response.data.body;
            const flightPrice = flightData.price;
            if(data.noOfSeats > flightData.totalSeats) {
                throw new ServiceError('Something went wrong in the booking process','Insufficient seats in the flight')
            }
            const totalCost =   data.noOfSeats * flightPrice;
            const bookingPayload = {...data,totalCost};
            const booking = await this.bookingRepository.create(bookingPayload);
            // return booking;
            // console.log("booking is --- " , booking);
            const updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`;
            console.log(updateFlightRequestURL);
            //return flightData.totalSeats;
            await axios.patch(updateFlightRequestURL,{totalSeats: flightData.totalSeats-booking.noOfSeats});
            const finalBooking = await this.bookingRepository.update(booking.id,{status:'Booked'});
            return finalBooking;
            
        } catch (error) {
            if(error.name == 'RepositoryError' || error.name=='ValidationError')
                return error;
            throw new ServiceError(); 
        }
    }

}


module.exports = BookingService;