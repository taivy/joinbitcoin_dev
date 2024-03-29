import React from "react";
import { Route } from "react-router-dom";
import { withAuthenticationRequired } from "@auth0/auth0-react";


const PrivateRoute = ({
  component,
  ...args
}: React.PropsWithChildren<any>) => (
  <Route
    component={withAuthenticationRequired(component, {
      // If using a Hash Router, you need to pass the hash fragment as `returnTo`
      // returnTo: () => window.location.hash.substr(1),
    })}
    {...args}
  />
);


export default PrivateRoute;