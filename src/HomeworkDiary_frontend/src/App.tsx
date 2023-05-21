function App() {
  return (
    <div style={{ "fontSize": "30px" }}>
      <div style={{ "backgroundColor": "yellow" }}>
        <p>Greetings, from DFINITY!</p>
        <p>
          {" "}
          Type your message in the Name input field, then click{" "}
          <b> Get Greeting</b> to display the result.
        </p>
      </div>
      {/* <div style={{ margin: "30px" }}>
//         <input
//           id="name"
//           value={name}
//           onChange={(ev) => setName(ev.target.value)}
//         ></input>
//         <button onClick={doGreet}>Get Greeting!</button>
//       </div>
//       <div>
//         Greeting is: "
//         <span style={{ color: "blue" }}>{message}</span>"
//       </div> */}
    </div>
  );
}

export default App;