import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Session } from "../interface";
import { getSession } from "../services/api";

const initialContext = {
  session: null as Session | null,
};

export const SessionContext = React.createContext(initialContext);

export const useSession = () => React.useContext(SessionContext);

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) => {
  const [session, setSession] = React.useState<Session | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const skin = searchParams.get("skin");

  React.useEffect(() => {
    if (token) {
      getSession(token)
        .then((result) => {
          setSession(result);
        })
        .catch(() => {
          navigate(`/?skin=${skin}`);
        })
        .finally(() => {});
    } else {
      navigate(`/?skin=${skin}`);
    }
  }, [token]);

  return (
    <SessionContext.Provider
      value={{
        session: session,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
