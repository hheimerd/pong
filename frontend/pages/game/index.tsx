import React from "react";
import { Button, Htag } from "../../components";
import { InnerPageLayout } from "../../layout/InnerPageLayout";

const Users = (): JSX.Element => {
  const handleMM = () => {
    console.log("Start game button pressed");
  };

  return (
    <InnerPageLayout>
      <div>
        <br />
        <Htag tag="h1">Play game</Htag>
        <div className="center">
          <br />
          <br />
          <Button appearance="primary" onClick={() => handleMM()}>
            START GAME
          </Button>
        </div>
      </div>
    </InnerPageLayout>
  );
};

export default Users;
