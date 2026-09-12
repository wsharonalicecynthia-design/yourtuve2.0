"use client";

import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  PlaySquare,
  Compass,
} from "lucide-react";

import { UserContext } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosInstance";


interface Channel {
  _id: string;
  name?: string;
  channelname?: string;
  email?: string;
  image?: string;
}


interface Subscription {
  _id: string;
  channel?: Channel;
  createdAt?: string;
}


export default function SubscriptionsPage() {

  const context =
    useContext(UserContext);

  const user = context?.user;


  const [
    subscriptions,
    setSubscriptions,
  ] = useState<Subscription[]>([]);


  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    if (!user?._id) {
      setLoading(false);
      return;
    }

    fetchSubscriptions();

  }, [user?._id]);


  const fetchSubscriptions =
    async () => {

      try {

        setLoading(true);

        const response =
          await axiosInstance.get(
            `/subscription/user/${user._id}`
          );

        setSubscriptions(
          Array.isArray(response.data)
            ? response.data
            : []
        );

      } catch (error) {

        console.error(
          "SUBSCRIPTIONS ERROR:",
          error
        );

      } finally {

        setLoading(false);

      }

    };


  if (!user) {

    return (
      <main className="min-h-screen bg-white p-8">

        <div className="mx-auto max-w-5xl">

          <p className="text-sm font-semibold uppercase tracking-wide text-gray-400">
            Subscriptions
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Your subscriptions
          </h1>

          <p className="mt-2 text-gray-500">
            Sign in to see the channels you subscribe to.
          </p>

        </div>

      </main>
    );

  }


  if (loading) {

    return (
      <main className="min-h-screen bg-white p-8">

        <div className="mx-auto max-w-5xl">

          <div className="h-8 w-64 animate-pulse rounded bg-gray-100" />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {[1, 2, 3].map(
              (item) => (
                <div
                  key={item}
                  className="h-28 animate-pulse rounded-2xl bg-gray-100"
                />
              )
            )}

          </div>

        </div>

      </main>
    );

  }


  return (
    <main className="min-h-screen bg-white p-8">

      <div className="mx-auto max-w-5xl">

        <p className="text-sm font-semibold uppercase tracking-wide text-gray-400">
          Subscriptions
        </p>

        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Your subscriptions
        </h1>

        <p className="mt-2 text-gray-500">
          Channels you subscribe to.
        </p>


        {subscriptions.length === 0 ? (

          <div className="mt-12 flex flex-col items-center justify-center rounded-2xl bg-gray-50 px-6 py-20 text-center">

            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">

              <PlaySquare className="h-9 w-9 text-gray-400" />

            </div>

            <h2 className="mt-6 text-xl font-semibold text-gray-900">
              No subscriptions yet
            </h2>

            <p className="mt-2 max-w-md text-sm text-gray-500">
              Subscribe to channels you like and their latest videos will appear here.
            </p>

            <Link
              href="/explore"
              className="mt-6 flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
            >

              <Compass className="h-4 w-4" />

              Explore channels

            </Link>

          </div>

        ) : (

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {subscriptions.map(
              (item) => {

                const channel =
                  item.channel;

                if (!channel) {
                  return null;
                }

                const name =
                  channel.channelname ||
                  channel.name ||
                  channel.email ||
                  "Channel";


                return (
                  <Link
                    key={item._id}
                    href={`/channel/${channel._id}`}
                    className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >

                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-lg font-bold text-gray-700">

                      {channel.image ? (

                        <img
                          src={channel.image}
                          alt=""
                          className="h-full w-full object-cover"
                        />

                      ) : (

                        name
                          .charAt(0)
                          .toUpperCase()

                      )}

                    </div>


                    <div className="min-w-0">

                      <h2 className="truncate font-semibold text-gray-900">
                        {name}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        View channel
                      </p>

                    </div>

                  </Link>
                );

              }
            )}

          </div>

        )}

      </div>

    </main>
  );
}