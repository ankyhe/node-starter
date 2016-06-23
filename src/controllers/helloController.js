class HelloController {
  getHello(req, reply) {
    reply({data: `hello for ${req.params.name}!`});
  }
}

const helloController = new HelloController();

export {helloController as default};

