const amqp = require("amqplib");
const data = require("./data.json");
const message = {
    description: "Message..."
}
const queueName = process.argv[2] || "jobQueue";

// function TestQueueName() {
//     const queueName = process.argv[2];
//     console.log("Queuue_Name: ", queueName);
//     return false;
// }
//TestQueueName();

connect_rabbitmq();
async function connect_rabbitmq() {
    try {
        const connection = await amqp.connect("amqp://localhost:5672");
        const channel = await connection.createChannel();
        const assertion = await channel.assertQueue(queueName);

        data.forEach(element => {
            message.description = element.id;
            channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
            console.log("Sending message", element.id);
        });
    }
    catch (error) {
        console.log("Error", error);
    }
}
