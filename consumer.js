const amqp = require("amqplib");
const data = require("./data.json");
const queueName = process.argv[2] || "jobQueue";

connect_rabbitmq();
async function connect_rabbitmq() {
    try {
        const connection = await amqp.connect("amqp://localhost:5672");
        const channel = await connection.createChannel();
        const assertion = await channel.assertQueue(queueName);

        console.log('Waiting message!');
        channel.consume(queueName, request => {
            const messageInfo = JSON.parse(request.content.toString());
            const userInfo = data.find(u => u.id == messageInfo.description);

            if (userInfo) { 
                console.log('Rendering file', userInfo);
                channel.ack(request);
            }
        });
    }
    catch (error) {
        console.log("Error", error);
    }
}
