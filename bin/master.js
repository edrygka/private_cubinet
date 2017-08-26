var cluster = require('cluster')

//var CPUCount = require('os').cpus().length

var CPUCount = 1

cluster.on('disconnect', (worker, code, signal) => {
    console.log(`Worker ${worker.id} died`);
    cluster.fork();
})

cluster.on('online', (worker) => {
    console.log(`Worker ${worker.id} running`);
});

for(var i = 0; i < CPUCount; ++i)
{
    cluster.fork();
}