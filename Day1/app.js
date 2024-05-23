const http = require("http");
const queryString = require("querystring");
const fs = require("fs");
const path = require("path");

const PORT = 3001;
const filePath = path.join(process.cwd(), "data.json");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.write("Home Route");
    res.end();
    return;
  }
  if (req.url === "/login") {
    res.setHeader("Content-Type", "text/html");
    res.write(`<form action='/submit' method="POST">
        <input type="text" name="username" placeholder="Enter Username" />
        <input type="text" name="password" placeholder="Enter Password" />
        <button>SUBMIT</button>
        </form>`);
    res.end();
    return;
  }
  if (req.url === "/signup") {
    res.setHeader("Content-Type", "text/html");
    res.write(`<form action='/submit' method="POST">
        <input type="text" name="signup_name" placeholder="Enter Your Name" />
        <input type="email" name="signup_email" placeholder="Enter Your Email" />
        <input type="text" name="Father" placeholder="Enter Your Father Name" />
        <button>SUBMIT</button>
        </form>`);
    res.end();
    return;
  }
  if (req.url === "/submit") {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });

    req.on("end", () => {
      const parsedData = queryString.parse(data);
      if (parsedData.username && parsedData.password) {
        // Handle login data
        // For simplicity, let's assume login data is handled here
      } else if (
        parsedData.signup_name &&
        parsedData.signup_email &&
        parsedData.Father
      ) {
        // Handle signup data
        const newUser = {
          username: parsedData.signup_name,
          email: parsedData.signup_email,
          father: parsedData.Father,
        };
        // Read existing data from file
        fs.readFile(filePath, "utf8", (err, fileData) => {
          if (err) {
            console.error("Error reading file:", err);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Internal Server Error");
            return;
          }
          let users = [];
          try {
            users = JSON.parse(fileData).users;
          } catch (parseError) {
            console.error("Error parsing JSON:", parseError);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Internal Server Error");
            return;
          }
          // Add the new user to the array
          users.push(newUser);
          // Write the updated data back to the file
          fs.writeFile(
            filePath,
            JSON.stringify({ users: users }),
            (writeErr) => {
              if (writeErr) {
                console.error("Error writing to file:", writeErr);
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Internal Server Error");
              } else {
                console.log("User data saved successfully");
                res.writeHead(200, { "Content-Type": "text/plain" });
                res.end("Success");
              }
            }
          );
        });
      } else {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("Bad Request");
      }
    });
    return;
  }

  res.write("Invalid Route");
  res.end();
});

server.listen(PORT, () => {
  console.log(`Server up and running on port ${PORT}`);
});
