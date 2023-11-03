const express = require('express');
const fs = require('fs')
const cors = require('cors')
const port = 8080;
const app = express();
app.use(cors())
app.use(express.json());

const names = [
  { id: '1', name: "bat", age: 30, password: 123 },
  { id: '2', name: "tuguldur", age: 25, password: 123 },
  { id: '3', name: "tuguldur", age: 25, password: 123 },

]
// app.post("/user",(req , res)=>{
// const data = req.body
// console.log(data)
// res.json({
//   status:'success'
// })
// }
// )
app.get("/user", (req, res) => {
  fs.readFile("./file/user.json",
    (readError, data) => {
      let savedData = JSON.parse(data);
      savedData = savedData.map((cur) => ({ id: cur.id, username: cur.username, age: cur.age }))
      if (readError) {
        res.json({
          status: "success",
          data: "read file error",
        });
      }
      res.json({
        status: "success",
        data: savedData,
      })
    })
})
app.get("/search", (req, res) => {
  res.json({ names: names });
});
app.get('/search/:name', (req, res) => {
  const { name } = req.params;
  names.filter((user) => user.name == name);


  res.json({ name })
});
app.post("/search", (req, res) => {

  const body = req.body;

  console.log(body)



  fs.readFile("./file/user.json", (readError, data) => {



    if (readError) {
      res.json({
        status: "read file error",



      })

    }

    let savedData = JSON.parse(data)
    const newUser = {
      id: Date.now().toString(),
      username: body.username,
      age: body.age,
      password: body.password
    }

    savedData.push(newUser);
    fs.writeFile("./file/user.json", JSON.stringify(savedData),
      (writeError) => {
        if (writeError) {
          res.json({
            status: "error"

          })

        } else {

          res.json({
            status: "succes",
            data: savedData,

          })

        }



      }

    )

  })

})
app.delete("/search", (req, res) => {
  const body = req.body
    ;
  fs.readFile("./file/user.json",
    (readError, data) => {
      let savedData = JSON.parse(data);
      if (readError) {
        res.json({
          status: 'read file error'
        });
      }
      const deleteData = savedData.filter((d) => d.id !==
        body.id);
      fs.writeFile(
        './file/user.json',
        JSON.stringify(deleteData),
        (writeError) => {
          if (writeError) {
            res.json({
              status: "error"
            });
          }
          res.json({
            status: "success",
            data: deleteData,
          });
        }
      );
    })
})
app.put("/search", (req, res) => {
  const body = req.body;
  fs.readFile("./file/user.json",
    (readError, data) => {
      let savedData = JSON.parse(data);
      if (readError) {
        res.json({
          status: "read file error",
        });
      }
      const updateData = savedData.map((d) => {
        if (d.id === body.id) {
          (d.username = body.username),
            (d.age = body.age);
        }
        return d;
      });
      fs.writeFile(
        "./file/user.json",
        JSON.stringify(updateData),
        (writeError) => {
          if (writeError) {
            res.json({
              status: "error"
            });
          } else {
            res.json({
              status: "success",
              data: updateData,
            });
          }
        }
      );
    });

});
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  fs.readFile('./file/user.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
      return;
    }

    const users = JSON.parse(data);
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
      res.json({ status: 'success', user: { username: user.username, age: user.age } });
    } else {
      res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }
  });
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});