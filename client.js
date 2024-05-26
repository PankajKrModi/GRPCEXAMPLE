const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader"); //this does compililation of our protobuf to js files
const packageDef = protoLoader.loadSync("todo.proto",{});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const client = new todoPackage.Todo("localhost:40000", grpc.credentials.createInsecure());

const text = process.argv[2];

client.createTodo({
    "id": -1,
    "text": text
},(err,response)=>{
    console.log(JSON.stringify(response));
});

client.readTodos({},(err,response)=>{
    console.log("Received All todos from server: ");
    if(response.items) {
        response.items.forEach(element => {
            console.log(element.text);
        });
    }
   
});


console.log("Started streaming from server");

const call = client.readTodosStream();
call.on("data", item => {
    console.log("received item from server "+JSON.stringify(item));
});

call.on("end", e => console.log("Server done!!"));