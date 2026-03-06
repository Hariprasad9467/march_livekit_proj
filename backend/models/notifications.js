// models/notifications.js

const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ["message", "performance", "meeting", "event", "holiday", "leave"]
  },

  // Holiday-specific
  holidayType: {
    type: String,
    enum: ["FIXED", "FLOATING"],
    required: function () {
      return this.category === "holiday";
    }
  },

  month: {
    type: String,
    enum: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ],
    // only required for holiday (previously was always required)
    required: function () {
      return this.category === "holiday";
    }
  },

  day: {
    type: Number,
    min: 1,
    max: 31,
    required: function () {
      return this.category === "holiday";
    }
  },

  year: {
    type: Number,
    required: true,
    index: true
  },

  state: {
    type: String,
    default: "TN"
  },

  message: {
    type: String,
    required: false
  },

  // chat messages array
  messages: [
    {
      senderId: String,
      senderName: String,
      receiverId: { type: String, default: "" },
      receiverName: { type: String, default: "" },
      text: String,
      attachments: [
        {
          filename: String,
          originalName: String,
          path: String,
          mimetype: String,
          size: Number
        }
      ],
      createdAt: { type: Date, default: Date.now },
      replyTo: {
        messageId: String,
        text: String,
        senderName: String,
        attachments: [
          {
            filename: String,
            originalName: String,
            path: String,
            mimetype: String,
            size: Number
          }
        ]
      },
      deletedBy: {
        type: [String],
        default: []
      }
    }
  ],

  // Performance fields (required for performance entries)
  empId: {
    type: String,
    required: function () {
      return this.category === "performance";
    }
  },
  receiverId: {
    type: String,
    required: function () {
      return this.category === "performance";
    }
  },

  reviewId: String,
  senderId: String,
  senderName: String,

  flag: {
    type: String,
    required: function () {
      return this.category === "performance";
    }
  },

  communication: String,
  attitude: String,
  technicalKnowledge: String,
  business: String,
  empName: String,
  receiverName: String,

  // top-level attachments (used by some non-chat notifications)
  attachments: [
    {
      filename: String,
      originalName: String,
      path: String,
      mimetype: String,
      size: Number
    }
  ],

  // Conversation-level boolean (still useful for message conversations)
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },

  // Per-user read tracking (NEW)
  readBy: {
    type: [String],
    default: [],
    index: true
  },

  // Hide-for list (already present)
  hiddenFor: {
    type: [String],
    default: []
  },

  createdAt: { type: Date, default: Date.now }

}, { timestamps: true });

// Optional: helpful compound indexes for faster unread-count queries
notificationSchema.index({ category: 1, readBy: 1 });
notificationSchema.index({ category: 1, hiddenFor: 1 });

module.exports = mongoose.model("Notification", notificationSchema);