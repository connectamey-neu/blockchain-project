import '../App.css';
import { useState, useRef } from "react";
import Avatar from '../assets/favicon.png';
import awsS3 from "aws-sdk/clients/s3";
import { ethers } from "ethers";
const Buy = ({ state }) => {
  const buyChai = async (event) => {
    handleAdd();
    event.preventDefault();
    const { contract } = state;
    const amount = { value: ethers.utils.parseEther("0.00001") };
    // const transaction = await contract.buyChai(name, message, amount);
    const transaction = await contract.buyChai("Question", addAsk, amount);
    await transaction.wait();
    console.log("Transaction is done");
  };

  const messageEnd = useRef(null);
  const [ans, setAns] = useState([]);
  const [addAsk, setAsk] = useState("");
  const [typing, setTyping] = useState(false);
  // let unique_id = uuid();

  let date = new Date().toLocaleDateString().replace(/[^apm\d]+/gi, '-');
  let time = new Date().toLocaleTimeString().replace(/[^apm\d]+/gi, '-');
  let unique_id = date + '-' + time;

  const params = {
    Bucket: "sia-mit",
    Key: unique_id,
    ContentType: "text",
    Body: addAsk,
    ACL: "public-read",
  };
  const [s3, setS3] = useState(new awsS3({
    apiVersion: "2006-03-01",
    accessKeyId: "3E6A65353D6376F33E60", //FILEBASE_ACCESS_ID
    secretAccessKey: "EiqdZsUsQHukycQuTo79dayYOXYyET9hrH4e9ekL", //FILEBASE_SECRET_KEY
    endpoint: "https://s3.filebase.com/",
    region: "us-east-1",
    s3ForcePathStyle: true,
  }));

  const handleAdd = async () => {
    date = new Date().toLocaleDateString().replace(/[^apm\d]+/gi, '-');
    time = new Date().toLocaleTimeString().replace(/[^apm\d]+/gi, '-');
    unique_id = date + '-' + time;

    setTimeout(() => {
      setAns((preAns) => [
        {
          responsed: addAsk,
          role: "User",
        },
        ...preAns,
      ]);


    }, 250);


    if (addAsk.includes("pizza")) {

      setAsk("");

      setTimeout(() => {
        setTyping(true);
      }, 800);

      setTimeout(() => {

        setAns((preAns) => [
          {
            responsed: "Here is nearest Pizza shop: Dominos, Near LMA, Boston",
            role: "Assistant",
          },
          ...preAns,
        ]);
      }, 1600);

      try {

        const response = await s3.putObject(params);
        await response.send();
        console.log("Uploaded file successfully on Filebase!");



        const options = {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            "X-RapidAPI-Key": "1a9b0fb267msh6baa89733baea49p1b7dbfjsnab05e6fa9631", //RAPID_API_KEY
            "X-RapidAPI-Host": "chatgpt-api7.p.rapidapi.com",
          },
          body: `{"query": "Pretend you are TechnoClever. Your hobbies are singing, writing poets. You are good in Classical singing and developing dApps. You are expert in dAPP development. beginner in filebase development. ${addAsk}"}`,
        };


        await fetch("https://chatgpt-api7.p.rapidapi.com/ask", options) //Fetch URL
          .then((response) => response.json())
          .then((response) => {
            setTyping(false);
            console.log(response);
            setAns((preAns) => [
              {
                responsed: response.response,
                role: "Assistant",
              },
              ...preAns,
            ]);
          })
          .catch((err) => console.error(err));

        const siaoptions = {
          method: 'PUT',
          headers: {
            'content-type': 'text/plain',
            'Authorization': 'Basic OnRlc3Q=',
            'Password': 'test',
          },
          body: `${addAsk}`,
        };
        console.log("siaoptions ", siaoptions);
        await fetch("http://localhost:9880/api/worker/objects/" + `${unique_id}` + ".txt", siaoptions) //Fetch URL
          .then((response) => response.json())
          .then((response) => {
            setTyping(false);
            console.log("UPLOADED TO SIA ", response);
          })
          .catch((err) => console.error(err));

      } catch (error) {
        console.log("Error uploading file:", error);
      }

    }

    else {

      setAsk("");

      setTimeout(() => {
        setTyping(true);
      }, 800);

      const options = {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          "X-RapidAPI-Key": "1a9b0fb267msh6baa89733baea49p1b7dbfjsnab05e6fa9631", //RAPID_API_KEY
          "X-RapidAPI-Host": "chatgpt-api7.p.rapidapi.com",
        },
        body: `{"query": "Pretend to be Ask Queries Earn Crypto Bot. ${addAsk}"}`,
      };



      await fetch("https://chatgpt-api7.p.rapidapi.com/ask", options)
        .then((response) => response.json())
        .then((response) => {
          console.log(response);
          setAns((preAns) => [
            {
              responsed: response.response,
              role: "Assistant",
            },
            ...preAns,
          ]);
        })
        .catch((err) => console.error(err));



      setTyping(false);

    }
  };

  const saveEnter = (e) => {
    if (e.key === "Enter") {
      handleAdd();

    }
  };

  return (
    <>
      <div className="apiApp">
        <ul className='chatContainer'>
          <div className="chatSec">
            {typing && (
              <div className="chat">
                <div className="chatCont">
                  <div className="showAvatarSec">
                    <img className={"showChatAvatar"} src={Avatar} alt="" />
                  </div>
                  <div className="assistant typing">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                </div>
              </div>
            )}

            {ans.length > 0 ? (
              ans.map((ans, index) => {
                return (
                  <div className="chat" key={index}>
                    <div
                      className={
                        ans.role === "Assistant" ? "chatCont" : "chatContUser"
                      }
                    >
                      <div
                        className={
                          ans.role === "Assistant"
                            ? "showAvatarSec"
                            : "hideChatAvatar"
                        }
                      >
                        <img
                          className={
                            ans.role === "Assistant"
                              ? "showChatAvatar"
                              : "hideChatAvatar"
                          }
                          src={Avatar}
                          alt=""
                        />
                      </div>
                      <p
                        className={
                          ans.role === "User"
                            ? "user chatStyle"
                            : "assistant chatStyle"
                        }
                      >
                        {ans.responsed}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={{ margin: "0 auto" }}>Ask Queries Earn Crypto🙂</p>
            )}
            <div ref={messageEnd} />
          </div>
        </ul>
        <div className="addPost">
          <input
            type="text"
            value={addAsk}
            placeholder="Type something to ask..."
            onChange={(e) => setAsk(e.target.value)}
            onKeyDown={saveEnter}
          />
          <button
            className='sendBtn'
            onClick={handleAdd}
            disabled={!addAsk}
          >
            Send
          </button>
          <button
            className='sendBtn'
            onClick={buyChai}
            disabled={!addAsk}
          >
            Earn
          </button>
        </div>
      </div>
    </>
  );
};
export default Buy;
