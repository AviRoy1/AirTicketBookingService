const { StatusCodes } = require('http-status-codes');

const { BookingService } = require('../services/index');

const { createChannel, publishMessage } = require('../utils/messageQueue');
const { REMINDER_BINDING_KEY } = require('../config/server-config');

const bookingService = new BookingService(); 

class BookingController {

    constructor() {
    }

    // async sendMessageToQueue(req, res){
    //     const channel = await createChannel();
    //     const payload = {
    //         data : {
    //             subject: 'This is notification from queue',
    //             content: 'Some queue will subscribe this',
    //             recepientEmail: 'ravijit512@gmail.com',
    //             notificaionTime: '2023-01-15T09:49:00'
    //         }
    //     };
    //     publishMessage(channel, REMINDER_BINDING_KEY, JSON.stringify(payload));
    //     return res.status(200).json({
    //         message: 'Succesfully published the event'
    //     });
    // }

    async create (req, res) {
        try {
            const response = await bookingService.createBooking(req.body);
            console.log("FROM BOOKING CONTROLLER", response);
            return res.status(StatusCodes.OK).json({
                message: 'Successfully completed booking',
                success: true,
                err: {},
                data: response
            })
        } catch (error) {
            return res.status(error.statusCode).json({
                message: error.message,
                success: false,
                err: error.explanation,
                data: {}
            });
        }
    }
}

module.exports = BookingController