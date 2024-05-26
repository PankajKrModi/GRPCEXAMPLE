const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader"); //this does compililation of our protobuf to js files
const packageDef = protoLoader.loadSync("todo.proto",{});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const server = new grpc.Server();
server.bind("127.0.0.1:40000", grpc.ServerCredentials.createInsecure());
server.addService(todoPackage.Todo.service,
        {
            "createTodo":createTodo,
            "readTodos":readAllTodos,
            "readTodosStream": streamAllTodos
        }
);

server.start();
console.log("Hello");
const todos = []

function createTodo(call,callback){
    const todoItem = {
        "id": todos.length +1,
        "text": call.request.text
    }
    todos.push(todoItem);
    callback(null,todoItem); //null is length of bytes sending to client, can be null as default for sending any size
}
function readAllTodos(call,callback){
    callback(null,{"items":todos});
}
function streamAllTodos(call,callback){
    todos.forEach(t=>call.write(t));
    call.end();
}


