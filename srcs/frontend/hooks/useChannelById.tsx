import { useQuery } from "@apollo/client";
import { CHAT_QUERY } from "../graphql/queries";
import { IChat } from "../interfaces/chat.interface";

export default function useChannelById(id: string | string[]) {
  // get user
  const { data, error, loading } = useQuery(CHAT_QUERY, {
    skip: !id,
    variables: { chatId: id },
    onError(err) {
      console.log("useChannelById", err);
    },
  });

  // wait fetching data
  if (loading) return;
  if (error) return;
  if (!data) return;

  return data.chat;
}
