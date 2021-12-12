import { useMutation, useQuery } from "@apollo/client";
import { FormControlLabel, Switch, TextField } from "@material-ui/core";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Avatar, Button, Htag, OutlinedDiv } from "../../components";
import { PROFILE_QUERY, UPDATE_USER_MUTATION } from "../../graphql";
import { InnerPageLayout } from "../../layout/InnerPageLayout";

const Rules = (): JSX.Element => {
  return (
    <InnerPageLayout>
      <div className="form">
      </div>
    </InnerPageLayout>
  );
};

export default Rules;
