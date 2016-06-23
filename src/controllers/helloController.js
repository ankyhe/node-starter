class HelloController {
  getHello(request, reply) {
    reply({data: `hello for ${request.params.name}!`});
  }
}

const helloController = new HelloController();

export {helloController as default};

