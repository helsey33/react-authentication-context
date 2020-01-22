# Auth Context

A context Provider for React that makes the call to your server to fetch the user as well as validates the user on every visit.

## Installation

```bash
npm install --save auth-context
```

[DEMO](https://codesandbox.io/s/auth-context-demo-fnt3i?fontsize=14&hidenavigation=1&theme=dark)

## Usage

```Javascript
import AuthContextProvider from "auth-context";
```

Wrap the Provider around your main App and pass in the validation url as well as fetch options for your endpoint.
The _fetchoptions_ includes your endpoint options such as headers, body(that might include the validation token) as well as other options.

```Javascript
function App() {
 const [fetchOptions, setFetchOptions] = useState(null);

 useEffect(() => {
   const getToken = async () => {
     const token = await localStorage.getItem("token");
     setFetchOptions({
       body: { token },
       method: "POST"
     });
   };
   getToken();
 }, []);

 return (
  <AuthContextProvider
       authOptions={{
         url:
           "https://authcontextdemoserver.netlify.com/.netlify/functions/validate",
         fetchOptions
       }}
     >
      <Dashboard />
     </AuthContextProvider>
 );
}
```

The provider will thus call the endpoint on every visit and validate the user. On success it will set the _user_ state and on error it will set the _error_ state that can be consumed by developers.

## Fetching User

The context also provides a function fetchUser that can be used to login or register the user when they land on your application for the first time

### Usage

```Javascript
import React, { useContext } from "react";

import { AuthContext } from "auth-context";

export default function HelloThere() {
  const { fetchUser } = useContext(AuthContext);

  const handleSubmit = async e => {
    e.preventDefault();
    const formElements = e.target.elements;
    const userDetails = {
      email: formElements.namedItem("email").value,
      password: formElements.namedItem("password").value
    };

    if (userDetails.email && userDetails.password) {
      const user = await fetchUser({
        url:
          "https://authcontextdemoserver.netlify.com/.netlify/functions/signin",
        method: "POST",
        body: userDetails
      });

      if (user) localStorage.setItem("token", String(user.user));
    }
  };

  return (
    <div className="login_wrapper">
      <form className="login_form" onSubmit={handleSubmit}>
        <div className="email">
          <input
            type="text"
            placeholder=""
            autoComplete="off"
            name="email"
            id="email"
          />
          <label htmlFor="email">Enter your email</label>
        </div>
        <div className="password">
          <input type="password" placeholder="" name="password" id="password" />
          <label htmlFor="password">Enter your password</label>
        </div>
        <input type="submit" value="SUBMIT" />
      </form>
    </div>
  );
}

```

If endpoint sends success the following function sets the _user_ state to the response sent by the endpoint as well as returns the user. On error it will set the _error_ state and return _undefined_.

## Context State

The context makes the following hook states available to the users.

| State    | Function    | Default | Description                                                                   |
| -------- | ----------- | ------- | ----------------------------------------------------------------------------- |
| fetching | setFetching | _true_  | true when validating and fetching the user.                                   |
| user     | setUser     | _null_  | The user object that is returned by the validation or the fetchuser endpoint. |
| error    | setError    | _null_  | The error object set to whatever the error returned by your endpoint          |

You can consume these state objects as well as their functions just as every context.

```Javascript
import React, { useContext } from "react";
import { AuthContext } from "auth-context";

import Login from "./Login";
import Loading from "./Loading";

export default function Dashboard() {
  const { user, fetching,error, setUser,setFetching,setError } = useContext(AuthContext);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  if (fetching) return <Loading />;
  else if (user)
    return (
      <div className="dashboard">
        Hello {user.email} <span onClick={logout}>LOGOUT</span>
      </div>
    );
  else return <Login />;
}
```
