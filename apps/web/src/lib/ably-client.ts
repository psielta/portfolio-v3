import * as Ably from 'ably';

let ablyClient: Ably.Realtime | null = null;

export function getAblyClient(): Ably.Realtime {
  if (!ablyClient) {
    ablyClient = new Ably.Realtime({
      authUrl: '/api/chat/ably-token',
      authMethod: 'POST',
      authHeaders: {
        'Content-Type': 'application/json',
      },
    });

    // Log connection state changes for debugging
    ablyClient.connection.on('connected', () => {
      console.log('✅ Ably connected successfully');
    });

    ablyClient.connection.on('failed', (stateChange) => {
      console.error('❌ Ably connection failed:', stateChange.reason);
    });

    ablyClient.connection.on('disconnected', () => {
      console.log('🔌 Ably disconnected');
    });
  }

  return ablyClient;
}

// Force reconnect with new token
export function reconnectAblyClient() {
  if (ablyClient) {
    console.log('🔄 Forcing Ably reconnection...');
    ablyClient.close();
    ablyClient = null;
  }
}

export function getChannel(channelName: string): Ably.RealtimeChannel {
  const client = getAblyClient();
  return client.channels.get(channelName);
}

export async function publishMessage(channelName: string, eventName: string, data: any) {
  const channel = getChannel(channelName);
  await channel.publish(eventName, data);
}

export function subscribeToChannel(
  channelName: string,
  eventName: string,
  callback: (message: Ably.Message) => void
) {
  const channel = getChannel(channelName);
  channel.subscribe(eventName, callback);

  return () => {
    channel.unsubscribe(eventName, callback);
  };
}

export function enterPresence(channelName: string, data?: any) {
  const channel = getChannel(channelName);
  return channel.presence.enter(data);
}

export function leavePresence(channelName: string) {
  const channel = getChannel(channelName);
  return channel.presence.leave();
}

export function subscribeToPresence(
  channelName: string,
  callback: (presenceMessage: Ably.PresenceMessage) => void
) {
  const channel = getChannel(channelName);
  channel.presence.subscribe(callback);

  return () => {
    channel.presence.unsubscribe(callback);
  };
}
