import React, { useState, createContext, useEffect } from "react";

export const AuthContext = createContext();

const AuthContextProvider = ({ children, authOptions }) => {
  const [fetching, setFetching] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const fetchUser = async ({
    url,
    method = "GET",
    body,
    headers,
    ...otherOptions
  }) => {
    setFetching(true);
    const fetchOptions = {
      method,
      body: JSON.stringify(body),
      headers,
      ...otherOptions
    };
    let res;
    try {
      res = await fetch(url, fetchOptions).then(res => res.json());
    } catch (error) {
      setError(error);
      setFetching(false);
      return res;
    }
    setUser(res);
    setError(null);
    setFetching(false);
    return res;
  };

  useEffect(() => {
    if (authOptions.fetchOptions) {
      const { fetchOptions } = authOptions;
      fetchUser({
        url: authOptions.url,
        method: fetchOptions.method,
        body: fetchOptions.body,
        headers: fetchOptions.headers,
        ...fetchOptions
      });
    } else {
      setError("No options provided for fetching");
    }
  }, [authOptions]);

  return (
    <AuthContext.Provider
      value={{
        fetching,
        setFetching,
        user,
        setUser,
        error,
        setError,
        fetchUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
