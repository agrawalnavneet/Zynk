// // // const mongoose = require('mongoose');

// // // const bookingSchema = new mongoose.Schema({
// // //   user: {
// // //     type: mongoose.Schema.Types.ObjectId,
// // //     ref: 'User',
// // //     required: true,
// // //   },
// // //   service: {
// // //     type: mongoose.Schema.Types.ObjectId,
// // //     ref: 'Service',
// // //     required: true,
// // //   },
// // //   date: {
// // //     type: Date,
// // //     required: true,
// // //   },
// // //   time: {
// // //     type: String,
// // //     required: true,
// // //   },
// // //   address: {
// // //     street: {
// // //       type: String,
// // //       required: true,
// // //     },
// // //     city: {
// // //       type: String,
// // //       required: true,
// // //     },
// // //     state: {
// // //       type: String,
// // //       required: true,
// // //     },
// // //     // zipCode: {
// // //     //   type: String,
// // //     //   required: true,
// // //     // },
// // //   },
// // //   status: {
// // //     type: String,
// // //     enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
// // //     default: 'pending',
// // //   },
// // //   plan: {
// // //     type: String,
// // //     enum: ['one-time', 'hourly', 'daily', 'weekly', 'monthly', 'yearly'],
// // //     default: 'one-time',
// // //   },
// // //   bookingType: {
// // //     type: String,
// // //     enum: ['instant', 'scheduled', 'recurring'],
// // //     default: 'scheduled',
// // //   },
// // //   recurringFrequency: {
// // //     type: String,
// // //     enum: ['daily', 'weekly', 'monthly'],
// // //   },
// // //   totalPrice: {
// // //     type: Number,
// // //     required: true,
// // //   },
// // //   paymentStatus: {
// // //     type: String,
// // //     enum: ['pending', 'paid', 'failed', 'refunded'],
// // //     default: 'pending',
// // //   },
// // //   paymentId: {
// // //     type: String,
// // //   },
// // //   razorpayOrderId: {
// // //     type: String,
// // //   },
// // //   specialInstructions: {
// // //     type: String,
// // //   },
// // // }, {
// // //   timestamps: true,
// // // });

// // // module.exports = mongoose.model('Booking', bookingSchema);


// // const mongoose = require('mongoose');

// // const bookingSchema = new mongoose.Schema(
// //   {
// //     user: {
// //       type: mongoose.Schema.Types.ObjectId,
// //       ref: 'User',
// //       required: true,
// //     },

// //     serviceId: {
// //       type: mongoose.Schema.Types.ObjectId,
// //       ref: 'Service',
// //       // required: true,
// //     },

// //     date: {
// //       type: Date,
// //       required: true,
// //     },

// //     time: {
// //       type: String,
// //       required: true,
// //     },

// //     plan: {
// //       type: String,
// //       enum: ['one-time', 'hourly', 'daily', 'weekly', 'monthly', 'yearly'],
// //       default: 'one-time',
// //     },

// //     bookingType: {
// //       type: String,
// //       enum: ['instant', 'scheduled', 'recurring'],
// //       default: 'scheduled',
// //     },

// //     recurringFrequency: {
// //       type: String,
// //       enum: ['daily', 'weekly', 'monthly'],
// //       required: function () {
// //         return this.bookingType === 'recurring';
// //       },
// //     },

// //     PgName: {
// //       type: String,
// //       // required: true,
// //     },

// //     RoomNo: {
// //       type: String,
// //       // required: true,
// //     },

// //     Landmark: {
// //       type: String,
// //       // required: true,
// //     },

// //     specialInstructions: {
// //       type: String,
// //     },

// //     status: {
// //       type: String,
// //       enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
// //       default: 'pending',
// //     },

// //     totalPrice: {
// //       type: Number,
// //       required: true,
// //     },

// //     paymentStatus: {
// //       type: String,
// //       enum: ['pending', 'paid', 'failed', 'refunded'],
// //       default: 'pending',
// //     },

// //     paymentId: String,
// //     razorpayOrderId: String,
// //   },
// //   {
// //     timestamps: true,
// //   }
// // );

// // module.exports = mongoose.model('Booking', bookingSchema);


// const mongoose = require('mongoose');

// const bookingSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },

//     // Change from serviceId to service
//     service: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Service',
//       required: true,
//     },

//     date: {
//       type: Date,
//       required: true,
//     },

//     time: {
//       type: String,
//       required: true,
//     },

//     plan: {
//       type: String,
//       enum: ['one-time', 'hourly', 'daily', 'weekly', 'monthly', 'yearly'],
//       default: 'one-time',
//     },

//     bookingType: {
//       type: String,
//       enum: ['instant', 'scheduled', 'recurring'],
//       default: 'scheduled',
//     },

//     recurringFrequency: {
//       type: String,
//       enum: ['daily', 'weekly', 'monthly'],
//       required: function () {
//         return this.bookingType === 'recurring';
//       },
//     },

//     PgName: {
//       type: String,
//       required: true,
//     },

//     RoomNo: {
//       type: String,
//       required: true,
//     },

//     Landmark: {
//       type: String,
//       required: true,
//     },

//     specialInstructions: {
//       type: String,
//     },

//     status: {
//       type: String,
//       enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
//       default: 'pending',
//     },

//     totalPrice: {
//       type: Number,
//       required: true,
//     },

//     paymentStatus: {
//       type: String,
//       enum: ['pending', 'paid', 'failed', 'refunded'],
//       default: 'pending',
//     },

//     paymentId: String,
//     razorpayOrderId: String,
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model('Booking', bookingSchema);




const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
    },

    date: {
      type: Date,
    },

    time: {
      type: String,
    },

    plan: {
      type: String,
      enum: ['one-time', 'hourly', 'daily', 'weekly', 'monthly', 'yearly'],
      default: 'one-time',
    },

    bookingType: {
      type: String,
      enum: ['instant', 'scheduled', 'recurring'],
      default: 'scheduled',
    },

    recurringFrequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      required: function () {
        return this.bookingType === 'recurring';
      },
    },

    PgName: {
      type: String,
    },

    RoomNo: {
      type: String,
    },

    Landmark: {
      type: String,
    },

    specialInstructions: {
      type: String,
    },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
      default: 'pending',
    },

    totalPrice: {
      type: Number,
    },

    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },

    paymentId: String,
    razorpayOrderId: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);