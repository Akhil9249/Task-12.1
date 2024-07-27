const http = require("http");
const fs = require("fs");
const path = require("path");

let userList = [
    { name: "akhil", age: 26 },
    { name: "arun", age: 30 },
];

// Create server
const server = http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin","*")
    // Handling the request
    const filePath = req.url === "/" ? "./index.html" : `.${req.url}`;
    const extname = path.extname(filePath) || null;

    if (extname !== null) {
        let contentType = "text/html";

        // Check extension and set content type accordingly
        switch (extname) {
            case ".js":
                contentType = "text/javascript";
                break;
            case ".css":
                contentType = "text/css";
                break;
            case ".json":
                contentType = "application/json";
                break;
            case ".png":
                contentType = "image/png";
                break;
            case ".jpg":
                contentType = "image/jpg";
                break;
        }

        // Read file
        fs.readFile(filePath, (err, content) => {
            if (err) {
                if (err.code === "ENOENT") {
                    // Page not found
                    fs.readFile("./404.html", (err, content) => {
                        res.writeHead(404, { "Content-Type": "text/html" });
                        res.end(content, "utf8");
                    });
                } else {
                    // Server error
                    res.writeHead(500);
                    res.end(`Server Error: ${err.code}`);
                }
            } else {
                // Success
                res.writeHead(200, { "Content-Type": contentType });
                res.end(content, "utf8");
            }
        });
    } else {
        switch (req.url) {
            case "/users":
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(userList));
        }
    }
});

// Define port
const PORT = process.env.PORT || 5000;

// Start the server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
