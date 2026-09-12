import express from "express";
import mongoose from "mongoose";

import Subscription from "../models/subscription.js";
import Auth from "../models/auth.js";

const router = express.Router();


/*
  CHECK SUBSCRIPTION

  GET
  /subscription/check/:subscriberId/:channelId
*/
router.get(
  "/check/:subscriberId/:channelId",
  async (req, res) => {
    try {
      const {
        subscriberId,
        channelId,
      } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          subscriberId
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid subscriber ID",
        });
      }

      if (
        !mongoose.Types.ObjectId.isValid(
          channelId
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid channel ID",
        });
      }

      const subscription =
        await Subscription.findOne({
          subscriber: subscriberId,
          channel: channelId,
        });

      return res.status(200).json({
        subscribed:
          !!subscription,
      });
    } catch (error) {
      console.error(
        "CHECK SUBSCRIPTION ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to check subscription",
        error: error.message,
      });
    }
  }
);


/*
  SUBSCRIBE

  POST
  /subscription
*/
router.post(
  "/",
  async (req, res) => {
    try {
      const {
        subscriber,
        channel,
      } = req.body;

      console.log(
        "SUBSCRIBE REQUEST:",
        req.body
      );

      if (!subscriber) {
        return res.status(400).json({
          message:
            "Subscriber ID is required",
        });
      }

      if (!channel) {
        return res.status(400).json({
          message:
            "Channel ID is required",
        });
      }

      if (
        !mongoose.Types.ObjectId.isValid(
          subscriber
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid subscriber ID",
        });
      }

      if (
        !mongoose.Types.ObjectId.isValid(
          channel
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid channel ID",
        });
      }

      /*
        Prevent subscribing to yourself
      */

      if (
        String(subscriber) ===
        String(channel)
      ) {
        return res.status(400).json({
          message:
            "You cannot subscribe to your own channel",
        });
      }

      /*
        Check whether already subscribed
      */

      const existing =
        await Subscription.findOne({
          subscriber,
          channel,
        });

      if (existing) {
        return res.status(200).json({
          message:
            "Already subscribed",
          subscribed: true,
          subscription: existing,
        });
      }

      /*
        Create subscription
      */

      const subscription =
        await Subscription.create({
          subscriber,
          channel,
        });

      console.log(
        "SUBSCRIPTION CREATED:",
        subscription._id
      );

      return res.status(201).json({
        message:
          "Subscribed successfully",
        subscribed: true,
        subscription,
      });
    } catch (error) {
      console.error(
        "SUBSCRIBE ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to subscribe",
        error: error.message,
      });
    }
  }
);


/*
  UNSUBSCRIBE

  DELETE
  /subscription/:subscriberId/:channelId
*/
router.delete(
  "/:subscriberId/:channelId",
  async (req, res) => {
    try {
      const {
        subscriberId,
        channelId,
      } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          subscriberId
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid subscriber ID",
        });
      }

      if (
        !mongoose.Types.ObjectId.isValid(
          channelId
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid channel ID",
        });
      }

      const deleted =
        await Subscription.findOneAndDelete({
          subscriber: subscriberId,
          channel: channelId,
        });

      if (!deleted) {
        return res.status(404).json({
          message:
            "Subscription not found",
        });
      }

      console.log(
        "UNSUBSCRIBED:",
        deleted._id
      );

      return res.status(200).json({
        message:
          "Unsubscribed successfully",
        subscribed: false,
      });
    } catch (error) {
      console.error(
        "UNSUBSCRIBE ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to unsubscribe",
        error: error.message,
      });
    }
  }
);


/*
  GET USER SUBSCRIPTIONS

  GET
  /subscription/user/:userId
*/
router.get(
  "/user/:userId",
  async (req, res) => {
    try {
      const { userId } =
        req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          userId
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid user ID",
        });
      }

      const subscriptions =
        await Subscription.find({
          subscriber: userId,
        })
          .populate(
            "channel",
            "name channelname email image"
          )
          .sort({
            createdAt: -1,
          })
          .lean();

      return res.status(200).json(
        subscriptions
      );
    } catch (error) {
      console.error(
        "GET SUBSCRIPTIONS ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to fetch subscriptions",
        error: error.message,
      });
    }
  }
);


export default router;