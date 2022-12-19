import {
    AuthError,
    createClient,
    RealtimeChannel,
    RealtimePostgresChangesPayload,
    User,
} from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL as string;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY as string;
const GUESTID = "g_090";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
let supabaseUser: User | null = null;
export const getUser = () => supabaseUser;
export const getUserProfileAsync = async () : Promise<any | null> => {
    const response = await supabase.from("profiles").select('*').eq('user_id', supabaseUser?.id);
    if (response?.data === null || response.data.length === 0) return null;
    return response?.data[0];
}

supabase.auth.getUser().then((response) => {
  if (response.data.user === null) return;
  supabaseUser = response.data.user;
});

let channel: RealtimeChannel;

export const login = async (email: string, password: string) : Promise<AuthError | null> => {
    const response = await supabase.auth.signInWithPassword({ email: email, password: password });
    if (response.error !== undefined && response.error !== null) return response.error;
    supabaseUser = response.data.user;
    return null;
}

export const register = async (email: string, password: string, username: string) : Promise<AuthError | null> => {
    const response = await supabase.auth.signUp({email: email, password: password});
    if (response.error !== undefined && response.error !== null) return response.error;
    supabaseUser = response.data.user;

    await supabase.from("profiles").insert({
        user_name: username,
        is_guest: false,
        user_id: supabaseUser?.id,
    });

    return null;
}

export const guestLogin = async () => {
  let guestId = localStorage.getItem(GUESTID);
  let username = `guest${guestId}`;
  let password = `${guestId}${username}`;

  if (guestId === null) {
    const { data, error } = await supabase.from("guests").insert({}).select();
    if (error) {
      console.error(error);
      return;
    }
    guestId = data[0].id as string;
    localStorage.setItem(GUESTID, guestId);

    username = `guest${guestId}`;
    password = `${guestId}${username}`;

    let response = await supabase.auth.signUp({
      email: `${username}@looplife`,
      password: password,
    });

    supabaseUser = response.data.user;

    await supabase.from("profiles").insert({
      user_name: username,
      is_guest: true,
      user_id: supabaseUser?.id,
    });

    return;
  }

  await supabase.auth.signInWithPassword({
    email: `${username}@looplife`,
    password: password,
  });
};

export const getMessages = async () => {
  return await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(100);
};

export const sendChatRoomMessage = async (message: string) => {
  return await supabase.from("messages").insert({ message: message });
};

export const messageSubscribe = (
  messageRecieved: (
    x: RealtimePostgresChangesPayload<{
      [key: string]: any;
    }>
  ) => void
) => {
  supabase
    .channel("public:messages")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
      },
      (payload) => {
        messageRecieved(payload);
      }
    )
    .subscribe();
};
