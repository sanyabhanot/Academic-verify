import React, { Component } from "react";
import { Image } from "semantic-ui-react";

export default class Nochats extends Component {
  render() {
    return (
      <div
        style={{
          display: "grid",
          textAlign: "center",
          justifyItems: "center",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          style={{ width: "70%" }}
          src="https://image.freepik.com/free-vector/chatting-design-concept-with-hand-holding-cellphone_7087-798.jpg"
        />
        <h1>No Chats</h1>
        <p>
          Feel free to discuss any matters the chats are end to end encrypted.
        </p>
      </div>
    );
  }
}